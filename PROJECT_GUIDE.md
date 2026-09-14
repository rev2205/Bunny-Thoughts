# 🐰 Bunny Thoughts — Master Architecture & Complete 0-to-100% Guide

Welcome to the definitive blueprint and master developer documentation for **Bunny Thoughts** — a full-stack personal blog and journal application designed with a late-2000s blogging aesthetic and powered by a modern, high-performance web architecture.

This document covers **every single technical detail, architectural pattern, communication mechanism, and setup step from 0% to 100%**.

---

## 📋 Table of Contents
1. [Project Overview & Design Philosophy](#1-project-overview--design-philosophy)
2. [Complete Technology Stack](#2-complete-technology-stack)
3. [Full Project Directory Structure](#3-full-project-directory-structure)
4. [Backend & Frontend Communication Mechanics](#4-backend--frontend-communication-mechanics)
5. [Routing & URL Dispatching Mechanics](#5-routing--url-dispatching-mechanics)
6. [Database Schema & Data Lifecycle](#6-database-schema--data-lifecycle)
7. [Step-by-Step Setup & Running (0% to 100%)](#7-step-by-step-setup--running-0-to-100)
8. [Database Options: SQLite vs PostgreSQL](#8-database-options-sqlite-vs-postgresql)
9. [Testing & Quality Assurance](#9-testing--quality-assurance)
10. [DevOps Readiness & Future Roadmap](#10-devops-readiness--future-roadmap)

---

## 1. Project Overview & Design Philosophy

### 🎯 What is Bunny Thoughts?
Bunny Thoughts is a web-based personal journal and blog. It captures the cozy, nostalgic feel of early personal blogs from the late 2000s (e.g., LiveJournal, Blogger, early WordPress), while utilizing enterprise-grade modern web technologies underneath.

### 🎨 Design System & Aesthetic
- **Color Palette**:
  - Background: Soft pastel teal (`#d1eceb`)
  - Main Container: Clean white (`#ffffff`) with subtle drop shadow
  - Navigation Header: Deep navy blue (`#1b365d`)
  - Accent / Links: Terracotta / Coral (`#d96b43`)
  - Text: Classic dark slate (`#2b2b2b` / `#4a4a4a`)
- **Typography**: Clean serif and sans-serif pairing (`Georgia`, `Inter`, system serif) with readable line height (`1.7`).
- **Mascot**: Custom SVG Bunny illustration embedded into the header, created without external image dependencies.

---

## 2. Complete Technology Stack

### 🐍 Backend
- **Language**: Python 3.11+
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, high-performance web framework)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) (Lightning-fast ASGI server implementation)
- **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Declarative relational mapper)
- **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/) (Strict type checking and JSON serialization)
- **Database Support**:
  - **SQLite**: Zero-configuration default database (`sqlite:///./bunny_thoughts.db`)
  - **PostgreSQL**: Production-ready database (`psycopg2-binary`)
- **Testing**: [Pytest](https://docs.pytest.org/) + [HTTPX](https://www.python-httpx.org/) TestClient

### ⚛️ Frontend
- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/) (Lightning-fast HMR and bundling)
- **Routing**: [React Router DOM 6](https://reactrouter.com/) (Client-side SPA routing)
- **HTTP Client**: [Axios](https://axios-http.com/) (Centralized API request module)
- **Styling**: Vanilla CSS (Custom design tokens, CSS variables, keyframe animations)

---

## 3. Full Project Directory Structure

```
Bunny-Thoughts/
├── README.md                      # Quickstart documentation
├── PROJECT_GUIDE.md               # Master 0-to-100% complete guide (This File)
├── Backend/                       # Python FastAPI Backend
│   ├── .env                       # Active environment variables
│   ├── .env.example               # Template environment variables
│   ├── requirements.txt           # Python dependencies
│   ├── seed.py                    # Database seeding script (12 sample thoughts)
│   ├── bunny_thoughts.db          # Local SQLite database (auto-generated)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app entrypoint & CORS config
│   │   ├── database.py            # SQLAlchemy engine & session manager
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py          # App settings & env parser
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── thought.py         # SQLAlchemy Thought model schema
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── thought.py         # Pydantic schemas (Create, Update, Response)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── thought_service.py # Business logic, pagination, slug generation
│   │   └── api/
│   │       ├── __init__.py
│   │       ├── router.py          # Master API router aggregator
│   │       └── v1/
│   │           ├── __init__.py
│   │           └── endpoints/
│   │               ├── __init__.py
│   │               ├── thoughts.py# CRUD endpoints for thoughts
│   │               └── archive.py # Archive grouping endpoints
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py            # Pytest database fixtures (in-memory SQLite)
│       └── test_api.py            # 22 automated API unit tests
└── frontend/                      # React + Vite Frontend
    ├── index.html                 # HTML entrypoint with Google Fonts
    ├── vite.config.js             # Vite configuration + API Proxy setup
    ├── package.json               # Node.js dependencies & scripts
    ├── src/
    │   ├── main.jsx               # React DOM mount point & BrowserRouter
    │   ├── App.jsx                # Application root & route definitions
    │   ├── index.css              # Global CSS design system
    │   ├── api/
    │   │   └── thoughts.js        # Axios instance & API client functions
    │   ├── components/
    │   │   ├── BunnyIcon.jsx      # Custom SVG Bunny Mascot
    │   │   ├── Header.jsx         # Site Header component
    │   │   ├── Nav.jsx            # Top navigation bar
    │   │   ├── Sidebar.jsx        # Categories & monthly archives sidebar
    │   │   ├── Layout.jsx         # 2-column page layout wrapper
    │   │   ├── ThoughtCard.jsx    # Blog post card for list views
    │   │   ├── Pagination.jsx     # Page numbers & ellipsis navigation
    │   │   ├── LoadingSpinner.jsx # Loading state indicator
    │   │   └── Footer.jsx         # Site footer with dynamic year
    │   └── pages/
    │       ├── HomePage.jsx       # Blog post feed page
    │       ├── ThoughtPage.jsx    # Individual thought view
    │       ├── ArchivePage.jsx    # Monthly archive post list
    │       ├── SlugRouter.jsx     # Dynamic URL dispatcher (Single vs Archive)
    │       ├── FaqPage.jsx        # FAQ with animated accordion
    │       ├── NotFoundPage.jsx   # 404 error page
    │       └── admin/
    │           ├── AdminPage.jsx     # Admin dashboard table view
    │           ├── NewThoughtPage.jsx# Create post form
    │           └── EditThoughtPage.jsx# Edit post form
```

---

## 4. Backend & Frontend Communication Mechanics

### 🔄 How Data Travels from Database to UI

```
┌─────────────────┐       HTTP GET /api/thoughts        ┌──────────────────────┐
│  React Frontend │ ──────────────────────────────────> │   Vite Dev Proxy     │
│ (localhost:5173)│                                     │   (Port 5173)        │
└─────────────────┘                                     └──────────┬───────────┘
         ▲                                                         │ Forward Request
         │ JSON Response                                           ▼
┌─────────────────┐       FastAPI + Pydantic            ┌──────────────────────┐
│   React UI      │ <────────────────────────────────── │   FastAPI Backend    │
│ Re-render State │                                     │   (localhost:8000)   │
└─────────────────┘                                     └──────────┬───────────┘
                                                                   │ SQLAlchemy Query
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │  SQLite / PostgreSQL │
                                                        │     Database         │
                                                        └──────────────────────┘
```

### 1. Vite Proxy Setup (`frontend/vite.config.js`)
During development, the React app runs on port `5173` and FastAPI runs on port `8000`. To prevent CORS issues and simplify requests, Vite proxies all requests starting with `/api` to `http://localhost:8000`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### 2. Centralized Axios API Client (`frontend/src/api/thoughts.js`)
All frontend HTTP calls pass through a centralized API helper module:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '', // Relative URL uses Vite proxy during dev & reverse proxy in prod
});

export async function getThoughts(page = 1, limit = 5) {
  const res = await api.get(`/api/thoughts?page=${page}&limit=${limit}`);
  return res.data;
}
```

### 3. FastAPI CORS Middleware (`Backend/app/main.py`)
FastAPI is configured with explicit CORS origin policies to accept requests securely:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 5. Routing & URL Dispatching Mechanics

### 🛣️ Application Route Table

| URL Pattern | Type | Component / Handler | Description |
|---|---|---|---|
| `/` | Frontend | `HomePage.jsx` | Blog feed (3 thoughts per page + intro banner) |
| `/faq` | Frontend | `FaqPage.jsx` | Frequently asked questions with smooth accordion |
| `/admin` | Frontend | `AdminPage.jsx` | Admin dashboard listing all thoughts in a table |
| `/admin/new` | Frontend | `NewThoughtPage.jsx` | Form to publish a new thought |
| `/admin/edit/:id` | Frontend | `EditThoughtPage.jsx` | Form to update an existing thought |
| `/:slug` | Frontend | `SlugRouter.jsx` | **Dynamic Dispatcher**: Routes to `ThoughtPage` or `ArchivePage` |
| `/api/thoughts` | Backend API | `GET` / `POST` | List paginated thoughts / Create new thought |
| `/api/thoughts/:id` | Backend API | `GET` / `PUT` / `DELETE` | Retrieve, update, or delete a single thought by ID |
| `/api/thoughts/slug/:slug` | Backend API | `GET` | Retrieve a single thought by unique slug |
| `/api/archive` | Backend API | `GET` | List available monthly archives with post counts |
| `/api/archive/:year/:month` | Backend API | `GET` | List thoughts published in a specific month |

### 🧩 The `SlugRouter` Dispatcher Pattern
To maintain clean root-level URLs without conflicting paths (e.g., `/september-2025` vs `/2025-09-14-153000`), `SlugRouter.jsx` uses regular expression pattern matching at runtime:
- If `:slug` matches `^(january|february|march|april|may|june|july|august|september|october|november|december)-\d{4}$`, it renders `ArchivePage`.
- Otherwise, it treats `:slug` as a single blog post slug and renders `ThoughtPage`.

---

## 6. Database Schema & Data Lifecycle

### 🗄️ Database Table: `thoughts`

```sql
CREATE TABLE thoughts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX ix_thoughts_slug ON thoughts (slug);
CREATE INDEX ix_thoughts_id ON thoughts (id);
```

### 🏷️ Automatic Slug Generation Strategy
- Slugs are automatically derived from the post date (`published_at`):
  - Format: `YYYY-MM-DD-HHMMSS` (e.g., `2025-09-14-153000`)
- If two posts share the exact same timestamp, the service automatically disambiguates by appending `-1`, `-2`, etc.

---

## 7. Step-by-Step Setup & Running (0% to 100%)

Follow these exact steps to run Bunny Thoughts on any fresh workstation.

### ⚡ 1-Click Launch (Recommended)
On Windows, simply run **`start.bat`** from the root workspace directory:
```cmd
.\start.bat
```
This batch script automatically:
1. Validates Python `venv` and installs backend dependencies.
2. Seeds the database (`python seed.py`).
3. Validates Node `node_modules` and installs frontend packages.
4. Starts FastAPI backend on `http://127.0.0.1:8000`.
5. Starts Vite frontend on `http://localhost:5173`.
6. Opens `http://localhost:5173` automatically in your browser!

*To cleanly terminate both servers, run **`.\stop.bat`**.*

---

### Step 1: System Prerequisites
- **Python**: Version 3.11 or higher installed (`python --version`)
- **Node.js**: Version 18 or higher installed (`node -v`)
- **Git**: Installed (`git --version`)

---

### Step 2: Backend Setup & Launch

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Create and activate a Python Virtual Environment**:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**:
   Copy the example environment file to `.env`:
   - **Windows**:
     ```powershell
     copy .env.example .env
     ```
   - **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```

5. **Seed the Database with Sample Content**:
   ```bash
   python seed.py
   ```
   *Output: `[SUCCESS] Seeded 12 thoughts successfully.` (or `[INFO] Database already seeded`)*

6. **Start the FastAPI Backend Server**:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   - FastAPI Backend is live at: `http://localhost:8000`
   - Interactive Swagger API Docs: `http://localhost:8000/docs`

---

### Step 3: Frontend Setup & Launch

1. **Open a new terminal window** and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. **Install Node Modules**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   - Frontend is live at: `http://localhost:5173`

---

## 8. Database Options: SQLite vs PostgreSQL

Bunny Thoughts supports both **SQLite** (default for local development) and **PostgreSQL** (recommended for production/DevOps).

### Switching to PostgreSQL
If you want to use PostgreSQL locally or in Docker:
1. Ensure PostgreSQL is running on port `5432`.
2. Create a database named `bunny_thoughts` and user `bunny` with password `bunnypass`.
3. Update `Backend/.env`:
   ```env
   DATABASE_URL=postgresql://bunny:bunnypass@localhost:5432/bunny_thoughts
   ```
4. Run `python seed.py` to create tables and seed data.

---

## 9. Testing & Quality Assurance

### Running Backend Unit Tests
The backend includes a full test suite built with `pytest` that tests database connections, CRUD operations, slug uniqueness, and API error codes using an isolated in-memory database:

```bash
cd Backend
.\venv\Scripts\activate
pytest
```
*Expected Output: `22 passed in 0.90s`*

### Validating Frontend Production Build
To verify that the frontend compiles cleanly for production:
```bash
cd frontend
npm run build
```
*Expected Output: `vite build -> dist/ index.html and index.js generated with zero errors.`*

---

## 10. DevOps Readiness & Future Roadmap

Bunny Thoughts was architected specifically to be deployed into containerized and cloud environments.

### 🐳 Docker Architecture (Next Steps)
1. **Backend Container**: Dockerfile running `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
2. **Frontend Container**: Multi-stage Dockerfile building Vite bundle with `npm run build` and serving assets via `nginx:alpine`.
3. **Database Container**: Official `postgres:15-alpine` image configured via `docker-compose.yml`.

### ☸️ Kubernetes & Cloud Roadmap
- **Helm Charts / K8s Manifests**: `Deployment`, `Service`, `Ingress`, and `PersistentVolumeClaim` definitions.
- **CI/CD Pipeline**: GitHub Actions workflow testing on Pull Requests and building multi-arch Docker images on push.
- **AWS Infrastructure**: Deployment target for AWS EKS or EC2 with RDS PostgreSQL.

---

*Keep thinking. Keep growing. ♡*
