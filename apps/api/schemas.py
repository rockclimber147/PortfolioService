"""Pydantic request/response shapes for API routes (separate from ORM tables)."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


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


class MediaAssetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    s3_url: str
    is_thumbnail: bool
    display_order: int


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    description_md: str
    is_public: bool
    tags: list[str]
    created_at: datetime
    date: datetime


class ProjectDetailRead(ProjectRead):
    media_assets: list[MediaAssetRead] = Field(default_factory=list)


class ProjectListResponse(BaseModel):
    items: list[ProjectRead]
    total: int
    skip: int
    limit: int


class ProjectSearchResponse(BaseModel):
    items: list[ProjectRead]
    total: int
    q: str
    skip: int
    limit: int
