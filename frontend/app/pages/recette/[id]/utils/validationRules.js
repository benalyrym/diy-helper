// Règles de validation réglementaires
export const REGULATORY_RULES = {
    MAX_HE_TOTAL: 1, // 1% maximum pour les produits visage
    PRESERVATIVE_REQUIRED: true, // Conservateur requis pour formules aqueuses
    ACTIVE_RANGES: {
        'Acide hyaluronique': { min: 0.1, max: 2 },
        'Vitamine E': { min: 0.1, max: 1 },
        'Acide salicylique': { min: 0.5, max: 2 },
        'Panthénol (B5)': { min: 0.5, max: 5 },
        'Niacinamide': { min: 2, max: 10 },
        'Vitamine C': { min: 5, max: 20 }
    },
    HE_LIMITS: {
        'Encens (Boswellia carterii)': 0.5,
        'Carotte sauvage': 0.3,
        'Immortelle (Hélichryse)': 0.4,
        'Orange douce': 1.0,
        'Lavande vraie': 1.0,
        'Tea tree': 1.0,
        'Romarin à cinéole': 0.4
    }
}

export const validateFormula = (formula, actives, essentialOils, heTotal) => {
    const errors = []
    const warnings = []

    // Validation HE totale
    if (heTotal > REGULATORY_RULES.MAX_HE_TOTAL) {
        errors.push(`Dépassement de la limite UE pour les HE: ${heTotal.toFixed(2)}% > 1%`)
    } else if (heTotal > 0.8) {
        warnings.push(`Approche de la limite UE pour les HE: ${heTotal.toFixed(2)}%`)
    }

    // Validation HE individuelles
    essentialOils.forEach(he => {
        const limit = REGULATORY_RULES.HE_LIMITS[he.name.replace('HE ', '')] || 1
        if (he.quantity > limit) {
            errors.push(`${he.name}: ${he.quantity}% > limite ${limit}%`)
        }
    })

    // Validation actifs
    actives.forEach(active => {
        const range = REGULATORY_RULES.ACTIVE_RANGES[active.name]
        if (range) {
            if (active.quantity < range.min) {
                warnings.push(`${active.name}: sous-dosage (${active.quantity}% < ${range.min}%)`)
            } else if (active.quantity > range.max) {
                errors.push(`${active.name}: surdosage (${active.quantity}% > ${range.max}%)`)
            }
        }
    })

    // Validation conservateur
    if (REGULATORY_RULES.PRESERVATIVE_REQUIRED) {
        const hasPreservative = formula.ingredients?.some(ing =>
            ing.type === 'preservative' || ing.name.includes('Cosgard')
        )
        if (!hasPreservative) {
            errors.push('Aucun système de conservation détecté')
        }
    }

    return { errors, warnings, isValid: errors.length === 0 }
}