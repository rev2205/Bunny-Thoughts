"""
Pydantic schemas for request validation and response serialisation.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


class ThoughtBase(BaseModel):
    title: Optional[str] = None
    content: str
    published_at: datetime


class ThoughtCreate(ThoughtBase):
    """Used when POSTing a new thought."""
    pass


class ThoughtUpdate(BaseModel):
    """All fields optional — PATCH-style update."""
    title: Optional[str] = None
    content: Optional[str] = None
    published_at: Optional[datetime] = None


class ThoughtResponse(BaseModel):
    """Full thought returned from API."""
    id: int
    title: Optional[str] = None
    slug: str
    content: str
    published_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ThoughtListResponse(BaseModel):
    """Thought in a list context (same fields, kept separate for future divergence)."""
    id: int
    title: Optional[str] = None
    slug: str
    content: str
    published_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedThoughtsResponse(BaseModel):
    """Paginated list of thoughts with metadata."""
    thoughts: List[ThoughtListResponse]
    total: int
    page: int
    limit: int
    total_pages: int
