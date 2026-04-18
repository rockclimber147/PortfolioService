from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from envconfig import EnvironmentConfig

class AuthService:
    # This defines the header name and the security scheme for Swagger
    api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

    @classmethod
    async def verify_admin(cls, api_key: str = Security(api_key_header)):
        """
        Dependency to protect admin routes.
        Directly compares the header value against the environment secret.
        """
        if api_key != EnvironmentConfig.ADMIN_SECRET_KEY:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid API Key. Access Denied."
            )
        return True