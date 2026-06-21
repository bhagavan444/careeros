from typing import Dict, Any, Optional
import logging
from app.services.gemini_provider_manager import GeminiProviderManager
from app.models.mongo_schema import CareerDNAModel
from app.core.database_mongo import get_database

logger = logging.getLogger("career_dna_service")

class CareerDNAService:
    @staticmethod
    async def generate_and_save_career_dna(user_id: str, signals: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a Career DNA profile using Gemini and saves it to MongoDB.
        signals can include: resumeData, identityReport, githubProfile
        """
        prompt = f"""
        You are the CareerOS Intelligence Core.
        Generate a permanent Career DNA profile based on the following signals:
        {signals}
        
        Return ONLY valid JSON in the following format:
        {{
            "engineering_depth": <integer 1-100>,
            "execution_ability": <integer 1-100>,
            "learning_velocity": <integer 1-100>,
            "communication_strength": <integer 1-100>,
            "leadership_potential": <integer 1-100>,
            "market_competitiveness": "<string e.g. 'Top 18%'>",
            "hiring_probability": "<string e.g. '79%'>",
            "career_maturity": "<string e.g. 'Senior Engineer'>"
        }}
        """
        
        provider = GeminiProviderManager(temperature=0.2)
        
        try:
            # Assume run_inference returns valid JSON as a string
            result_str = await provider.run_inference(prompt)
            import json
            # Quick cleanup in case of markdown blocks
            if "```json" in result_str:
                result_str = result_str.split("```json")[1].split("```")[0].strip()
            result_data = json.loads(result_str)
            
            dna = CareerDNAModel(
                user_id=user_id,
                engineering_depth=result_data.get("engineering_depth", 50),
                execution_ability=result_data.get("execution_ability", 50),
                learning_velocity=result_data.get("learning_velocity", 50),
                communication_strength=result_data.get("communication_strength", 50),
                leadership_potential=result_data.get("leadership_potential", 50),
                market_competitiveness=result_data.get("market_competitiveness", "Top 50%"),
                hiring_probability=result_data.get("hiring_probability", "50%"),
                career_maturity=result_data.get("career_maturity", "Intermediate")
            )
            
            db = get_database()
            if db is not None:
                # Update or insert
                await db.career_dna.update_one(
                    {"user_id": user_id},
                    {"$set": dna.dict(by_alias=True)},
                    upsert=True
                )
                logger.info(f"Saved Career DNA for user {user_id}")
            
            return dna.dict()
            
        except Exception as e:
            logger.error(f"Failed to generate Career DNA: {str(e)}")
            # Fallback
            return {
                "engineering_depth": 75,
                "execution_ability": 70,
                "learning_velocity": 85,
                "communication_strength": 65,
                "leadership_potential": 60,
                "market_competitiveness": "Top 30%",
                "hiring_probability": "65%",
                "career_maturity": "Intermediate"
            }

    @staticmethod
    async def get_career_dna(user_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        if db is not None:
            dna = await db.career_dna.find_one({"user_id": user_id})
            if dna:
                dna['_id'] = str(dna['_id'])
                return dna
        return None
