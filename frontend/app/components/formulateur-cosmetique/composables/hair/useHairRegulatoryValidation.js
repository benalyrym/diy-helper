// composables/useHairRegulatoryValidation.js
import { computed } from 'vue'

export default function useHairRegulatoryValidation(formData, hairActives, aqueousPhaseTotal, oilPhaseTotal, fragranceTotal, waterPhase, hairProfiles, selectedConditioningAgents) {
    const getFormData = () => ({
        name: formData.value?.name || '',
        volume: formData.value?.volume || 0,
        hairType: formData.value?.hairType || '',
        hairConcern: formData.value?.hairConcern || '',
        applicationType: formData.value?.applicationType || '',
        preservativeSystem: formData.value?.preservativeSystem || '',
        cosgardPercent: formData.value?.cosgardPercent || 0,
        selectedFragrances: formData.value?.selectedFragrances || []
    })

    const enabledActivesCount = computed(() => {
        const activeList = hairActives.value || hairActives || []
        return activeList.filter(a => a?.enabled).length
    })

    // CORRECTION : utilisez oilPhaseTotal au lieu de oilTotal
    const oilPhaseExceeded = computed(() => {
        const data = getFormData()
        const hairProfile = hairProfiles?.[data.hairType]
        const oilLimit = hairProfile?.oil || 15
        return oilPhaseTotal.value > oilLimit // ← CORRECTION ICI
    })

    const regulatoryChecks = computed(() => {
        const data = getFormData()
        return [
            {
                name: 'Nom du conditionneur',
                description: 'Doit être renseigné et unique',
                passed: data.name.trim().length > 0,
                error: 'Le nom du conditionneur est obligatoire',
                recommendation: 'Donnez un nom descriptif à votre conditionneur'
            },
            {
                name: 'Volume total',
                description: 'Doit être entre 50 et 1000 ml',
                passed: data.volume >= 50 && data.volume <= 1000,
                error: `Volume invalide: ${data.volume}ml (50-1000 ml requis)`,
                recommendation: 'Ajustez le volume entre 50 et 1000 ml'
            },
            {
                name: 'Type de cheveux',
                description: 'Doit être sélectionné',
                passed: !!data.hairType,
                error: 'Aucun type de cheveux sélectionné',
                recommendation: 'Sélectionnez un type de cheveux cible'
            },
            {
                name: 'Type d\'application',
                description: 'Doit être spécifié',
                passed: !!data.applicationType,
                error: 'Aucun type d\'application sélectionné',
                recommendation: 'Sélectionnez un type d\'application'
            },
            {
                name: 'Préoccupation capillaire',
                description: 'Doit être spécifiée',
                passed: !!data.hairConcern,
                error: 'Aucune préoccupation capillaire sélectionnée',
                recommendation: 'Sélectionnez une préoccupation principale'
            },
            {
                name: 'Limite fragrances (UE 1223/2009)',
                description: 'Maximum 1% de fragrances total',
                passed: fragranceTotal.value <= 1,
                error: `Dépassement: ${fragranceTotal.value.toFixed(2)}% > 1%`,
                recommendation: 'Réduisez le total de fragrances à 1% maximum'
            },
            {
                name: 'Dosage conservateur',
                description: 'Respect des limites de sécurité',
                passed: data.preservativeSystem !== 'cosgard' ||
                    (data.cosgardPercent >= 0.5 && data.cosgardPercent <= 1.0),
                error: `Dosage Cosgard hors plage: ${data.cosgardPercent}% (0.5-1.0% requis)`,
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
                name: 'Phase huileuse',
                description: 'Respect des recommandations par type de cheveux',
                passed: !oilPhaseExceeded.value,
                // CORRECTION : utilisez oilPhaseTotal au lieu de oilTotal
                error: `Phase huileuse excessive: ${oilPhaseTotal.value.toFixed(1)}% > ${hairProfiles?.[data.hairType]?.oil || 15}%`,
                recommendation: `Réduisez la phase huileuse à ${hairProfiles?.[data.hairType]?.oil || 15}% maximum`
            }
        ]
    })

    const regulatoryErrors = computed(() => {
        return regulatoryChecks.value
            .filter(check => !check.passed)
            .map(check => check.error)
    })

    const regulatoryStatus = computed(() => ({
        isValid: regulatoryErrors.value.length === 0,
        errors: regulatoryErrors.value,
        warnings: fragranceWarnings.value
    }))

    const fragranceWarnings = computed(() => {
        const data = getFormData()
        const warnings = []

        if (fragranceTotal.value > 1) {
            warnings.push(`Dépassement limite UE: ${fragranceTotal.value.toFixed(2)}% > 1%`)
        }

        if (fragranceTotal.value > 0.8 && fragranceTotal.value <= 1) {
            warnings.push('Approche de la limite UE (1%) - vérification recommandée')
        }

        const allergens = data.selectedFragrances.filter(f => f?.allergen)
        if (allergens.length > 0) {
            warnings.push(`${allergens.length} fragrances contenant des allergènes`)
        }

        return warnings
    })

    const mandatoryMentions = computed(() => {
        const data = getFormData()
        const mentions = []

        // Mentions générales
        mentions.push('À conserver hors de la portée des enfants')
        mentions.push('Éviter le contact avec les yeux')
        mentions.push('Usage externe uniquement')

        // Mentions conditionneur
        mentions.push('Appliquez sur cheveux essorés')
        mentions.push('Éviter le cuir chevelu si sensible')

        // Mentions agents conditionnants
        const cationicAgents = selectedConditioningAgents.value?.filter(a => a?.charge === 'positive') || []
        if (cationicAgents.length > 0) {
            mentions.push('Contient des agents conditionnants cationiques')
        }

        // Mentions fragrances
        if (fragranceTotal.value > 0) {
            mentions.push('Contient des parfums')

            const allergens = data.selectedFragrances.filter(f => f?.allergen)
            if (allergens.length > 0) {
                mentions.push('Contient des substances allergisantes')
                allergens.forEach(f => {
                    mentions.push(`Allergène: ${f?.name || 'Inconnu'}`)
                })
            }
        }

        // Mention conservation
        if (data.preservativeSystem === 'cosgard') {
            mentions.push('Conserver à température ambiante, à l\'abri de la lumière')
        }

        // Mention durée de vie
        mentions.push('Durée d\'utilisation après ouverture: 6 mois')

        return mentions
    })

    const validateVolume = () => {
        const data = getFormData()
        if (data.volume < 50 || data.volume > 1000) {
            return 'Volume invalide (50-1000 ml)'
        }
        return null
    }

    const clearError = (field) => {
        // Implémenté dans le parent
    }

    const isValid = computed(() => {
        const data = getFormData()

        const hasPreservative = data.preservativeSystem === 'cosgard'
            ? (data.cosgardPercent >= 0.5 && data.cosgardPercent <= 1.0)
            : data.preservativeSystem

        return data.name.trim().length > 0 &&
            data.volume >= 50 &&
            data.hairType &&
            data.applicationType &&
            data.hairConcern &&
            hasPreservative &&
            waterPhase.value >= 0 &&
            fragranceTotal.value <= 1 &&
            regulatoryErrors.value.length === 0
    })

    return {
        regulatoryChecks,
        regulatoryErrors,
        regulatoryStatus,
        fragranceWarnings,
        mandatoryMentions,
        validateVolume,
        clearError,
        isValid
    }
}