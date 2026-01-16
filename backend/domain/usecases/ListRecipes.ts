import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"

export class ListRecipes {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(ownerId: string) {
        return this.recipeRepo.findByOwner(ownerId)
    }
}
