"""
Business logic for Thought CRUD, slug generation, and archive queries.
All database interactions go through this service layer.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.models.thought import Thought
from app.schemas.thought import ThoughtCreate, ThoughtUpdate

# ---------------------------------------------------------------------------
# Month name lookup (1-indexed)
# ---------------------------------------------------------------------------
MONTH_NAMES: dict[int, str] = {
    1: "january",
    2: "february",
    3: "march",
    4: "april",
    5: "may",
    6: "june",
    7: "july",
    8: "august",
    9: "september",
    10: "october",
    11: "november",
    12: "december",
}


# ---------------------------------------------------------------------------
# Slug helpers
# ---------------------------------------------------------------------------

def generate_slug_from_date(published_at: datetime) -> str:
    """Generate a URL slug from a publication datetime.

    Example:
        datetime(2025, 8, 28, 10, 0) -> "august-28-2025"
    """
    month = MONTH_NAMES[published_at.month]
    day = published_at.day
    year = published_at.year
    return f"{month}-{day}-{year}"


def ensure_unique_slug(
    db: Session, base_slug: str, exclude_id: Optional[int] = None
) -> str:
    """Guarantee the slug is unique in the database.

    If a collision is found, appends -2, -3, … until the slug is free.
    Pass ``exclude_id`` when updating so the existing row isn't counted
    against itself.
    """
    slug = base_slug
    counter = 2
    while True:
        query = db.query(Thought).filter(Thought.slug == slug)
        if exclude_id is not None:
            query = query.filter(Thought.id != exclude_id)
        if query.first() is None:
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


# ---------------------------------------------------------------------------
# Read operations
# ---------------------------------------------------------------------------

def get_thoughts(
    db: Session, page: int = 1, limit: int = 4
) -> Tuple[List[Thought], int, int]:
    """Return a paginated list of thoughts (newest first).

    Returns:
        (thoughts, total_count, total_pages)
    """
    offset = (page - 1) * limit
    total: int = db.query(func.count(Thought.id)).scalar() or 0
    thoughts = (
        db.query(Thought)
        .order_by(Thought.published_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    total_pages = max(1, (total + limit - 1) // limit)
    return thoughts, total, total_pages


def get_thought_by_id(db: Session, thought_id: int) -> Optional[Thought]:
    return db.query(Thought).filter(Thought.id == thought_id).first()


def get_thought_by_slug(db: Session, slug: str) -> Optional[Thought]:
    return db.query(Thought).filter(Thought.slug == slug).first()


# ---------------------------------------------------------------------------
# Write operations
# ---------------------------------------------------------------------------

def create_thought(db: Session, thought_data: ThoughtCreate) -> Thought:
    """Create a new thought with an auto-generated, collision-safe slug."""
    base_slug = generate_slug_from_date(thought_data.published_at)
    slug = ensure_unique_slug(db, base_slug)

    thought = Thought(
        title=thought_data.title,
        slug=slug,
        content=thought_data.content,
        published_at=thought_data.published_at,
    )
    db.add(thought)
    db.commit()
    db.refresh(thought)
    return thought


def update_thought(
    db: Session, thought_id: int, thought_data: ThoughtUpdate
) -> Optional[Thought]:
    """Update an existing thought.

    If ``published_at`` changes, the slug is regenerated automatically.
    """
    thought = get_thought_by_id(db, thought_id)
    if thought is None:
        return None

    update_data = thought_data.model_dump(exclude_unset=True)

    if "published_at" in update_data:
        base_slug = generate_slug_from_date(update_data["published_at"])
        thought.slug = ensure_unique_slug(db, base_slug, exclude_id=thought_id)

    for key, value in update_data.items():
        setattr(thought, key, value)

    thought.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(thought)
    return thought


def delete_thought(db: Session, thought_id: int) -> bool:
    """Delete a thought by ID. Returns True if deleted, False if not found."""
    thought = get_thought_by_id(db, thought_id)
    if thought is None:
        return False
    db.delete(thought)
    db.commit()
    return True


# ---------------------------------------------------------------------------
# Archive operations
# ---------------------------------------------------------------------------

def get_archive(db: Session) -> list:
    """Return a list of (year, month, count) rows sorted newest-first."""
    results = (
        db.query(
            extract("year", Thought.published_at).label("year"),
            extract("month", Thought.published_at).label("month"),
            func.count(Thought.id).label("count"),
        )
        .group_by(
            extract("year", Thought.published_at),
            extract("month", Thought.published_at),
        )
        .order_by(
            extract("year", Thought.published_at).desc(),
            extract("month", Thought.published_at).desc(),
        )
        .all()
    )
    return results


def get_thoughts_by_month(
    db: Session, year: int, month: int
) -> List[Thought]:
    """Return all thoughts published in the given year/month, newest first."""
    return (
        db.query(Thought)
        .filter(
            extract("year", Thought.published_at) == year,
            extract("month", Thought.published_at) == month,
        )
        .order_by(Thought.published_at.desc())
        .all()
    )
