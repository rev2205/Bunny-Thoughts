"""
Thoughts router — CRUD endpoints for blog thoughts.

IMPORTANT: The /slug/{slug} route MUST be registered before /{thought_id}
to prevent FastAPI from treating "slug" as an integer.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.thought import (
    PaginatedThoughtsResponse,
    ThoughtCreate,
    ThoughtResponse,
    ThoughtUpdate,
)
from app.services import thought_service

router = APIRouter(prefix="/api/thoughts", tags=["thoughts"])


@router.get("", response_model=PaginatedThoughtsResponse)
def list_thoughts(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(10, ge=1, le=100, description="Thoughts per page"),
    db: Session = Depends(get_db),
):
    """Return a paginated list of thoughts, newest first."""
    thoughts, total, total_pages = thought_service.get_thoughts(db, page, limit)
    return PaginatedThoughtsResponse(
        thoughts=thoughts,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


# slug route MUST come before /{thought_id} to avoid routing conflicts
@router.get("/slug/{slug}", response_model=ThoughtResponse)
def get_thought_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve a single thought by its URL slug (e.g. 'august-28-2025')."""
    thought = thought_service.get_thought_by_slug(db, slug)
    if thought is None:
        raise HTTPException(status_code=404, detail="Thought not found")
    return thought


@router.get("/{thought_id}", response_model=ThoughtResponse)
def get_thought(thought_id: int, db: Session = Depends(get_db)):
    """Retrieve a single thought by its database ID."""
    thought = thought_service.get_thought_by_id(db, thought_id)
    if thought is None:
        raise HTTPException(status_code=404, detail="Thought not found")
    return thought


@router.post("", response_model=ThoughtResponse, status_code=201)
def create_thought(thought_data: ThoughtCreate, db: Session = Depends(get_db)):
    """Create a new thought. The slug is auto-generated from published_at."""
    return thought_service.create_thought(db, thought_data)


@router.put("/{thought_id}", response_model=ThoughtResponse)
def update_thought(
    thought_id: int, thought_data: ThoughtUpdate, db: Session = Depends(get_db)
):
    """Update an existing thought. Changing published_at regenerates the slug."""
    thought = thought_service.update_thought(db, thought_id, thought_data)
    if thought is None:
        raise HTTPException(status_code=404, detail="Thought not found")
    return thought


@router.delete("/{thought_id}", status_code=204)
def delete_thought(thought_id: int, db: Session = Depends(get_db)):
    """Permanently delete a thought."""
    success = thought_service.delete_thought(db, thought_id)
    if not success:
        raise HTTPException(status_code=404, detail="Thought not found")
