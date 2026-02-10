export const formatDate = (dateString) => {
    if (!dateString) return 'Jamais'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const formatPercent = (value) => {
    return `${value.toFixed(1)}%`
}

export const formatGrams = (percent, volume) => {
    return Number(((volume * percent) / 100).toFixed(2))
}