<template>
  <section id="fragrance" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
        <span class="text-green-600 text-xl">🌸</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Parfum & Huiles essentielles</h2>
      <div class="ml-auto text-sm bg-gray-100 px-3 py-1 rounded-full">
        Total: <span class="font-bold" :class="heTotalClass">{{ heTotal }}%</span>
      </div>
    </div>

    <!-- Alertes parfum -->
    <div v-if="fragranceWarnings.length > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="text-amber-600 text-xl">⚠️</span>
        <div>
          <h3 class="font-semibold text-amber-800">Alertes parfum</h3>
          <ul class="text-sm text-amber-700 space-y-1 mt-1">
            <li v-for="(warning, index) in fragranceWarnings" :key="index">
              • {{ warning }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Type de parfum -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
          v-for="option in fragranceOptions"
          :key="option.value"
          class="border-2 rounded-xl p-4 cursor-pointer text-center transition-all duration-200"
          :class="formData.fragranceType === option.value
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 hover:border-green-300'"
          @click="formData.fragranceType = option.value"
      >
        <input
            type="radio"
            :value="option.value"
            v-model="formData.fragranceType"
            class="hidden"
        >
        <div class="text-2xl mb-2">
          {{ option.value === 'essential_oils' ? '🌿' : option.value === 'fragrance_oil' ? '🧪' : '🚫' }}
        </div>
        <div class="font-medium">{{ option.label }}</div>
      </div>
    </div>

    <!-- Intensité et note (si parfumé) -->
    <div v-if="formData.fragranceType !== 'none'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Intensité du parfum
        </label>
        <div class="flex gap-2">
          <button
              v-for="intensity in ['light', 'medium', 'strong']"
              :key="intensity"
              @click="formData.fragranceIntensity = intensity"
              class="flex-1 py-2 border-2 rounded-xl text-sm capitalize"
              :class="formData.fragranceIntensity === intensity
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-green-300'"
          >
            {{ intensity === 'light' ? '🍃 Léger' : intensity === 'medium' ? '🌿 Moyen' : '🌳 Fort' }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Note olfactive
        </label>
        <select
            v-model="formData.fragranceNote"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Sélectionner une note</option>
          <option v-for="note in fragranceNotes" :key="note.value" :value="note.value">
            {{ note.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Sélection des huiles essentielles -->
    <div v-if="formData.fragranceType === 'essential_oils'" class="space-y-4">
      <h3 class="font-semibold text-gray-700">Huiles essentielles</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
            v-for="he in hairEssentialOils"
            :key="he.id"
            class="border-2 rounded-xl p-4 transition-all duration-200"
            :class="isSelected(he) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <input
                  type="checkbox"
                  :checked="isSelected(he)"
                  @change="toggleHE(he)"
                  class="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
              >
              <div>
                <h4 class="font-medium">{{ he.name }}</h4>
                <p class="text-xs text-gray-500 italic">{{ he.latinName }}</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="prop in he.properties" :key="prop" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {{ prop }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">{{ getHEPercent(he).toFixed(2) }}%</div>
              <div class="text-xs text-gray-500">{{ (getHEPercent(he) / 100 * formData.volume).toFixed(1) }}g</div>
            </div>
          </div>

          <!-- Slider de dosage -->
          <div v-if="isSelected(he)" class="mt-3">
            <input
                type="range"
                :value="getHEPercent(he)"
                @input="updateHEPercent(he, parseFloat($event.target.value))"
                :min="0.1"
                :max="he.max_percent || 1"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-green"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: 0.1%</span>
              <span>Max: {{ he.max_percent || 1 }}%</span>
            </div>
          </div>

          <!-- Allergènes -->
          <div v-if="isSelected(he) && he.allergens" class="mt-2">
            <p class="text-xs text-gray-600">Allergènes à déclarer:</p>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="allergen in he.allergens" :key="allergen" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                ⚠️ {{ allergen }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé des allergènes -->
    <div v-if="allergensList.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <h3 class="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
        <span>⚠️</span> Allergènes à déclarer (selon UE 1223/2009)
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
            v-for="allergen in allergensList"
            :key="allergen.name"
            class="bg-white border border-yellow-300 px-3 py-1 rounded-full text-sm"
        >
          {{ allergen.name }} ({{ allergen.concentration }})
        </span>
      </div>
      <p class="text-xs text-yellow-700 mt-2">
        Ces allergènes doivent figurer sur l'étiquetage si concentration > 0.001% dans les produits rincés
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  fragranceOptions: {
    type: Array,
    required: true
  },
  fragranceNotes: {
    type: Array,
    required: true
  },
  hairEssentialOils: {
    type: Array,
    required: true
  },
  fragranceWarnings: {
    type: Array,
    default: () => []
  },
  toggleEssentialOil: {
    type: Function,
    default: () => {}
  },
  checkFragranceAllergens: {
    type: Function,
    default: () => ({ allergens: [] })
  }
})

const heTotal = computed(() => {
  const total = props.formData.selectedEssentialOils?.reduce((sum, he) => {
    return sum + (he.percent || 0)
  }, 0) || 0
  return total.toFixed(2)
})

const heTotalClass = computed(() => {
  const total = parseFloat(heTotal.value)
  if (total > 1) return 'text-red-600'
  if (total > 0.5) return 'text-amber-600'
  return 'text-green-600'
})

const allergensList = computed(() => {
  return props.checkFragranceAllergens(props.formData.selectedEssentialOils || [])
})

const isSelected = (he) => {
  return props.formData.selectedEssentialOils?.some(e => e.id === he.id)
}

const getHEPercent = (he) => {
  const found = props.formData.selectedEssentialOils?.find(e => e.id === he.id)
  return found?.percent || he.default_percent || 0.5
}

const toggleHE = (he) => {
  props.toggleEssentialOil(he)
}

const updateHEPercent = (he, percent) => {
  const index = props.formData.selectedEssentialOils?.findIndex(e => e.id === he.id)
  if (index !== -1) {
    props.formData.selectedEssentialOils[index].percent = percent
  }
}
</script>