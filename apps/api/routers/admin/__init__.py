from fastapi import APIRouter, Depends
from .projects import router as projects_router
from .tags import router as tags_router
from .assets import router as assets_router
from .profile import router as profile_router
from .experience import router as experience_router
from .education import router as education_router
from .auth import router as auth_router

from services.auth import AuthService

admin_deps = [Depends(AuthService.verify_admin)]

admin_router = APIRouter()
admin_router.include_router(auth_router, prefix="/auth", tags=["Admin Auth"])

admin_router.include_router(projects_router, prefix="/projects", tags=["Admin Projects"], dependencies=admin_deps)
admin_router.include_router(tags_router, prefix="/tags", tags=["Admin Tags"], dependencies=admin_deps)
admin_router.include_router(assets_router, prefix="/assets", tags=["Admin Assets"], dependencies=admin_deps)
admin_router.include_router(profile_router, prefix="/profile", tags=["Admin Profile"], dependencies=admin_deps)
admin_router.include_router(experience_router, prefix="/experience", tags=["Admin Work Experience"], dependencies=admin_deps)
admin_router.include_router(education_router, prefix="/education", tags=["Admin Education"], dependencies=admin_deps)