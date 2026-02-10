import { useState } from "nuxt/app"
import type { IRecipe } from "../domain/models/Recipe"
export function useRecipes() {
    const recipes = useState<IRecipe[]>("recipes", () => [])
    const recipesLoaded = useState<boolean>("recipesLoaded", () => false)

    const setRecipes = (next: IRecipe[]) => {
        recipes.value = next
        recipesLoaded.value = true
    }

    const clearRecipes = () => {
        recipes.value = []
        recipesLoaded.value = false
    }

    return { recipes, recipesLoaded, setRecipes, clearRecipes }
}
