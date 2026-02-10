import type { IRecipe, RecipeForm } from "../../domain/entities/Recipe"
import type { RecipeRepository } from "../../domain/repositories/RecipeRepository"

export class CreateRecipe {
    constructor(private readonly repository: RecipeRepository) {}

    execute(payload: RecipeForm): Promise<IRecipe> {
        return this.repository.create(payload)
    }
}
