// infra/repositories/RecipeRepositorySQLite.ts - version corrigée
import { db } from "../db"
import { v4 as uuidv4 } from "uuid"
import { Recipe } from "../../domain/models/Recipe"

export class RecipeRepositorySQLite {
    async save(recipe: Recipe) {
        const id = uuidv4()
        const now = new Date().toISOString()
        const skincarePayload = recipe.skincareData ? JSON.stringify(recipe.skincareData) : null

        console.log('💾 Saving recipe:', {
            name: recipe.name,
            type: recipe.type || 'recipe'
        })

        try {
            // Insertion avec la colonne type
            db.prepare(
                `INSERT INTO recipes(
                    id, name, description, ownerId, type,
                    volume, skinType, skincareData, createdAt, updatedAt
                ) VALUES(?,?,?,?,?,?,?,?,?,?)`
            ).run(
                id,
                recipe.name,
                recipe.description || '',
                recipe.ownerId,
                recipe.type || 'recipe',
                recipe.volume || null,
                recipe.skinType || null,
                skincarePayload,
                now,
                now
            )

            // Insertion des ingrédients
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                const stmt = db.prepare(
                    "INSERT INTO ingredients(recipeId, name, ratio, density) VALUES(?,?,?,?)"
                )

                for (const ingredient of recipe.ingredients) {
                    const quantity = ingredient.quantity ?? ingredient.ratio ?? 0
                    const unit = ingredient.unit ?? ingredient.density ?? null
                    stmt.run(
                        id,
                        ingredient.name,
                        quantity,
                        unit
                    )
                }
            }

            return {
                id,
                ...recipe,
                createdAt: now,
                updatedAt: now,
                skincareData: recipe.skincareData
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
        let skincarePayload: string | null = null

        if (typeof data.skincareData !== 'undefined') {
            skincarePayload = data.skincareData ? JSON.stringify(data.skincareData) : null
        } else if (data.type === 'skincare') {
            const picked = {
                formulaType: data.formulaType,
                spf: data.spf,
                preservativeSystem: data.preservativeSystem,
                actives: data.actives || [],
                selectedHE: data.selectedHE || [],
                phases: data.phases,
                regulatoryStatus: data.regulatoryStatus,
                inciList: data.inciList,
                mandatoryMentions: data.mandatoryMentions,
                compliance: data.compliance,
                version: data.version
            }
            skincarePayload = JSON.stringify(picked)
        }

        console.log('📝 Repository update:', { id, data })

        try {
            // Mise à jour de la recette
            const stmt = db.prepare(`
                UPDATE recipes 
                SET name = ?, description = ?, type = ?,
                    volume = ?, skinType = ?, skincareData = COALESCE(?, skincareData), updatedAt = ?
                WHERE id = ?
            `)

            stmt.run(
                data.name || '',
                data.description || '',
                data.type || 'recipe',
                data.volume || null,
                data.skinType || null,
                skincarePayload,
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
                        INSERT INTO ingredients(recipeId, name, ratio, density)
                        VALUES (?, ?, ?, ?)
                    `)

                    for (const ing of data.ingredients) {
                        const quantity = ing.quantity ?? ing.ratio ?? 0
                        const unit = ing.unit ?? ing.density ?? null
                        insertStmt.run(
                            id,
                            ing.name,
                            quantity,
                            unit
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

            // Récupérer les ingrédients
            const ingredientsQuery = db
                .prepare("SELECT name, ratio, density FROM ingredients WHERE recipeId = ?")

            const ingredientsRows = ingredientsQuery.all(recipe.id)

            const ingredients = ingredientsRows.map((ing: any) => ({
                name: ing.name,
                quantity: ing.ratio,
                unit: ing.density || undefined
            }))

            // Construction de l'objet enrichi
            let skincareData: any = null
            if (recipe.skincareData) {
                try {
                    skincareData = JSON.parse(recipe.skincareData)
                } catch (err: any) {
                    console.warn('⚠️ Invalid skincareData JSON for recipe', recipe.id)
                }
            }

            const enriched: any = {
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                ownerId: recipe.ownerId,
                ingredients,
                type: recipe.type || 'recipe',
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt
            }

            // Ajouter les champs spécifiques selon le type
            if (recipe.type === 'skincare') {
                enriched.volume = recipe.volume || 50
                enriched.skinType = recipe.skinType || 'mixte'
                if (skincareData) {
                    enriched.skincareData = skincareData
                    Object.assign(enriched, skincareData)
                }
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

            // Retourner la recette de base en cas d'erreur
            return {
                id: recipe.id,
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
                "INSERT INTO ingredients(recipeId, name, ratio, density) VALUES (?,?,?,?)"
            )

            for (const ing of ingredients) {
                const quantity = ing.quantity ?? ing.ratio ?? 0
                const unit = ing.unit ?? ing.density ?? null
                stmt.run(
                    recipeId,
                    ing.name,
                    quantity,
                    unit
                )
            }
            console.log(`✅ ${ingredients.length} ingredients inserted for recipe ${recipeId}`)
        } catch (error: any) {
            console.error('💥 Error inserting ingredients:', error.message)
            throw error
        }
    }
}
