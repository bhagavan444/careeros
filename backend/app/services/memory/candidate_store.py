import os
import json
import logging
from typing import Optional

logger = logging.getLogger("candidate_store")

class CandidateStore:
    """
    Lightweight JSON-based persistence layer for Candidate Intelligence.
    In a real production environment, this would be Postgres/MongoDB.
    """
    
    STORE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..", "data", "candidates")
    
    @staticmethod
    def _ensure_dir():
        if not os.path.exists(CandidateStore.STORE_DIR):
            os.makedirs(CandidateStore.STORE_DIR, exist_ok=True)
            
    @staticmethod
    def save(candidate_id: str, data: dict):
        CandidateStore._ensure_dir()
        if not candidate_id:
            logger.warning("Attempted to save candidate with empty ID.")
            return
            
        candidate_id = candidate_id.strip().lower()
        file_path = os.path.join(CandidateStore.STORE_DIR, f"{candidate_id}.json")
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            logger.info(f"[CANDIDATE_STORE] Saved intelligence for '{candidate_id}' at {file_path}")
        except Exception as e:
            logger.error(f"[CANDIDATE_STORE] Failed to save '{candidate_id}' at {file_path}: {e}")
            
    @staticmethod
    def get(candidate_id: str) -> Optional[dict]:
        CandidateStore._ensure_dir()
        candidate_id = candidate_id.strip().lower()
        file_path = os.path.join(CandidateStore.STORE_DIR, f"{candidate_id}.json")
        
        logger.info(f"[CANDIDATE_STORE] Retrieving candidate from path: {file_path}")
        
        if not os.path.exists(file_path):
            logger.error(f"[CANDIDATE_STORE] Candidate file existence check failed for: {file_path}")
            raise ValueError(f"Candidate not found: '{candidate_id}'. File does not exist at {file_path}")
            
        try:
            logger.info(f"[CANDIDATE_STORE] Loading and deserializing JSON for candidate: '{candidate_id}'")
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if not data:
                    logger.error(f"[CANDIDATE_STORE] Empty profile payload for '{candidate_id}'")
                    raise ValueError(f"Empty profile payload in file for '{candidate_id}'")
                return data
        except json.JSONDecodeError as e:
            logger.error(f"[CANDIDATE_STORE] Corrupt candidate file for '{candidate_id}'. JSON decode error: {e}")
            raise ValueError(f"Corrupt candidate file for '{candidate_id}'. Invalid JSON.")
        except Exception as e:
            logger.error(f"[CANDIDATE_STORE] Unexpected error reading '{candidate_id}': {e}")
            raise ValueError(f"Unexpected error reading candidate '{candidate_id}': {e}")
