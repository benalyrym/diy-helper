import { computed } from 'vue'

export default function useConditionerRegulatoryValidation(
  {
    formData,
    waterPhase,
    oilPhaseTotal,
    totalConditioningPercent,
    hairProfiles,
    heTotal
  },
  errors
) {
  const heContraindications = computed(() => {
    const warnings = []
    const selected = formData.selectedEssentialOils || []

    const phototoxic = new Set(['Lemon', 'Grapefruit', 'Bergamot', 'Lime', 'Orange', 'Mandarin'])
    const irritant = new Set(['Cinnamon Bark', 'Cinnamon Leaf', 'Clove Bud', 'Thyme', 'Oregano', 'Lemongrass', 'Peppermint', 'Eucalyptus'])
    const pregnancyCaution = new Set(['Clary Sage', 'Rosemary', 'Rosemary CT camphor', 'Rosemary CT verbenone', 'Sage', 'Basil'])

    selected.forEach(he => {
      if (phototoxic.has(he.name)) {
        warnings.push(`${he.name}: photosensibilisante`)
      }
      if (irritant.has(he.name)) {
        warnings.push(`${he.name}: irritante, usage faible recommandé`)
      }
      if (pregnancyCaution.has(he.name)) {
        warnings.push(`${he.name}: déconseillée grossesse/allaitement`)
      }
    })

    return warnings
  })

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
      description: 'Doit être entre 100 et 1000 ml',
      passed: formData.volume >= 100 && formData.volume <= 1000,
      error: `Volume invalide: ${formData.volume}ml (100-1000 ml requis)`,
      recommendation: 'Ajustez le volume entre 100 et 1000 ml'
    },
    {
      name: 'Type de cheveux cible',
      description: 'Doit être sélectionné',
      passed: !!formData.hairType,
      error: 'Aucun type de cheveux sélectionné',
      recommendation: 'Sélectionnez un type de cheveux cible'
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
      name: 'Phase grasse',
      description: 'Respect des recommandations par type de cheveux',
      passed: oilPhaseTotal.value <= (hairProfiles[formData.hairType]?.oil || 10),
      error: `Phase grasse excessive: ${oilPhaseTotal.value.toFixed(1)}% > ${hairProfiles[formData.hairType]?.oil}%`,
      recommendation: `Réduisez la phase grasse à ${hairProfiles[formData.hairType]?.oil}% maximum`
    },
    {
      name: 'Agents démêlants',
      description: 'Dosage approprié pour le type de cheveux',
      passed: totalConditioningPercent.value <= (hairProfiles[formData.hairType]?.oil || 10) * 0.8,
      error: `Trop d'agents démêlants: ${totalConditioningPercent.value.toFixed(1)}%`,
      recommendation: `Réduisez les agents démêlants à ${(hairProfiles[formData.hairType]?.oil || 10) * 0.8}% maximum`
    },
    {
      name: 'Agents conditionnants requis',
      description: 'Un après-shampoing doit contenir au moins un agent conditionnant',
      passed: totalConditioningPercent.value > 0,
      error: 'Aucun agent conditionnant sélectionné',
      recommendation: 'Ajoutez un agent cationique (BTMS, Behentrimonium Methosulfate, alcool cétylique)'
    },
    {
      name: 'Limite totale des huiles essentielles',
      description: "Maximum 1% d'HE total dans les produits cosmétiques pour le visage (Article 3, Règlement UE 1223/2009)",
      passed: heTotal.value <= 1,
      error: `Dépassement de la limite UE: ${heTotal.value.toFixed(2)}% > 1%`,
      recommendation: 'Réduire le total des HE à 1% maximum en ajustant les pourcentages individuels'
    }
  ])

  const regulatoryErrors = computed(() => {
    return regulatoryChecks.value
      .filter(check => !check.passed)
      .map(check => check.error)
  })

  const regulatoryStatus = computed(() => ({
    isValid: regulatoryErrors.value.length === 0,
    errors: regulatoryErrors.value
  }))

  const clearError = (field) => {
    if (errors?.value?.[field]) {
      delete errors.value[field]
    }
  }

  const validateVolume = () => {
    if (!errors) return
    if (formData.volume < 100 || formData.volume > 1000) {
      errors.value.volume = 'Volume invalide (100-1000 ml)'
    } else {
      delete errors.value.volume
    }
  }

  return {
    regulatoryChecks,
    regulatoryErrors,
    regulatoryStatus,
    heContraindications,
    validateVolume,
    clearError
  }
}
