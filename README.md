# culinary-encyclopedia

## Local development

### Run
From the repo root:

```
npm run db:up      # Postgres in Docker on :5432 (background)
npm run api        # sam build + local API on http://127.0.0.1:3000 (leave running)
npm run web        # Vite on http://localhost:5173 (separate terminal)
```

Open http://localhost:5173.

- Backend changes: restart `npm run api` (it rebuilds on start). Frontend changes hot-reload.
- Stop the API or web server with Ctrl+C in its terminal. From another terminal: `npm run api:stop` (also removes SAM's Lambda containers) or `npm run web:stop`.
- `npm run db:down` — stop Postgres.
- `npm run db:reset` — wipe the database and re-run `docker/postgres/init.sql`.

### Checks
```
npm run typecheck
npm test
```
