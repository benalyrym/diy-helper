import type { RecipeRepository } from "../../domain/repositories/RecipeRepository"

export class DeleteRecipe {
    constructor(private readonly repository: RecipeRepository) {}

    execute(id: string | number): Promise<void> {
        return this.repository.remove(id)
    }
}
