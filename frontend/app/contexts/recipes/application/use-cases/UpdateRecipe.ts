import type { IRecipe, RecipeForm } from "../../domain/entities/Recipe"
import type { RecipeRepository } from "../../domain/repositories/RecipeRepository"

export class UpdateRecipe {
    constructor(private readonly repository: RecipeRepository) {}

    execute(id: string | number, payload: Partial<RecipeForm>): Promise<IRecipe> {
        return this.repository.update(id, payload)
    }
}
