from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from database.database import engine
from database.db_init import initialize_singleton_profile
from sqlmodel.ext.asyncio.session import AsyncSession
from models import SQLModel, Project
from routers import client, admin
from routers.admin import admin_router
from services.auth import AuthService
from envconfig import EnvironmentConfig

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Tables found in metadata: {SQLModel.metadata.tables.keys()}")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    async with AsyncSession(engine) as session:
        await initialize_singleton_profile(session)
    yield
    await engine.dispose()

app = FastAPI(
    title="Daylen's Portfolio API",
    lifespan=lifespan,
    description="Backend for managing projects and AI-powered search.",
    version="1.0.0"
)

origins = [
    EnvironmentConfig.CLIENT_URL,
    EnvironmentConfig.ADMIN_URL,
]

for origin in origins:
    print(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client.router)
app.include_router(
    admin_router,
    prefix="/admin",
    dependencies=[Depends(AuthService.verify_admin)]
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}
