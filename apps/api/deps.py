"""FastAPI dependencies."""

from __future__ import annotations

from fastapi import Depends
from sqlmodel import Session

from database import get_session
from project_service import ProjectService


def get_project_service(session: Session = Depends(get_session)) -> ProjectService:
    return ProjectService(session)
