<template>
  <section id="conditioning-agents" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
        <span class="text-pink-600 text-xl">✨</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Agents conditionneurs</h2>
      <div class="ml-auto text-sm bg-gray-100 px-3 py-1 rounded-full">
        Total: <span class="font-bold" :class="totalConditioningClass">{{ totalConditioningPercent.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- Alertes -->
    <div v-if="totalConditioningPercent > 6" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="text-amber-600 text-xl">⚠️</span>
        <div>
          <h3 class="font-semibold text-amber-800">Trop de conditionneurs</h3>
          <p class="text-sm text-amber-600">Le total ne devrait pas dépasser 6% pour éviter l'effet alourdissant</p>
        </div>
      </div>
    </div>

    <!-- Liste des conditionneurs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
          v-for="agent in conditioningAgents"
          :key="agent.id"
          class="border-2 rounded-xl p-4 transition-all duration-200"
          :class="agent.selected ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <input
                type="checkbox"
                v-model="agent.selected"
                class="mt-1 w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
            >
            <div>
              <h4 class="font-medium">{{ agent.name }}</h4>
              <p class="text-xs text-gray-500">{{ agent.inci }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ agent.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium">{{ agent.percent.toFixed(1) }}%</div>
            <div class="text-xs text-gray-500">{{ (agent.percent / 100 * formData.volume).toFixed(0) }}g</div>
          </div>
        </div>

        <!-- Slider de dosage -->
        <div v-if="agent.selected" class="mt-3">
          <input
              type="range"
              v-model.number="agent.percent"
              :min="agent.min"
              :max="agent.max"
              step="0.5"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-pink"
          >
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min: {{ agent.min }}%</span>
            <span>Max: {{ agent.max }}%</span>
          </div>
        </div>

        <!-- Avertissement -->
        <p v-if="agent.selected && agent.warning" class="text-xs text-amber-600 mt-2">
          ⚠️ {{ agent.warning }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  conditioningAgents: {
    type: Array,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  selectedConditioningAgents: {
    type: Array,
    default: () => []
  },
  totalConditioningPercent: {
    type: Number,
    default: 0
  },
  grams: {
    type: Object,
    default: () => ({})
  }
})

const totalConditioningClass = computed(() => {
  if (props.totalConditioningPercent > 6) return 'text-red-600'
  if (props.totalConditioningPercent > 4) return 'text-amber-600'
  return 'text-green-600'
})
</script>