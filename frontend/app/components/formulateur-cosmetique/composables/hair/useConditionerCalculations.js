import { computed } from 'vue'

export default function useConditionerCalculations({
  formData,
  actives,
  aqueousPhaseOptions,
  oilPhaseOptions,
  conditioningAgents,
  hairProfiles
}) {
  const grams = (percent) => {
    return Number(((formData.volume * percent) / 100).toFixed(2))
  }

  const selectedAqueousPhase = computed(() => {
    const selected = []
    for (const category of Object.values(aqueousPhaseOptions)) {
      for (const item of category.items) {
        if (item.selected) {
          selected.push({
            name: item.name,
            percent: item.percent,
            properties: item.properties,
            min: item.min,
            max: item.max
          })
        }
      }
    }
    return selected
  })

  const aqueousPhaseTotal = computed(() => {
    return selectedAqueousPhase.value.reduce((total, item) => total + item.percent, 0)
  })

  const selectedOilPhase = computed(() => {
    const selected = []
    for (const category of Object.values(oilPhaseOptions)) {
      for (const item of category.items) {
        if (item.selected) {
          selected.push({
            name: item.name,
            percent: item.percent,
            penetration: item.penetration,
            properties: item.properties,
            min: item.min,
            max: item.max
          })
        }
      }
    }
    return selected
  })

  const oilPhaseTotal = computed(() => {
    return selectedOilPhase.value.reduce((total, item) => total + item.percent, 0)
  })

  const oilPhaseExceeded = computed(() => {
    return oilPhaseTotal.value > (hairProfiles[formData.hairType]?.oil || 10)
  })

  const penetrationDistribution = computed(() => {
    const distribution = {
      'légère': { level: 'Légère', percent: 0, colorClass: 'bg-green-500' },
      'moyenne': { level: 'Moyenne', percent: 0, colorClass: 'bg-amber-500' },
      'faible': { level: 'Faible', percent: 0, colorClass: 'bg-blue-500' }
    }

    selectedOilPhase.value.forEach(item => {
      distribution[item.penetration].percent += item.percent
    })

    Object.values(distribution).forEach(d => {
      d.percent = (d.percent / oilPhaseTotal.value) * 100
    })

    return Object.values(distribution).filter(d => d.percent > 0)
  })

  const selectedConditioningAgents = computed(() => {
    return conditioningAgents.filter(agent => agent.selected)
  })

  const totalConditioningPercent = computed(() => {
    return selectedConditioningAgents.value.reduce((total, agent) => total + agent.percent, 0)
  })

  const enabledActivesCount = computed(() => {
    return actives.filter(a => a.enabled).length
  })

  const tooManyActives = computed(() => {
    return enabledActivesCount.value > (hairProfiles[formData.hairType]?.maxActives || 4)
  })

  const preservativePercent = computed(() => {
    if (formData.preservativeSystem === 'cosgard') {
      return formData.cosgardPercent || 0.8
    }
    return 0.5
  })

  const thickenerPercent = computed(() => {
    return formData.thickenerPercent || 1.0
  })

  const totalActivesPercent = computed(() => {
    return actives.filter(a => a.enabled).reduce((sum, a) => sum + a.percent, 0)
  })

  const waterPhase = computed(() => {
    const totalUsed = oilPhaseTotal.value +
      aqueousPhaseTotal.value +
      totalActivesPercent.value +
      preservativePercent.value +
      totalConditioningPercent.value +
      thickenerPercent.value +
      (formData.fragranceType === 'essential_oils' ? 0.5 : 0.3)

    return Math.max(0, 100 - totalUsed)
  })

  const waterPhaseGrams = computed(() => grams(waterPhase.value))

  const totalFormulationPercent = computed(() => {
    return 100 - waterPhase.value
  })

  const phases = computed(() => {
    const phasesList = [
      {
        name: 'Phase grasse',
        percent: oilPhaseTotal.value,
        grams: grams(oilPhaseTotal.value),
        color: '#f59e0b',
        icon: '🌿'
      },
      {
        name: 'Infusions',
        percent: aqueousPhaseTotal.value,
        grams: grams(aqueousPhaseTotal.value),
        color: '#3b82f6',
        icon: '💧'
      },
      {
        name: 'Actifs',
        percent: totalActivesPercent.value,
        grams: grams(totalActivesPercent.value),
        color: '#8b5cf6',
        icon: '🧴'
      },
      {
        name: 'Agents démêlants',
        percent: totalConditioningPercent.value,
        grams: grams(totalConditioningPercent.value),
        color: '#10b981',
        icon: '✨'
      },
      {
        name: 'Conservateur',
        percent: preservativePercent.value,
        grams: grams(preservativePercent.value),
        color: '#ef4444',
        icon: '🛡️'
      },
      {
        name: 'Épaississant',
        percent: thickenerPercent.value,
        grams: grams(thickenerPercent.value),
        color: '#ec4899',
        icon: '🌊'
      }
    ]

    if (formData.fragranceType !== 'none') {
      phasesList.push({
        name: 'Parfum',
        percent: formData.fragranceType === 'essential_oils' ? 0.5 : 0.3,
        grams: grams(formData.fragranceType === 'essential_oils' ? 0.5 : 0.3),
        color: '#f472b6',
        icon: '🌸'
      })
    }

    return phasesList.filter(p => p.percent > 0)
  })

  const formulationSummary = computed(() => {
    return phases.value.map(p => ({
      name: p.name,
      percent: p.percent,
      colorClass: p.name === 'Phase grasse' ? 'bg-amber-500' :
        p.name === 'Infusions' ? 'bg-blue-500' :
          p.name === 'Actifs' ? 'bg-purple-500' :
            p.name === 'Agents démêlants' ? 'bg-green-500' :
              p.name === 'Conservateur' ? 'bg-red-500' : 'bg-pink-500'
    }))
  })

  const getRemainingOilPercent = () => {
    const max = hairProfiles[formData.hairType]?.oil || 10
    return Math.max(0, max - oilPhaseTotal.value)
  }

  return {
    grams,
    selectedAqueousPhase,
    aqueousPhaseTotal,
    selectedOilPhase,
    oilPhaseTotal,
    oilPhaseExceeded,
    penetrationDistribution,
    selectedConditioningAgents,
    totalConditioningPercent,
    enabledActivesCount,
    tooManyActives,
    preservativePercent,
    thickenerPercent,
    totalActivesPercent,
    waterPhase,
    waterPhaseGrams,
    totalFormulationPercent,
    phases,
    formulationSummary,
    getRemainingOilPercent
  }
}
