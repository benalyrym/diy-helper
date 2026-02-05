export const calculateGrams = (percent, volume) => {
    return Number(((volume * percent) / 100).toFixed(2))
}

export const calculatePhaseTotal = (items) => {
    return items.reduce((total, item) => total + item.percent, 0)
}

export const calculateWaterPhase = (totals) => {
    const totalUsed = totals.oil +
        totals.aqueous +
        totals.actives +
        totals.preservative +
        totals.he +
        5 // Émulsifiant

    return Math.max(0, 100 - totalUsed)
}