import { computed } from 'vue'

export default function useConditionerIngredients({
  formData,
  actives,
  thickeners,
  preservativeSystems,
  selectedConditioningAgents,
  selectedOilPhase,
  selectedAqueousPhase
}) {
  const inciList = computed(() => {
    const list = ['Aqua']

    const thickenerObj = thickeners.find(t => t.name === formData.thickener)
    if (thickenerObj) {
      list.push(
        formData.thickener === 'xanthane'
          ? 'Xanthan Gum'
          : formData.thickener === 'guar'
            ? 'Guar Gum'
            : 'Carbomer'
      )
    }

    const significantActives = actives
      .filter(a => a.enabled && a.percent >= 0.5)
      .sort((a, b) => b.percent - a.percent)

    significantActives.forEach(a => list.push(a.inci))

    selectedConditioningAgents.value.forEach(agent => {
      list.push(agent.name)
    })

    const significantOils = selectedOilPhase.value
      .filter(o => o.percent >= 0.5)
      .sort((a, b) => b.percent - a.percent)

    significantOils.forEach(o => {
      list.push(`${o.name} Oil`)
    })

    const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
    if (preservative) {
      list.push(preservative.inci)
    }

    if (formData.fragranceType !== 'none') {
      list.push('Parfum (Fragrance)')
      if (formData.fragranceType === 'essential_oils') {
        formData.selectedEssentialOils.forEach(eo => {
          list.push(`${eo.name} Oil`)
        })
      }
    }

    return list
  })

  return {
    inciList
  }
}
