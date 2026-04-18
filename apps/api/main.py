from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from routers import client, admin

app = FastAPI(
    title="Daylen's Portfolio API",
    description="Backend for managing projects and AI-powered search.",
    version="1.0.0"
)

app.include_router(client.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}
