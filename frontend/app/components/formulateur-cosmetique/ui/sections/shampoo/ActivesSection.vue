<template>
  <section id="actives" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
        <span class="text-purple-600 text-xl">💊</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Actifs capillaires</h2>
      <div class="ml-auto flex items-center gap-3">
        <div class="text-sm bg-gray-100 px-3 py-1 rounded-full">
          <span :class="enabledActivesCount > 5 ? 'text-red-600' : 'text-gray-700'">
            {{ enabledActivesCount }}/5 actifs
          </span>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative">
        <span class="absolute left-3 top-3 text-gray-400">🔍</span>
        <input
            v-model="search"
            type="text"
            placeholder="Rechercher un actif..."
            class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
      </div>
      <select
          v-model="typeFilter"
          class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      >
        <option value="all">Tous les types</option>
        <option value="protéine">Protéines</option>
        <option value="vitamine">Vitamines</option>
        <option value="extrait">Extraits</option>
        <option value="minéral">Minéraux</option>
        <option value="anti-pelliculaire">Anti-pelliculaires</option>
      </select>
    </div>

    <!-- Alerte trop d'actifs -->
    <div v-if="tooManyActives" class="bg-red-50 border border-red-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="text-red-600 text-xl">⚠️</span>
        <div>
          <h3 class="font-semibold text-red-800">Trop d'actifs sélectionnés</h3>
          <p class="text-sm text-red-600">Maximum 5 actifs recommandé pour éviter les interactions</p>
        </div>
      </div>
    </div>

    <!-- Liste des actifs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
          v-for="active in filteredActives"
          :key="active.id"
          class="border-2 rounded-xl p-4 transition-all duration-200"
          :class="active.enabled ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <input
                type="checkbox"
                v-model="active.enabled"
                class="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            >
            <div>
              <h4 class="font-medium">{{ active.label }}</h4>
              <p class="text-xs text-gray-500">{{ active.inci }}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {{ active.type }}
                </span>
                <span v-for="type in active.hair_types" :key="type" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {{ type }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium">{{ active.percent.toFixed(1) }}%</div>
            <div class="text-xs text-gray-500">{{ (active.percent / 100 * formData.volume).toFixed(0) }}g</div>
          </div>
        </div>

        <!-- Slider de dosage -->
        <div v-if="active.enabled" class="mt-3">
          <input
              type="range"
              v-model.number="active.percent"
              :min="active.min"
              :max="active.max"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-purple"
          >
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min: {{ active.min }}%</span>
            <span>Max: {{ active.max }}%</span>
          </div>
        </div>

        <!-- Description -->
        <p v-if="active.enabled" class="text-xs text-gray-600 mt-2">
          {{ active.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  filteredActives: {
    type: Array,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  hairProfiles: {
    type: Object,
    required: true
  },
  enabledActivesCount: {
    type: Number,
    default: 0
  },
  tooManyActives: {
    type: Boolean,
    default: false
  },
  activeSearch: {
    type: String,
    default: ''
  },
  activeTypeFilter: {
    type: String,
    default: 'all'
  },
  grams: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:activeSearch', 'update:activeTypeFilter'])

// Variables locales pour les filtres
const search = computed({
  get: () => props.activeSearch,
  set: (value) => emit('update:activeSearch', value)
})

const typeFilter = computed({
  get: () => props.activeTypeFilter,
  set: (value) => emit('update:activeTypeFilter', value)
})
</script>