export class Recipe {
    name: string;
    description: string;
    ownerId: number;
    ingredients: Ingredient[]
    prepTime: number | bigint | string | null;
    cookTime: number | bigint | string | null;
    servings: number | bigint | string | null;
    difficulty:  number | bigint | string | null;
    notes:  number | bigint | string | null;


}
export class Ingredient {
    name: string;
    ratio: string;
    density: number;
}