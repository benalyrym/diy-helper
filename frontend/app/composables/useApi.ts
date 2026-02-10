// composables/useApi.ts
import { useAuth } from "./useAuth"
import type { IRecipe, RecipeForm } from "../domain/models/Recipe"
import { createRecipesApi } from "../services/api/recipes"


export function useApi() {
    const { authFetch } = useAuth()
    const api = createRecipesApi(authFetch)

    return {
        listRecipes: api.listRecipes,
        getRecipe: api.getRecipe,
        createRecipe: (data: RecipeForm) => api.createRecipe(data),
        updateRecipe: (id: string | number, data: Partial<RecipeForm>) => api.updateRecipe(id, data),
        deleteRecipe: api.deleteRecipe
    }
}
