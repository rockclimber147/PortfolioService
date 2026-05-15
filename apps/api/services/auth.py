from fastapi import Request, HTTPException, Response, status
from envconfig import EnvironmentConfig

class AuthService:
    COOKIE_NAME = "admin_session"

    @classmethod
    async def verify_admin(cls, request: Request):
        api_key = request.cookies.get(cls.COOKIE_NAME)
        
        if not api_key or api_key != EnvironmentConfig.ADMIN_SECRET_KEY:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Session expired or invalid."
            )
        return True

    @classmethod
    def login(cls, response: Response, provided_key: str):
        if provided_key != EnvironmentConfig.ADMIN_SECRET_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Credentials"
            )
        
        response.set_cookie(
            key=cls.COOKIE_NAME,
            value=provided_key,
            httponly=True,
            secure=True,    # Ensure this is True in production (HTTPS)
            samesite="lax",
            max_age=3600 * 24
        )
        return {"status": "success", "message": "Logged in successfully"}

    @classmethod
    def logout(cls, response: Response):
        response.delete_cookie(
            key=cls.COOKIE_NAME,
            httponly=True,
            secure=True,
            samesite="lax"
        )
        return {"status": "success", "message": "Logged out"}