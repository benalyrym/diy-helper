import type { IRecipe } from "../../domain/entities/Recipe"
import type { RecipeRepository } from "../../domain/repositories/RecipeRepository"

export class ListRecipes {
    constructor(private readonly repository: RecipeRepository) {}

    execute(): Promise<IRecipe[]> {
        return this.repository.list()
    }
}
