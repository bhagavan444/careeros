from app.core.database_mongo import db
from app.models.mongo_schema import UserModel
from app.schemas.auth import UserCreate
from app.core.security import get_password_hash
from fastapi import HTTPException
import logging

logger = logging.getLogger("auth_service")

class AuthService:
    @staticmethod
    async def create_user(user_in: UserCreate) -> dict:
        if db.db is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
            
        users_collection = db.db["users"]
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user_in.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Create new user
        hashed_password = get_password_hash(user_in.password)
        
        user_model = UserModel(
            email=user_in.email,
            hashed_password=hashed_password,
            full_name=user_in.full_name,
            role=user_in.role.value
        )
        
        # Insert into MongoDB
        result = await users_collection.insert_one(user_model.model_dump(by_alias=True))
        
        # Fetch the created user
        created_user = await users_collection.find_one({"_id": result.inserted_id})
        
        # Map _id to id for response
        created_user["id"] = created_user.pop("_id")
        return created_user

    @staticmethod
    async def get_user_by_email(email: str) -> dict:
        if db.db is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
            
        user = await db.db["users"].find_one({"email": email})
        if user:
            user["id"] = user.get("_id")
        return user
