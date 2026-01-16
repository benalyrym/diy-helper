// domain/usecases/UpdateRecipe.ts


import {RecipeRepositorySQLite} from "../../infra/repositories/RecipeRepositorySQLite";

export class UpdateRecipe {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(recipeId: string, userId: string, data: any) {
        const recipe = await this.recipeRepo.findByIdAndOwner(recipeId, userId)

        if (!recipe) {
            throw new Error("Recipe not found or not owned by user")
        }

        await this.recipeRepo.update(recipeId, data)

        if (data.ingredients) {
            await this.recipeRepo.deleteIngredientsByRecipe(recipeId)
            await this.recipeRepo.insertIngredients(recipeId, data.ingredients)
        }
    }
}
