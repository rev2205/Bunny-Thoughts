# 🐰 Bunny Thoughts

A personal blog/journal application with a late-2000s blog aesthetic, built on a modern full-stack:

- **Frontend**: React 18 + Vite 5 + React Router 6
- **Backend**: Python 3.11+ / FastAPI / Uvicorn
- **Database**: PostgreSQL 16 (via SQLAlchemy 2.x)
- **Dev DB**: Docker Compose (PostgreSQL only)

---

## Architecture

```
Browser
  ↓
React + Vite  (port 5173)
  ↓  /api/* proxied
FastAPI + Uvicorn  (port 8000)
  ↓  SQLAlchemy 2.x
PostgreSQL  (port 5432)
```

---

## Folder Structure

```
Bunny-Thoughts/
├── backend/
│   ├── app/
│   │   ├── main.py          ← FastAPI app entry point
│   │   ├── database.py      ← SQLAlchemy engine + session
│   │   ├── models/
│   │   │   └── thought.py   ← ORM model
│   │   ├── schemas/
│   │   │   └── thought.py   ← Pydantic schemas
│   │   ├── routers/
│   │   │   ├── thoughts.py  ← CRUD endpoints
│   │   │   └── archive.py   ← Archive endpoints
│   │   └── services/
│   │       └── thought_service.py  ← Business logic
│   ├── tests/
│   │   ├── conftest.py      ← SQLite test database setup
│   │   └── test_api.py      ← 22 integration tests
│   ├── seed.py              ← Seed 12 sample thoughts
│   ├── requirements.txt
│   ├── .env                 ← Not committed (gitignored)
│   └── .env.example         ← Committed — copy to .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── thoughts.js  ← All API calls (Axios)
│   │   ├── components/
│   │   │   ├── Header, Nav, Footer, Layout, Sidebar
│   │   │   ├── ThoughtCard, Pagination, LoadingSpinner
│   │   │   └── BunnyIcon    ← Original SVG mascot
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ThoughtPage.jsx
│   │   │   ├── ArchivePage.jsx
│   │   │   ├── FaqPage.jsx
│   │   │   ├── SlugRouter.jsx   ← Runtime URL dispatcher
│   │   │   └── admin/
│   │   │       ├── AdminPage.jsx
│   │   │       ├── NewThoughtPage.jsx
│   │   │       └── EditThoughtPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        ← Full design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml        ← PostgreSQL only
├── .gitignore
└── README.md  ← This file
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| Docker Desktop | latest |
| npm | 9+ |

---

## Setup & Running Locally

### 1. Start PostgreSQL

```bash
# From the repo root
docker-compose up -d
```

This starts a PostgreSQL 16 container on port 5432.
Database: `bunny_thoughts`, User: `bunny`, Password: `bunnypass`.

### ⚡ 1-Click Quickstart (Windows)

Simply double-click **`start.bat`** (or run `.\start.bat` in your terminal).

It automatically:
1. Installs Python & Node dependencies if needed.
2. Seeds the database with 12 sample blog posts.
3. Launches the FastAPI backend server (`http://localhost:8000`).
4. Launches the React Vite frontend server (`http://localhost:5173`).
5. Opens `http://localhost:5173` in your default browser!

*To stop all servers cleanly, run **`.\stop.bat`**.*

---

### 🛠️ Manual Setup Steps

```bash
cd backend

# Activate the virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# (or macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env   # Windows
# or
cp .env.example .env     # macOS/Linux

# (Edit .env if your credentials differ from the defaults)
```

#### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./bunny_thoughts.db` | SQLite (default) or PostgreSQL (`postgresql://user:pass@host:5432/db`) |
| `FRONTEND_URL` | `http://localhost:5173` | Used for CORS |

---

### 3. Seed the Database

```bash
# From backend/ with venv active
python seed.py
```

Seeds 12 original sample thoughts distributed across June–September 2025.

---

### 4. Start the Backend

```bash
# From backend/ with venv active
uvicorn app.main:app --reload
```

FastAPI is now running at **http://localhost:8000**.
Auto-generated API docs: http://localhost:8000/docs

---

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend is now running at **http://localhost:5173**.

> **Note:** The Vite dev server proxies all `/api/*` requests to `http://localhost:8000`.
> You do not need to configure CORS separately for development.

---

## Running Backend Tests

Tests use SQLite in-memory so they **do not require a running PostgreSQL server**.

```bash
cd backend

# Activate venv first
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate       # macOS/Linux

# Run all tests
pytest tests/ -v

# Run with coverage (optional)
pytest tests/ -v --tb=short
```

**22 test cases** cover:
- Health endpoint
- GET thoughts (empty, paginated, ordered)
- POST thought (with and without title)
- Slug collision handling
- GET thought by ID and slug
- PUT (update content + update date → slug change)
- DELETE (existing + non-existent)
- GET archive
- GET thoughts by month
- Pagination

---

## Public Frontend Routes

| URL | Description |
|-----|-------------|
| `/` | Homepage — latest thoughts, paginated |
| `/august-28-2025/` | Individual thought by date-slug |
| `/august-2025/` | All thoughts from August 2025 |
| `/faq/` | Frequently Asked Questions |

> **Important:** All public URLs are at the root level.
> There is no `/thoughts/`, `/posts/`, or `/archive/` prefix.

### More Examples

```
/                        → homepage
/september-14-2025/      → thought from Sep 14, 2025
/june-15-2025/           → thought from Jun 15, 2025
/september-2025/         → archive: all September 2025 thoughts
/august-2025/            → archive: all August 2025 thoughts
/faq/                    → FAQ
```

---

## Admin Routes

| URL | Description |
|-----|-------------|
| `/admin/` | Dashboard — list + delete thoughts |
| `/admin/new/` | Create a new thought |
| `/admin/edit/:id/` | Edit an existing thought |

> Admin has no authentication yet — it will be added in a future release.
> Public visitors never see Edit/Delete buttons; those only appear in the `/admin/` area.

---

## Backend API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Liveness check |
| GET | `/api/thoughts?page=1&limit=4` | Paginated thoughts list |
| GET | `/api/thoughts/{id}` | Single thought by ID |
| GET | `/api/thoughts/slug/{slug}` | Single thought by URL slug |
| POST | `/api/thoughts` | Create a thought |
| PUT | `/api/thoughts/{id}` | Update a thought |
| DELETE | `/api/thoughts/{id}` | Delete a thought |
| GET | `/api/archive` | All months with post counts |
| GET | `/api/archive/{year}/{month}` | All thoughts in a given month |

---

## Database Schema

```sql
CREATE TABLE thoughts (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(255),         -- optional
    slug         VARCHAR(255) UNIQUE NOT NULL,  -- e.g. "august-28-2025"
    content      TEXT NOT NULL,
    published_at TIMESTAMP NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);
```

The `slug` is auto-generated from `published_at`:
- `2025-08-28` → `august-28-2025`
- Collision (same date, two posts) → `august-28-2025-2`

---

## Future DevOps Phase (Not Yet Implemented)

This project is designed to be the foundation for learning:

```
Git → GitHub → GitHub Actions → Docker → Container Registry → Kubernetes → AWS
```

Do not add DevOps infrastructure until you are ready for that phase.

---

## Design Reference

The visual design is inspired by late-2000s personal blog aesthetics:

- **Page background**: `#7ecac3` (pastel teal)
- **Content container**: white, centered, max-width 800px
- **Navigation bar**: `#3a5f8a` (slate blue)
- **Site title**: `#1a5f9e` (cobalt blue)
- **Read more / links**: `#cc3333` (coral red)
- **Typography**: Georgia (body), Inter (UI)

---

## License

MIT — do whatever you want with it. 🐰
