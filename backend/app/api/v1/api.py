from fastapi import APIRouter
from app.api.v1.endpoints import (
    chat, memory, career_dna, documents, resume, github, 
    profile_intelligence, recruiter_intelligence, identity, 
    resume_studio, resurrection, auth
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(resume.router, prefix="/resume", tags=["Resume Intelligence"])
api_router.include_router(github.router, prefix="/github", tags=["GitHub Intelligence"])
api_router.include_router(profile_intelligence.router, prefix="/profile-intelligence", tags=["Profile Intelligence"])
api_router.include_router(recruiter_intelligence.router, prefix="/recruiter-intelligence", tags=["Recruiter Intelligence"])
api_router.include_router(identity.router, prefix="/identity", tags=["Identity Engine"])
api_router.include_router(resurrection.router, prefix="/resurrection", tags=["Resurrection Engine"])
api_router.include_router(resume_studio.router, prefix="/resume-studio", tags=["Resume Studio"])
