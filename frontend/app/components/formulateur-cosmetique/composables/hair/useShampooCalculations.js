import { ref, computed } from 'vue'

export default function useShampooCalculations({
                                                 formData,
                                                 surfactants,
                                                 actives,
                                                 conditioningAgents,
                                                 hairProfiles,
                                                 targetPh,
                                                 viscosityTarget
                                               }) {
  // Assurer que les références existent avec des valeurs par défaut
  const safeFormData = computed(() => formData?.value || {})
  const safeSurfactants = computed(() => surfactants?.value || [])
  const safeActives = computed(() => actives?.value || [])
  const safeConditioningAgents = computed(() => conditioningAgents?.value || [])
  const safeHairProfiles = computed(() => hairProfiles || {})

  // Conversion en grammes
  const grams = computed(() => {
    const volume = safeFormData.value.volume || 0
    return {
      surfactants: (totalSurfactants.value / 100) * volume,
      actives: (totalActivesPercent.value / 100) * volume,
      conditioning: (totalConditioningPercent.value / 100) * volume,
      thickener: ((safeFormData.value.thickenerPercent || 0) / 100) * volume,
      preservative: (preservativePercent.value / 100) * volume,
      fragrance: (heTotal.value / 100) * volume,
      water: (waterPhase.value / 100) * volume
    }
  })

  // Tensioactifs sélectionnés
  const selectedSurfactants = computed(() => {
    return safeSurfactants.value.filter(s => s?.selected)
  })

  const primarySurfactants = computed(() => {
    return selectedSurfactants.value.filter(s => s?.type === 'primary')
  })

  const secondarySurfactants = computed(() => {
    return selectedSurfactants.value.filter(s => s?.type === 'secondary')
  })

  const totalSurfactants = computed(() => {
    return selectedSurfactants.value.reduce((sum, s) => sum + (s?.percent || 0), 0)
  })

  const primarySurfactantsPercent = computed(() => {
    return primarySurfactants.value.reduce((sum, s) => sum + (s?.percent || 0), 0)
  })

  const secondarySurfactantsPercent = computed(() => {
    return secondarySurfactants.value.reduce((sum, s) => sum + (s?.percent || 0), 0)
  })

  // Ratio tensioactifs primaires/secondaires
  const surfactantRatio = computed(() => {
    const total = totalSurfactants.value
    if (total === 0) return 0
    return (primarySurfactantsPercent.value / total) * 100
  })

  // Avertissements sur les tensioactifs
  const surfactantWarnings = computed(() => {
    const warnings = []
    const total = totalSurfactants.value
    const profile = safeHairProfiles.value[safeFormData.value?.hairType]

    if (total === 0) {
      warnings.push('Aucun tensioactif sélectionné')
    } else if (profile) {
      if (total < (profile.surfactant_min || 0)) {
        warnings.push(`Base lavante insuffisante (min ${profile.surfactant_min}%)`)
      }
      if (total > (profile.surfactant_max || 100)) {
        warnings.push(`Base lavante trop concentrée (max ${profile.surfactant_max}%)`)
      }
      if (surfactantRatio.value < (profile.surfactant_ratio || 50) - 10) {
        warnings.push('Trop de tensioactifs secondaires')
      }
      if (surfactantRatio.value > (profile.surfactant_ratio || 50) + 10) {
        warnings.push('Trop de tensioactifs primaires (risque d\'irritation)')
      }
    }

    // Vérifier la compatibilité
    selectedSurfactants.value.forEach(s => {
      if (s?.warning && (s?.percent || 0) > (s?.max || 100) * 0.8) {
        warnings.push(s.warning)
      }
    })

    return warnings
  })

  // Actifs
  const enabledActives = computed(() => {
    return safeActives.value.filter(a => a?.enabled)
  })

  const enabledActivesCount = computed(() => {
    return enabledActives.value.length
  })

  const tooManyActives = computed(() => {
    return enabledActivesCount.value > 5
  })

  const totalActivesPercent = computed(() => {
    return enabledActives.value.reduce((sum, a) => sum + (a?.percent || 0), 0)
  })

  // Agents conditionneurs
  const selectedConditioningAgents = computed(() => {
    return safeConditioningAgents.value.filter(a => a?.selected)
  })

  const totalConditioningPercent = computed(() => {
    return selectedConditioningAgents.value.reduce((sum, a) => sum + (a?.percent || 0), 0)
  })

  // Épaississant
  const thickenerPercent = computed(() => {
    return safeFormData.value.thickenerPercent || 0
  })

  // Ajusteur pH
  const phAdjusterPercent = computed(() => {
    return safeFormData.value.phAdjusterPercent || 0
  })

  // Conservation
  const preservativePercent = computed(() => {
    if (safeFormData.value.preservativeSystem === 'cosgard') {
      return safeFormData.value.cosgardPercent || 0
    } else if (safeFormData.value.preservativeSystem) {
      // Note: preservativeSystems n'est pas disponible ici, donc on utilise une valeur par défaut
      return 0.5
    }
    return 0
  })

  // Huiles essentielles
  const heTotal = computed(() => {
    return (safeFormData.value.selectedEssentialOils || []).reduce((sum, he) => {
      return sum + (typeof he?.percent === 'number' ? he.percent : 0)
    }, 0) || 0
  })

  // Phase eau (complément à 100%)
  const waterPhase = computed(() => {
    const total = totalSurfactants.value +
        totalActivesPercent.value +
        totalConditioningPercent.value +
        thickenerPercent.value +
        phAdjusterPercent.value +
        preservativePercent.value +
        heTotal.value

    return Math.max(0, 100 - total)
  })

  const waterPhaseGrams = computed(() => {
    return (waterPhase.value / 100) * (safeFormData.value.volume || 0)
  })

  // Total formulation
  const totalFormulationPercent = computed(() => {
    return 100 - waterPhase.value
  })

  // Phases pour graphique
  const phases = computed(() => {
    return [
      { name: 'Tensioactifs', percent: totalSurfactants.value, color: '#3B82F6' },
      { name: 'Actifs', percent: totalActivesPercent.value, color: '#8B5CF6' },
      { name: 'Conditionneurs', percent: totalConditioningPercent.value, color: '#EC4899' },
      { name: 'Épaississants', percent: thickenerPercent.value, color: '#F59E0B' },
      { name: 'Conservateurs', percent: preservativePercent.value, color: '#EF4444' },
      { name: 'Parfum', percent: heTotal.value, color: '#10B981' },
      { name: 'Ajusteurs pH', percent: phAdjusterPercent.value, color: '#6366F1' }
    ].filter(phase => phase.percent > 0)
  })

  // Avertissements pH
  const phWarnings = computed(() => {
    const warnings = []
    const profile = safeHairProfiles.value[safeFormData.value?.hairType]
    const currentPh = targetPh?.value || 5.5

    if (profile) {
      if (currentPh < (profile.ph_min || 0)) {
        warnings.push(`pH trop acide pour ce type de cheveux (min ${profile.ph_min})`)
      }
      if (currentPh > (profile.ph_max || 14)) {
        warnings.push(`pH trop basique pour ce type de cheveux (max ${profile.ph_max})`)
      }
    }

    if (currentPh < 4.0) {
      warnings.push('pH très acide - risque d\'irritation')
    }
    if (currentPh > 6.5) {
      warnings.push('pH trop élevé - risque de dégradation de la fibre')
    }

    return warnings
  })

  // Avertissements conservation
  const preservativeWarnings = computed(() => {
    const warnings = []

    if (!safeFormData.value.preservativeSystem) {
      warnings.push('Aucun conservateur sélectionné')
    } else if (safeFormData.value.preservativeSystem === 'cosgard') {
      if ((safeFormData.value.cosgardPercent || 0) < 0.5) {
        warnings.push('Concentration Cosgard insuffisante (< 0.5%)')
      }
      if ((safeFormData.value.cosgardPercent || 0) > 1.0) {
        warnings.push('Concentration Cosgard trop élevée (> 1.0%)')
      }
    }

    return warnings
  })

  // Avertissements parfum
  const fragranceWarnings = computed(() => {
    const warnings = []

    if (heTotal.value > 1.0) {
      warnings.push('Concentration totale d\'HE trop élevée (> 1%) - risque d\'irritation')
    }

    if ((safeFormData.value.selectedEssentialOils?.length || 0) > 3) {
      warnings.push('Trop d\'huiles essentielles différentes (max 3 recommandé)')
    }

    return warnings
  })

  // Résumé de formulation
  const formulationSummary = computed(() => {
    return {
      totalSurfactants: totalSurfactants.value.toFixed(1),
      primarySurfactants: primarySurfactantsPercent.value.toFixed(1),
      secondarySurfactants: secondarySurfactantsPercent.value.toFixed(1),
      ratio: surfactantRatio.value.toFixed(0),
      totalActives: totalActivesPercent.value.toFixed(1),
      totalConditioning: totalConditioningPercent.value.toFixed(1),
      thickener: thickenerPercent.value.toFixed(1),
      preservative: preservativePercent.value.toFixed(1),
      fragrance: heTotal.value.toFixed(2),
      water: waterPhase.value.toFixed(1),
      ph: (targetPh?.value || 5.5).toFixed(1),
      volume: safeFormData.value.volume || 0
    }
  })

  return {
    grams,
    selectedSurfactants,
    primarySurfactants,
    secondarySurfactants,
    totalSurfactants,
    surfactantRatio,
    surfactantWarnings,
    enabledActives,
    enabledActivesCount,
    tooManyActives,
    totalActivesPercent,
    selectedConditioningAgents,
    totalConditioningPercent,
    thickenerPercent,
    phAdjusterPercent,
    preservativePercent,
    heTotal,
    waterPhase,
    waterPhaseGrams,
    totalFormulationPercent,
    phases,
    phWarnings,
    preservativeWarnings,
    fragranceWarnings,
    formulationSummary
  }
}