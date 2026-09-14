"""
FastAPI application entry point.

Wires together:
- CORS middleware (reads FRONTEND_URL from .env)
- All API routers
- Health check endpoint
- Auto-creates database tables on startup (fine for development;
  use Alembic migrations in production)
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Import models so SQLAlchemy can discover them before create_all
from app.database import Base, engine
import app.models  # noqa: F401  — registers all models with Base

from app.routers import archive, thoughts

# -------------------------------------------------------------------------
# Create tables (idempotent — safe to run on every startup)
# -------------------------------------------------------------------------
Base.metadata.create_all(bind=engine)

# -------------------------------------------------------------------------
# App
# -------------------------------------------------------------------------
app = FastAPI(
    title="Bunny Thoughts API",
    description="Backend API for the Bunny Thoughts personal blog.",
    version="1.0.0",
)

# -------------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------------
frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------------
# Routers
# -------------------------------------------------------------------------
app.include_router(thoughts.router)
app.include_router(archive.router)


# -------------------------------------------------------------------------
# Health check
# -------------------------------------------------------------------------
@app.get("/api/health", tags=["health"])
def health_check():
    """Simple liveness check — used by monitoring and CI."""
    return {"status": "ok", "service": "Bunny Thoughts API"}
