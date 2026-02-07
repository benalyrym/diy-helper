import { ref, computed } from 'vue'

export default function useConditionerFilters(actives) {
  const activeSearch = ref('')
  const activeTypeFilter = ref('')

  const filteredActives = computed(() => {
    return actives.filter(active => {
      if (
        activeSearch.value &&
        !active.label.toLowerCase().includes(activeSearch.value.toLowerCase()) &&
        !active.inci.toLowerCase().includes(activeSearch.value.toLowerCase()) &&
        !active.description.toLowerCase().includes(activeSearch.value.toLowerCase())
      ) {
        return false
      }

      if (activeTypeFilter.value && active.type !== activeTypeFilter.value) {
        return false
      }

      return true
    })
  })

  return {
    activeSearch,
    activeTypeFilter,
    filteredActives
  }
}
