import type { IRecipe, RecipeForm } from "../../domain/entities/Recipe"
import type { RecipeRepository } from "../../domain/repositories/RecipeRepository"
import { mapRecipeDtoToDomain, mapRecipeFormToDto } from "../../application/mappers/recipeMapper"

type RequestFn = <T>(url: string, options?: any) => Promise<T>

export class RecipeHttpRepository implements RecipeRepository {
    constructor(private readonly request: RequestFn) {}

    async list(): Promise<IRecipe[]> {
        const data = await this.request<IRecipe[]>("/recipes")
        return data.map(mapRecipeDtoToDomain)
    }

    async get(id: string | string[]): Promise<IRecipe> {
        const data = await this.request<IRecipe>(`/recipes/${id}`)
        return mapRecipeDtoToDomain(data)
    }

    async create(payload: RecipeForm): Promise<IRecipe> {
        const data = await this.request<IRecipe>("/recipes", {
            method: "POST",
            body: mapRecipeFormToDto(payload)
        })
        return mapRecipeDtoToDomain(data)
    }

    async update(id: string | number, payload: Partial<RecipeForm>): Promise<IRecipe> {
        const recipeId = typeof id === "number" ? id.toString() : id
        const data = await this.request<IRecipe>(`/recipes/${recipeId}`, {
            method: "PUT",
            body: mapRecipeFormToDto(payload as RecipeForm)
        })
        return mapRecipeDtoToDomain(data)
    }

    async remove(id: string | number): Promise<void> {
        await this.request<void>(`/recipes/${id}`, {
            method: "DELETE"
        })
    }
}
