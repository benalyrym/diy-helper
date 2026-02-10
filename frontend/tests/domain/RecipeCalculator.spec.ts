import { describe, it, expect } from "vitest"
import { calculateIngredients } from "../../app/application/services/RecipeCalculator"

describe("RecipeCalculator", () => {
    it("calculates quantities proportionally", () => {
        const res = calculateIngredients(
            [
                { name: "Eau", ratio: 50, density: 1 },
                { name: "Huile", ratio: 50, density: 1 }
            ],
            100
        )
        expect(res[0].quantity).toBe(50)
        expect(res[1].quantity).toBe(50)
    })

    it("handles floating ratios", () => {
        const res = calculateIngredients(
            [
                { name: "A", ratio: 0.2 },
                { name: "B", ratio: 0.8 }
            ],
            100
        )
        expect(res[0].quantity).toBe(20)
        expect(res[1].quantity).toBe(80)
    })

    it("does not mutate input", () => {
        const ingredients = [{ name: "A", ratio: 1 }]
        const copy = JSON.parse(JSON.stringify(ingredients))
        calculateIngredients(ingredients, 100)
        expect(ingredients).toEqual(copy)
    })
})
