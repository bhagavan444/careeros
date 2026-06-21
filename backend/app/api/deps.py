from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import logging
import os
from dotenv import load_dotenv

# Ensure .env is loaded before firebase initializes
load_dotenv()

logger = logging.getLogger("auth_deps")

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    try:
        # If FIREBASE_SERVICE_ACCOUNT_KEY path is provided in .env, use it
        # Otherwise, default initialize (works in GCP/Render or if GOOGLE_APPLICATION_CREDENTIALS is set)
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
            if project_id:
                firebase_admin.initialize_app(options={'projectId': project_id})
            else:
                firebase_admin.initialize_app()
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin: {e}")

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodes the Firebase JWT token and returns the user payload containing the uid.
    """
    token = credentials.credentials
    try:
        # Bypass strict Firebase Admin verification in local development if no credentials exist
        if os.getenv("FLASK_ENV") == "development" and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and not os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"):
            from jose import jwt
            decoded_token = jwt.get_unverified_claims(token)
            return {
                "uid": decoded_token.get("user_id") or decoded.get("uid"),
                "email": decoded_token.get("email"),
                "name": decoded_token.get("name", "")
            }
            
        decoded_token = auth.verify_id_token(token)
        # return a dictionary with user info
        return {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name", "")
        }
    except Exception as e:
        logger.error(f"Firebase token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# --- New JWT & MongoDB Authentication ---
from jose import jwt, JWTError
from app.core.config import settings
from app.core.database_mongo import db
from app.schemas.auth import TokenPayload

async def get_jwt_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodes the custom JWT token and fetches the user from MongoDB.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    # Fetch user from MongoDB
    if db.db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")
        
    user = await db.db["users"].find_one({"email": token_data.sub})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_jwt_user)):
        if user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return user
