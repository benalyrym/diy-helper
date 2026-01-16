// application/use-cases/GetRecipe.ts
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"

// domain/usecases/GetRecipe.ts
export class GetRecipe {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(id: string, ownerId: string) {
        console.log('🚀 USECASE: GetRecipe.execute()')
        console.log('📌 ID:', id)
        console.log('📌 OwnerID:', ownerId)

        const recipe = await this.recipeRepo.findByIdAndOwner(id, ownerId)

        if (!recipe) {
            console.log('❌ USECASE: Recipe not found in repository')
            throw new Error("Recipe not found")
        }

        console.log('✅ USECASE: Recipe found, returning...')
        return recipe
    }
}