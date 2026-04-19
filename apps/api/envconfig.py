import os
from dotenv import load_dotenv

load_dotenv() 


class EnvironmentConfig:
    @staticmethod
    def load_env(key: str) -> str:
        val = os.getenv(key)
        if not val:
            raise RuntimeError(f"{key} not set in environment")
        return val
    
    DATABASE_URL: str = load_env("DATABASE_URL")
    ADMIN_SECRET_KEY: str = load_env("ADMIN_SECRET_KEY")
    CLIENT_URL: str = load_env("CLIENT_URL")
    ADMIN_URL: str = load_env("ADMIN_URL")
    S3_BUCKET_NAME = load_env("S3_BUCKET_NAME")
    AWS_REGION = load_env("AWS_REGION")
