import type { IRecipe, RecipeForm } from "../../domain/models/Recipe"

type AuthRequest = <T>(url: string, options?: any) => Promise<T>

export const createRecipesApi = (authRequest: AuthRequest) => {
    const listRecipes = (): Promise<IRecipe[]> =>
        authRequest<IRecipe[]>("/recipes")

    const getRecipe = (id: string | string[]): Promise<IRecipe> =>
        authRequest<IRecipe>(`/recipes/${id}`)

    const createRecipe = (data: RecipeForm): Promise<IRecipe> =>
        authRequest<IRecipe>("/recipes", {
            method: "POST",
            body: data
        })

    const updateRecipe = (id: string | number, data: Partial<RecipeForm>): Promise<IRecipe> => {
        const recipeId = typeof id === "number" ? id.toString() : id
        return authRequest<IRecipe>(`/recipes/${recipeId}`, {
            method: "PUT",
            body: data
        })
    }

    const deleteRecipe = (id: string | number): Promise<void> =>
        authRequest<void>(`/recipes/${id}`, {
            method: "DELETE"
        })

    return {
        listRecipes,
        getRecipe,
        createRecipe,
        updateRecipe,
        deleteRecipe
    }
}
