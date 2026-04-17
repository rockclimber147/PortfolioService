from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Daylen's Portfolio API",
    description="Backend for managing projects and AI-powered search.",
    version="1.0.0"
)

class Project(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]
    is_featured: bool = False

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}

@app.get("/projects", response_model=List[Project])
def get_projects():
    return [
        {
            "id": 1, 
            "title": "C++ Compiler", 
            "description": "High-performance compiler for Nand2Tetris.",
            "tech_stack": ["C++", "CMake"]
        }
    ]