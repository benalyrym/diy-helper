// composables/useHairConditionerData.js
import { ref, reactive, computed } from 'vue'
import hairActivesData from '../../data/hairActivesData.js'
import hairProfiles from '../../data/hairProfiles.js'

// Données pour les agents conditionnants
const conditioningAgentsData = [
    {
        id: 'behentrimonium',
        name: 'Behentrimonium Chloride',
        inci: 'Behentrimonium Chloride',
        charge: 'cationique',
        slipScore: 9,
        recommendedPercent: 1.0,
        min: 0.5,
        max: 3.0,
        description: 'Agent conditionnant cationique, excellent pour démêlage'
    },
    {
        id: 'cetrimonium',
        name: 'Cetrimonium Chloride',
        inci: 'Cetrimonium Chloride',
        charge: 'cationique',
        slipScore: 8,
        recommendedPercent: 0.5,
        min: 0.2,
        max: 1.5,
        description: 'Conditionnant léger, bon pour cheveux fins'
    },
    {
        id: 'panthenol',
        name: 'Panthénol',
        inci: 'Panthenol',
        charge: 'non-ionique',
        slipScore: 7,
        recommendedPercent: 2.0,
        min: 0.5,
        max: 5.0,
        description: 'Humectant et conditionnant'
    },
    {
        id: 'hydrolyzed',
        name: 'Protéine hydrolysée',
        inci: 'Hydrolyzed Wheat Protein',
        charge: 'anionique',
        slipScore: 6,
        recommendedPercent: 1.5,
        min: 0.5,
        max: 3.0,
        description: 'Renforce et conditionne la fibre capillaire'
    },
    {
        id: 'polyquaternium',
        name: 'Polyquaternium-7',
        inci: 'Polyquaternium-7',
        charge: 'cationique',
        slipScore: 8,
        recommendedPercent: 0.8,
        min: 0.3,
        max: 2.0,
        description: 'Polymère conditionnant, bon fixateur'
    },
    {
        id: 'guar',
        name: 'Guar Hydroxypropyltrimonium Chloride',
        inci: 'Guar Hydroxypropyltrimonium Chloride',
        charge: 'cationique',
        slipScore: 7,
        recommendedPercent: 0.5,
        min: 0.2,
        max: 1.5,
        description: 'Polymère naturel dérivé du guar'
    }
]

// Données pour la phase huileuse capillaire
const hairOilPhaseOptions = {
    light: {
        name: 'Huiles légères',
        description: 'Pénétration rapide, non grasses',
        items: [
            {
                name: 'Huile de jojoba',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Simmondsia Chinensis (Jojoba) Seed Oil',
                weight: 'light',
                penetration: 'high'
            },
            {
                name: 'Huile de pépin de raisin',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Vitis Vinifera (Grape) Seed Oil',
                weight: 'light',
                penetration: 'high'
            },
            {
                name: 'Huile de camélia',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Camellia Japonica Seed Oil',
                weight: 'light',
                penetration: 'medium'
            }
        ]
    },
    medium: {
        name: 'Huiles moyennes',
        description: 'Équilibre entre pénétrations et effet filmogène',
        items: [
            {
                name: 'Huile d\'argan',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Argania Spinosa Kernel Oil',
                weight: 'medium',
                penetration: 'medium'
            },
            {
                name: 'Huile d\'avocat',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Persea Gratissima (Avocado) Oil',
                weight: 'medium',
                penetration: 'medium'
            },
            {
                name: 'Huile d\'amande douce',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Prunus Amygdalus Dulcis (Sweet Almond) Oil',
                weight: 'medium',
                penetration: 'medium'
            }
        ]
    },
    heavy: {
        name: 'Huiles riches',
        description: 'Nutrition intense, effet filmogène',
        items: [
            {
                name: 'Huile de ricin',
                percent: 0,
                min: 0.5,
                max: 3.0,
                inci: 'Ricinus Communis (Castor) Seed Oil',
                weight: 'heavy',
                penetration: 'low'
            },
            {
                name: 'Huile de macadamia',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Macadamia Integrifolia Seed Oil',
                weight: 'heavy',
                penetration: 'medium'
            },
            {
                name: 'Beurre de karité',
                percent: 0,
                min: 0.5,
                max: 5.0,
                inci: 'Butyrospermum Parkii (Shea) Butter',
                weight: 'heavy',
                penetration: 'low'
            }
        ]
    }
}

// Données pour les fragrances
const fragranceOptions = [
    {
        id: 'vanilla',
        name: 'Vanille',
        category: 'gourmand',
        strength: 'moyen',
        allergen: true
    },
    {
        id: 'lavender',
        name: 'Lavande',
        category: 'floral',
        strength: 'fort',
        allergen: true
    },
    {
        id: 'citrus',
        name: 'Agrumes',
        category: 'frais',
        strength: 'léger',
        allergen: true
    },
    {
        id: 'rosemary',
        name: 'Romarin',
        category: 'herbacé',
        strength: 'moyen',
        allergen: false
    }
]

export default function useHairConditionerData(initialData = {}) {
    // Données du formulaire
    const formData = reactive({
        name: initialData.name || '',
        volume: initialData.volume || 100,
        hairType: initialData.hairType || 'normaux',
        hairConcern: initialData.hairConcern || '',
        applicationType: initialData.applicationType || 'rinçage',
        preservativeSystem: initialData.preservativeSystem || 'cosgard',
        cosgardPercent: initialData.cosgardPercent || 0.6,
        selectedFragrances: initialData.selectedFragrances || []
    })

    // Actifs capillaires avec état réactif
    const hairActives = ref(
        hairActivesData.map(active => ({
            ...active,
            enabled: initialData.actives?.some(a => a.id === active.id) || false,
            percent: initialData.actives?.find(a => a.id === active.id)?.percent || active.percent || 0
        }))
    )

    // Agents conditionnants
    const conditioningAgents = ref([...conditioningAgentsData])
    const selectedConditioningAgents = ref(
        initialData.conditioningAgents?.map(agent => ({
            ...agent,
            enabled: true,
            percent: agent.percent || conditioningAgentsData.find(a => a.id === agent.id)?.recommendedPercent || 0
        })) || []
    )

    // Filtres de recherche
    const activeSearch = ref('')
    const activeTypeFilter = ref('')

    // Computed properties
    const enabledActivesCount = computed(() => {
        return hairActives.value.filter(a => a.enabled).length
    })

    const tooManyActives = computed(() => {
        const profile = hairProfiles[formData.hairType]
        return enabledActivesCount.value > (profile?.maxActives || 4)
    })

    const filteredActives = computed(() => {
        return hairActives.value.filter(active => {
            const matchesSearch = !activeSearch.value ||
                active.label.toLowerCase().includes(activeSearch.value.toLowerCase()) ||
                active.inci.toLowerCase().includes(activeSearch.value.toLowerCase()) ||
                active.benefit.toLowerCase().includes(activeSearch.value.toLowerCase())

            const matchesType = !activeTypeFilter.value || active.type === activeTypeFilter.value

            return matchesSearch && matchesType
        })
    })

    // Méthodes de mise à jour
    const updateFormData = (updates) => {
        Object.assign(formData, updates)
    }

    const updateActive = (activeId, updates) => {
        const index = hairActives.value.findIndex(a => a.id === activeId)
        if (index !== -1) {
            if (updates.enabled !== undefined) {
                hairActives.value[index].enabled = updates.enabled
            }
            if (updates.percent !== undefined) {
                hairActives.value[index].percent = parseFloat(updates.percent)
            }
        }
    }

    const updateSearch = (value) => {
        activeSearch.value = value
    }

    const updateTypeFilter = (value) => {
        activeTypeFilter.value = value
    }

    const updateConditioningAgents = (agentId, updates) => {
        const index = selectedConditioningAgents.value.findIndex(a => a.id === agentId)
        if (index !== -1) {
            if (updates.enabled !== undefined) {
                selectedConditioningAgents.value[index].enabled = updates.enabled
            }
            if (updates.percent !== undefined) {
                selectedConditioningAgents.value[index].percent = parseFloat(updates.percent)
            }
        } else if (updates.enabled === true) {
            // Ajouter un nouvel agent
            const agent = conditioningAgents.value.find(a => a.id === agentId)
            if (agent) {
                selectedConditioningAgents.value.push({
                    ...agent,
                    enabled: true,
                    percent: agent.recommendedPercent
                })
            }
        }
    }

    const addFragrance = (fragranceId) => {
        const fragrance = fragranceOptions.find(f => f.id === fragranceId)
        if (fragrance && !formData.selectedFragrances.some(f => f.id === fragranceId)) {
            formData.selectedFragrances.push({
                ...fragrance,
                percent: 0.1 // Valeur par défaut
            })
        }
    }

    const removeFragrance = (fragranceId) => {
        const index = formData.selectedFragrances.findIndex(f => f.id === fragranceId)
        if (index !== -1) {
            formData.selectedFragrances.splice(index, 1)
        }
    }

    const updateFragrancePercent = (fragranceId, percent) => {
        const fragrance = formData.selectedFragrances.find(f => f.id === fragranceId)
        if (fragrance) {
            fragrance.percent = parseFloat(percent)
        }
    }

    return {
        // Données
        formData,
        hairActives,
        conditioningAgents,
        hairOilPhaseOptions,
        fragranceOptions,
        hairProfiles,

        // États réactifs
        selectedConditioningAgents,
        activeSearch,
        activeTypeFilter,

        // Computed
        enabledActivesCount,
        tooManyActives,
        filteredActives,

        // Méthodes
        updateFormData,
        updateActive,
        updateSearch,
        updateTypeFilter,
        updateConditioningAgents,
        addFragrance,
        removeFragrance,
        updateFragrancePercent
    }
}