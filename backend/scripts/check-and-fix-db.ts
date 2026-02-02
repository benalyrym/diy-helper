// scripts/check-and-fix-db.ts
import Database from "better-sqlite3"
import { join } from "path"

const dbPath = join(process.cwd(), "recipes.db")
const db = new Database(dbPath)

console.log('🔍 Vérification de la base de données...')

try {
    // 1. Vérifier la table recipes
    console.log('\n📋 Table recipes:')
    const recipeColumns = db.prepare("PRAGMA table_info(recipes)").all()

    if (recipeColumns.length === 0) {
        console.log('❌ Table recipes n\'existe pas')
    } else {
        console.log('Colonnes:')
        recipeColumns.forEach((col: any) => {
            console.log(`  ${col.name} (${col.type})`)
        })

        // Vérifier si la colonne 'type' existe
        const hasTypeColumn = recipeColumns.some((col: any) => col.name === 'type')
        console.log(`\n✅ Colonne 'type' présente: ${hasTypeColumn}`)

        if (!hasTypeColumn) {
            console.log('➕ Ajout de la colonne type...')
            db.prepare("ALTER TABLE recipes ADD COLUMN type TEXT DEFAULT 'recipe'").run()
            console.log('✅ Colonne type ajoutée')
        }
    }

    // 2. Vérifier les données
    console.log('\n📊 Données dans recipes:')
    const recipes = db.prepare("SELECT id, name, type FROM recipes LIMIT 5").all()
    console.log(`Total recettes: ${recipes.length}`)
    recipes.forEach((recipe: any, index: number) => {
        console.log(`  ${index + 1}. ${recipe.name} (${recipe.type || 'non défini'})`)
    })

    console.log('\n✅ Vérification terminée avec succès')

} catch (error: any) {
    console.error('❌ Erreur:', error.message)
} finally {
    db.close()
}