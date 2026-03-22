"""Portfolio API entrypoint (FastAPI). See ARCHITECTURE.md."""

from __future__ import annotations

from fastapi import FastAPI

from routers import admin, public

app = FastAPI(
    title="Portfolio API",
    version="0.1.0",
    description="Backend for the portfolio platform (public gallery + admin).",
)

app.include_router(public.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1/admin")


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness/readiness probe for Kubernetes."""
    return {"status": "ok"}
