import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"
import { CreateRecipe } from "../../domain/usecases/CreateRecipe"
import { ListRecipes } from "../../domain/usecases/ListRecipes"
import {GetRecipe} from "../../domain/usecases/GetRecipe";

export default async function (fastify) {
    const repo = new RecipeRepositorySQLite()

    fastify.addHook("onRequest", async (req, reply) => {
        try {
            await req.jwtVerify()

            // Formatter req.user selon ta structure
            const user = req.user as any
            console.log('Raw JWT payload:', user)

            // Si ton JWT a 'sub' au lieu de 'id'
            if (user.sub && !user.id) {
                req.user = { ...user, id: user.sub }
            }

            // Si ton JWT a 'userId' au lieu de 'id'
            if (user.userId && !user.id) {
                req.user = { ...user, id: user.userId }
            }

            console.log('Formatted user:', req.user)

        } catch (err) {
            return reply.code(401).send({ error: "Unauthorized" })
        }
    })

    fastify.get("/", async (req) => {
        const list = new ListRecipes(repo)
        return list.execute((req.user as any).id)
    })

    // routes/recipes/index.ts
    fastify.get("/:id", async (req, reply) => {
        try {
            console.log('🌐 ROUTE: GET /recipes/:id')
            console.log('🔐 User object:', req.user)
            console.log('🔐 User ID from req.user:', (req.user as any).id)
            console.log('🔐 Recipe ID from params:', (req.params as any).id)

            const userId = (req.user as any).id
            const recipeId = (req.params as any).id

            if (!userId) {
                console.log('❌ ERROR: User ID is undefined or null')
                return reply.code(400).send({ error: "User ID missing from token" })
            }

            const get = new GetRecipe(repo)
            const recipe = await get.execute(recipeId, userId)

            console.log('✅ ROUTE: Recipe found and returned')
            return recipe

        } catch (error: any) {
            console.error('💥 ROUTE ERROR:', error.message)
            console.error('💥 Stack trace:', error.stack)
            return reply.code(404).send({ error: "Recipe not found" })
        }
    })

    fastify.post("/", async (req) => {
        const create = new CreateRecipe(repo)
        return create.execute({ ...req.body, ownerId: (req.user as any).id })
    })
    // PUT /recipes/:id - Mettre à jour une recette (optionnel)
    fastify.put("/:id", async (req, reply) => {
        // À implémenter si besoin
        return reply.code(501).send({ error: "Not implemented yet" })
    })

    // DELETE /recipes/:id - Supprimer une recette (optionnel)
    fastify.delete("/:id", async (req, reply) => {
        // À implémenter si besoin
        return reply.code(501).send({ error: "Not implemented yet" })
    })
}
