import { describe, it, expect } from 'vitest'
import { calculateIngredients } from './RecipeCalculator'

describe('calculateIngredients', () => {
    it('calculates quantities proportionally for integer ratios', () => {
        const ingredients = [
            { name: 'A', ratio: 1 },
            { name: 'B', ratio: 3 },
        ]
        const result = calculateIngredients(ingredients, 400)
        expect(result).toEqual([
            { name: 'A', ratio: 1, quantity: 100 },
            { name: 'B', ratio: 3, quantity: 300 },
        ])
    })

    it('handles floating ratios', () => {
        const ingredients = [
            { name: 'A', ratio: 0.2 },
            { name: 'B', ratio: 0.8 },
        ]
        const result = calculateIngredients(ingredients, 100)
        expect(result).toEqual([
            { name: 'A', ratio: 0.2, quantity: 20 },
            { name: 'B', ratio: 0.8, quantity: 80 },
        ])
    })

    it('returns zeros when totalVolume is 0', () => {
        const ingredients = [
            { name: 'A', ratio: 2 },
            { name: 'B', ratio: 3 },
        ]
        const result = calculateIngredients(ingredients, 0)
        expect(result.every((i) => i.quantity === 0)).toBe(true)
    })

    it('does not mutate the original ingredients array', () => {
        const ingredients = [{ name: 'A', ratio: 1 }]
        const originalCopy = JSON.parse(JSON.stringify(ingredients))
        calculateIngredients(ingredients, 100)
        expect(ingredients).toEqual(originalCopy)
    })

    it('produces NaN quantities when total ratio is 0', () => {
        const ingredients = [
            { name: 'A', ratio: 0 },
            { name: 'B', ratio: 0 },
        ]
        const result = calculateIngredients(ingredients, 100)
        expect(result[0].quantity).toBeNaN()
        expect(result[1].quantity).toBeNaN()
    })
})