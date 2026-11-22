import { Pool } from "pg";

let pool: Pool | undefined;

/**
 * One pool per Lambda container, created lazily and reused across invocations.
 * max: 1 because a Lambda container handles one request at a time.
 */
export function getPool(): Pool {
  pool ??= new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 1,
  });
  return pool;
}
