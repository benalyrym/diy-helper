import { ref, computed } from 'vue'

export default function useFilters(actives, extendedEssentialOils) {
    // Actives filters
    const activeSearch = ref('')
    const activeTypeFilter = ref('')

    // HE filters
    const heSearchTerm = ref('')
    const heFilterProperty = ref('')
    const heFilters = ref({
        safeForPregnancy: false,
        noPhotosensitivity: false,
        noAllergen: false
    })

    const filteredActives = computed(() => {
        return actives.filter(active => {
            if (activeSearch.value &&
                !active.label.toLowerCase().includes(activeSearch.value.toLowerCase()) &&
                !active.inci.toLowerCase().includes(activeSearch.value.toLowerCase()) &&
                !active.description.toLowerCase().includes(activeSearch.value.toLowerCase())) {
                return false
            }

            if (activeTypeFilter.value && active.type !== activeTypeFilter.value) {
                return false
            }

            return true
        })
    })

    const filteredEssentialOils = computed(() => {
        const filtered = {}

        for (const [category, oils] of Object.entries(extendedEssentialOils)) {
            let filteredOils = oils

            if (heSearchTerm.value) {
                filteredOils = filteredOils.filter(oil =>
                    oil.name.toLowerCase().includes(heSearchTerm.value.toLowerCase()) ||
                    oil.latinName.toLowerCase().includes(heSearchTerm.value.toLowerCase()) ||
                    oil.properties.some(p => p.toLowerCase().includes(heSearchTerm.value.toLowerCase()))
                )
            }

            if (heFilterProperty.value) {
                filteredOils = filteredOils.filter(oil =>
                    oil.properties.some(p => p.toLowerCase().includes(heFilterProperty.value.toLowerCase()))
                )
            }

            if (heFilters.value.safeForPregnancy) {
                filteredOils = filteredOils.filter(oil => oil.pregnancy)
            }
            if (heFilters.value.noPhotosensitivity) {
                filteredOils = filteredOils.filter(oil => !oil.photo)
            }
            if (heFilters.value.noAllergen) {
                filteredOils = filteredOils.filter(oil => !oil.allergen)
            }

            if (filteredOils.length > 0) {
                filtered[category] = filteredOils
            }
        }

        return filtered
    })

    const filteredHECount = computed(() => {
        return Object.values(filteredEssentialOils.value).reduce((total, oils) => total + oils.length, 0)
    })

    const updateSearch = (value) => {
        activeSearch.value = value
    }

    const updateTypeFilter = (value) => {
        activeTypeFilter.value = value
    }

    const updateHESearch = (value) => {
        heSearchTerm.value = value
    }

    const updateHEPropertyFilter = (value) => {
        heFilterProperty.value = value
    }

    const updateHEFilters = (key, value) => {
        heFilters.value[key] = value
    }

    return {
        activeSearch,
        activeTypeFilter,
        heSearchTerm,
        heFilterProperty,
        heFilters,
        filteredActives,
        filteredEssentialOils,
        filteredHECount,
        updateSearch,
        updateTypeFilter,
        updateHESearch,
        updateHEPropertyFilter,
        updateHEFilters
    }
}