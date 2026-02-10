// composables/useApi.ts
import { useContainer } from "~/di/useContainer"
import type { RecipeForm } from "~/domain/models/Recipe"


export function useApi() {
    const { recipes } = useContainer()

    return {
        listRecipes: () => recipes.listRecipes.execute(),
        getRecipe: (id: string | string[]) => recipes.getRecipe.execute(id),
        createRecipe: (data: RecipeForm) => recipes.createRecipe.execute(data),
        updateRecipe: (id: string | number, data: Partial<RecipeForm>) =>
            recipes.updateRecipe.execute(id, data),
        deleteRecipe: (id: string | number) => recipes.deleteRecipe.execute(id)
    }
}
