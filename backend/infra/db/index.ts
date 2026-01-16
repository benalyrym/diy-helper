import Database from "better-sqlite3"
export const db = new Database("recipes.db")
db.prepare(
    "CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, email TEXT, password TEXT)"
).run()
db.prepare(
    "CREATE TABLE IF NOT EXISTS recipes(id TEXT PRIMARY KEY, name TEXT, description TEXT, ownerId TEXT)"
).run()
db.prepare(
    "CREATE TABLE IF NOT EXISTS ingredients(recipeId TEXT, name TEXT, ratio REAL, density REAL)"
).run()
