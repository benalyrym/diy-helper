// composables/useFilters.js
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

    // S'assurer que les actifs sont bien un tableau
    const getActivesArray = () => {
        // Si c'est un ref, retourner sa valeur
        if (actives && typeof actives.value !== 'undefined') {
            return actives.value || []
        }
        // Sinon, retourner le tableau directement
        return actives || []
    }

    const filteredActives = computed(() => {
        const activesArray = getActivesArray()

        if (!Array.isArray(activesArray)) {
            console.error('actives is not an array:', activesArray)
            return []
        }

        return activesArray.filter(active => {
            // Filtre par recherche
            if (activeSearch.value) {
                const searchLower = activeSearch.value.toLowerCase()
                const matchesSearch =
                    (active.label && active.label.toLowerCase().includes(searchLower)) ||
                    (active.inci && active.inci.toLowerCase().includes(searchLower)) ||
                    (active.description && active.description.toLowerCase().includes(searchLower)) ||
                    (active.benefit && active.benefit.toLowerCase().includes(searchLower))

                if (!matchesSearch) return false
            }

            // Filtre par type
            if (activeTypeFilter.value && active.type !== activeTypeFilter.value) {
                return false
            }

            return true
        })
    })

    const filteredEssentialOils = computed(() => {
        const filtered = {}

        // Vérifier si extendedEssentialOils existe
        if (!extendedEssentialOils) return filtered

        for (const [category, oils] of Object.entries(extendedEssentialOils)) {
            if (!Array.isArray(oils)) continue

            let filteredOils = oils

            if (heSearchTerm.value) {
                const searchLower = heSearchTerm.value.toLowerCase()
                filteredOils = filteredOils.filter(oil =>
                    (oil.name && oil.name.toLowerCase().includes(searchLower)) ||
                    (oil.latinName && oil.latinName.toLowerCase().includes(searchLower)) ||
                    (oil.properties && oil.properties.some(p =>
                        p && p.toLowerCase().includes(searchLower)
                    ))
                )
            }

            if (heFilterProperty.value) {
                const propertyLower = heFilterProperty.value.toLowerCase()
                filteredOils = filteredOils.filter(oil =>
                        oil.properties && oil.properties.some(p =>
                            p && p.toLowerCase().includes(propertyLower)
                        )
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