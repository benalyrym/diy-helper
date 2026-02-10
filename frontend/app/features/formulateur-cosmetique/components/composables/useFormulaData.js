import { reactive } from 'vue'
import skinProfilesData from '../data/skinProfiles'
import activesData from '../data/activesData'
import preservativesData from '../data/preservativesData'
import aqueousPhaseData from '../data/aqueousPhaseData'
import oilPhaseData from '../data/oilPhaseData'
import essentialOilsData from '../data/essentialOilsData'

export default function useFormulaData(initialData = {}) {
    const formData = reactive({
        name: initialData.name || '',
        volume: initialData.volume || 50,
        skinType: initialData.skinType || 'mixte',
        selectedHE: initialData.selectedHE || [],
        preservativeSystem: initialData.preservativeSystem || 'cosgard',
        cosgardPercent: initialData.cosgardPercent || 0.8,
        formulaType: initialData.formulaType || 'creme',
        spf: initialData.spf || 0
    })

    const actives = reactive(activesData.map(active => ({
        ...active,
        enabled: initialData.actives?.some(a => a.key === active.key) || false,
        percent: initialData.actives?.find(a => a.key === active.key)?.percent || active.percent
    })))

    const preservativeSystems = preservativesData

    const aqueousPhaseOptions = reactive({ ...aqueousPhaseData })

    const oilPhaseOptions = reactive({ ...oilPhaseData })

    const extendedEssentialOils = reactive({ ...essentialOilsData })

    const skinProfiles = { ...skinProfilesData }

    // Update methods
    const updateFormData = (key, value) => {
        if (key in formData) {
            formData[key] = value
        }
    }

    const updateActive = (key, updates) => {
        const active = actives.find(a => a.key === key)
        if (active) {
            Object.assign(active, updates)
        }
    }

    const updateAqueousPhase = (category, itemName, updates) => {
        const categoryData = aqueousPhaseOptions[category]
        if (categoryData) {
            const item = categoryData.items.find(i => i.name === itemName)
            if (item) {
                Object.assign(item, updates)
            }
        }
    }

    const updateOilPhase = (category, itemName, updates) => {
        const categoryData = oilPhaseOptions[category]
        if (categoryData) {
            const item = categoryData.items.find(i => i.name === itemName)
            if (item) {
                Object.assign(item, updates)
            }
        }
    }

    return {
        formData,
        actives,
        preservativeSystems,
        aqueousPhaseOptions,
        oilPhaseOptions,
        extendedEssentialOils,
        skinProfiles,
        updateFormData,
        updateActive,
        updateAqueousPhase,
        updateOilPhase
    }
}