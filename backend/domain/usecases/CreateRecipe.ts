import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"
import {Recipe} from "../../application/models/Recipe";

export class CreateRecipe {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(data: any) {
        const recipe: any = new Recipe(
            data.name,
            data.description,
            data.ingredients,
            data.ownerId
        )
        return this.recipeRepo.save(recipe)
    }
}
