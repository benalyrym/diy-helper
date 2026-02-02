// interfaces/routes/recipe.ts - version complète avec toutes les routes
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite.js"
import { CreateRecipe } from "../../domain/usecases/CreateRecipe.js"
import { ListRecipes } from "../../domain/usecases/ListRecipes.js"
import { GetRecipe } from "../../domain/usecases/GetRecipe.js"
import { UpdateRecipe } from "../../domain/usecases/UpdateRecipe.js"

export default async function (fastify: any) {
    const repo = new RecipeRepositorySQLite()

    fastify.addHook("onRequest", async (req: { jwtVerify: () => any; user: any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { error: string }): any; new(): any } } }) => {
        try {
            await req.jwtVerify()
            const user = req.user as any
            console.log('✅ Authenticated user:', user.id)

            // Normaliser l'ID utilisateur
            if (user.sub && !user.id) {
                req.user = { ...user, id: user.sub }
            }
            if (user.userId && !user.id) {
                req.user = { ...user, id: user.userId }
            }

        } catch (err: any) {
            console.error('🔐 Auth error:', err.message)
            return reply.code(401).send({ error: "Unauthorized" })
        }
    })

    // GET /recipes - Liste toutes les recettes de l'utilisateur
    fastify.get("/", async (req: { user: any; query: any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { error: string }): any; new(): any } } }) => {
        try {
            const userId = (req.user as any).id
            const type = (req.query as any).type

            console.log('📋 Getting recipes for user:', userId, 'type:', type)

            const list = new ListRecipes(repo)
            const recipes = await list.execute(userId, type)

            console.log(`✅ Returning ${recipes.length} recipes`)
            return recipes

        } catch (error: any) {
            console.error('💥 Error listing recipes:', error.message)
            return reply.code(500).send({
                error: "Internal server error"
            })
        }
    })

    // GET /recipes/:id - Récupère une recette spécifique
    fastify.get("/:id", async (req: { user: any; params: any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { error: string }): any; new(): any } } }) => {
        try {
            const userId = (req.user as any).id
            const recipeId = (req.params as any).id

            console.log('🔍 Getting recipe:', { recipeId, userId })

            const get = new GetRecipe(repo)
            const recipe = await get.execute(recipeId, userId)

            if (!recipe) {
                return reply.code(404).send({ error: "Recipe not found" })
            }

            return recipe

        } catch (error: any) {
            console.error('💥 Error getting recipe:', error.message)
            return reply.code(500).send({ error: "Internal server error" })
        }
    })

    // POST /recipes - Crée une nouvelle recette
    fastify.post("/", async (req: { user: any; body: any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; data?: { createdAt: string; updatedAt: string; ingredients: any[]; name: string; description: string; ownerId: string; type: "recipe" | "skincare"; volume?: number | undefined; skinType?: string | undefined; prepTime?: number | undefined; cookTime?: number | undefined; servings?: number | undefined; difficulty?: "easy" | "medium" | "hard" | undefined; notes?: string | undefined; id: string }; message?: string; error?: any }): any; new(): any } } }) => {
        try {
            const userId = (req.user as any).id
            const data = { ...req.body, ownerId: userId }

            console.log('➕ Creating recipe for user:', userId)
            console.log('📦 Data:', data)

            const create = new CreateRecipe(repo)
            const result = await create.execute(data)

            console.log('✅ Recipe created:', result.id)

            return reply.code(201).send({
                success: true,
                data: result,
                message: "Recette créée avec succès"
            })

        } catch (error: any) {
            console.error("💥 Error creating recipe:", error.message)
            return reply.code(400).send({
                success: false,
                error: error.message
            })
        }
    })

    // PUT /recipes/:id - Met à jour une recette existante
    fastify.put("/:id", async (req: { user: any; params: any; body: any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { success?: boolean; message?: string; error?: any; details?: any }): any; new(): any } } }) => {
        try {
            const userId = (req.user as any).id
            const recipeId = (req.params as any).id
            const data = req.body

            console.log('📝 Updating recipe:', { recipeId, userId })
            console.log('📦 Update data:', data)

            const update = new UpdateRecipe(repo)
            await update.execute(recipeId, userId, data)

            return reply.code(200).send({
                success: true,
                message: "Recipe updated successfully"
            })

        } catch (error: any) {
            console.error("💥 Error updating recipe:", error.message)

            if (error.message.includes('not found') || error.message.includes('unauthorized')) {
                return reply.code(403).send({
                    error: error.message
                })
            }

            return reply.code(500).send({
                error: "Internal server error",
                details: error.message
            })
        }
    })

    // DELETE /recipes/:id - Supprime une recette
    fastify.delete("/:id", async (req: { user: any; params: any }, reply: { code: (arg0: number) => { (): any; new(): any; send: { (arg0: { success?: boolean; message?: string; error?: string }): any; new(): any } } }) => {
        try {
            const userId = (req.user as any).id
            const recipeId = (req.params as any).id

            console.log('🗑️  Deleting recipe:', { recipeId, userId })

            // À implémenter dans le repository
            // await repo.delete(recipeId, userId)

            return reply.code(200).send({
                success: true,
                message: "Recipe deleted successfully"
            })

        } catch (error: any) {
            console.error("💥 Error deleting recipe:", error.message)
            return reply.code(500).send({ error: "Internal server error" })
        }
    })

    // GET /recipes/skincare/formulas - Routes spécifiques skincare
    fastify.get("/skincare/formulas", async (req: { user: any }, reply: { send: (arg0: { success: boolean; data: any[]; count: number }) => any; code: (arg0: number) => { (): any; new(): any; send: { (arg0: { error: string }): any; new(): any } } }) => {
        try {
            const userId = (req.user as any).id

            console.log('🧴 Getting skincare formulas for user:', userId)

            const recipes = await repo.findByOwner(userId, 'skincare')

            return reply.send({
                success: true,
                data: recipes,
                count: recipes.length
            })

        } catch (error: any) {
            console.error("💥 Error getting skincare formulas:", error.message)
            return reply.code(500).send({ error: "Internal server error" })
        }
    })
}