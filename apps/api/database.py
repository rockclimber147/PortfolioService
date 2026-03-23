"""SQLModel engine and session dependency."""

from __future__ import annotations

from collections.abc import Generator

from sqlmodel import Session, create_engine

from config import get_database_url, get_db_connect_args

engine = create_engine(
    get_database_url(),
    pool_pre_ping=True,
    connect_args=get_db_connect_args(),
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
