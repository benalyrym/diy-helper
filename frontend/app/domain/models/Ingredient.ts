// domain/models/Ingredient.ts
export interface Ingredient {
    id?: string | number;
    name: string;
    quantity: number;
    unit?: string;
}

// OU si c'est une classe :
export class Ingredient {
    id?: string | number;
    name: string;
    quantity: number;
    unit?: string;

    constructor(data: Partial<Ingredient> = {}) {
        this.id = data.id;
        this.name = data.name || '';
        this.quantity = data.quantity || 0;
        this.unit = data.unit;
    }
}

// Si tu as besoin d'un type pour le formulaire :
export interface IngredientForm {
    name: string;
    quantity: number;
    unit?: string;
}