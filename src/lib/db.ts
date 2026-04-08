import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const res = await pool.query(sql, params)
  return res.rows as T[]
}

export async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id          SERIAL PRIMARY KEY,
      email       TEXT NOT NULL UNIQUE,
      first_name  TEXT,
      sport       TEXT NOT NULL DEFAULT 'FOOTBALL',
      other_sport TEXT,
      country     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}
