"""
Test configuration.

Sets DATABASE_URL to SQLite BEFORE any app code is imported, so that
app.database.engine points to SQLite instead of PostgreSQL.
Tests therefore run without needing a running PostgreSQL server.
"""

import os

# Override the database URL before importing any app modules
os.environ["DATABASE_URL"] = "sqlite:///./test_bunny.db"

import pytest
from fastapi.testclient import TestClient

# Import app modules AFTER overriding the env var
from app import database as db_module
from app.database import Base, get_db
import app.models  # noqa — register all models with Base
from app.main import app


# -------------------------------------------------------------------------
# Fixtures
# -------------------------------------------------------------------------

@pytest.fixture(autouse=True)
def clean_db():
    """Drop and recreate all tables before each test for a clean slate."""
    Base.metadata.drop_all(bind=db_module.engine)
    Base.metadata.create_all(bind=db_module.engine)
    yield
    Base.metadata.drop_all(bind=db_module.engine)


@pytest.fixture
def client():
    """Return a synchronous TestClient for the FastAPI app."""
    return TestClient(app)
