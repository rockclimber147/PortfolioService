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
