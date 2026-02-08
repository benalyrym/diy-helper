<template>
  <section id="fragrance"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">🫙</span>
      </div>
      <div class="flex-1">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Huiles essentielles</h2>
            <p class="text-gray-600">Sélectionnez vos huiles essentielles pour l'après-shampoing</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-4 py-2 rounded-full border font-semibold bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-700">
              <span class="text-sm">
                Sélection: {{ selectedEssentialOils.length }} • Total: {{ totalEssentialOilsPercent.toFixed(2) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="formData.fragranceType === 'essential_oils'" class="space-y-6">
      <div class="border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-md border-green-300 bg-green-50/50">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
            <span class="p-2 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg text-white">
              🎯
            </span>
            Sélection des huiles essentielles
            <span class="text-sm font-normal text-gray-500">
              ({{ selectedEssentialOils.length }}/{{ filteredEssentialOils.length }})
            </span>
          </h3>
          <div class="text-sm text-green-600">
            Filtre actif: {{ currentFilterLabel }}
          </div>
        </div>

        <div class="mb-6">
          <label class="label mb-3">Filtrer par type de cheveux</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="filter in hairTypeFilters"
                    :key="filter.value"
                    @click="activeFilter = filter.value"
                    class="px-4 py-2 rounded-lg transition-all duration-300"
                    :class="activeFilter === filter.value
                      ? 'bg-green-700 text-white shadow-lg'
                      : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'">
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="he in filteredEssentialOils"
               :key="he.name"
               :class="[
                 'rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-1',
                 isEssentialOilSelected(he)
                   ? 'bg-gradient-to-br from-green-50 to-white border-2 border-green-300 shadow-md'
                   : 'bg-white border border-gray-200 hover:border-green-200'
               ]">
            <div class="flex items-start gap-3">
              <div class="flex items-center h-6 pt-1">
                <input :id="`he-${he.name}`"
                       type="checkbox"
                       :checked="isEssentialOilSelected(he)"
                       @change="handleToggleEssentialOil(he)"
                       class="h-5 w-5 rounded border-2 border-gray-300 checked:border-green-600 checked:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <label :for="`he-${he.name}`"
                           :class="[
                             'font-bold cursor-pointer',
                             isEssentialOilSelected(he) ? 'text-gray-900 hover:text-green-600' : 'text-gray-700'
                           ]">
                      {{ he.name }}
                    </label>
                    <p class="text-xs text-gray-500 mt-1">{{ he.latinName }}</p>
                  </div>
                  <span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                    {{ he.note }}
                  </span>
                </div>

                <p class="text-xs text-gray-500">{{ he.aroma }}</p>

                <div v-if="isEssentialOilSelected(he)" class="mt-4 space-y-3">
                  <div>
                    <label :for="`he-percent-${he.name}`"
                           class="block text-xs font-medium text-gray-700 mb-1">
                      Dosage (%)
                    </label>
                    <div class="flex items-center gap-2">
                      <div class="relative flex-1">
                        <input :id="`he-percent-${he.name}`"
                               type="number"
                               :value="getEssentialOilPercent(he)"
                               :min="getConcentrationRange(he).min"
                               :max="getConcentrationRange(he).max"
                               step="0.1"
                               class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-1 border-green-300 focus:ring-green-500 focus:border-green-500"
                               @input="updateEssentialOilPercent(he, $event.target.value)">
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                      </div>
                      <span class="text-xs text-gray-500 min-w-16 text-right">
                        {{ grams(getEssentialOilPercent(he)) }} g
                      </span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-500">Min: {{ getConcentrationRange(he).min }}%</span>
                      <span class="text-green-600 font-medium">Concentration</span>
                      <span class="text-gray-500">Max: {{ getConcentrationRange(he).max }}%</span>
                    </div>
                    <input type="range"
                           :value="getEssentialOilPercent(he)"
                           :min="getConcentrationRange(he).min"
                           :max="getConcentrationRange(he).max"
                           step="0.1"
                           @input="updateEssentialOilPercent(he, $event.target.value)"
                           class="w-full h-2 bg-gradient-to-r from-green-200 to-emerald-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg">
                  </div>
                </div>

                <div class="mt-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="prop in he.properties.slice(0, 3)"
                          :key="prop"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                      {{ prop }}
                    </span>
                    <span v-if="he.properties.length > 3"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      +{{ he.properties.length - 3 }}
                    </span>
                  </div>
                </div>

                <div v-if="he.benefits" class="mt-2">
                  <p class="text-xs text-gray-600">
                    <span class="font-medium">Bénéfices :</span>
                    {{ he.benefits.slice(0, 2).join(', ') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedEssentialOils.length > 0"
         class="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-300">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
          <span class="text-green-600">📊</span>
          Répartition des huiles essentielles
        </h3>
        <div class="text-sm font-medium text-green-700">
          Total: {{ totalEssentialOilsPercent.toFixed(2) }}%
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in selectedEssentialOils"
             :key="item.name"
             class="bg-white/80 rounded-lg p-3 border border-green-200">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 truncate">{{ item.name }}</span>
            </div>
            <span class="font-bold text-green-700">{{ item.percent }}%</span>
          </div>
          <div class="text-xs text-gray-500 flex justify-between">
            <span>{{ grams(item.percent) }} g</span>
            <span class="text-green-600">
              {{ ((item.percent / totalEssentialOilsPercent) * 100).toFixed(0) }}% de la phase
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  fragranceOptions: { type: Array, required: true },
  hairEssentialOils: { type: Array, required: true },
  toggleEssentialOil: { type: Function, required: true }
})

// Filtres actifs
const activeFilter = ref('all')

// Filtres par type de cheveux
const hairTypeFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'greasy', label: 'Cheveux gras' },
  { value: 'dry', label: 'Cheveux secs' },
  { value: 'loss', label: 'Chute' },
  { value: 'dandruff', label: 'Pellicules' },
  { value: 'sensitive', label: 'Sensible' },
  { value: 'shine', label: 'Brillance' }
]

const volume = computed(() => props.formData?.volume || 100)

const grams = (percent) => {
  return Number(((volume.value * percent) / 100).toFixed(2))
}

const parseConcentrationRange = (concentration) => {
  if (typeof concentration !== 'string') {
    return { min: 0.1, max: 2 }
  }

  const matches = concentration.match(/(\d+(?:\.\d+)?)/g) || []
  if (matches.length >= 2) {
    const min = parseFloat(matches[0])
    const max = parseFloat(matches[1])
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return min <= max ? { min, max } : { min: max, max: min }
    }
  }

  if (matches.length === 1) {
    const max = parseFloat(matches[0])
    if (Number.isFinite(max)) {
      return { min: Math.min(0.1, max), max }
    }
  }

  return { min: 0.1, max: 2 }
}

const getConcentrationRange = (he) => {
  return parseConcentrationRange(he.concentration)
}

const isEssentialOilSelected = (he) => {
  return props.formData.selectedEssentialOils.some(eo => eo.name === he.name)
}

const getSelectedEssentialOil = (he) => {
  return props.formData.selectedEssentialOils.find(eo => eo.name === he.name)
}

const getEssentialOilPercent = (he) => {
  const selected = getSelectedEssentialOil(he)
  if (selected && typeof selected.percent === 'number') {
    return selected.percent
  }
  return getConcentrationRange(he).min
}

const updateEssentialOilPercent = (he, value) => {
  const selected = getSelectedEssentialOil(he)
  if (!selected) return

  const range = getConcentrationRange(he)
  const parsed = parseFloat(value)
  const safeValue = Number.isFinite(parsed) ? parsed : range.min
  selected.percent = Math.min(range.max, Math.max(range.min, safeValue))
}

const handleToggleEssentialOil = (he) => {
  props.toggleEssentialOil(he)
  const selected = getSelectedEssentialOil(he)
  if (selected && typeof selected.percent !== 'number') {
    selected.percent = getConcentrationRange(he).min
  }
}

const selectedEssentialOils = computed(() => {
  return props.formData.selectedEssentialOils || []
})

const totalEssentialOilsPercent = computed(() => {
  return selectedEssentialOils.value.reduce((sum, he) => {
    return sum + (typeof he.percent === 'number' ? he.percent : 0)
  }, 0)
})

// Huiles essentielles filtrées
const filteredEssentialOils = computed(() => {
  if (activeFilter.value === 'all') return props.hairEssentialOils

  const filterMap = {
    greasy: ['Tea Tree', 'Lemon', 'Cedarwood', 'Clary Sage', 'Rosemary', 'Peppermint'],
    dry: ['Lavender', 'Ylang Ylang', 'Sandalwood', 'Geranium', 'Chamomile Roman'],
    loss: ['Rosemary CT verbenone', 'Clove Bud', 'Bay Laurel', 'Ginger', 'Black Pepper'],
    dandruff: ['Rosemary CT camphor', 'Tea Tree', 'Lavender Spike', 'Manuka', 'Cajeput'],
    sensitive: ['Chamomile German', 'Blue Tansy', 'Helichrysum Italicum', 'Calendula', 'Tamanu'],
    shine: ['Ylang Ylang Extra', 'Sandalwood', 'Jasmine Absolute', 'Rose Absolute', 'Vanilla Absolute']
  }

  return props.hairEssentialOils.filter(he =>
    filterMap[activeFilter.value]?.includes(he.name)
  )
})

const currentFilterLabel = computed(() => {
  return hairTypeFilters.find(filter => filter.value === activeFilter.value)?.label || 'Tous'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #db2777;
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
