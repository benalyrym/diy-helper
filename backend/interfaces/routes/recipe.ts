// interfaces/routes/recipe.ts
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite.js"
import { CreateRecipe } from "../../domain/usecases/CreateRecipe.js"
import { ListRecipes } from "../../domain/usecases/ListRecipes.js"
import { GetRecipe } from "../../domain/usecases/GetRecipe.js"
import { UpdateRecipe } from "../../domain/usecases/UpdateRecipe.js"
import { requireAuth } from "../middleware/requireAuth.js"

export default async function (fastify: any) {
    const repo = new RecipeRepositorySQLite()

    fastify.addHook("onRequest", requireAuth)

    const idParamsSchema = {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: {
                type: "string",
                minLength: 1,
                maxLength: 64
            }
        }
    }

    const listQuerySchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            type: { type: "string", enum: ["recipe", "skincare"] }
        }
    }

    const ingredientSchema = {
        type: "object",
        required: ["name", "quantity"],
        additionalProperties: false,
        properties: {
            name: { type: "string", minLength: 1, maxLength: 120 },
            quantity: { type: "number", minimum: 0 },
            unit: { type: "string", maxLength: 20 },
            type: { type: "string", maxLength: 50 }
        }
    }

    const createRecipeSchema = {
        type: "object",
        required: ["name"],
        additionalProperties: false,
        properties: {
            name: { type: "string", minLength: 1, maxLength: 200 },
            description: { type: "string", maxLength: 2000 },
            type: { type: "string", enum: ["recipe", "skincare"] },
            category: { type: "string", maxLength: 120 },
            subtype: { type: "string", maxLength: 120 },
            recipeType: { type: "object" },
            formulaType: { type: "string", maxLength: 120 },
            steps: {
                type: "array",
                items: { type: "string", maxLength: 500 },
                maxItems: 200
            },
            volume: { type: "number", minimum: 0 },
            skinType: { type: "string", maxLength: 40 },
            prepTime: { type: "number", minimum: 0 },
            cookTime: { type: "number", minimum: 0 },
            servings: { type: "number", minimum: 0 },
            difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
            notes: { type: "string", maxLength: 2000 },
            ingredients: {
                type: "array",
                items: ingredientSchema,
                maxItems: 200
            }
        }
    }

    const updateRecipeSchema = {
        ...createRecipeSchema,
        required: []
    }

    fastify.get("/", {
        schema: { querystring: listQuerySchema }
    }, async (req: { user: any; query: any }, reply: any) => {
        try {
            const userId = (req.user as any).id
            const type = (req.query as any).type

            const list = new ListRecipes(repo)
            const recipes = await list.execute(userId, type)

            return recipes

        } catch (error: any) {
            return reply.code(500).send({
                error: "Internal server error"
            })
        }
    })

    fastify.get("/:id", {
        schema: { params: idParamsSchema }
    }, async (req: { user: any; params: any }, reply: any) => {
        try {
            const userId = (req.user as any).id
            const recipeId = (req.params as any).id

            const get = new GetRecipe(repo)
            const recipe = await get.execute(recipeId, userId)

            if (!recipe) {
                return reply.code(404).send({ error: "Recipe not found" })
            }

            return recipe

        } catch (error: any) {
            return reply.code(500).send({ error: "Internal server error" })
        }
    })

    fastify.post("/", {
        schema: { body: createRecipeSchema }
    }, async (req: { user: any; body: any }, reply: any) => {
        try {
            const userId = (req.user as any).id
            const data = { ...req.body, ownerId: userId }

            const create = new CreateRecipe(repo)
            const result = await create.execute(data)

            return reply.code(201).send(result)

        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                error: error.message
            })
        }
    })

    fastify.put("/:id", {
        schema: { params: idParamsSchema, body: updateRecipeSchema }
    }, async (req: { user: any; params: any; body: any }, reply: any) => {
        try {
            const userId = (req.user as any).id
            const recipeId = (req.params as any).id
            const data = req.body

            const update = new UpdateRecipe(repo)
            const updated = await update.execute(recipeId, userId, data)

            return reply.code(200).send(updated)

        } catch (error: any) {
            if (error.message.includes("not found") || error.message.includes("unauthorized")) {
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

    fastify.delete("/:id", {
        schema: { params: idParamsSchema }
    }, async (req: { user: any; params: any }, reply: any) => {
        try {
            const userId = (req.user as any).id
            const recipeId = (req.params as any).id

            const deleted = await repo.deleteByIdAndOwner(recipeId, userId)
            if (!deleted) {
                return reply.code(404).send({ error: "Recipe not found" })
            }

            return reply.code(200).send({
                success: true,
                message: "Recipe deleted successfully"
            })

        } catch (error: any) {
            return reply.code(500).send({ error: "Internal server error" })
        }
    })

    fastify.get("/skincare/formulas", async (req: { user: any }, reply: any) => {
        try {
            const userId = (req.user as any).id

            const recipes = await repo.findByOwner(userId, "skincare")

            return reply.send({
                success: true,
                data: recipes,
                count: recipes.length
            })

        } catch (error: any) {
            return reply.code(500).send({ error: "Internal server error" })
        }
    })
}
