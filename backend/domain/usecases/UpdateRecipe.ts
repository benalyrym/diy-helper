// domain/usecases/UpdateRecipe.ts
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"

export class UpdateRecipe {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(recipeId: string, ownerId: string, data: any) {
        console.log('📝 UpdateRecipe use case:', { recipeId, ownerId })

        // Vérifier que la recette existe et appartient à l'utilisateur
        const existingRecipe = await this.recipeRepo.findByIdAndOwner(recipeId, ownerId)

        if (!existingRecipe) {
            throw new Error("Recipe not found or unauthorized")
        }

        // Mettre à jour la recette
        await this.recipeRepo.update(recipeId, data)

        console.log('✅ Recipe updated successfully')
    }
}