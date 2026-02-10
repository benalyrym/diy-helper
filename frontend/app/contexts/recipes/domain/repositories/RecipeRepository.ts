import type { IRecipe, RecipeForm } from "../entities/Recipe"

export interface RecipeRepository {
    list(): Promise<IRecipe[]>
    get(id: string | string[]): Promise<IRecipe>
    create(payload: RecipeForm): Promise<IRecipe>
    update(id: string | number, payload: Partial<RecipeForm>): Promise<IRecipe>
    remove(id: string | number): Promise<void>
}
