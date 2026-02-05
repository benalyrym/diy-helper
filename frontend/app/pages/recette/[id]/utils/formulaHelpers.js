// Fonctions utilitaires pour les formules
export const calculateGrams = (volume, percent) => {
    return ((volume * percent) / 100).toFixed(2)
}

export const calculateTotalGrams = (volume) => {
    return volume.toFixed(2)
}

export const getActiveTotalPercentage = (actives) => {
    return actives.reduce((total, active) => total + active.quantity, 0)
}

export const getSkinTypeDescription = (skinType) => {
    const skinTypes = {
        'seche': 'Peau déshydratée, besoin en nutrition élevé',
        'grasse': 'Sécrétion sébacée importante, pores dilatés',
        'sensible': 'Réactivité cutanée élevée, tolérance limitée',
        'mixte': 'Combinaison de zones sèches et grasses',
        'mature': 'Besoins anti-âge et restructuration'
    }
    return skinTypes[skinType] || 'Non spécifié'
}

export const formatINCIList = (ingredients) => {
    if (!ingredients?.length) return 'Aqua'

    const sorted = [...ingredients].sort((a, b) => b.quantity - a.quantity)

    const inciNames = sorted.map((ing) => {
        const conversions = {
            'Acide hyaluronique': 'Sodium Hyaluronate',
            'Vitamine E': 'Tocopherol',
            'Acide salicylique': 'Salicylic Acid',
            'Panthénol (B5)': 'Panthenol',
            'Niacinamide': 'Niacinamide',
            'Vitamine C': 'Ascorbic Acid',
            'Eau déminéralisée': 'Aqua',
            'Eau': 'Aqua'
        }

        if (ing.name.startsWith('HE ')) {
            return `Parfum (${ing.name.replace('HE ', '')})`
        }

        if (ing.name.includes('Cosgard')) {
            return 'Benzyl Alcohol, Dehydroacetic Acid'
        }

        return conversions[ing.name] || ing.name
    })

    if (!inciNames.includes('Aqua')) {
        inciNames.unshift('Aqua')
    }

    return inciNames.join(', ')
}