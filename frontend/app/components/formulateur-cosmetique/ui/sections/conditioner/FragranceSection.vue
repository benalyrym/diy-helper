<template>
  <section id="fragrance"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">🌸</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Huiles essentielles</h2>
        <p class="text-gray-600">Sélectionnez vos huiles essentielles pour l'après-shampoing</p>
      </div>
    </div>

    <!-- Intensité de la fragrance -->
    <div class="mb-8">
      <label class="label">Intensité de la fragrance</label>
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Très légère</span>
          <span class="text-sm text-gray-600">Moyenne</span>
          <span class="text-sm text-gray-600">Intense</span>
        </div>
        <input type="range"
               v-model.number="formData.fragranceIntensity"
               min="1"
               max="10"
               step="1"
               class="w-full h-2 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white">
        <div class="text-center mt-2">
          <span class="text-lg font-bold text-pink-600">
            Niveau {{ formData.fragranceIntensity }} - {{ getIntensityLabel(formData.fragranceIntensity) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Sélection d'huiles essentielles (si choisi) -->
    <div v-if="formData.fragranceType === 'essential_oils'" class="mb-8">
      <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
        <span>🎯</span> Sélection des huiles essentielles
      </h3>

      <!-- Filtres par type de cheveux -->
      <div class="mb-6">
        <label class="label mb-3">Filtrer par type de cheveux</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="filter in hairTypeFilters"
                  :key="filter.value"
                  @click="activeFilter = filter.value"
                  class="px-4 py-2 rounded-lg transition-all duration-300"
                  :class="activeFilter === filter.value
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Liste des huiles essentielles -->
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

    <!-- Résumé de la sélection -->
    <div v-if="showSelectionSummary" class="mt-8 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
      <h4 class="font-bold text-lg text-gray-900 mb-3">📋 Résumé de votre sélection</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-700">
            <span class="font-medium">Type:</span> {{ getFragranceTypeLabel(formData.fragranceType) }}
          </p>
          <p class="text-sm text-gray-700">
            <span class="font-medium">Intensité:</span> {{ getIntensityLabel(formData.fragranceIntensity) }} ({{ formData.fragranceIntensity }}/10)
          </p>
        </div>
        <div>
          <p v-if="formData.selectedEssentialOils.length > 0" class="text-sm text-gray-700">
            <span class="font-medium">Huiles essentielles:</span> {{ formData.selectedEssentialOils.length }} sélectionnée(s)
          </p>
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

// Labels helpers
const getIntensityLabel = (level) => {
  if (level <= 3) return 'Très légère'
  if (level <= 6) return 'Modérée'
  if (level <= 8) return 'Intense'
  return 'Très intense'
}

const getFragranceTypeLabel = (value) => {
  return props.fragranceOptions.find(o => o.value === value)?.label || value
}

// Conditions d'affichage
const showSelectionSummary = computed(() => {
  return props.formData.fragranceType !== 'none' &&
    (props.formData.fragranceIntensity > 1 ||
      props.formData.selectedEssentialOils.length > 0)
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
