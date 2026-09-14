"""
Archive router — returns available months and their thoughts.
"""

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.thought import ThoughtListResponse
from app.services import thought_service

router = APIRouter(prefix="/api/archive", tags=["archive"])

MONTH_DISPLAY_NAMES: dict[int, str] = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
}


@router.get("")
def get_archive(db: Session = Depends(get_db)):
    """Return a list of months that have at least one thought, newest first.

    Each entry includes:
    - year, month (integers)
    - month_name (e.g. "August")
    - count (number of thoughts)
    - slug (e.g. "august-2025") — used to build frontend URLs
    """
    results = thought_service.get_archive(db)
    return [
        {
            "year": int(r.year),
            "month": int(r.month),
            "month_name": MONTH_DISPLAY_NAMES[int(r.month)],
            "count": r.count,
            "slug": f"{MONTH_DISPLAY_NAMES[int(r.month)].lower()}-{int(r.year)}",
        }
        for r in results
    ]


@router.get("/{year}/{month}", response_model=List[ThoughtListResponse])
def get_thoughts_by_month(
    year: int, month: int, db: Session = Depends(get_db)
):
    """Return all thoughts published in a given year/month, newest first."""
    thoughts = thought_service.get_thoughts_by_month(db, year, month)
    return thoughts
