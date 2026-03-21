import { ref, computed } from 'vue'

export default function useShampooIngredients({
                                                formData,
                                                surfactants,
                                                actives,
                                                thickeners,
                                                phAdjusters,
                                                preservativeSystems,
                                                selectedConditioningAgents
                                              }) {
  const ingredientsList = computed(() => {
    const ingredients = []

    // Tensioactifs (triés par concentration)
    const selectedSurfactants = surfactants.value
        .filter(s => s.selected)
        .sort((a, b) => b.percent - a.percent)

    selectedSurfactants.forEach(s => {
      ingredients.push({
        name: s.inci,
        percent: s.percent,
        function: s.function,
        cas: s.cas
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
        function: a.function,
        cas: a.cas
      })
    })

    // Agents conditionneurs
    selectedConditioningAgents.value
        .sort((a, b) => b.percent - a.percent)
        .forEach(agent => {
          ingredients.push({
            name: agent.inci,
            percent: agent.percent,
            function: agent.function,
            cas: agent.cas
          })
        })

    // Épaississant
    const thickener = thickeners.value.find(t => t.name === formData.value.thickener)
    if (thickener && formData.value.thickenerPercent > 0) {
      ingredients.push({
        name: thickener.inci,
        percent: formData.value.thickenerPercent,
        function: thickener.function,
        cas: thickener.cas
      })
    }

    // Ajusteur pH
    const phAdjuster = phAdjusters.value.find(p => p.name === formData.value.phAdjuster)
    if (phAdjuster && formData.value.phAdjusterPercent > 0) {
      ingredients.push({
        name: phAdjuster.inci,
        percent: formData.value.phAdjusterPercent,
        function: phAdjuster.function,
        cas: phAdjuster.cas
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
        function: preservative.function,
        cas: preservative.cas,
        allergens: preservative.allergens
      })
    }

    // Huiles essentielles
    if (formData.value.selectedEssentialOils) {
      formData.value.selectedEssentialOils.forEach(he => {
        ingredients.push({
          name: he.inci || `Parfum (${he.name})`,
          percent: he.percent || 0.5,
          function: 'Fragrance',
          cas: he.cas,
          allergens: he.allergens || []
        })
      })
    }

    // Eau (toujours en dernier)
    const waterPercent = 100 - ingredients.reduce((sum, i) => sum + i.percent, 0)
    if (waterPercent > 0) {
      ingredients.push({
        name: 'Aqua (Water)',
        percent: waterPercent,
        function: 'Solvent',
        cas: '7732-18-5'
      })
    }

    // Tri final par concentration décroissante
    return ingredients.sort((a, b) => b.percent - a.percent)
  })

  return {
    ingredientsList
  }
}