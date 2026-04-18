from fastapi import FastAPI
from contextlib import asynccontextmanager

from database import engine
from models import SQLModel, Project
from routers import client, admin

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

app.include_router(client.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}
