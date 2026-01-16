import { describe, it, expect } from "vitest"
import {calculateIngredients} from "../../app/application/services/RecipeCalculator";

describe("RecipeCalculator", () => {
    it("calculates correct quantities", () => {
        const res = calculateIngredients(
            [
                { name: "Eau", ratio: 50, density: 1 },
                { name: "Huile", ratio: 50, density: 1 },
            ],
            100
        )
        expect(res[0].quantity).contain(50)
        expect(res[1].quantity).contain(50)
    })
})
