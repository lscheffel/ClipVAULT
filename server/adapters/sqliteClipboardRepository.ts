import Database from "better-sqlite3";

import type { ClipboardItem, ClipboardRepository, NewClipboardItem } from "../../src/core/contracts";

const asClipboardItem = (row: {
  id: number;
  content: string;
  type: "text";
  timestamp: string;
}): ClipboardItem => ({
  id: row.id,
  content: row.content,
  type: row.type,
  timestamp: row.timestamp
});

export class SqliteClipboardRepository implements ClipboardRepository {
  private db: Database.Database;

  public constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS clipboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public async insert(item: NewClipboardItem): Promise<ClipboardItem> {
    const timestamp = item.timestamp ?? new Date().toISOString();
    const result = this.db
      .prepare("INSERT INTO clipboard (content, type, timestamp) VALUES (?, ?, ?)")
      .run(item.content, item.type, timestamp);

    const row = this.db
      .prepare("SELECT id, content, type, timestamp FROM clipboard WHERE id = ?")
      .get(result.lastInsertRowid as number) as { id: number; content: string; type: "text"; timestamp: string };

    return asClipboardItem(row);
  }

  public async listRecent(limit: number): Promise<ClipboardItem[]> {
    const rows = this.db
      .prepare("SELECT id, content, type, timestamp FROM clipboard ORDER BY id DESC LIMIT ?")
      .all(limit) as Array<{ id: number; content: string; type: "text"; timestamp: string }>;

    return rows.map(asClipboardItem);
  }

  public async findById(id: number): Promise<ClipboardItem | null> {
    const row = this.db
      .prepare("SELECT id, content, type, timestamp FROM clipboard WHERE id = ?")
      .get(id) as { id: number; content: string; type: "text"; timestamp: string } | undefined;

    return row ? asClipboardItem(row) : null;
  }

  public async deleteById(id: number): Promise<boolean> {
    this.db.prepare("DELETE FROM clipboard WHERE id = ?").run(id);
    return true;
  }
}
