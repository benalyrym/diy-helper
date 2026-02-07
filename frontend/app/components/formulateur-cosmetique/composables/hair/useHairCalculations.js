// composables/useHairCalculations.js
import { computed } from 'vue'

export default function useHairCalculations(
    formData,
    hairActives,
    aqueousPhaseOptions,
    hairOilPhaseOptions,
    hairProfiles,
    selectedConditioningAgents,
    fragranceOptions
) {
    // Fonction pour convertir les pourcentages en grammes
    const grams = (percent) => {
        return Number(((formData.volume * percent) / 100).toFixed(2))
    }

    // Calculs pour les actifs capillaires
    const enabledActivesCount = computed(() => {
        // Si hairActives est un ref
        if (hairActives.value) {
            return hairActives.value.filter(a => a.enabled).length
        }
        // Si c'est un tableau
        return hairActives.filter(a => a.enabled).length
    })

    const totalActivesPercent = computed(() => {
        let total = 0
        if (hairActives.value) {
            hairActives.value.forEach(a => {
                if (a.enabled) total += a.percent
            })
        } else {
            hairActives.forEach(a => {
                if (a.enabled) total += a.percent
            })
        }
        return total
    })

    // Phase aqueuse
    const aqueousPhaseTotal = computed(() => {
        let total = 0
        for (const category in aqueousPhaseOptions) {
            const items = aqueousPhaseOptions[category]?.items || []
            items.forEach(item => {
                total += item.percent || 0
            })
        }
        return Number(total.toFixed(2))
    })

    const selectedAqueousPhase = computed(() => {
        const selected = []
        for (const category in aqueousPhaseOptions) {
            const items = aqueousPhaseOptions[category]?.items || []
            items.forEach(item => {
                if (item.percent > 0) {
                    selected.push({
                        category,
                        ...item,
                        grams: grams(item.percent)
                    })
                }
            })
        }
        return selected
    })

    // Phase huileuse
    const oilPhaseTotal = computed(() => {
        let total = 0
        for (const category in hairOilPhaseOptions) {
            const items = hairOilPhaseOptions[category]?.items || []
            items.forEach(item => {
                total += item.percent || 0
            })
        }
        return Number(total.toFixed(2))
    })

    const selectedOilPhase = computed(() => {
        const selected = []
        for (const category in hairOilPhaseOptions) {
            const items = hairOilPhaseOptions[category]?.items || []
            items.forEach(item => {
                if (item.percent > 0) {
                    selected.push({
                        category,
                        ...item,
                        grams: grams(item.percent)
                    })
                }
            })
        }
        return selected
    })

    // Vérification de la limite de la phase huileuse
    const oilPhaseExceeded = computed(() => {
        const profile = hairProfiles[formData.hairType]
        const oilLimit = profile?.oil || 15
        return oilPhaseTotal.value > oilLimit
    })

    // Phase eau
    const waterPhase = computed(() => {
        const totalPercent = aqueousPhaseTotal.value + oilPhaseTotal.value + totalActivesPercent.value
        return Number((100 - totalPercent).toFixed(2))
    })

    const waterPhaseGrams = computed(() => {
        return grams(waterPhase.value)
    })

    // Total de la formulation
    const totalFormulationPercent = computed(() => {
        return aqueousPhaseTotal.value + oilPhaseTotal.value + totalActivesPercent.value + waterPhase.value
    })

    // Agents conditionnants
    const conditioningAgentsTotal = computed(() => {
        let total = 0
        if (selectedConditioningAgents.value) {
            selectedConditioningAgents.value.forEach(agent => {
                total += agent.percent || 0
            })
        } else {
            selectedConditioningAgents.forEach(agent => {
                total += agent.percent || 0
            })
        }
        return Number(total.toFixed(2))
    })

    // Fragrances
    const fragranceTotal = computed(() => {
        let total = 0
        const fragrances = formData.selectedFragrances || []
        fragrances.forEach(fragrance => {
            total += fragrance.percent || 0
        })
        return Number(total.toFixed(2))
    })

    // Conservateur
    const preservativePercent = computed(() => {
        if (formData.preservativeSystem === 'cosgard') {
            return formData.cosgardPercent || 0
        }
        return 0
    })

    // Profil de cheveux sélectionné
    const selectedHairProfile = computed(() => {
        return hairProfiles[formData.hairType] || hairProfiles.normaux
    })

    // Vérification si trop d'actifs
    const tooManyActives = computed(() => {
        const max = selectedHairProfile.value?.maxActives || 4
        return enabledActivesCount.value > max
    })

    // Répartition des poids
    const weightDistribution = computed(() => {
        return {
            aqueous: grams(aqueousPhaseTotal.value),
            oil: grams(oilPhaseTotal.value),
            actives: grams(totalActivesPercent.value),
            water: grams(waterPhase.value),
            conditioning: grams(conditioningAgentsTotal.value),
            fragrance: grams(fragranceTotal.value),
            preservative: grams(preservativePercent.value)
        }
    })

    // Phases résumées
    const phases = computed(() => ({
        aqueous: {
            percent: aqueousPhaseTotal.value,
            grams: grams(aqueousPhaseTotal.value)
        },
        oil: {
            percent: oilPhaseTotal.value,
            grams: grams(oilPhaseTotal.value)
        },
        actives: {
            percent: totalActivesPercent.value,
            grams: grams(totalActivesPercent.value)
        },
        water: {
            percent: waterPhase.value,
            grams: grams(waterPhase.value)
        }
    }))

    // Résumé des phases
    const phasesSummary = computed(() => [
        {
            name: 'Phase aqueuse',
            percent: aqueousPhaseTotal.value,
            grams: grams(aqueousPhaseTotal.value),
            color: 'blue'
        },
        {
            name: 'Phase huileuse',
            percent: oilPhaseTotal.value,
            grams: grams(oilPhaseTotal.value),
            color: 'amber'
        },
        {
            name: 'Actifs',
            percent: totalActivesPercent.value,
            grams: grams(totalActivesPercent.value),
            color: 'purple'
        },
        {
            name: 'Eau',
            percent: waterPhase.value,
            grams: grams(waterPhase.value),
            color: 'cyan'
        },
        {
            name: 'Agents conditionnants',
            percent: conditioningAgentsTotal.value,
            grams: grams(conditioningAgentsTotal.value),
            color: 'green'
        },
        {
            name: 'Fragrances',
            percent: fragranceTotal.value,
            grams: grams(fragranceTotal.value),
            color: 'pink'
        }
    ])

    // Pourcentage de complétion
    const completionPercentage = computed(() => {
        let score = 0
        const maxScore = 100

        // Nom du conditionneur (10 points)
        if (formData.name && formData.name.trim().length > 0) score += 10

        // Type de cheveux (15 points)
        if (formData.hairType) score += 15

        // Préoccupation capillaire (15 points)
        if (formData.hairConcern) score += 15

        // Type d'application (10 points)
        if (formData.applicationType) score += 10

        // Au moins un actif activé (10 points)
        if (enabledActivesCount.value > 0) score += 10

        // Conservateur configuré (10 points)
        if (formData.preservativeSystem === 'cosgard' && formData.cosgardPercent > 0) {
            score += 10
        } else if (formData.preservativeSystem) {
            score += 10
        }

        // Phase aqueuse non vide (10 points)
        if (aqueousPhaseTotal.value > 0) score += 10

        // Phase huileuse dans les limites (10 points)
        if (oilPhaseTotal.value > 0 && !oilPhaseExceeded.value) score += 10

        // Fragrances dans les limites (5 points)
        if (fragranceTotal.value <= 1) score += 5

        return Math.min(score, maxScore)
    })

    return {
        grams,
        aqueousPhaseTotal,
        selectedAqueousPhase,
        oilPhaseTotal,
        selectedOilPhase,
        oilPhaseExceeded,
        waterPhase,
        waterPhaseGrams,
        totalFormulationPercent,
        phases,
        phasesSummary,
        enabledActivesCount,
        tooManyActives,
        conditioningAgentsTotal,
        fragranceTotal,
        preservativePercent,
        totalActivesPercent,
        weightDistribution,
        completionPercentage,
        selectedHairProfile
    }
}