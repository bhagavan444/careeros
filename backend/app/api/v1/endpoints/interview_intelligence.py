import logging
import traceback
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from starlette.concurrency import run_in_threadpool
from app.schemas.interview_intelligence import InterviewIntelligenceResponse, InterviewOutcomeRequest, InterviewOutcomeResponse
from app.services.interview_intelligence.orchestrator import InterviewIntelligenceOrchestrator
from app.services.interview_intelligence.interview_outcome_engine import InterviewOutcomeEngine
from app.services.interview_intelligence.hiring_decision_engine import HiringDecisionEngine
from app.api.v1.endpoints.documents import extract_document_text_sync

router = APIRouter()
logger = logging.getLogger("api_interview_intelligence")

@router.post("/generate", response_model=InterviewIntelligenceResponse)
async def generate_interview_strategy(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    github: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    portfolio: Optional[str] = Form(None)
):
    """
    Single-Shot Interview Intelligence endpoint.
    Upload a resume and JD to generate the complete Interview Blueprint, Simulations, and Scorecards.
    """
    try:
        logger.info(f"[API] Received Interview Intelligence Request for {resume.filename}")
        
        content = await resume.read()
        content_type = resume.content_type or ""
        
        extracted_text = ""
        try:
            extracted_text = await run_in_threadpool(
                extract_document_text_sync, 
                resume.filename, 
                content, 
                content_type
            )
        except Exception as extract_error:
            raise ValueError(str(extract_error))
                
        if not extracted_text or not extracted_text.strip():
            raise ValueError(f"Could not extract parseable text from {resume.filename}")
            
        response = await InterviewIntelligenceOrchestrator.generate_strategy(
            resume_text=extracted_text,
            job_description=job_description,
            github=github,
            linkedin=linkedin,
            portfolio=portfolio
        )
        return response

    except ValueError as ve:
        logger.error(f"[API_ERROR] Validation failed: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"[API_ERROR] Interview Intelligence Engine crashed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/outcome", response_model=InterviewOutcomeResponse)
async def generate_interview_outcome(request: InterviewOutcomeRequest):
    """
    Phase 2 Workflow: Process recruiter rubric scores and generate final boardroom hiring decision.
    """
    try:
        logger.info("[API] Received Interview Outcome Generation Request")
        outcome = InterviewOutcomeEngine.evaluate(request)
        decision = HiringDecisionEngine.generate(outcome, request)
        
        return InterviewOutcomeResponse(
            outcome=outcome,
            hiring_decision=decision
        )
    except Exception as e:
        logger.error(f"[API_ERROR] Outcome Engine crashed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

