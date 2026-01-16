import { db } from "../db"
import { v4 as uuidv4 } from "uuid"
import { Recipe } from "../../domain/models/Recipe"

export class RecipeRepositorySQLite {
    async save(recipe: Recipe) {
        const id = uuidv4()
        db.prepare(
            "INSERT INTO recipes(id,name,description,ownerId) VALUES(?,?,?,?)"
        ).run(id, recipe.name, recipe.description, recipe.ownerId)
        const stmt = db.prepare(
            "INSERT INTO ingredients(recipeId,name,ratio,density) VALUES(?,?,?,?)"
        )
        recipe.ingredients.forEach((i) =>
            stmt.run(id, i.name, i.ratio, i.density)
        )
        return { id, ...recipe }
    }

    async findByOwner(ownerId: string) {
        const rows = db
            .prepare("SELECT * FROM recipes WHERE ownerId=?")
            .all(ownerId)
        return rows
    }
    // infra/repositories/RecipeRepositorySQLite.ts
    async findByIdAndOwner(id: string, ownerId: string) {
        console.log('🔍 REPO: findByIdAndOwner called')
        console.log('📌 ID recherché:', id)
        console.log('📌 OwnerID recherché:', ownerId)
        console.log('📌 Type de ownerId:', typeof ownerId)

        const recipe = db
            .prepare("SELECT * FROM recipes WHERE id = ? AND ownerId = ?")
            .get(id, ownerId)

        console.log('📌 Résultat SQL brut:', recipe)

        if (!recipe) {
            console.log('❌ REPO: Recipe not found with these criteria')

            // Vérifier si la recette existe sans ownerId
            const recipeWithoutOwner = db
                .prepare("SELECT * FROM recipes WHERE id = ?")
                .get(id)
            console.log('🔍 Recette sans vérification owner:', recipeWithoutOwner)

            // Vérifier les recettes de cet owner
            const ownerRecipes = db
                .prepare("SELECT id, name FROM recipes WHERE ownerId = ?")
                .all(ownerId)
            console.log('📋 Toutes les recettes de cet owner:', ownerRecipes)

            return null
        }

        console.log('✅ REPO: Recipe found, enriching...')
        return this._enrichRecipe(recipe)
    }
    async update(id: string, data: any): Promise<void> {
        const { name, description } = data

        db.prepare(
            `
        UPDATE recipes
        SET name = ?, description = ?
        WHERE id = ?
        `
        ).run(name, description, id)
    }

    private _enrichRecipe(recipe: any) {
        console.log('🔍 ENRICH: Starting to enrich recipe:', recipe.id)

        // Récupérer les ingrédients - UTILISER LES BONNES COLONNES
        const ingredientsQuery = db
            .prepare("SELECT name, ratio, density FROM ingredients WHERE recipeId = ?")

        const ingredientsRows = ingredientsQuery.all(recipe.id)
        console.log('📦 Ingredients rows from DB:', ingredientsRows)

        const ingredients = ingredientsRows.map(ing => {
            console.log('📦 Processing ingredient:', ing)
            return {
                name: ing.name,
                quantity: ing.ratio,  // Utiliser ratio comme quantity
                unit: ing.density || undefined  // Utiliser density comme unit
            }
        })

        console.log('📦 Processed ingredients:', ingredients)

        // Récupérer les étapes
        try {
            const stepsQuery = db
                .prepare("SELECT description FROM steps WHERE recipeId = ? ORDER BY stepNumber")
            const stepsRows = stepsQuery.all(recipe.id)
            const steps = stepsRows.map(s => s.description)
            console.log('📋 Steps found:', steps)
        } catch (error) {
            console.log('📋 No steps table or error:', error.message)
            // Pas de table steps ou autre erreur
        }

        return {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            ownerId: recipe.ownerId,
            ingredients,
            steps: [], // Temporairement vide
            prepTime: recipe.prepTime || undefined,
            cookTime: recipe.cookTime || undefined,
            servings: recipe.servings || undefined,
            difficulty: recipe.difficulty || undefined,
            notes: recipe.notes || undefined,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        }
    }
    async deleteIngredientsByRecipe(recipeId: string) {
        db.prepare(
            "DELETE FROM ingredients WHERE recipeId = ?"
        ).run(recipeId)
    }

    async insertIngredients(recipeId: string, ingredients: any[]) {
        const stmt = db.prepare(
            "INSERT INTO ingredients(recipeId, name, ratio, density) VALUES (?,?,?,?)"
        )

        for (const ing of ingredients) {
            stmt.run(
                recipeId,
                ing.name,
                ing.quantity,   // quantity -> ratio
                ing.unit ?? null
            )
        }
    }
}
