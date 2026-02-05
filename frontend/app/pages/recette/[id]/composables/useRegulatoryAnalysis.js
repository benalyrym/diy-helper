import { computed } from 'vue'

export function useRegulatoryAnalysis(
    formula,
    heTotal,
    actives,
    essentialOils,
    activeReferences,
    HEReferences
) {
    // Validation détaillée
    const validationChecks = computed(() => {
        const checks = [
            {
                name: 'Limite totale des huiles essentielles',
                description: 'Maximum 1% d\'HE total dans les produits cosmétiques pour le visage (Article 3, Règlement UE 1223/2009)',
                passed: heTotal.value <= 1,
                error: `Dépassement de la limite UE: ${heTotal.value.toFixed(2)}% > 1%`,
                recommendation: 'Réduire le total des HE à 1% maximum en ajustant les pourcentages individuels'
            },
            {
                name: 'Dosages sécuritaires des HE individuelles',
                description: 'Respect des limites maximales recommandées pour chaque huile essentielle (IFRA)',
                passed: essentialOils.value.every((he) =>
                    he.quantity <= (getHEMaxLimit(he.name) || 1)
                ),
                error: 'Une ou plusieurs HE dépassent leur limite de sécurité recommandée',
                recommendation: 'Vérifier et ajuster les dosages des HE signalées'
            },
            {
                name: 'Dosages des actifs cosmétiques',
                description: 'Respect des plages recommandées pour les actifs fonctionnels',
                passed: actives.value.every((active) => {
                    const ref = activeReferences[active.name]
                    if (!ref) return true
                    return active.quantity >= ref.min && active.quantity <= ref.max
                }),
                error: 'Un ou plusieurs actifs sont hors de leur plage recommandée',
                recommendation: 'Ajuster les pourcentages des actifs problématiques'
            },
            {
                name: 'Présence d\'un système de conservation',
                description: 'Toute formule contenant de l\'eau doit inclure un conservateur conforme (Annexe V)',
                passed: !!formula.value?.ingredients?.find((ing) =>
                    ing.type === 'preservative' || ing.name.includes('Cosgard') || ing.name.includes('Conservateur')
                ),
                error: 'Aucun système de conservation détecté',
                recommendation: 'Ajouter un conservateur conforme à l\'Annexe V du Règlement UE'
            }
        ]

        // Ajouter des vérifications spécifiques si disponibles
        if (formula.value?.compliance?.checks) {
            checks.push(...formula.value.compliance.checks)
        }

        return checks
    })

    const regulatoryErrors = computed(() => {
        return validationChecks.value
            .filter(check => !check.passed)
            .map(check => check.error)
    })

    const regulatoryStatus = computed(() => {
        const validCount = validationChecks.value.filter(c => c.passed).length
        const totalCount = validationChecks.value.length

        return {
            isValid: validCount === totalCount,
            validCount,
            totalCount,
            percentage: Math.round((validCount / totalCount) * 100)
        }
    })

    // Avertissements
    const warnings = computed(() => {
        const warnings = []

        // Avertissements réglementaires
        if (heTotal.value > 1) {
            warnings.push(`⚠️ Dépassement de la limite UE pour les HE: ${heTotal.value.toFixed(2)}% > 1% (Règlement UE 1223/2009) - Une reformulation est nécessaire`)
        } else if (heTotal.value > 0.8) {
            warnings.push(`⚠️ Approche de la limite UE pour les HE: ${heTotal.value.toFixed(2)}% - Surveillance recommandée`)
        }

        // Avertissements sécurité HE
        const pregnancyUnsafe = essentialOils.value.filter((he) => isHENotSafeForPregnancy(he.name))
        if (pregnancyUnsafe.length > 0) {
            warnings.push(`👶 ${pregnancyUnsafe.length} HE contre-indiquées pendant la grossesse/allaitement - Mention obligatoire sur l\'étiquetage`)
        }

        const photosensitive = essentialOils.value.filter((he) => isHEPhotosensitive(he.name))
        if (photosensitive.length > 0) {
            warnings.push(`☀️ ${photosensitive.length} HE photosensibilisantes - Éviter l\'exposition au soleil pendant 12h après application`)
        }

        const overdosedHE = essentialOils.value.filter((he) =>
            he.quantity > (getHEMaxLimit(he.name) || 1)
        )
        if (overdosedHE.length > 0) {
            warnings.push(`⚠️ ${overdosedHE.length} HE dépassent leur limite de sécurité recommandée - Risque d\'irritation`)
        }

        // Avertissements actifs
        const overdosedActives = actives.value.filter((active) => {
            const ref = activeReferences[active.name]
            if (!ref) return false
            return active.quantity > ref.max
        })
        if (overdosedActives.length > 0) {
            warnings.push(`⚡ ${overdosedActives.length} actifs potentiellement surdosés - Révision recommandée`)
        }

        const underdosedActives = actives.value.filter((active) => {
            const ref = activeReferences[active.name]
            if (!ref) return false
            return active.quantity < ref.min
        })
        if (underdosedActives.length > 0) {
            warnings.push(`📉 ${underdosedActives.length} actifs sous-dosés - Efficacité potentiellement réduite`)
        }

        return warnings
    })

    // Mentions obligatoires
    const mandatoryMentions = computed(() => {
        const mentions = []

        // Mentions génériques obligatoires
        mentions.push('À conserver hors de la portée des enfants')
        mentions.push('Éviter le contact avec les yeux')
        mentions.push('Usage externe uniquement')
        mentions.push('Conserver à température ambiante, à l\'abri de la lumière')

        // Mentions HE
        if (essentialOils.value.length > 0) {
            mentions.push('Contient des huiles essentielles')

            const allergens = essentialOils.value.filter((he) => isHEAllergen(he.name))
            if (allergens.length > 0) {
                allergens.forEach((he) => {
                    mentions.push(`Allergène: ${he.name.replace('HE ', '')}`)
                })
            }

            const pregnancyUnsafe = essentialOils.value.filter((he) => isHENotSafeForPregnancy(he.name))
            if (pregnancyUnsafe.length > 0) {
                mentions.push('Contre-indiqué pendant la grossesse et l\'allaitement')
            }

            const photosensitive = essentialOils.value.filter((he) => isHEPhotosensitive(he.name))
            if (photosensitive.length > 0) {
                mentions.push('Éviter l\'exposition au soleil après application')
            }
        }

        // Mentions spéciales pour certains actifs
        if (actives.value.some((a) => a.name.includes('Acide salicylique'))) {
            mentions.push('Utiliser avec une protection solaire')
        }

        if (actives.value.some((a) => a.name.includes('Vitamine C'))) {
            mentions.push('Protéger de la lumière et de la chaleur')
        }

        // Mention durée de vie
        mentions.push('Durée d\'utilisation après ouverture: 6 mois')

        return mentions
    })

    // Liste INCI
    const inciList = computed(() => {
        if (!formula.value?.ingredients) return 'Aqua'

        const ingredients = [...formula.value.ingredients]

        // Trier par pourcentage décroissant
        ingredients.sort((a, b) => b.quantity - a.quantity)

        // Convertir en noms INCI
        const inciNames = ingredients.map((ing) => {
            let name = ing.name

            // Conversion des noms français vers INCI
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

            // Gestion des HE
            if (name.startsWith('HE ')) {
                return `Parfum (${name.replace('HE ', '')})`
            }

            // Gestion des conservateurs
            if (name.includes('Cosgard')) {
                return 'Benzyl Alcohol, Dehydroacetic Acid'
            }

            return conversions[name] || name
        })

        // Ajouter l'eau en premier si pas déjà présent
        if (!inciNames.includes('Aqua')) {
            inciNames.unshift('Aqua')
        }

        return inciNames.join(', ')
    })

    // Évaluation des risques
    const riskLevel = computed(() => {
        let riskScore = 0

        // Points pour les HE
        if (heTotal.value > 1) riskScore += 3
        if (heTotal.value > 0.8) riskScore += 1

        // Points pour les HE à risque
        const pregnancyUnsafe = essentialOils.value.filter((he) => isHENotSafeForPregnancy(he.name)).length
        const photosensitive = essentialOils.value.filter((he) => isHEPhotosensitive(he.name)).length
        const allergens = essentialOils.value.filter((he) => isHEAllergen(he.name)).length

        riskScore += pregnancyUnsafe * 2
        riskScore += photosensitive * 1
        riskScore += allergens * 1

        // Points pour les actifs surdosés
        const overdosedActives = actives.value.filter((active) => {
            const ref = activeReferences[active.name]
            return ref && active.quantity > ref.max
        }).length

        riskScore += overdosedActives * 2

        // Détermination du niveau de risque
        if (riskScore >= 5) return 'Élevé'
        if (riskScore >= 3) return 'Modéré'
        return 'Faible'
    })

    const riskDescription = computed(() => {
        switch(riskLevel.value) {
            case 'Élevé':
                return 'Cette formule présente plusieurs risques significatifs nécessitant une reformulation avant toute utilisation.'
            case 'Modéré':
                return 'Cette formule présente certains risques modérés. Une surveillance attentive est recommandée.'
            case 'Faible':
                return 'Cette formule présente des risques minimes et est généralement sûre pour une utilisation selon les instructions.'
            default:
                return 'Évaluation des risques non disponible.'
        }
    })

    const safetyMeasures = computed(() => {
        const measures = [
            'Effectuer un test de tolérance cutanée avant la première utilisation',
            'Respecter les contre-indications spécifiques (grossesse, allergies)',
            'Conserver dans un endroit frais et sec, à l\'abri de la lumière'
        ]

        if (essentialOils.value.length > 0) {
            measures.push('Éviter le contact avec les muqueuses et les yeux')
        }

        if (actives.value.some((a) => a.name.includes('Acide'))) {
            measures.push('Utiliser une protection solaire SPF 30+ lors de l\'exposition au soleil')
        }

        return measures
    })

    // Fonctions utilitaires pour les HE
    const getHEMaxLimit = (name) => {
        const heName = name.replace('HE ', '')
        return HEReferences[heName]?.max || 1
    }

    const isHENotSafeForPregnancy = (name) => {
        const heName = name.replace('HE ', '')
        return !HEReferences[heName]?.pregnancy || false
    }

    const isHEPhotosensitive = (name) => {
        const heName = name.replace('HE ', '')
        return HEReferences[heName]?.photo || false
    }

    const isHEAllergen = (name) => {
        const heName = name.replace('HE ', '')
        return HEReferences[heName]?.allergen || false
    }

    return {
        validationChecks,
        regulatoryErrors,
        regulatoryStatus,
        warnings,
        mandatoryMentions,
        inciList,
        riskLevel,
        riskDescription,
        safetyMeasures
    }
}