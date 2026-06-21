import tempfile
import os
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Dict, Any
from playwright.async_api import async_playwright

router = APIRouter()

async def render_pdf(html_content: str, output_path: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.set_content(html_content, wait_until="networkidle")
        await page.pdf(
            path=output_path,
            format="A4",
            print_background=True,
            margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
        )
        await browser.close()

def _generate_html(resume_data: Dict[str, Any]) -> str:
    """
    Very basic HTML rendering for ATS-friendly PDF.
    In a full production scenario, this could hit a React SSR endpoint or use Jinja2.
    """
    pi = resume_data.get("personalInfo", {})
    summary = resume_data.get("summary", "")
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{pi.get('name', 'Resume')}</title>
        <style>
            body {{ font-family: 'Helvetica', 'Arial', sans-serif; color: #111; line-height: 1.5; padding: 40px; }}
            h1 {{ font-size: 24pt; margin-bottom: 0; }}
            .contact {{ font-size: 10pt; color: #555; margin-bottom: 20px; }}
            h2 {{ font-size: 14pt; border-bottom: 1px solid #ccc; margin-top: 20px; padding-bottom: 5px; }}
            .section-content {{ font-size: 11pt; }}
            .job-title {{ font-weight: bold; }}
            .company {{ font-style: italic; }}
        </style>
    </head>
    <body>
        <div style="text-align: center;">
            <h1>{pi.get('name', 'Your Name')}</h1>
            <div class="contact">
                {pi.get('email', '')} | {pi.get('phone', '')} | {pi.get('linkedin', '')}
            </div>
        </div>
        
        <h2>Professional Summary</h2>
        <div class="section-content">{summary}</div>
        
        <h2>Experience</h2>
        <div class="section-content">
    """
    for exp in resume_data.get("experience", []):
        html += f"""
        <div style="margin-bottom: 15px;">
            <div class="job-title">{exp.get('title', '')}</div>
            <div class="company">{exp.get('company', '')} | {exp.get('startDate', '')} - {exp.get('endDate', '')}</div>
            <p>{exp.get('description', '')}</p>
        </div>
        """
    
    html += """
        </div>
    </body>
    </html>
    """
    return html

from app.services.job_service import JobService
import base64

async def async_render_pdf_task(html_content: str) -> Dict[str, Any]:
    """Background task to render PDF and return base64 payload."""
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    
    try:
        await render_pdf(html_content, path)
        with open(path, "rb") as f:
            pdf_bytes = f.read()
            
        b64_pdf = base64.b64encode(pdf_bytes).decode("utf-8")
        return {"pdf_base64": b64_pdf}
    finally:
        if os.path.exists(path):
            os.remove(path)

@router.post("/pdf")
async def export_pdf(payload: Dict[str, Any], background_tasks: BackgroundTasks, async_mode: bool = False):
    try:
        # Check if the frontend provided fully formatted HTML
        html_content = payload.get("html_content")
        filename = payload.get("filename", "Resume.pdf")
        
        if not html_content:
            # Fallback to legacy schema generation if no HTML provided
            resume_data = payload.get("resumeData", {})
            html_content = _generate_html(resume_data)
            filename = f"{resume_data.get('personalInfo', {}).get('name', 'Resume').replace(' ', '_')}.pdf"
            
        if async_mode:
            # Create a background job and return immediately
            job = await JobService.create_job("pdf_generation")
            JobService.spawn_background_task(job.job_id, async_render_pdf_task, html_content)
            return {"status": "pending", "job_id": job.job_id, "message": "PDF generation queued"}
        
        # Synchronous execution
        fd, path = tempfile.mkstemp(suffix=".pdf")
        os.close(fd)
        
        await render_pdf(html_content, path)
        
        # Clean up file after sending
        background_tasks.add_task(os.remove, path)
        
        return FileResponse(
            path, 
            media_type="application/pdf", 
            filename=filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Generation failed: {str(e)}")

@router.get("/pdf/status/{job_id}")
async def get_pdf_status(job_id: str):
    """Poll for PDF generation status."""
    job = await JobService.get_job(job_id)
    if job.get("status") == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")
        
    return job

