import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from starlette.concurrency import run_in_threadpool
import traceback

from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse
from app.services.recruiter_intelligence.orchestrator import RecruiterIntelligenceOrchestrator
from app.api.v1.endpoints.documents import extract_document_text_sync

router = APIRouter()
logger = logging.getLogger("api_recruiter_intelligence")

@router.post("/analyze", response_model=RecruiterIntelligenceResponse)
async def analyze_candidate_direct(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    github: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    portfolio: Optional[str] = Form(None),
    persona: Optional[str] = Form("Enterprise Hiring Manager"),
    user_id: Optional[str] = Form("anonymous")
):
    """
    Executes the deterministic Recruiter Intelligence Platform pipeline directly from an uploaded resume.
    """
    try:
        logger.info(f"[API] Received Recruiter Intelligence Direct Analysis Request")
        
        # 1. Extract Resume Text
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
            raise ValueError(f"Could not extract text from '{resume.filename}'. File may be scanned, encrypted, or empty.")
            
        # 2. Run Direct Analysis
        response = await RecruiterIntelligenceOrchestrator.analyze_direct(
            resume_text=extracted_text,
            job_description=job_description,
            github=github,
            linkedin=linkedin,
            portfolio=portfolio,
            persona=persona
        )
        
        # 3. Save to MongoDB
        from app.core.database_mongo import get_database
        from app.models.mongo_schema import RecruiterReviewModel
        
        db = get_database()
        if db is not None:
            review = RecruiterReviewModel(
                user_id=user_id,
                persona=persona,
                interview_probability=response.hiring_recommendation.confidence_score,
                hiring_probability=response.hiring_recommendation.confidence_score,
                risk_areas=[risk.category for risk in response.risk_analysis.factors],
                missing_evidence=[gap.skill_name for gap in response.skill_gap_analysis.critical_missing],
                recommended_actions=response.hiring_recommendation.reasoning.split(". "),
                verdict=response.hiring_recommendation.decision
            )
            try:
                await db.recruiter_reviews.insert_one(review.dict(by_alias=True))
            except Exception as db_err:
                logger.warning(f"Failed to save review to MongoDB, but continuing. Error: {db_err}")
            
        return response

    except ValueError as ve:
        logger.error(f"[API_ERROR] Validation failed: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"[API_ERROR] Recruiter Intelligence Engine crashed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error during Candidate Analysis: {str(e)}")
