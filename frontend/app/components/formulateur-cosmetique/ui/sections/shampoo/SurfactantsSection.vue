<template>
  <section id="surfactants" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <span class="text-blue-600 text-xl">🧼</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Base lavante</h2>
      <div class="ml-auto flex items-center gap-3">
        <div class="text-sm bg-gray-100 px-3 py-1 rounded-full">
          Total: <span class="font-bold" :class="totalSurfactantsClass">{{ totalSurfactants.toFixed(1) }}%</span>
        </div>
        <button
            @click="optimizeSurfactants"
            class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
            title="Optimiser automatiquement"
        >
          ⚡ Optimiser
        </button>
      </div>
    </div>

    <!-- Alertes -->
    <div v-if="surfactantWarnings.length > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="text-amber-600 text-xl">⚠️</span>
        <div class="flex-1">
          <h3 class="font-semibold text-amber-800 mb-1">Alertes base lavante</h3>
          <ul class="text-sm text-amber-700 space-y-1">
            <li v-for="(warning, index) in surfactantWarnings" :key="index">
              • {{ warning }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Graphique de répartition -->
    <div class="bg-gray-50 rounded-xl p-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Répartition des tensioactifs</h3>
      <div class="flex h-4 rounded-full overflow-hidden">
        <div
            v-for="(surf, index) in selectedSurfactants"
            :key="index"
            class="h-full transition-all duration-300"
            :style="{
            width: (surf.percent / totalSurfactants * 100) + '%',
            backgroundColor: getSurfactantColor(surf.type, index)
          }"
            :title="`${surf.name}: ${surf.percent}%`"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span>Ratio primaires/secondaires: {{ surfactantRatio.toFixed(0) }}% / {{ (100 - surfactantRatio).toFixed(0) }}%</span>
        <span>Recommandé: 60-80% primaires</span>
      </div>
    </div>

    <!-- Liste des tensioactifs -->
    <div class="space-y-4">
      <h3 class="font-semibold text-gray-700">Tensioactifs primaires (base lavante)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
            v-for="surf in primarySurfactantsList"
            :key="surf.id"
            class="border-2 rounded-xl p-4 transition-all duration-200"
            :class="surf.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <input
                  type="checkbox"
                  v-model="surf.selected"
                  class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              >
              <div>
                <h4 class="font-medium">{{ surf.name }}</h4>
                <p class="text-xs text-gray-500">{{ surf.inci }}</p>
                <div class="flex gap-2 mt-1">
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Douceur: {{ surf.mildness }}/10
                  </span>
                  <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Mousse: {{ surf.foam }}/10
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">{{ surf.percent.toFixed(1) }}%</div>
              <div class="text-xs text-gray-500">{{ (surf.percent / 100 * formData.volume).toFixed(0) }}g</div>
            </div>
          </div>

          <!-- Slider de dosage -->
          <div v-if="surf.selected" class="mt-3">
            <input
                type="range"
                v-model.number="surf.percent"
                :min="surf.min"
                :max="surf.max"
                step="0.5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                :class="'range-' + getRangeColor(surf.percent, surf.min, surf.max)"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {{ surf.min }}%</span>
              <span>Max: {{ surf.max }}%</span>
            </div>
          </div>
        </div>
      </div>

      <h3 class="font-semibold text-gray-700 mt-6">Tensioactifs secondaires (co-tensioactifs)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
            v-for="surf in secondarySurfactantsList"
            :key="surf.id"
            class="border-2 rounded-xl p-4 transition-all duration-200"
            :class="surf.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <input
                  type="checkbox"
                  v-model="surf.selected"
                  class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              >
              <div>
                <h4 class="font-medium">{{ surf.name }}</h4>
                <p class="text-xs text-gray-500">{{ surf.inci }}</p>
                <div class="flex gap-2 mt-1">
                  <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Viscosité: {{ surf.viscosity_contribution }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">{{ surf.percent.toFixed(1) }}%</div>
              <div class="text-xs text-gray-500">{{ (surf.percent / 100 * formData.volume).toFixed(0) }}g</div>
            </div>
          </div>

          <!-- Slider de dosage -->
          <div v-if="surf.selected" class="mt-3">
            <input
                type="range"
                v-model.number="surf.percent"
                :min="surf.min"
                :max="surf.max"
                step="0.5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                :class="'range-' + getRangeColor(surf.percent, surf.min, surf.max)"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {{ surf.min }}%</span>
              <span>Max: {{ surf.max }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé en grammes -->
    <div class="bg-gray-50 rounded-xl p-4 mt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Équivalence en grammes</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        <div v-for="(value, key) in grams" :key="key" class="bg-white rounded-lg p-2 text-center">
          <div class="text-xs text-gray-500">{{ key }}</div>
          <div class="font-medium">{{ value.toFixed(1) }}g</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  surfactants: {
    type: Array,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  totalSurfactants: {
    type: Number,
    default: 0
  },
  surfactantRatio: {
    type: Number,
    default: 0
  },
  surfactantWarnings: {
    type: Array,
    default: () => []
  },
  grams: {
    type: Object,
    default: () => ({})
  },
  optimizeSurfactants: {
    type: Function,
    default: () => {}
  }
})

const primarySurfactantsList = computed(() => {
  return props.surfactants.filter(s => s.type === 'primary')
})

const secondarySurfactantsList = computed(() => {
  return props.surfactants.filter(s => s.type === 'secondary')
})

const selectedSurfactants = computed(() => {
  return props.surfactants.filter(s => s.selected)
})

const totalSurfactantsClass = computed(() => {
  if (props.totalSurfactants < 8) return 'text-red-600'
  if (props.totalSurfactants > 35) return 'text-red-600'
  if (props.totalSurfactants >= 10 && props.totalSurfactants <= 25) return 'text-green-600'
  return 'text-amber-600'
})

const getSurfactantColor = (type, index) => {
  const colors = {
    primary: ['#3B82F6', '#2563EB', '#1D4ED8'],
    secondary: ['#8B5CF6', '#7C3AED', '#6D28D9']
  }
  const colorArray = type === 'primary' ? colors.primary : colors.secondary
  return colorArray[index % colorArray.length]
}

const getRangeColor = (value, min, max) => {
  const percent = (value - min) / (max - min) * 100
  if (percent < 25) return 'red'
  if (percent > 75) return 'red'
  if (percent >= 40 && percent <= 60) return 'green'
  return 'amber'
}
</script>