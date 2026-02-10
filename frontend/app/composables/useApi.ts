// composables/useApi.ts
import { useAuth } from "./useAuth"
import {Ingredient} from "../domain/models/Ingredient";

export interface Recipe {
    id?: string | number;
    name: string;
    description?: string;
    type?: string;
    category?: string;
    subtype?: string;
    recipeType?: {
        subtype?: string;
        type?: string;
    };
    formulaType?: string;
    ingredients: Ingredient[];
    steps?: string[];
    prepTime?: number; // en minutes
    cookTime?: number; // en minutes
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}


export function useApi() {
    const { authFetch } = useAuth()

    const listRecipes = (): Promise<Recipe[]> =>
        authFetch<Recipe[]>("/recipes")

    const getRecipe = (id: string | string[]): Promise<Recipe> =>
        authFetch<Recipe>(`/recipes/${id}`)

    const createRecipe = async (data: any): Promise<Recipe> => {
        if (process.dev) {
            console.log("Envoi des donnees:", data)
        }
        const response = await authFetch<Recipe>("/recipes", {
            method: "POST",
            body: data
        })
        if (process.dev) {
            console.log("Reponse recue:", response)
        }
        return response
    }
    const updateRecipe = (id: string | number, data: Partial<Recipe>): Promise<Recipe> => {
        const recipeId = typeof id === 'number' ? id.toString() : id
        return authFetch<Recipe>(`/recipes/${recipeId}`, {
            method: "PUT",
            body: data
        })
    }
    const deleteRecipe = (id: string | number): Promise<void> =>
        authFetch<void>(`/recipes/${id}`, {
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
