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
        password TEXT,
        firstName TEXT,
        lastName TEXT,
        displayName TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
    )`
).run()

db.prepare(
    `CREATE TABLE IF NOT EXISTS recipes(
        id TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        description TEXT,
        ownerId TEXT NOT NULL,
        type TEXT DEFAULT 'recipe',
        category TEXT,
        subtype TEXT,
        recipeType TEXT,
        formulaType TEXT,
        steps TEXT,
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
        type TEXT,
        FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE
    )`
).run()

const ensureColumn = (table: string, column: string, type: string) => {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all()
    const exists = columns.some((col: any) => col.name === column)
    if (!exists) {
        db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run()
    }
}

ensureColumn('users', 'firstName', 'TEXT')
ensureColumn('users', 'lastName', 'TEXT')
ensureColumn('users', 'displayName', 'TEXT')
ensureColumn('users', 'createdAt', 'TEXT')
ensureColumn('recipes', 'category', 'TEXT')
ensureColumn('recipes', 'subtype', 'TEXT')
ensureColumn('recipes', 'recipeType', 'TEXT')
ensureColumn('recipes', 'formulaType', 'TEXT')
ensureColumn('recipes', 'steps', 'TEXT')
ensureColumn('recipes', 'prepTime', 'INTEGER')
ensureColumn('recipes', 'cookTime', 'INTEGER')
ensureColumn('recipes', 'servings', 'INTEGER')
ensureColumn('recipes', 'difficulty', 'TEXT')
ensureColumn('recipes', 'notes', 'TEXT')
ensureColumn('ingredients', 'type', 'TEXT')

console.log('✅ Base de données initialisée avec succès')
