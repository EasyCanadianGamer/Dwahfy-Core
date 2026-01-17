# Dwahfy Core

Backend API for Dwahfy. This repo is intentionally separate from the frontend for clean organization and independent deployments.

## Requirements

- Node.js 20+
- Docker (for Postgres + Mongo, optional)

## Quick start (local + Docker databases)

1) Copy env template:

```bash
cp ex.env .env
```

2) Start databases:

```bash
docker compose up -d postgres mongo
```

3) Run the server:

```bash
node server.js
```

API will be available at `http://localhost:3000`.

## Quick start (full Docker)

Build and run everything:

```bash
docker compose up --build
```

API will be available at `http://localhost:3000`.

## Environment variables

These are in `ex.env`:

- `PORT` (default: 3000)
- `DATABASE_URL` (Postgres connection string for local dev)
- `MONGO_URI` (Mongo connection string for local dev)
- `CORS_ORIGIN` (frontend URL, for example `http://localhost:3000`)

When running with Docker Compose, the app uses internal service names for DBs. If you run the server directly on your host, keep using `localhost` in the env file.

## Endpoints

- `GET /` basic health response
- `GET /health` returns `{"status":"ok"}`

## Contributing

1) Fork the repo and create your branch: `git checkout -b feature/my-change`
2) Make changes with clear commits
3) Ensure the server boots and endpoints respond
4) Open a PR describing the change and why it is needed

### Style and conventions

- Keep changes focused and small
- Prefer explicit names and simple control flow
- Add or update docs when behavior changes

## Notes for frontend integration

If the frontend runs on your host machine (separate repo), point it at `http://localhost:3000`. If you later containerize the frontend, use the backend service name `app:3000` inside Docker.
