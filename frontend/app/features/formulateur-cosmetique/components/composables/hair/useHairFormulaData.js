import { reactive } from 'vue'
import hairProfilesData from '../../data/hairProfiles.js'
import hairActivesData from '../../data/hairActivesData.js'
import preservativesData from '../../data/preservativesData.js'
import aqueousPhaseData from '../../data/aqueousPhaseData.js'
import oilPhaseData from '../../data/oilPhaseData.js'
import essentialOilsData from '../../data/essentialOilsData.js'

export default function useHairFormulaData(initialData = {}) {
    const formData = reactive({
        name: initialData.name || '',
        volume: initialData.volume || 100,
        hairType: initialData.hairType || 'normaux',
        hairConcern: initialData.hairConcern || '',
        applicationType: initialData.applicationType || 'rinçage',
        selectedFragrances: initialData.selectedFragrances || [],
        preservativeSystem: initialData.preservativeSystem || 'cosgard',
        cosgardPercent: initialData.cosgardPercent || 0.8,
        formulaType: initialData.formulaType || 'conditionneur'
    })

    const actives = reactive(hairActivesData.map(active => ({
        ...active,
        enabled: initialData.actives?.some(a => a.id === active.id) || false,
        percent: initialData.actives?.find(a => a.id === active.id)?.percent || active.percent
    })))

    const preservativeSystems = preservativesData
    const aqueousPhaseOptions = reactive({ ...aqueousPhaseData })
    const oilPhaseOptions = reactive({ ...oilPhaseData })
    const extendedEssentialOils = reactive({ ...essentialOilsData })
    const hairProfiles = { ...hairProfilesData }

    // Update methods
    const updateFormData = (key, value) => {
        if (key in formData) {
            formData[key] = value
        }
    }

    const updateActive = (id, updates) => {
        const active = actives.find(a => a.id === id)
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

    // Computed properties
    const enabledActivesCount = computed(() => {
        return actives.filter(a => a.enabled).length
    })

    const tooManyActives = computed(() => {
        const profile = hairProfiles[formData.hairType]
        return enabledActivesCount.value > (profile?.maxActives || 4)
    })

    const filteredActives = computed(() => {
        return actives.filter(active => {
            const matchesSearch = !activeSearch.value ||
                active.label.toLowerCase().includes(activeSearch.value.toLowerCase()) ||
                active.inci.toLowerCase().includes(activeSearch.value.toLowerCase()) ||
                active.benefit.toLowerCase().includes(activeSearch.value.toLowerCase())

            const matchesType = !activeTypeFilter.value || active.type === activeTypeFilter.value

            return matchesSearch && matchesType
        })
    })

    // Search and filter
    const activeSearch = ref('')
    const activeTypeFilter = ref('')

    const updateSearch = (value) => {
        activeSearch.value = value
    }

    const updateTypeFilter = (value) => {
        activeTypeFilter.value = value
    }

    return {
        formData,
        actives,
        preservativeSystems,
        aqueousPhaseOptions,
        oilPhaseOptions,
        extendedEssentialOils,
        hairProfiles,
        enabledActivesCount,
        tooManyActives,
        filteredActives,
        activeSearch,
        activeTypeFilter,
        updateFormData,
        updateActive,
        updateAqueousPhase,
        updateOilPhase,
        updateSearch,
        updateTypeFilter
    }
}