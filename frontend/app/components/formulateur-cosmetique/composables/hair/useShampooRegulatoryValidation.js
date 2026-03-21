import { ref, computed } from 'vue'

export default function useShampooRegulatoryValidation(calculations, errors) {
  const {
    formData,
    waterPhase,
    totalSurfactants,
    surfactantRatio,
    totalConditioningPercent,
    hairProfiles,
    heTotal,
    targetPh
  } = calculations

  // Vérifications réglementaires
  const regulatoryChecks = computed(() => {
    const profile = hairProfiles[formData.value.hairType]

    return [
      {
        name: 'Nom de la recette',
        valid: formData.value.name.trim().length > 0,
        message: 'Le nom est requis'
      },
      {
        name: 'Volume',
        valid: formData.value.volume >= 50,
        message: 'Volume minimum 50ml'
      },
      {
        name: 'Type de cheveux',
        valid: !!formData.value.hairType,
        message: 'Type de cheveux requis'
      },
      {
        name: 'Base lavante',
        valid: profile
            ? (totalSurfactants.value >= profile.surfactant_min && totalSurfactants.value <= profile.surfactant_max)
            : totalSurfactants.value > 0,
        message: profile
            ? `Base lavante doit être entre ${profile.surfactant_min}% et ${profile.surfactant_max}%`
            : 'Base lavante requise'
      },
      {
        name: 'Équilibre tensioactifs',
        valid: profile
            ? (surfactantRatio.value >= profile.surfactant_ratio - 15 && surfactantRatio.value <= profile.surfactant_ratio + 15)
            : true,
        message: 'Déséquilibre dans la base lavante'
      },
      {
        name: 'pH',
        valid: profile
            ? (targetPh.value >= profile.ph_min && targetPh.value <= profile.ph_max)
            : (targetPh.value >= 4.0 && targetPh.value <= 6.0),
        message: profile
            ? `pH doit être entre ${profile.ph_min} et ${profile.ph_max}`
            : 'pH doit être entre 4.0 et 6.0'
      },
      {
        name: 'Conservation',
        valid: formData.value.preservativeSystem === 'cosgard'
            ? (formData.value.cosgardPercent >= 0.5 && formData.value.cosgardPercent <= 1.0)
            : !!formData.value.preservativeSystem,
        message: 'Système de conservation requis ou concentration incorrecte'
      },
      {
        name: 'Huiles essentielles',
        valid: heTotal.value <= 1.0,
        message: 'Total HE ne doit pas dépasser 1%'
      },
      {
        name: 'Conditionneurs',
        valid: profile
            ? (totalConditioningPercent.value <= profile.conditioning_max)
            : totalConditioningPercent.value <= 6,
        message: 'Trop de conditionneurs'
      },
      {
        name: 'Total %',
        valid: waterPhase.value >= 0 && waterPhase.value <= 100,
        message: 'Le total des ingrédients dépasse 100%'
      }
    ]
  })

  const regulatoryErrors = computed(() => {
    return regulatoryChecks.value
        .filter(check => !check.valid)
        .map(check => check.message)
  })

  const regulatoryStatus = computed(() => ({
    isValid: regulatoryErrors.value.length === 0,
    errors: regulatoryErrors.value,
    checks: regulatoryChecks.value,
    score: Math.max(0, 100 - (regulatoryErrors.value.length * 10))
  }))

  // Vérifier compatibilité conservateur
  const checkPreservativeCompatibility = (preservative) => {
    if (!preservative) return { compatible: false, reason: 'Conservateur non spécifié' }

    const issues = []

    // Vérifier pH
    if (preservative.ph_range) {
      const [min, max] = preservative.ph_range
      if (targetPh.value < min || targetPh.value > max) {
        issues.push(`pH ${targetPh.value} hors plage d'efficacité (${min}-${max})`)
      }
    }

    // Vérifier avertissements
    if (preservative.warning) {
      issues.push(preservative.warning)
    }

    return {
      compatible: issues.length === 0,
      issues
    }
  }

  // Vérifier allergènes des parfums
  const checkFragranceAllergens = (essentialOils) => {
    const allergens = []
    const allergenCounts = {}

    essentialOils.forEach(oil => {
      if (oil.allergens) {
        oil.allergens.forEach(allergen => {
          allergenCounts[allergen] = (allergenCounts[allergen] || 0) + 1
          if (!allergens.includes(allergen)) {
            allergens.push(allergen)
          }
        })
      }
    })

    return {
      allergens,
      needsDeclaration: allergens.length > 0,
      warning: allergens.length > 3 ? 'Trop d\'allergènes différents' : null
    }
  }

  // Validation volume
  const validateVolume = (value) => {
    if (value < 50) {
      errors.value.volume = 'Volume minimum: 50ml'
    } else if (value > 1000) {
      errors.value.volume = 'Volume maximum: 1000ml'
    } else {
      delete errors.value.volume
    }
  }

  // Effacer une erreur spécifique
  const clearError = (field) => {
    delete errors.value[field]
  }

  return {
    regulatoryChecks,
    regulatoryErrors,
    regulatoryStatus,
    validateVolume,
    clearError,
    checkPreservativeCompatibility,
    checkFragranceAllergens
  }
}