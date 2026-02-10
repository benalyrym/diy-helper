type IngredientRatio = {
    ratio: number
}

export function calculateIngredients<T extends IngredientRatio>(
    ingredients: T[],
    totalVolume: number
): Array<T & { quantity: number }> {
    const totalRatio = ingredients.reduce((acc, item) => acc + item.ratio, 0)
    return ingredients.map((item) => ({
        ...item,
        quantity: (item.ratio / totalRatio) * totalVolume
    }))
}
