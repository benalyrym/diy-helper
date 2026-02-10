import { ref } from "vue"
import type { IRecipe } from "../domain/models/Recipe"
export function useRecipes() {
    const recipes = ref<IRecipe[]>([])
    return { recipes }
}
