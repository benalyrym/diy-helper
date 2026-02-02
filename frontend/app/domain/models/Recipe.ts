import {Ingredient} from "./Ingredient";


export interface Recipe {
    id?: string | number;
    name: string;
    description?: string;
    ingredients: Ingredient[];
    steps?: string[];
    prepTime?: number; // en minutes
    cookTime?: number; // en minutes
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    notes?: string;
    type?: 'recipe' | 'skincare';
    volume?: number;
    skinType?: string;
    formulaType?: string;
    spf?: number;
    preservativeSystem?: string;
    actives?: any[];
    selectedHE?: any[];
    phases?: any;
    regulatoryStatus?: any;
    inciList?: string[];
    mandatoryMentions?: string[];
    compliance?: any;
    version?: string;
    skincareData?: any;
    createdAt?: string;
    updatedAt?: string;
}

export interface RecipeForm {
    name: string;
    description?: string;
    ingredients: Ingredient[];
    steps?: string[];
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    notes?: string;
    type?: 'recipe' | 'skincare';
    volume?: number;
    skinType?: string;
    formulaType?: string;
    spf?: number;
    preservativeSystem?: string;
    actives?: any[];
    selectedHE?: any[];
    phases?: any;
    regulatoryStatus?: any;
    inciList?: string[];
    mandatoryMentions?: string[];
    compliance?: any;
    version?: string;
    skincareData?: any;
}
