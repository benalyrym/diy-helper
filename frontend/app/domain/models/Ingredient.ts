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

export interface IngredientForm {
    name: string;
    quantity: number;
    unit?: string;
}
