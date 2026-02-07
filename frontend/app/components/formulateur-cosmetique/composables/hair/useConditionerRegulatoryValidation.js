import { computed } from 'vue'

export default function useConditionerRegulatoryValidation(
  {
    formData,
    waterPhase,
    oilPhaseTotal,
    totalConditioningPercent,
    hairProfiles
  },
  errors
) {
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
    validateVolume,
    clearError
  }
}
