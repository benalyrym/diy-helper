import { ref, computed } from 'vue'

export default function useShampooINCI({
                                         formData,
                                         surfactants,
                                         actives,
                                         thickeners,
                                         phAdjusters,
                                         preservativeSystems,
                                         selectedConditioningAgents
                                       }) {
  // Liste INCI simple
  const inciList = computed(() => {
    const ingredients = []

    // Tensioactifs
    const selectedSurfactants = surfactants.value
        .filter(s => s.selected)
        .sort((a, b) => b.percent - a.percent)

    selectedSurfactants.forEach(s => {
      ingredients.push(s.inci)
    })

    // Actifs
    const selectedActives = actives.value
        .filter(a => a.enabled)
        .sort((a, b) => b.percent - a.percent)

    selectedActives.forEach(a => {
      ingredients.push(a.inci)
    })

    // Agents conditionneurs
    selectedConditioningAgents.value
        .sort((a, b) => b.percent - a.percent)
        .forEach(agent => {
          ingredients.push(agent.inci)
        })

    // Épaississant
    const thickener = thickeners.value.find(t => t.name === formData.value.thickener)
    if (thickener && formData.value.thickenerPercent > 0) {
      ingredients.push(thickener.inci)
    }

    // Ajusteur pH
    const phAdjuster = phAdjusters.value.find(p => p.name === formData.value.phAdjuster)
    if (phAdjuster && formData.value.phAdjusterPercent > 0) {
      ingredients.push(phAdjuster.inci)
    }

    // Conservateur
    const preservative = preservativeSystems.value.find(p => p.id === formData.value.preservativeSystem)
    if (preservative) {
      ingredients.push(preservative.inci)
    }

    // Huiles essentielles
    if (formData.value.selectedEssentialOils) {
      formData.value.selectedEssentialOils.forEach(he => {
        if (he.inci) {
          ingredients.push(he.inci)
        } else {
          ingredients.push(`Parfum (${he.name})`)
        }
      })
    }

    // Eau (toujours en dernier)
    ingredients.push('Aqua')

    return ingredients
  })

  // Liste INCI avec numéros CAS
  const inciWithCas = computed(() => {
    const ingredients = []

    // Tensioactifs
    const selectedSurfactants = surfactants.value
        .filter(s => s.selected)
        .sort((a, b) => b.percent - a.percent)

    selectedSurfactants.forEach(s => {
      ingredients.push({
        name: s.inci,
        percent: s.percent,
        cas: s.cas || 'Non fourni',
        function: s.function
      })
    })

    // Actifs
    const selectedActives = actives.value
        .filter(a => a.enabled)
        .sort((a, b) => b.percent - a.percent)

    selectedActives.forEach(a => {
      ingredients.push({
        name: a.inci,
        percent: a.percent,
        cas: a.cas || 'Non fourni',
        function: a.function
      })
    })

    // Agents conditionneurs
    selectedConditioningAgents.value
        .sort((a, b) => b.percent - a.percent)
        .forEach(agent => {
          ingredients.push({
            name: agent.inci,
            percent: agent.percent,
            cas: agent.cas || 'Non fourni',
            function: agent.function
          })
        })

    // Épaississant
    const thickener = thickeners.value.find(t => t.name === formData.value.thickener)
    if (thickener && formData.value.thickenerPercent > 0) {
      ingredients.push({
        name: thickener.inci,
        percent: formData.value.thickenerPercent,
        cas: thickener.cas || 'Non fourni',
        function: thickener.function
      })
    }

    // Ajusteur pH
    const phAdjuster = phAdjusters.value.find(p => p.name === formData.value.phAdjuster)
    if (phAdjuster && formData.value.phAdjusterPercent > 0) {
      ingredients.push({
        name: phAdjuster.inci,
        percent: formData.value.phAdjusterPercent,
        cas: phAdjuster.cas || 'Non fourni',
        function: phAdjuster.function
      })
    }

    // Conservateur
    const preservative = preservativeSystems.value.find(p => p.id === formData.value.preservativeSystem)
    if (preservative) {
      const percent = formData.value.preservativeSystem === 'cosgard'
          ? formData.value.cosgardPercent
          : preservative.defaultPercent

      ingredients.push({
        name: preservative.inci,
        percent: percent,
        cas: preservative.cas || 'Non fourni',
        function: preservative.function
      })
    }

    // Huiles essentielles
    if (formData.value.selectedEssentialOils) {
      formData.value.selectedEssentialOils.forEach(he => {
        ingredients.push({
          name: he.inci || `Parfum (${he.name})`,
          percent: he.percent || 0.5,
          cas: he.cas || 'Non fourni',
          function: 'Fragrance'
        })
      })
    }

    // Eau
    const waterPercent = 100 - ingredients.reduce((sum, i) => sum + i.percent, 0)
    if (waterPercent > 0) {
      ingredients.push({
        name: 'Aqua',
        percent: waterPercent,
        cas: '7732-18-5',
        function: 'Solvent'
      })
    }

    // Tri final par concentration décroissante
    return ingredients.sort((a, b) => b.percent - a.percent)
  })

  // Liste des allergènes à déclarer (selon règlement UE 1223/2009)
  const allergensList = computed(() => {
    const allergens = new Set()
    const allergenConcentrations = {}

    // Vérifier les conservateurs
    const preservative = preservativeSystems.value.find(p => p.id === formData.value.preservativeSystem)
    if (preservative?.allergens) {
      preservative.allergens.forEach(allergen => {
        allergens.add(allergen)
        allergenConcentrations[allergen] = (allergenConcentrations[allergen] || 0) +
            (formData.value.preservativeSystem === 'cosgard' ? formData.value.cosgardPercent : preservative.defaultPercent)
      })
    }

    // Vérifier les huiles essentielles
    if (formData.value.selectedEssentialOils) {
      formData.value.selectedEssentialOils.forEach(he => {
        if (he.allergens) {
          he.allergens.forEach(allergen => {
            allergens.add(allergen)
            allergenConcentrations[allergen] = (allergenConcentrations[allergen] || 0) + (he.percent || 0.5)
          })
        }
      })
    }

    // Filtrer ceux qui dépassent le seuil de déclaration (0.001% pour les produits rincés)
    const declarableAllergens = Array.from(allergens).filter(allergen => {
      return (allergenConcentrations[allergen] || 0) >= 0.001
    })

    return declarableAllergens.map(allergen => ({
      name: allergen,
      concentration: allergenConcentrations[allergen].toFixed(3) + '%'
    }))
  })

  // Fonctions utilitaires INCI
  const formatINCIString = (inciArray) => {
    return inciArray.join(', ')
  }

  const validateINCI = (inci) => {
    // Vérifications de base pour un nom INCI valide
    if (!inci || inci.trim() === '') return false

    // Un nom INCI ne devrait pas contenir de caractères spéciaux sauf certains
    const invalidChars = /[<>{}[\]\\\/]/
    if (invalidChars.test(inci)) return false

    return true
  }

  return {
    inciList,
    inciWithCas,
    allergensList,
    formatINCIString,
    validateINCI
  }
}