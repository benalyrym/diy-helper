// domain/models/Recipe.ts

import {DomainError} from "../../application/errors/DomainError";

export class Recipe {
    public ingredients: any[] = []

    constructor(
        public name: string,
        public description: string,
        ingredients: { name: string; quantity: number; unit?: string }[],
        public ownerId: string,
        public type: 'recipe' | 'skincare' = 'recipe',
        public volume?: number,
        public skinType?: string,
        public prepTime?: number,
        public cookTime?: number,
        public servings?: number,
        public difficulty?: 'easy' | 'medium' | 'hard',
        public notes?: string
    ) {
        if (!name) throw new DomainError("Name required")

        this.ingredients = ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit
        }))
    }
}

// domain/models/Ingredient.ts
export class Ingredient {
    constructor(
        public name: string,
        public quantity: number,
        public unit?: string
    ) {
        if (!name || quantity < 0) {
            throw new Error("Invalid ingredient")
        }
    }
}