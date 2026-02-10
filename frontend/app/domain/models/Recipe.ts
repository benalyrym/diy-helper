import {Ingredient} from "./Ingredient";


export interface IRecipe {
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

export interface RecipeForm {
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
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    notes?: string;
}
