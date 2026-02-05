import { computed } from 'vue'

export default function useRegulatoryValidation(formData, actives, aqueousPhaseTotal, oilPhaseTotal, heTotal, waterPhase, skinProfiles) {
    const regulatoryChecks = computed(() => [
        {
            name: 'Nom de la formule',
            description: 'Doit être renseigné et unique',
            passed: formData.name.trim().length > 0,
            error: 'Le nom de la formule est obligatoire',
            recommendation: 'Donnez un nom descriptif à votre formule'
        },
        {
            name: 'Volume total',
            description: 'Doit être entre 1 et 1000 ml',
            passed: formData.volume >= 1 && formData.volume <= 1000,
            error: `Volume invalide: ${formData.volume}ml (1-1000 ml requis)`,
            recommendation: 'Ajustez le volume entre 1 et 1000 ml'
        },
        {
            name: 'Type de peau cible',
            description: 'Doit être sélectionné',
            passed: !!formData.skinType,
            error: 'Aucun type de peau sélectionné',
            recommendation: 'Sélectionnez un type de peau cible'
        },
        {
            name: 'Limite huiles essentielles (UE 1223/2009)',
            description: 'Maximum 1% d\'HE total dans les produits visage',
            passed: heTotal.value <= 1,
            error: `Dépassement: ${heTotal.value.toFixed(2)}% > 1% - INTERDIT`,
            recommendation: 'Réduisez le total d\'HE à 1% maximum'
        },
        {
            name: 'Dosage conservateur',
            description: 'Respect des limites de sécurité',
            passed: formData.preservativeSystem !== 'cosgard' ||
                (formData.cosgardPercent >= 0.5 && formData.cosgardPercent <= 1.0),
            error: `Dosage Cosgard hors plage: ${formData.cosgardPercent}% (0.5-1.0% requis)`,
            recommendation: 'Ajustez le dosage de Cosgard entre 0.5% et 1.0%'
        },
        {
            name: 'Cohérence de la formulation',
            description: 'La somme des phases ≤ 100%',
            passed: waterPhase.value >= 0,
            error: `La somme des phases dépasse 100% de ${Math.abs(waterPhase.value).toFixed(1)}%`,
            recommendation: 'Réduisez les pourcentages des phases existantes'
        },
        {
            name: 'Limites spécifiques HE',
            description: 'Respect des limites IFRA et spécifiques',
            passed: formData.selectedHE.every(he => he.percent <= he.maxFace),
            error: 'Une ou plusieurs HE dépassent leur limite recommandée',
            recommendation: 'Vérifiez et ajustez les dosages individuels des HE'
        },
        {
            name: 'Nombre d\'actifs',
            description: 'Respect des recommandations par type de peau',
            passed: enabledActivesCount.value <= (skinProfiles[formData.skinType]?.maxActives || 3),
            error: `Trop d'actifs pour une peau ${formData.skinType} (${enabledActivesCount.value}/${skinProfiles[formData.skinType]?.maxActives})`,
            recommendation: `Réduisez le nombre d'actifs à ${skinProfiles[formData.skinType]?.maxActives} maximum`
        },
        {
            name: 'Phase huileuse',
            description: 'Respect des recommandations par type de peau',
            passed: !oilPhaseExceeded.value,
            error: `Phase huileuse excessive: ${oilPhaseTotal.value.toFixed(1)}% > ${skinProfiles[formData.skinType]?.oil}%`,
            recommendation: `Réduisez la phase huileuse à ${skinProfiles[formData.skinType]?.oil}% maximum`
        }
    ])

    const regulatoryErrors = computed(() => {
        return regulatoryChecks.value
            .filter(check => !check.passed)
            .map(check => check.error)
    })

    const regulatoryStatus = computed(() => ({
        isValid: regulatoryErrors.value.length === 0,
        errors: regulatoryErrors.value,
        warnings: heWarnings.value
    }))

    const heWarnings = computed(() => {
        const warnings = []

        if (heTotal.value > 1) {
            warnings.push(`Dépassement limite UE: ${heTotal.value.toFixed(2)}% > 1%`)
        }

        if (heTotal.value > 0.8 && heTotal.value <= 1) {
            warnings.push('Approche de la limite UE (1%) - vérification recommandée')
        }

        const pregnancyUnsafe = formData.selectedHE.filter(oil => !oil.pregnancy)
        if (pregnancyUnsafe.length > 0) {
            warnings.push(`${pregnancyUnsafe.length} HE non recommandées pendant la grossesse`)
        }

        const photosensitive = formData.selectedHE.filter(oil => oil.photo)
        if (photosensitive.length > 0) {
            warnings.push(`${photosensitive.length} HE photosensibilisantes`)
        }

        const highIFRA = formData.selectedHE.filter(oil => oil.ifra < 0.5)
        if (highIFRA.length > 0) {
            warnings.push(`${highIFRA.length} HE avec limite IFRA basse (<0.5%)`)
        }

        return warnings
    })

    const mandatoryMentions = computed(() => {
        const mentions = []

        // Mentions générales
        mentions.push('À conserver hors de la portée des enfants')
        mentions.push('Éviter le contact avec les yeux')
        mentions.push('Usage externe uniquement')

        // Mentions HE
        if (heTotal.value > 0) {
            mentions.push('Contient des huiles essentielles')

            const pregnancyUnsafe = formData.selectedHE.filter(he => !he.pregnancy)
            if (pregnancyUnsafe.length > 0) {
                mentions.push('Contre-indiqué pendant la grossesse et l\'allaitement')
            }

            const photosensitive = formData.selectedHE.filter(he => he.photo)
            if (photosensitive.length > 0) {
                mentions.push('Éviter l\'exposition au soleil après application')
            }

            const allergens = formData.selectedHE.filter(he => he.allergen)
            if (allergens.length > 0) {
                mentions.push('Contient des substances allergisantes')
                allergens.forEach(he => {
                    mentions.push(`Allergène: ${he.name}`)
                })
            }
        }

        // Mentions actifs
        actives.filter(a => a.enabled).forEach(a => {
            if (a.key === 'bha' || a.key === 'bha') {
                mentions.push('Utiliser avec protection solaire')
            }
            if (a.percent > a.max * 0.8) {
                mentions.push(`Concentration élevée en ${a.label}`)
            }
        })

        // Mention conservation
        if (formData.preservativeSystem === 'cosgard') {
            mentions.push('Conserver à température ambiante, à l\'abri de la lumière')
        }

        // Mention durée de vie
        mentions.push('Durée d\'utilisation après ouverture: 6 mois')

        return mentions
    })

    const enabledActivesCount = computed(() => {
        return actives.filter(a => a.enabled).length
    })

    const oilPhaseExceeded = computed(() => {
        return oilPhaseTotal.value > (skinProfiles[formData.skinType]?.oil || 20)
    })

    const validateVolume = () => {
        if (formData.volume < 1 || formData.volume > 1000) {
            return 'Volume invalide (1-1000 ml)'
        }
        return null
    }

    const clearError = (field) => {
        // This would be implemented to clear errors in the parent component
    }

    const isValid = computed(() => {
        const hasPreservative = formData.preservativeSystem === 'cosgard'
            ? (formData.cosgardPercent >= 0.5 && formData.cosgardPercent <= 1.0)
            : formData.preservativeSystem

        return formData.name.trim().length > 0 &&
            formData.volume > 0 &&
            formData.skinType &&
            hasPreservative &&
            waterPhase.value >= 0 &&
            heTotal.value <= 1 &&
            regulatoryErrors.value.length === 0
    })

    return {
        regulatoryChecks,
        regulatoryErrors,
        regulatoryStatus,
        heWarnings,
        mandatoryMentions,
        enabledActivesCount,
        oilPhaseExceeded,
        validateVolume,
        clearError,
        isValid
    }
}