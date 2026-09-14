"""
Seed script — populates the database with 12 original sample thoughts.

Run once after setting up the database:
    python seed.py

Safe to run multiple times: exits early if data already exists.
"""

import sys
import os

# Allow running from the backend/ directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime

from app.database import SessionLocal, engine, Base
from app.models.thought import Thought  # noqa — registers model
from app.services.thought_service import generate_slug_from_date, ensure_unique_slug

Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# Original sample content — 12 thoughts across 6 months
# ---------------------------------------------------------------------------
SAMPLE_THOUGHTS = [
    # ---- June 2025 --------------------------------------------------------
    {
        "title": None,
        "published_at": datetime(2025, 6, 15, 18, 30, 0),
        "content": (
            "Started keeping a gratitude list. Not because a productivity influencer told me to "
            "(okay, maybe a little because of that), but because I genuinely wanted to see what I'd write down.\n\n"
            "Day one list: good coffee, the sound of rain, the fact that bees exist, my favourite hoodie, this blog.\n\n"
            "Surprisingly easy. Apparently there's a lot to be grateful for when you actually look."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 6, 28, 15, 0, 0),
        "content": (
            "Summer is somehow already half over, which is confusing because it didn't feel like it started.\n\n"
            "I've been making a list of things I want to do before it ends. It's a very ambitious list. "
            "I will complete approximately 30% of it and feel good about that.\n\n"
            "On the list: try a new recipe, take a long walk somewhere green, finish at least one of the "
            "three books I'm currently reading. Simple things. Achievable things. Allegedly."
        ),
    },
    # ---- July 2025 --------------------------------------------------------
    {
        "title": None,
        "published_at": datetime(2025, 7, 10, 21, 0, 0),
        "content": (
            "Reading more lately. It's been good. There's something about getting absorbed in someone else's "
            "world for a while that makes your own feel a little more manageable.\n\n"
            "Currently reading three books simultaneously like the chaotic person I am. A novel, "
            "a book about systems thinking, and something about the history of salt. "
            "The salt book is unexpectedly gripping.\n\n"
            "Apparently salt has caused wars. Multiple wars. Over salt. Humans are fascinating."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 7, 22, 7, 30, 0),
        "content": (
            "Had a strange dream last night where I was a librarian in a library that only had one book, "
            "and everyone was furious about it. I kept apologising but also secretly thought the book was quite good.\n\n"
            "Not sure what to make of that.\n\n"
            "On a more grounded note: I've been trying to spend less time on my phone in the mornings. "
            "Waking up and immediately scrolling feels like inviting strangers to yell at you before you've had coffee. "
            "Hard pass."
        ),
    },
    # ---- August 2025 ------------------------------------------------------
    {
        "title": None,
        "published_at": datetime(2025, 8, 7, 11, 0, 0),
        "content": (
            "Progress isn't always loud. Sometimes it's just showing up, again and again, even when it's hard.\n\n"
            "I've been tracking a few habits lately. Not perfectly — some days are a clean zero — "
            "but I keep coming back. And apparently that's the whole point.\n\n"
            "Also watched a documentary about bread. Highly recommend. Very calming. Very crusty."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 8, 14, 16, 45, 0),
        "content": (
            "I've been thinking a lot about the kind of person I want to be. "
            "Kind. Curious. Independent. At peace. This is me writing it down, so I don't forget.\n\n"
            "Spent the afternoon at a café doing absolutely nothing important. "
            "Watched people walk by. Thought about octopuses (they're genuinely fascinating creatures). "
            "Drank an overpriced latte.\n\n"
            "Good day."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 8, 21, 20, 0, 0),
        "content": (
            "I finally took some time off to just sit with my thoughts. "
            "It felt good. No laptop, no learning, no checking anything — "
            "just me, my playlist, and the sky. I think I needed that more than I realised.\n\n"
            "Also: I reorganised my bookmarks folder today. "
            "I have 847 saved articles I will never read. I'm at peace with this."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 8, 28, 8, 0, 0),
        "content": (
            "Today was one of those days where everything felt a little brighter. "
            "I started the morning with a warm cup of chai, watched the rain outside, "
            "and actually took my time instead of rushing into the day.\n\n"
            "I've been thinking a lot about how small moments make life feel meaningful. "
            "A good song, a kind message, a quiet evening — it's amazing how these little things add up.\n\n"
            "I also spent some time organising my space and writing down a few goals for the rest of the month. "
            "Nothing too big, just small steps. But small steps still count."
        ),
    },
    # ---- September 2025 ---------------------------------------------------
    {
        "title": None,
        "published_at": datetime(2025, 9, 1, 10, 0, 0),
        "content": (
            "Started this blog today! A space to dump thoughts, ideas, silly things, "
            "and maybe even some useful learnings. Let's see where this goes. 🐰\n\n"
            "I've been meaning to do this for a while — just have a little corner of the internet "
            "that's mine. No algorithm. No likes counter. Just words.\n\n"
            "Honestly, if even one person finds something here that makes them feel less alone, "
            "that's enough for me. And if not... well, at least I'll have a record of how my brain works. Or doesn't."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 9, 5, 14, 30, 0),
        "content": (
            "I've been thinking a lot about the kind of life I want to build. "
            "Not just in terms of career, but also the kind of person I want to be. "
            "Kind. Curious. Independent. At peace. This is me writing it down, so I don't forget.\n\n"
            "Sometimes I worry I'm chasing some abstract idea of a 'good life' instead of just... living. "
            "Like I'm planning a trip but never actually leaving the house.\n\n"
            "Note to self: leave the house more. Metaphorically and literally."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 9, 10, 19, 0, 0),
        "content": (
            "I finally took some time to just sit with my thoughts. "
            "It felt good. No laptop, no learning, no checking anything — "
            "just me, my playlist, and the sky. I think I needed that.\n\n"
            "There's this weird guilt that comes with doing nothing. "
            "Like time spent not 'being productive' is time wasted. "
            "But doing nothing IS something. It's rest. It's maintenance. It's important.\n\n"
            "Anyway. My playlist was excellent. 10/10 recommend."
        ),
    },
    {
        "title": None,
        "published_at": datetime(2025, 9, 14, 9, 15, 0),
        "content": (
            "Some days are just a mix of overthinking, chai, and small wins. "
            "Today was one of those days. I realised how important it is to just keep showing up, "
            "even when things feel uncertain or hard.\n\n"
            "I sent an email I'd been putting off for three weeks. That was the small win. "
            "I also made really good chai. That was the big win.\n\n"
            "Progress is progress."
        ),
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        existing = db.query(Thought).count()
        if existing > 0:
            print(f"[INFO] Database already has {existing} thought(s). Skipping seed.")
            return

        for data in SAMPLE_THOUGHTS:
            base_slug = generate_slug_from_date(data["published_at"])
            slug = ensure_unique_slug(db, base_slug)
            thought = Thought(
                title=data.get("title"),
                slug=slug,
                content=data["content"],
                published_at=data["published_at"],
            )
            db.add(thought)

        db.commit()
        print(f"[SUCCESS] Seeded {len(SAMPLE_THOUGHTS)} thoughts successfully.")
    except Exception as exc:
        db.rollback()
        print(f"[ERROR] Seeding failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
