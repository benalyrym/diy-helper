// infra/db/index.ts - version corrigée
import Database from "better-sqlite3"
import { join } from "path"

// Chemin vers la base de données
const dbPath = join(process.cwd(), "recipes.db")

export const db = new Database(dbPath)

// Activer les clés étrangères et WAL pour de meilleures performances
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Créer les tables avec toutes les colonnes nécessaires
db.prepare(
    `CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, 
        email TEXT UNIQUE, 
        password TEXT
    )`
).run()

db.prepare(
    `CREATE TABLE IF NOT EXISTS recipes(
        id TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        description TEXT,
        ownerId TEXT NOT NULL,
        type TEXT DEFAULT 'recipe',
        volume INTEGER,
        skinType TEXT,
        prepTime INTEGER,
        cookTime INTEGER,
        servings INTEGER,
        difficulty TEXT,
        notes TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (ownerId) REFERENCES users(id)
    )`
).run()

db.prepare(
    `CREATE TABLE IF NOT EXISTS ingredients(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId TEXT NOT NULL,
        name TEXT NOT NULL,
        ratio REAL NOT NULL,
        density TEXT,
        FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE
    )`
).run()

console.log('✅ Base de données initialisée avec succès')