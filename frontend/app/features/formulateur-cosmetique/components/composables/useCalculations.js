import { computed } from 'vue'

export default function useCalculations(formData, actives, aqueousPhaseOptions, oilPhaseOptions, skinProfiles) {
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
                        comedogenic: item.comedogenic,
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
        return oilPhaseTotal.value > (skinProfiles[formData.skinType]?.oil || 20)
    })

    const totalActivesPercent = computed(() => {
        return actives.filter(a => a.enabled).reduce((sum, a) => sum + a.percent, 0)
    })

    const enabledActivesCount = computed(() => {
        return actives.filter(a => a.enabled).length
    })

    const tooManyActives = computed(() => {
        return enabledActivesCount.value > (skinProfiles[formData.skinType]?.maxActives || 3)
    })

    const heTotal = computed(() => {
        return formData.selectedHE.reduce((sum, oil) => sum + oil.percent, 0)
    })

    const preservativePercent = computed(() => {
        if (formData.preservativeSystem === 'cosgard') {
            return formData.cosgardPercent || 0.8
        }
        return 0.5
    })

    const waterPhase = computed(() => {
        const totalUsed = oilPhaseTotal.value +
            aqueousPhaseTotal.value +
            totalActivesPercent.value +
            preservativePercent.value +
            heTotal.value +
            5

        return Math.max(0, 100 - totalUsed)
    })

    const waterPhaseGrams = computed(() => grams(waterPhase.value))

    const totalFormulationPercent = computed(() => {
        return 100 - waterPhase.value
    })

    const phases = computed(() => {
        const phasesList = [
            {
                name: 'Phase huileuse',
                percent: oilPhaseTotal.value,
                grams: grams(oilPhaseTotal.value),
                color: '#f59e0b',
                icon: '🫒'
            },
            {
                name: 'Hydrolats',
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
                icon: '🧪'
            },
            {
                name: 'HE',
                percent: heTotal.value,
                grams: grams(heTotal.value),
                color: '#10b981',
                icon: '🌿'
            },
            {
                name: 'Conservateur',
                percent: preservativePercent.value,
                grams: grams(preservativePercent.value),
                color: '#ef4444',
                icon: '🛡️'
            },
            {
                name: 'Émulsifiant',
                percent: 5,
                grams: grams(5),
                color: '#ec4899',
                icon: '⚗️'
            }
        ]

        return phasesList.filter(p => p.percent > 0)
    })

    const phasesSummary = computed(() => {
        return phases.value.map(p => ({
            name: p.name,
            percent: p.percent,
            colorClass: p.name === 'Phase huileuse' ? 'bg-amber-500' :
                p.name === 'Hydrolats' ? 'bg-blue-500' :
                    p.name === 'Actifs' ? 'bg-purple-500' :
                        p.name === 'HE' ? 'bg-green-500' :
                            p.name === 'Conservateur' ? 'bg-red-500' : 'bg-pink-500'
        }))
    })

    const comedogenicDistribution = computed(() => {
        const distribution = {
            0: { level: 0, percent: 0, colorClass: 'bg-green-500' },
            1: { level: 1, percent: 0, colorClass: 'bg-amber-500' },
            2: { level: 2, percent: 0, colorClass: 'bg-orange-500' },
            3: { level: 3, percent: 0, colorClass: 'bg-red-500' }
        }

        selectedOilPhase.value.forEach(item => {
            const level = Math.min(item.comedogenic, 3)
            distribution[level].percent += item.percent
        })

        Object.values(distribution).forEach(d => {
            d.percent = (d.percent / oilPhaseTotal.value) * 100
        })

        return Object.values(distribution).filter(d => d.percent > 0)
    })

    const selectedSkinProfile = computed(() => {
        return Object.entries(skinProfiles).map(([key, value]) => ({
            value: key,
            label: key,
            icon: key === 'seche' ? '🏜️' :
                key === 'grasse' ? '💦' :
                    key === 'sensible' ? '🌡️' :
                        key === 'mixte' ? '⚖️' : '👵',
            iconLabel: key === 'seche' ? 'Icône peau sèche' :
                key === 'grasse' ? 'Icône peau grasse' :
                    key === 'sensible' ? 'Icône peau sensible' :
                        key === 'mixte' ? 'Icône peau mixte' :
                            'Icône peau mature',
            oil: value.oil,
            maxActives: value.maxActives,
            description: value.description,
            color: value.color,
            tips: value.tips
        })).find(p => p.value === formData.skinType)
    })

    const completionPercentage = computed(() => {
        let percentage = 0

        if (formData.name.trim().length > 0) percentage += 10
        if (formData.volume > 0) percentage += 5
        if (formData.skinType) percentage += 10
        if (formData.preservativeSystem) percentage += 15
        if (formData.preservativeSystem === 'cosgard' && formData.cosgardPercent >= 0.5) {
            percentage += 5
        }
        if (enabledActivesCount.value > 0) percentage += 10
        if (aqueousPhaseTotal.value > 0) percentage += 10
        if (oilPhaseTotal.value > 0) percentage += 10
        if (formData.selectedHE.length > 0) percentage += 10

        return Math.min(percentage, 100)
    })

    return {
        grams,
        aqueousPhaseTotal,
        selectedAqueousPhase,
        oilPhaseTotal,
        selectedOilPhase,
        oilPhaseExceeded,
        waterPhase,
        waterPhaseGrams,
        totalFormulationPercent,
        phases,
        phasesSummary,
        enabledActivesCount,
        tooManyActives,
        heTotal,
        preservativePercent,
        totalActivesPercent,
        comedogenicDistribution,
        selectedSkinProfile,
        completionPercentage
    }
}