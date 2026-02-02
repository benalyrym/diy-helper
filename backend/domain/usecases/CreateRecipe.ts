import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"
import { Recipe } from "../models/Recipe"

export class CreateRecipe {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(data: any) {
        const recipe: any = new Recipe(
            data.name,
            data.description,
            data.ingredients || [],
            data.ownerId,
            data.type || 'recipe',
            data.volume,
            data.skinType,
            data.prepTime,
            data.cookTime,
            data.servings,
            data.difficulty,
            data.notes,
            data.skincareData
        )
        return this.recipeRepo.save(recipe)
    }
}
