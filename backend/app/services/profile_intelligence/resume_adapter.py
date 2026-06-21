import logging
from typing import Dict, Any, List

# Core extraction mechanisms from existing DocumentParser
from core.ingestion.entity_extractor import EntityExtractor
from core.ingestion.document_parser import DocumentParser
from app.api.v1.endpoints.documents import get_resume_text
from .skill_taxonomy import SkillTaxonomy

logger = logging.getLogger(__name__)

class ResumeAdapter:
    """
    Data acquisition layer for Resume intelligence.
    Extracts core entities and applies canonical skill taxonomy normalization.
    """

    @staticmethod
    def extract(doc_id: str) -> Dict[str, Any]:
        """
        Parses the document, extracts entities, and normalizes them.
        Returns a structured dictionary of verified profile claims.
        """
        result = {
            "skills": [],
            "projects": [],
            "experience": [],
            "education": [],
            "certifications": []
        }

        if not doc_id:
            return result

        try:
            # 1. Fetch Text
            raw_text = get_resume_text(doc_id)
            if not raw_text:
                logger.warning(f"ResumeAdapter: No text found for doc_id {doc_id}")
                return result

            # 2. Parse Sections (using existing DocumentParser)
            sections = DocumentParser.parse_sections(raw_text)

            # 3. Extract Skills via EntityExtractor
            raw_skills = EntityExtractor.extract_skills(raw_text)
            
            # Apply Canonical Taxonomy
            normalized_skills = SkillTaxonomy.deduplicate(list(raw_skills))
            result["skills"] = normalized_skills

            # 4. Extract other sections (simple extraction from parsed blocks for now)
            # In a real scenario, this would use an NER model. For now, we pull the raw blocks.
            if "Projects" in sections:
                result["projects"] = [sections["Projects"][:500]] # Truncated representation
                
            if "Experience" in sections:
                result["experience"] = [sections["Experience"][:500]]
                
            if "Education" in sections:
                result["education"] = [sections["Education"][:500]]
                
            if "Certifications" in sections:
                result["certifications"] = [sections["Certifications"][:500]]

            return result

        except Exception as e:
            logger.error(f"ResumeAdapter extraction failed for doc_id {doc_id}: {e}")
            return result
