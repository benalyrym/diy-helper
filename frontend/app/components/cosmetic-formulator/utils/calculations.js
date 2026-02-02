export const toGrams = (percent, volumeMl = 100) => {
    const ratio = Number(percent) / 100
    return Math.round(ratio * volumeMl * 10) / 10
}
