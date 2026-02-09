// infra/repositories/RecipeRepositorySQLite.ts - version corrigée
import { db } from "../db"
import { v4 as uuidv4 } from "uuid"
import { Recipe } from "../../domain/models/Recipe"

export class RecipeRepositorySQLite {
    async save(recipe: Recipe) {
        const id = uuidv4()
        const now = new Date().toISOString()
        const recipeTypeValue = recipe.recipeType ? JSON.stringify(recipe.recipeType) : null
        const stepsValue = recipe.steps ? JSON.stringify(recipe.steps) : null

        console.log('💾 Saving recipe:', {
            name: recipe.name,
            type: recipe.type || 'recipe'
        })

        try {
            // Insertion avec la colonne type
            db.prepare(
                `INSERT INTO recipes(
                    id, name, description, ownerId, type,
                    category, subtype, recipeType, formulaType, steps,
                    volume, skinType, prepTime, cookTime, servings,
                    difficulty, notes, createdAt, updatedAt
                ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            ).run(
                id,
                recipe.name,
                recipe.description || '',
                recipe.ownerId,
                recipe.type || 'recipe',
                recipe.category || null,
                recipe.subtype || null,
                recipeTypeValue,
                recipe.formulaType || null,
                stepsValue,
                recipe.volume || null,
                recipe.skinType || null,
                recipe.prepTime || null,
                recipe.cookTime || null,
                recipe.servings || null,
                recipe.difficulty || null,
                recipe.notes || null,
                now,
                now
            )

            // Insertion des ingrédients
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                const stmt = db.prepare(
                    "INSERT INTO ingredients(recipeId, name, ratio, density, type) VALUES(?,?,?,?,?)"
                )

                for (const ingredient of recipe.ingredients) {
                    stmt.run(
                        id,
                        ingredient.name,
                        ingredient.quantity,
                        ingredient.unit || null,
                        ingredient.type || null
                    )
                }
            }

            return {
                id,
                _id: id,
                ...recipe,
                createdAt: now,
                updatedAt: now
            }

        } catch (error: any) {
            console.error('💥 Error saving recipe:', error.message)
            throw error
        }
    }

    async findByOwner(ownerId: string, type?: 'recipe' | 'skincare') {
        try {
            let query = "SELECT * FROM recipes WHERE ownerId = ?"
            const params: any[] = [ownerId]

            if (type) {
                query += " AND type = ?"
                params.push(type)
            }

            query += " ORDER BY updatedAt DESC"

            const rows = db.prepare(query).all(...params)
            console.log(`📊 Found ${rows.length} recipes for owner ${ownerId}`)

            return rows.map(row => this._enrichRecipe(row))

        } catch (error: any) {
            console.error('💥 Error in findByOwner:', error.message)
            return []
        }
    }

    async findByIdAndOwner(id: string, ownerId: string) {
        try {
            console.log('🔍 REPO: findByIdAndOwner called')

            const recipe = db
                .prepare("SELECT * FROM recipes WHERE id = ? AND ownerId = ?")
                .get(id, ownerId)

            if (!recipe) {
                console.log('❌ REPO: Recipe not found')
                return null
            }

            console.log('✅ REPO: Recipe found')
            return this._enrichRecipe(recipe)

        } catch (error: any) {
            console.error('💥 Error in findByIdAndOwner:', error.message)
            return null
        }
    }

    async update(id: string, data: any): Promise<void> {
        const now = new Date().toISOString()
        const recipeTypeValue = data.recipeType ? JSON.stringify(data.recipeType) : null
        const stepsValue = data.steps ? JSON.stringify(data.steps) : null

        console.log('📝 Repository update:', { id, data })

        try {
            // Mise à jour de la recette
            const stmt = db.prepare(`
                UPDATE recipes 
                SET name = ?, description = ?, type = ?,
                    category = ?, subtype = ?, recipeType = ?, formulaType = ?, steps = ?,
                    volume = ?, skinType = ?, prepTime = ?, cookTime = ?, servings = ?,
                    difficulty = ?, notes = ?, updatedAt = ?
                WHERE id = ?
            `)

            stmt.run(
                data.name || '',
                data.description || '',
                data.type || 'recipe',
                data.category || null,
                data.subtype || null,
                recipeTypeValue,
                data.formulaType || null,
                stepsValue,
                data.volume || null,
                data.skinType || null,
                data.prepTime || null,
                data.cookTime || null,
                data.servings || null,
                data.difficulty || null,
                data.notes || null,
                now,
                id
            )

            // Mettre à jour les ingrédients si fournis
            if (data.ingredients && Array.isArray(data.ingredients)) {
                // Supprimer les anciens ingrédients
                await this.deleteIngredientsByRecipe(id)

                // Insérer les nouveaux ingrédients
                if (data.ingredients.length > 0) {
                    const insertStmt = db.prepare(`
                        INSERT INTO ingredients(recipeId, name, ratio, density, type)
                        VALUES (?, ?, ?, ?, ?)
                    `)

                    for (const ing of data.ingredients) {
                        insertStmt.run(
                            id,
                            ing.name,
                            ing.quantity ?? ing.ratio ?? 0,
                            ing.unit || null,
                            ing.type || null
                        )
                    }
                }
            }

            console.log('✅ Repository: Recipe updated successfully')

        } catch (error: any) {
            console.error('💥 Repository update error:', error.message)
            throw error
        }
    }

    private _enrichRecipe(recipe: any) {
        try {
            console.log(`🔍 Enriching recipe: ${recipe.id}`)
            const parseJson = (value: any) => {
                if (!value) return undefined
                try {
                    return JSON.parse(value)
                } catch {
                    return undefined
                }
            }

            const ingredientsQuery = db
                .prepare("SELECT name, ratio, density, type FROM ingredients WHERE recipeId = ?")

            const ingredientsRows = ingredientsQuery.all(recipe.id)

            const ingredients = ingredientsRows.map((ing: any) => ({
                name: ing.name,
                quantity: ing.ratio,
                unit: ing.density || undefined,
                type: ing.type || undefined
            }))

            const enriched: any = {
                id: recipe.id,
                _id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                ownerId: recipe.ownerId,
                ingredients,
                type: recipe.type || 'recipe',
                category: recipe.category || undefined,
                subtype: recipe.subtype || undefined,
                recipeType: parseJson(recipe.recipeType),
                formulaType: recipe.formulaType || undefined,
                steps: parseJson(recipe.steps),
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt
            }

            if (recipe.type === 'skincare') {
                enriched.volume = recipe.volume || 50
                enriched.skinType = recipe.skinType || 'mixte'
            } else {
                enriched.prepTime = recipe.prepTime || undefined
                enriched.cookTime = recipe.cookTime || undefined
                enriched.servings = recipe.servings || undefined
                enriched.difficulty = recipe.difficulty || undefined
                enriched.notes = recipe.notes || undefined
            }

            console.log(`✅ Recipe enriched: ${recipe.name}`)
            return enriched

        } catch (error: any) {
            console.error(`💥 Error enriching recipe ${recipe.id}:`, error.message)

            return {
                id: recipe.id,
                _id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                ownerId: recipe.ownerId,
                ingredients: [],
                type: recipe.type || 'recipe'
            }
        }
    }

    async deleteIngredientsByRecipe(recipeId: string) {
        try {
            db.prepare(
                "DELETE FROM ingredients WHERE recipeId = ?"
            ).run(recipeId)
            console.log(`✅ Ingredients deleted for recipe ${recipeId}`)
        } catch (error: any) {
            console.error('💥 Error deleting ingredients:', error.message)
            throw error
        }
    }

    async insertIngredients(recipeId: string, ingredients: any[]) {
        try {
            const stmt = db.prepare(
                "INSERT INTO ingredients(recipeId, name, ratio, density, type) VALUES (?,?,?,?,?)"
            )

            for (const ing of ingredients) {
                stmt.run(
                    recipeId,
                    ing.name,
                    (ing.quantity ?? ing.ratio ?? 0),
                    ing.unit || null,
                            ing.type || null
                )
            }
            console.log(`✅ ${ingredients.length} ingredients inserted for recipe ${recipeId}`)
        } catch (error: any) {
            console.error('💥 Error inserting ingredients:', error.message)
            throw error
        }
    }
}





















