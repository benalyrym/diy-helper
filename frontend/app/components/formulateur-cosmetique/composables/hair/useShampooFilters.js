import { ref, computed } from 'vue'

export default function useShampooFilters(actives) {
  const activeSearch = ref('')
  const activeTypeFilter = ref('all')

  const filteredActives = computed(() => {
    return actives.value.filter(active => {
      // Filtre par recherche
      const matchesSearch = activeSearch.value === '' ||
          active.label.toLowerCase().includes(activeSearch.value.toLowerCase()) ||
          active.inci.toLowerCase().includes(activeSearch.value.toLowerCase())

      // Filtre par type
      const matchesType = activeTypeFilter.value === 'all' ||
          active.type === activeTypeFilter.value

      return matchesSearch && matchesType
    })
  })

  return {
    activeSearch,
    activeTypeFilter,
    filteredActives
  }
}