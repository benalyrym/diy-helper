export function calculateIngredients(
    ingredients: any[],
    totalVolume: number
): any[] {
    const totalRatio = ingredients.reduce((a, i) => a + i.ratio, 0)
    return ingredients.map((i) => ({
        ...i,
        quantity: (i.ratio / totalRatio) * totalVolume,
    }))
}
