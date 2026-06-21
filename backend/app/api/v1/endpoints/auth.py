from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import UserCreate, UserResponse, Token, TokenPayload
from app.services.auth_service import AuthService
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.api.deps import get_jwt_user, RoleChecker
from jose import jwt, JWTError
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate):
    """
    Register a new user.
    """
    user = await AuthService.create_user(user_in)
    return user

@router.post("/login", response_model=Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = await AuthService.get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = create_access_token(subject=user["email"], role=user["role"])
    refresh_token = create_refresh_token(subject=user["email"], role=user["role"])
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    """
    Refresh an access token using a refresh token.
    """
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
        
        if token_data.type != "refresh":
            raise HTTPException(status_code=403, detail="Invalid token type")
            
        user = await AuthService.get_user_by_email(token_data.sub)
        if not user or not user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Inactive or deleted user")
            
        new_access_token = create_access_token(subject=user["email"], role=user["role"])
        new_refresh_token = create_refresh_token(subject=user["email"], role=user["role"])
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_jwt_user)):
    """
    Get current user profile based on JWT token.
    """
    current_user["id"] = str(current_user.get("_id"))
    return current_user

@router.get("/admin/stats", dependencies=[Depends(RoleChecker(["Admin"]))])
async def get_admin_stats():
    """
    Example protected endpoint that only Admins can access.
    """
    return {"status": "success", "message": "Welcome Admin. Here are your stats."}
