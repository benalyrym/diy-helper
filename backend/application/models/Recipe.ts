import { Ingredient } from "./Ingredient"
import { DomainError } from "../errors/DomainError"

export class Recipe {
    public ingredients: Ingredient[] = []
    constructor(
        public name: string,
        public description: string,
        ingredients: { name: string; ratio: number; density: number }[],
        public ownerId: string
    ) {
        if (!name) throw new DomainError("Name required")
        this.ingredients = ingredients.map(
            (i) => new Ingredient(i.name, i.ratio, i.density)
        )
    }
}
