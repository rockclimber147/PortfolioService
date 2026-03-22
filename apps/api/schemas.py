"""Pydantic request/response shapes for API routes (separate from ORM tables)."""

from __future__ import annotations

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    title: str = Field(max_length=100)
    slug: str
    description_md: str
    is_public: bool = False
    tags: list[str] = Field(default_factory=list)


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=100)
    slug: str | None = None
    description_md: str | None = None
    is_public: bool | None = None
    tags: list[str] | None = None
