-- Runs once, when the Postgres volume is first created.
-- To re-run: `npm run db:reset`.
-- Will be replaced by migrations before the first AWS deploy.

CREATE TABLE recipes (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO recipes (name) VALUES ('Beef Stew');
