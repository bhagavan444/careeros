import logging
import traceback
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from starlette.concurrency import run_in_threadpool
from app.schemas.talent_ranking import TalentIntelligenceResponse
from app.services.talent_ranking.orchestrator import TalentIntelligenceOrchestrator
from app.api.v1.endpoints.documents import extract_document_text_sync

router = APIRouter()
logger = logging.getLogger("api_talent_intelligence")

@router.post("/batch-analyze", response_model=TalentIntelligenceResponse)
async def analyze_talent_batch(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    """
    Processes a batch of 1 to 500 resumes against a single Job Description to produce a Ranked Shortlist.
    """
    try:
        logger.info(f"[API] Received Talent Intelligence Batch Request for {len(resumes)} resumes.")
        
        if len(resumes) > 500:
            raise ValueError("Maximum allowed batch size is 500 resumes per request.")
            
        resume_texts = []
        filenames = []
        
        for resume in resumes:
            content = await resume.read()
            content_type = resume.content_type or ""
            
            try:
                extracted_text = await run_in_threadpool(
                    extract_document_text_sync, 
                    resume.filename, 
                    content, 
                    content_type
                )
            except Exception as e:
                logger.warning(f"Failed to parse document {resume.filename}: {e}")
                extracted_text = ""
                    
            if extracted_text and extracted_text.strip():
                resume_texts.append(extracted_text)
                filenames.append(resume.filename)
            else:
                logger.warning(f"[API] Skipping empty or unparseable file: {resume.filename}")

        if not resume_texts:
            raise ValueError("No valid text could be extracted from any of the provided resumes.")
            
        response = await TalentIntelligenceOrchestrator.analyze_batch(
            resume_texts=resume_texts,
            filenames=filenames,
            job_description=job_description
        )
        return response

    except ValueError as ve:
        logger.error(f"[API_ERROR] Validation failed: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"[API_ERROR] Talent Intelligence Engine crashed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error during Batch Analysis: {str(e)}")
