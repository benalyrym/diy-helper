// domain/usecases/ListRecipes.ts
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"

export class ListRecipes {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(ownerId: string, type?: 'recipe' | 'skincare') {
        return this.recipeRepo.findByOwner(ownerId, type)
    }
}