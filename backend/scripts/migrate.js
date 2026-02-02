// scripts/migrate.js
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Début de la migration avec better-sqlite3...');

const dbPath = path.join(__dirname, '../recipes.db');

if (!fs.existsSync(dbPath)) {
    console.error('❌ Base de données non trouvée:', dbPath);
    process.exit(1);
}

// Ouvrir la base de données
const db = new Database(dbPath);

try {
    // Activer les clés étrangères
    db.pragma('foreign_keys = ON');

    // 1. Vérifier la structure actuelle
    console.log('\n📊 Structure actuelle de la table recipes:');
    const recipeColumns = db.prepare("PRAGMA table_info(recipes)").all();
    recipeColumns.forEach(col => {
        console.log(`  ${col.cid}. ${col.name} (${col.type})`);
    });

    // 2. Liste des colonnes à ajouter
    const columnsToAdd = [
        'type TEXT DEFAULT "recipe"',
        'volume INTEGER',
        'skinType TEXT',
        'prepTime INTEGER',
        'cookTime INTEGER',
        'servings INTEGER',
        'difficulty TEXT',
        'notes TEXT',
        'createdAt TEXT',
        'updatedAt TEXT'
    ];

    console.log('\n➕ Ajout des colonnes manquantes...');

    // 3. Ajouter chaque colonne manquante
    columnsToAdd.forEach(columnDef => {
        const columnName = columnDef.split(' ')[0];
        const exists = recipeColumns.some(col => col.name === columnName);

        if (!exists) {
            console.log(`  Ajout de ${columnName}...`);
            try {
                const sql = `ALTER TABLE recipes ADD COLUMN ${columnDef}`;
                db.prepare(sql).run();
                console.log(`  ✅ ${columnName} ajoutée`);
            } catch (error) {
                console.log(`  ⚠️  ${columnName}: ${error.message}`);
            }
        } else {
            console.log(`  ⏭️  ${columnName} existe déjà`);
        }
    });

    // 4. Mettre à jour les données existantes
    console.log('\n🔄 Mise à jour des données existantes...');

    // Mettre à jour les timestamps
    const updateTimestamps = db.prepare(`
        UPDATE recipes
        SET createdAt = COALESCE(createdAt, datetime('now')),
            updatedAt = COALESCE(updatedAt, datetime('now'))
        WHERE createdAt IS NULL OR updatedAt IS NULL
    `);

    const timestampResult = updateTimestamps.run();
    console.log(`  ${timestampResult.changes} recettes mises à jour (timestamps)`);

    // Mettre à jour le type (toutes les recettes existantes sont de type 'recipe')
    const updateType = db.prepare(`
        UPDATE recipes
        SET type = 'recipe'
        WHERE type IS NULL
    `);

    const typeResult = updateType.run();
    console.log(`  ${typeResult.changes} recettes définies comme type 'recipe'`);

    // 5. Vérification finale
    console.log('\n✅ Vérification finale:');
    const finalColumns = db.prepare("PRAGMA table_info(recipes)").all();
    console.log(`\n🎉 ${finalColumns.length} colonnes dans la table recipes:`);
    finalColumns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });

    // Compter les recettes
    const recipeCount = db.prepare("SELECT COUNT(*) as count FROM recipes").get();
    console.log(`\n📊 Total recettes: ${recipeCount.count}`);

    // Afficher quelques recettes avec leur type
    const sampleRecipes = db.prepare(`
        SELECT id, name, type,
               CASE
                   WHEN type = 'skincare' THEN '🧴'
                   ELSE '🍽️'
                   END as icon
        FROM recipes
                 LIMIT 5
    `).all();

    console.log('\n📋 Exemples de recettes:');
    sampleRecipes.forEach(recipe => {
        console.log(`  ${recipe.icon} ${recipe.name} (${recipe.type})`);
    });

    // Vérifier la table ingredients
    console.log('\n🧪 Vérification de la table ingredients:');
    const ingredientColumns = db.prepare("PRAGMA table_info(ingredients)").all();
    console.log(`  ${ingredientColumns.length} colonnes:`);
    ingredientColumns.forEach(col => {
        console.log(`    - ${col.name} (${col.type})`);
    });

    console.log('\n🎉 Migration terminée avec succès !');

} catch (error) {
    console.error('\n💥 Erreur pendant la migration:', error.message);
    console.error('\nStack trace:', error.stack);
} finally {
    db.close();
    console.log('\n🔒 Base de données fermée');
}