"""
Thought ORM model — maps to the `thoughts` table in PostgreSQL.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Thought(Base):
    __tablename__ = "thoughts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    published_at = Column(DateTime(timezone=False), nullable=False)
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=False),
        server_default=func.now(),
        onupdate=func.now(),
    )
