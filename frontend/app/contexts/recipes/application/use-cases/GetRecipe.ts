import type { IRecipe } from "../../domain/entities/Recipe"
import type { RecipeRepository } from "../../domain/repositories/RecipeRepository"

export class GetRecipe {
    constructor(private readonly repository: RecipeRepository) {}

    execute(id: string | string[]): Promise<IRecipe> {
        return this.repository.get(id)
    }
}
