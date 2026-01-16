import { ref } from "vue"
export function useRecipes() {
    const recipes = ref<any[]>([])
    return { recipes }
}
