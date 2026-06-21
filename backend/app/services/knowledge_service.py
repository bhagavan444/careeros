from sqlalchemy import or_
from models import KnowledgeBase
from extensions import db
import logging

logger = logging.getLogger("knowledge_service")

class KnowledgeService:
    """
    Interfaces with the PostgreSQL Knowledge Base for local answer retrieval.
    """
    
    def search_by_keyword(self, query: str) -> str | None:
        """
        Uses basic ILIKE matching for fast keyword retrieval.
        Returns the best matching answer or None.
        """
        try:
            # For a more advanced approach, PostgreSQL tsvector could be used, 
            # but standard ILIKE across question and tags is robust for small-medium DBs.
            keywords = query.lower().split()
            # Filter out common stop words to improve basic match
            stop_words = {"what", "is", "how", "to", "explain", "the", "a", "an", "and", "or", "can", "you", "tell", "me"}
            filtered_keywords = [k for k in keywords if k not in stop_words]
            
            if not filtered_keywords:
                filtered_keywords = keywords # fallback if all were stop words
            
            # Simple heuristic: find an entry where the question or tags contain at least one of the main keywords.
            # We'll order by the first found for now, but a ranking system can be built out.
            
            filters = []
            for kw in filtered_keywords:
                term = f"%{kw}%"
                filters.append(KnowledgeBase.question.ilike(term))
                filters.append(KnowledgeBase.title.ilike(term))
            
            match = KnowledgeBase.query.filter(or_(*filters)).first()
            
            if match:
                logger.info(f"Knowledge Base hit for category: {match.category}")
                return match.answer
                
            return None
        except Exception as e:
            logger.error(f"Knowledge Base search error: {e}")
            return None
