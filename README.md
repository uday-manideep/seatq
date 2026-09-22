# SeatQ — Module 0: Project Setup and Environment

This is the skeleton for Module 0. It gives you:
- A NestJS backend that boots and exposes a health check
- A Next.js frontend that boots and shows a home page
- Docker Compose for local PostgreSQL and Redis
- Env file templates
- Lint/format config
- A GitHub Actions CI pipeline that lints and builds on every push

Nothing "real" (auth, queue, payments) lives here yet — that starts in Module 1 onward.
This module's only job is: **everything runs, and the pieces can talk to each other.**

---

## 0. Prerequisites

Install on your machine:
- Node.js 20 LTS or newer (`node -v` to check)
- npm 10+ (comes with Node)
- Docker Desktop (for Postgres and Redis)
- Git

---

## 1. Get the code onto your machine

Unzip this project, then:

```bash
cd seatq
git init
git add .
git commit -m "Module 0: project setup"
```

Create an empty repo on GitHub, then:

```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

---

## 2. Start Postgres and Redis

From the project root:

```bash
docker compose up -d
```

This starts:
- PostgreSQL on `localhost:5432` (db: `seatq`, user: `seatq`, password: `seatq_dev_password`)
- Redis on `localhost:6379`

Check they're running:

```bash
docker compose ps
```

To stop them later: `docker compose down` (add `-v` to also wipe the data).

---

## 3. Set up and run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

You should see NestJS boot on `http://localhost:4000`.

Test it:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{ "status": "ok", "database": "connected", "redis": "connected" }
```

If `database` or `redis` say `"error"`, double check Docker Compose is running (step 2) and that `.env` matches `docker-compose.yml`.

---

## 4. Set up and run the frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. You should see a SeatQ starter page that fetches and displays the backend's `/health` response — proving the two sides can talk to each other.

---

## 5. Lint and format check

From `backend/` or `frontend/`:

```bash
npm run lint
npm run format:check
```

CI runs these same commands automatically on every push (see `.github/workflows/ci.yml`).

---

## 6. Deploy staging (Railway or Render)

Pick one (Railway is quicker to start with):

1. Create a new Railway project, connect it to your GitHub repo.
2. Add two services: one pointing at `/backend`, one at `/frontend`.
3. Add a managed PostgreSQL and Redis plugin in Railway (or point at your own).
4. Copy the environment variables from `.env.example` into Railway's service settings, using Railway's actual database and Redis URLs.
5. Deploy. Confirm `https://<your-backend>.up.railway.app/health` returns `"status": "ok"`.

---

## Exit Criteria for Module 0 (check all of these before Module 1)

- [ ] `docker compose up -d` starts Postgres and Redis with no errors
- [ ] Backend runs locally and `/health` returns `database: connected` and `redis: connected`
- [ ] Frontend runs locally and displays the backend's health status
- [ ] `npm run lint` passes with no errors on both backend and frontend
- [ ] Code is pushed to GitHub and the CI workflow passes (green check)
- [ ] Backend is deployed to staging and `/health` is reachable over the internet

Once every box is checked, we move to **Module 1: Database Schema and Core Models**.
