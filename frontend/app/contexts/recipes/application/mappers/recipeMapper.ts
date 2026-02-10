import type { IRecipe, RecipeForm } from "../../domain/entities/Recipe"

export const mapRecipeDtoToDomain = (dto: any): IRecipe => ({
    id: dto.id ?? dto._id,
    name: dto.name,
    description: dto.description,
    type: dto.type,
    category: dto.category,
    subtype: dto.subtype,
    recipeType: dto.recipeType,
    formulaType: dto.formulaType,
    ingredients: dto.ingredients || [],
    steps: dto.steps,
    prepTime: dto.prepTime,
    cookTime: dto.cookTime,
    servings: dto.servings,
    difficulty: dto.difficulty,
    notes: dto.notes,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
})

export const mapRecipeFormToDto = (form: RecipeForm) => ({
    ...form
})
