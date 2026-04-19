from fastapi import APIRouter
from .projects import router as projects_router
from .tags import router as tags_router
from .assets import router as assets_router

admin_router = APIRouter()
admin_router.include_router(projects_router, prefix="/projects", tags=["Admin Projects"])
admin_router.include_router(tags_router, prefix="/tags", tags=["Admin Tags"])
admin_router.include_router(assets_router, prefix="/assets", tags=["Admin Assets"])