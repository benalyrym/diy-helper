import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"
import { Recipe } from "../models/Recipe"

export class CreateRecipe {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(data: any) {
        const ingredients = Array.isArray(data.ingredients)
            ? data.ingredients.map((ing: any) => ({
                name: ing.name,
                quantity: ing.quantity ?? ing.ratio ?? 0,
                unit: ing.unit ?? ing.density,
                type: ing.type
            }))
            : []

        const recipe: any = new Recipe(
            data.name,
            data.description || '',
            ingredients,
            data.ownerId,
            data.type || 'recipe',
            data.volume,
            data.skinType,
            data.prepTime,
            data.cookTime,
            data.servings,
            data.difficulty,
            data.notes,
            data.category,
            data.subtype,
            data.recipeType,
            data.formulaType,
            data.steps
        )
        return this.recipeRepo.save(recipe)
    }
}
