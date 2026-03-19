import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  await db.batch(
    [
      // リマインダー（タイマーの永続化）
      `CREATE TABLE IF NOT EXISTS reminders (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT    NOT NULL,
        channel_id TEXT    NOT NULL,
        label      TEXT    NOT NULL,
        fire_at    INTEGER NOT NULL
      )`,
      // AFK
      `CREATE TABLE IF NOT EXISTS afk (
        user_id TEXT PRIMARY KEY,
        reason  TEXT    NOT NULL,
        since   INTEGER NOT NULL
      )`,
      // 警告システム（将来用）
      `CREATE TABLE IF NOT EXISTS warnings (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id  TEXT    NOT NULL,
        user_id   TEXT    NOT NULL,
        reason    TEXT    NOT NULL,
        issued_at INTEGER NOT NULL
      )`,
    ],
    'write'
  );
}
