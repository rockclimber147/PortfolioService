from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import SQLModel, Project
from routers import client, admin
from services.auth import AuthService

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Tables found in metadata: {SQLModel.metadata.tables.keys()}")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title="Daylen's Portfolio API",
    lifespan=lifespan,
    description="Backend for managing projects and AI-powered search.",
    version="1.0.0"
)

origins = [
    "http://localhost:5174",  # Your Vite dev server
    "http://localhost:5173",  # Sometimes Vite uses 5173
    "http://localhost:3000",  # Common for other frameworks
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PATCH, etc.
    allow_headers=["*"],  # Allows X-API-KEY, Content-Type, etc.
)

app.include_router(client.router)
app.include_router(
    admin.router,
    prefix="/admin",
    dependencies=[Depends(AuthService.verify_admin)]
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}
