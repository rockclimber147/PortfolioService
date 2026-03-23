"""Business logic for projects (used by API routers)."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import Text, cast, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from models import Project
from schemas import ProjectCreate, ProjectUpdate


class ProjectConflictError(Exception):
    """Raised when a unique constraint (e.g. title or slug) is violated."""

    def __init__(self, message: str = "Unique constraint violated") -> None:
        self.message = message
        super().__init__(message)


def _ilike_substring(column: Any, q: str) -> Any:
    escaped = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return column.ilike(f"%{escaped}%", escape="\\")


class ProjectService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_public(self, skip: int, limit: int) -> tuple[list[Project], int]:
        where = Project.is_public.is_(True)
        total = self.session.scalar(select(func.count(Project.id)).where(where)) or 0
        stmt = (
            select(Project)
            .where(where)
            .order_by(Project.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        items = list(self.session.exec(stmt).all())
        return items, int(total)

    def list_all(self, skip: int, limit: int) -> tuple[list[Project], int]:
        total = self.session.scalar(select(func.count(Project.id))) or 0
        stmt = (
            select(Project)
            .order_by(Project.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        items = list(self.session.exec(stmt).all())
        return items, int(total)

    def get_public_by_slug(self, slug: str) -> Project | None:
        stmt = (
            select(Project)
            .options(selectinload(Project.media_assets))
            .where(Project.slug == slug, Project.is_public.is_(True))
        )
        return self.session.exec(stmt).first()

    def search_public(self, q: str, skip: int, limit: int) -> tuple[list[Project], int]:
        where_public = Project.is_public.is_(True)
        tags_text = cast(Project.tags, Text)
        search_where = or_(
            _ilike_substring(Project.title, q),
            _ilike_substring(tags_text, q),
        )
        combined = where_public & search_where
        total = self.session.scalar(select(func.count(Project.id)).where(combined)) or 0
        stmt = (
            select(Project)
            .where(combined)
            .order_by(Project.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        items = list(self.session.exec(stmt).all())
        return items, int(total)

    def get_by_id(self, project_id: uuid.UUID) -> Project | None:
        stmt = select(Project).where(Project.id == project_id)
        return self.session.exec(stmt).first()

    def create(self, payload: ProjectCreate) -> Project:
        data = payload.model_dump()
        project = Project.model_validate(data)
        self.session.add(project)
        try:
            self.session.commit()
        except IntegrityError as e:
            self.session.rollback()
            raise ProjectConflictError(
                "Project with this title or slug already exists."
            ) from e
        self.session.refresh(project)
        return project

    def update(self, project_id: uuid.UUID, payload: ProjectUpdate) -> Project | None:
        project = self.get_by_id(project_id)
        if project is None:
            return None
        updates = payload.model_dump(exclude_unset=True)
        for key, value in updates.items():
            setattr(project, key, value)
        self.session.add(project)
        try:
            self.session.commit()
        except IntegrityError as e:
            self.session.rollback()
            raise ProjectConflictError(
                "Project with this title or slug already exists."
            ) from e
        self.session.refresh(project)
        return project

    def delete(self, project_id: uuid.UUID) -> bool:
        project = self.get_by_id(project_id)
        if project is None:
            return False
        self.session.delete(project)
        self.session.commit()
        return True
