import { computed } from 'vue'

export function useFormulaCalculations(formula, activeReferences, skinTypes) {
    // Calculs de base
    const calculateGrams = (percent) => {
        const volume = formula.value?.volume || 50
        return ((volume * percent) / 100).toFixed(2)
    }

    const calculateTotalGrams = () => {
        const volume = formula.value?.volume || 50
        return volume.toFixed(2)
    }

    // Filtrage des ingrédients
    const actives = computed(() => {
        if (!formula.value?.ingredients) return []
        return formula.value.ingredients.filter((ing) =>
            ing.type === 'active' ||
            ing.name.includes('Acide') ||
            ing.name.includes('Vitamine') ||
            ing.name.includes('Panthénol') ||
            ing.name.includes('Niacinamide') ||
            (!ing.name.startsWith('HE ') && !ing.name.includes('Eau') && !ing.name.includes('Conservateur'))
        )
    })

    const essentialOils = computed(() => {
        if (!formula.value?.ingredients) return []
        return formula.value.ingredients.filter((ing) =>
            ing.type === 'essential_oil' || ing.name.startsWith('HE ')
        )
    })

    const heTotal = computed(() => {
        if (!essentialOils.value.length) return 0
        return essentialOils.value.reduce((total, he) => total + he.quantity, 0)
    })

    const getActiveTotalPercentage = () => {
        return actives.value.reduce((total, active) => total + active.quantity, 0)
    }

    // Validation de conformité
    const isFormulaValid = computed(() => {
        return heTotal.value <= 1 &&
            essentialOils.value.every((he) =>
                he.quantity <= (getHEMaxLimit(he.name) || 1)
            ) &&
            actives.value.every((active) => {
                const ref = activeReferences[active.name]
                if (!ref) return true
                return active.quantity >= ref.min && active.quantity <= ref.max
            })
    })

    // Fonctions pour les HE
    const getHEMaxLimit = (name) => {
        const heName = name.replace('HE ', '')
        const HEReferences = {
            'Encens (Boswellia carterii)': { max: 0.5 },
            'Carotte sauvage': { max: 0.3 },
            'Immortelle (Hélichryse)': { max: 0.4 },
            'Orange douce': { max: 1.0 },
            'Lavande vraie': { max: 1.0 },
            'Tea tree': { max: 1.0 },
            'Romarin à cinéole': { max: 0.4 }
        }
        return HEReferences[heName]?.max || 1
    }

    // Fonctions pour le type de peau
    const getSkinTypeDescription = (skinType) => {
        return skinTypes[skinType]?.description || 'Non spécifié'
    }

    const getSkinTypeTips = (skinType) => {
        return skinTypes[skinType]?.tips || ['Aucune recommandation spécifique']
    }

    const getPreservativeSystem = () => {
        const preservative = formula.value?.ingredients?.find((ing) =>
            ing.type === 'preservative' || ing.name.includes('Cosgard') || ing.name.includes('Conservateur')
        )
        return preservative?.name || 'Non spécifié'
    }

    return {
        actives,
        essentialOils,
        heTotal,
        calculateGrams,
        calculateTotalGrams,
        isFormulaValid,
        getActiveTotalPercentage,
        getSkinTypeDescription,
        getPreservativeSystem,
        getSkinTypeTips,
        getHEMaxLimit
    }
}