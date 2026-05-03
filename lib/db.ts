import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "tours.db");

// ensure data directory exists
import { mkdirSync } from "fs";
mkdirSync(path.join(process.cwd(), "data"), { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS custom_tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'JPY',
    duration TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    tags TEXT NOT NULL DEFAULT '[]',
    product_url TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '鹿児島',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface CustomTour {
  id: number;
  product_code: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  review_count: number;
  tags: string;
  product_url: string;
  image_url: string;
  location: string;
  created_at: string;
}

export function getAllTours(): CustomTour[] {
  return db.prepare("SELECT * FROM custom_tours ORDER BY created_at DESC").all() as CustomTour[];
}

export function createTour(data: Omit<CustomTour, "id" | "created_at">): CustomTour {
  const stmt = db.prepare(`
    INSERT INTO custom_tours
      (product_code, title, description, price, currency, duration, rating, review_count, tags, product_url, image_url, location)
    VALUES
      (@product_code, @title, @description, @price, @currency, @duration, @rating, @review_count, @tags, @product_url, @image_url, @location)
  `);
  const result = stmt.run(data);
  return db.prepare("SELECT * FROM custom_tours WHERE id = ?").get(result.lastInsertRowid) as CustomTour;
}

export function updateTour(id: number, data: Partial<Omit<CustomTour, "id" | "created_at">>): CustomTour | null {
  const fields = Object.keys(data).map((k) => `${k} = @${k}`).join(", ");
  if (!fields) return null;
  db.prepare(`UPDATE custom_tours SET ${fields} WHERE id = @id`).run({ ...data, id });
  return db.prepare("SELECT * FROM custom_tours WHERE id = ?").get(id) as CustomTour;
}

export function deleteTour(id: number): void {
  db.prepare("DELETE FROM custom_tours WHERE id = ?").run(id);
}
