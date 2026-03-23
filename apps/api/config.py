"""Load settings from environment (see .env.example)."""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()


def _normalize_postgresql_driver(url: str) -> str:
    """Use psycopg v3 (package `psycopg`). Bare postgresql:// makes SQLAlchemy expect psycopg2."""
    if "://" not in url:
        return url
    scheme, rest = url.split("://", 1)
    if "+" in scheme:
        return url
    if scheme in ("postgresql", "postgres"):
        return f"postgresql+psycopg://{rest}"
    return url


def get_database_url() -> str:
    """Return PostgreSQL URL. Prefer DATABASE_URL; accept legacy misnamed DB_PASSWORD when it holds a full URL."""
    url = os.getenv("DATABASE_URL", "").strip()
    if url:
        return _normalize_postgresql_driver(url)
    legacy = os.getenv("DB_PASSWORD", "").strip()
    if legacy.startswith(("postgresql://", "postgres://")):
        return _normalize_postgresql_driver(legacy)
    raise RuntimeError(
        "Set DATABASE_URL to your PostgreSQL connection string. "
        "If the URL contains & or ?, wrap it in double quotes in .env."
    )


def get_db_connect_args() -> dict[str, object]:
    """psycopg connect kwargs; see https://www.psycopg.org/psycopg3/docs/api/connections.html"""
    raw = os.getenv("DB_CONNECT_TIMEOUT", "60").strip()
    try:
        connect_timeout = max(1, int(raw))
    except ValueError:
        connect_timeout = 60
    return {"connect_timeout": connect_timeout}
