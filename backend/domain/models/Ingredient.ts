// application/models/Ingredient.ts

import {DomainError} from "../../application/errors/DomainError";

export class Ingredient {
    constructor(
        public name: string,
        public quantity: number,
        public unit?: string,
        public density?: number,
        // Champs supplémentaires pour skincare
        public category?: string,
        public type?: 'active' | 'essential_oil' | 'base',
        public warnings?: string[],
        public inci?: string
    ) {
        if (!name || quantity < 0) throw new DomainError("Invalid ingredient")
    }
}