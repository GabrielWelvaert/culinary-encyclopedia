# culinary-encyclopedia

## Local development

### Prerequisites (one-time)
- Node.js 22
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — must be running
- [AWS SAM CLI](https://github.com/aws/aws-sam-cli/releases/latest/download/AWS_SAM_CLI_64_PY3.msi) — verify with `sam --version`
- `npm install` (repo root)
- `cp docker/.env.example docker/.env`

### Run
From the repo root:

```
npm run db:up      # Postgres in Docker on :5432 (background)
npm run api        # sam build + local API on http://127.0.0.1:3000 (leave running)
npm run web        # Vite on http://localhost:5173 (separate terminal)
```

Open http://localhost:5173.

- Backend changes: restart `npm run api` (it rebuilds on start). Frontend changes hot-reload.
- `npm run db:down` — stop Postgres.
- `npm run db:reset` — wipe the database and re-run `docker/postgres/init.sql`.

### Checks
```
npm run typecheck
npm test
```
