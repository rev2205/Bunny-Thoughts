"""
API integration tests for Bunny Thoughts backend.

All tests use SQLite (configured in conftest.py) — no PostgreSQL needed.
"""

import pytest
from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

def test_health(client: TestClient):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "Bunny Thoughts" in data["service"]


# ---------------------------------------------------------------------------
# GET /api/thoughts — empty state
# ---------------------------------------------------------------------------

def test_get_thoughts_empty(client: TestClient):
    resp = client.get("/api/thoughts")
    assert resp.status_code == 200
    data = resp.json()
    assert data["thoughts"] == []
    assert data["total"] == 0
    assert data["total_pages"] == 1  # min value is 1


# ---------------------------------------------------------------------------
# POST /api/thoughts — create
# ---------------------------------------------------------------------------

def test_create_thought(client: TestClient):
    payload = {"content": "Test thought.", "published_at": "2025-08-28T10:00:00"}
    resp = client.post("/api/thoughts", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["content"] == "Test thought."
    assert data["slug"] == "august-28-2025"
    assert "id" in data
    assert data["title"] is None


def test_create_thought_with_title(client: TestClient):
    payload = {
        "title": "My Title",
        "content": "Content here.",
        "published_at": "2025-09-01T10:00:00",
    }
    resp = client.post("/api/thoughts", json=payload)
    assert resp.status_code == 201
    assert resp.json()["title"] == "My Title"
    assert resp.json()["slug"] == "september-1-2025"


def test_create_thought_missing_content(client: TestClient):
    resp = client.post("/api/thoughts", json={"published_at": "2025-09-01T10:00:00"})
    assert resp.status_code == 422  # validation error


# ---------------------------------------------------------------------------
# Slug collision handling
# ---------------------------------------------------------------------------

def test_slug_collision(client: TestClient):
    """Two thoughts published on the same date must get distinct slugs."""
    payload = {"content": "First.", "published_at": "2025-08-10T10:00:00"}
    r1 = client.post("/api/thoughts", json=payload)
    assert r1.status_code == 201
    assert r1.json()["slug"] == "august-10-2025"

    payload2 = {"content": "Second.", "published_at": "2025-08-10T12:00:00"}
    r2 = client.post("/api/thoughts", json=payload2)
    assert r2.status_code == 201
    assert r2.json()["slug"] == "august-10-2025-2"


# ---------------------------------------------------------------------------
# GET /api/thoughts?page=&limit=
# ---------------------------------------------------------------------------

def test_get_thoughts_after_create(client: TestClient):
    client.post("/api/thoughts", json={"content": "Hello", "published_at": "2025-09-01T10:00:00"})
    resp = client.get("/api/thoughts")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert len(data["thoughts"]) == 1


def test_pagination(client: TestClient):
    """Create 6 thoughts and paginate with limit=4."""
    for i in range(1, 7):
        client.post("/api/thoughts", json={
            "content": f"Thought {i}",
            "published_at": f"2025-09-{i:02d}T10:00:00",
        })

    r1 = client.get("/api/thoughts?page=1&limit=4")
    assert r1.status_code == 200
    d1 = r1.json()
    assert len(d1["thoughts"]) == 4
    assert d1["total"] == 6
    assert d1["total_pages"] == 2

    r2 = client.get("/api/thoughts?page=2&limit=4")
    d2 = r2.json()
    assert len(d2["thoughts"]) == 2


def test_thoughts_ordered_newest_first(client: TestClient):
    client.post("/api/thoughts", json={"content": "Older", "published_at": "2025-07-01T10:00:00"})
    client.post("/api/thoughts", json={"content": "Newer", "published_at": "2025-09-01T10:00:00"})
    resp = client.get("/api/thoughts")
    thoughts = resp.json()["thoughts"]
    assert thoughts[0]["content"] == "Newer"


# ---------------------------------------------------------------------------
# GET /api/thoughts/{id}
# ---------------------------------------------------------------------------

def test_get_single_thought(client: TestClient):
    create_resp = client.post("/api/thoughts", json={"content": "Single", "published_at": "2025-07-15T10:00:00"})
    tid = create_resp.json()["id"]
    resp = client.get(f"/api/thoughts/{tid}")
    assert resp.status_code == 200
    assert resp.json()["id"] == tid


def test_get_nonexistent_thought(client: TestClient):
    resp = client.get("/api/thoughts/9999")
    assert resp.status_code == 404


# ---------------------------------------------------------------------------
# GET /api/thoughts/slug/{slug}
# ---------------------------------------------------------------------------

def test_get_thought_by_slug(client: TestClient):
    client.post("/api/thoughts", json={"content": "Slug test", "published_at": "2025-06-10T10:00:00"})
    resp = client.get("/api/thoughts/slug/june-10-2025")
    assert resp.status_code == 200
    assert resp.json()["slug"] == "june-10-2025"


def test_get_nonexistent_slug(client: TestClient):
    resp = client.get("/api/thoughts/slug/does-not-exist")
    assert resp.status_code == 404


# ---------------------------------------------------------------------------
# PUT /api/thoughts/{id}
# ---------------------------------------------------------------------------

def test_update_thought_content(client: TestClient):
    create_resp = client.post("/api/thoughts", json={"content": "Original", "published_at": "2025-05-20T10:00:00"})
    tid = create_resp.json()["id"]
    update_resp = client.put(f"/api/thoughts/{tid}", json={"content": "Updated content"})
    assert update_resp.status_code == 200
    assert update_resp.json()["content"] == "Updated content"
    assert update_resp.json()["slug"] == "may-20-2025"  # slug unchanged


def test_update_thought_date_changes_slug(client: TestClient):
    create_resp = client.post("/api/thoughts", json={"content": "Dated", "published_at": "2025-05-20T10:00:00"})
    tid = create_resp.json()["id"]
    update_resp = client.put(f"/api/thoughts/{tid}", json={"published_at": "2025-06-15T10:00:00"})
    assert update_resp.status_code == 200
    assert update_resp.json()["slug"] == "june-15-2025"


def test_update_nonexistent_thought(client: TestClient):
    resp = client.put("/api/thoughts/9999", json={"content": "x"})
    assert resp.status_code == 404


# ---------------------------------------------------------------------------
# DELETE /api/thoughts/{id}
# ---------------------------------------------------------------------------

def test_delete_thought(client: TestClient):
    create_resp = client.post("/api/thoughts", json={"content": "To delete", "published_at": "2025-04-10T10:00:00"})
    tid = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/thoughts/{tid}")
    assert delete_resp.status_code == 204

    get_resp = client.get(f"/api/thoughts/{tid}")
    assert get_resp.status_code == 404


def test_delete_nonexistent_thought(client: TestClient):
    resp = client.delete("/api/thoughts/9999")
    assert resp.status_code == 404


# ---------------------------------------------------------------------------
# GET /api/archive
# ---------------------------------------------------------------------------

def test_get_archive(client: TestClient):
    client.post("/api/thoughts", json={"content": "Sep", "published_at": "2025-09-01T10:00:00"})
    client.post("/api/thoughts", json={"content": "Aug", "published_at": "2025-08-01T10:00:00"})

    resp = client.get("/api/archive")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    # Sorted newest first → September before August
    assert data[0]["month"] == 9
    assert data[0]["year"] == 2025
    assert data[0]["slug"] == "september-2025"
    assert data[1]["month"] == 8


def test_get_archive_empty(client: TestClient):
    resp = client.get("/api/archive")
    assert resp.status_code == 200
    assert resp.json() == []


# ---------------------------------------------------------------------------
# GET /api/archive/{year}/{month}
# ---------------------------------------------------------------------------

def test_get_thoughts_by_month(client: TestClient):
    client.post("/api/thoughts", json={"content": "Aug thought", "published_at": "2025-08-15T10:00:00"})
    client.post("/api/thoughts", json={"content": "Sep thought", "published_at": "2025-09-15T10:00:00"})

    resp = client.get("/api/archive/2025/8")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert "Aug thought" in data[0]["content"]


def test_get_thoughts_by_month_empty(client: TestClient):
    resp = client.get("/api/archive/2025/1")
    assert resp.status_code == 200
    assert resp.json() == []
