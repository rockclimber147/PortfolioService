"""SQLModel table definitions for the portfolio API (see ARCHITECTURE.md)."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Project(SQLModel, table=True):
    __tablename__ = "project"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=100, unique=True)
    slug: str = Field(unique=True, index=True)
    description_md: str = Field(sa_column=Column(Text, nullable=False))
    is_public: bool = Field(default=False)
    tags: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSONB, nullable=False),
    )
    created_at: datetime = Field(default_factory=utc_now)
    date: datetime = Field(default_factory=utc_now)

    media_assets: list["MediaAsset"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class MediaAsset(SQLModel, table=True):
    __tablename__ = "media_asset"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(foreign_key="project.id", index=True)
    s3_url: str = Field(sa_column_kwargs={"nullable": False})
    is_thumbnail: bool = Field(default=False)
    display_order: int = Field(default=0)

    project: Project | None = Relationship(back_populates="media_assets")
