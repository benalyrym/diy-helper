<template>
  <section id="texturizers" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
        <span class="text-amber-600 text-xl">⚗️</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Texturisants</h2>
    </div>

    <!-- Contrôle du pH -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700">
          pH cible
        </label>
        <div class="flex items-center gap-4">
          <input
              type="range"
              v-model.number="targetPhLocal"
              min="3.0"
              max="7.0"
              step="0.1"
              class="flex-1 h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
          >
          <span class="text-2xl font-bold" :class="phColor">{{ targetPhLocal.toFixed(1) }}</span>
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Acide (3.0)</span>
          <span>Optimal (5.5)</span>
          <span>Basique (7.0)</span>
        </div>

        <!-- Alertes pH -->
        <div v-if="phWarningsLocal.length > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
          <ul class="text-xs text-amber-700 space-y-1">
            <li v-for="(warning, index) in phWarningsLocal" :key="index">
              ⚠️ {{ warning }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Viscosité -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700">
          Viscosité souhaitée
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
              v-for="level in ['low', 'medium', 'high']"
              :key="level"
              @click="viscosityTargetLocal = level"
              class="py-2 px-3 border-2 rounded-xl text-sm capitalize transition-all"
              :class="viscosityTargetLocal === level
              ? 'border-amber-500 bg-amber-50 text-amber-700'
              : 'border-gray-200 hover:border-amber-300'"
          >
            {{ level === 'low' ? '💧 Fluide' : level === 'medium' ? '🥣 Crémeux' : '🍦 Épais' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Épaississants -->
    <div class="space-y-4">
      <h3 class="font-semibold text-gray-700">Épaississants</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
            v-for="thickener in thickeners"
            :key="thickener.id"
            class="border-2 rounded-xl p-4 cursor-pointer transition-all duration-200"
            :class="formData.thickener === thickener.name ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'"
            @click="selectThickener(thickener.name)"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <input
                  type="radio"
                  :value="thickener.name"
                  :checked="formData.thickener === thickener.name"
                  class="mt-1 w-5 h-5 text-amber-600 focus:ring-amber-500"
                  @change="selectThickener(thickener.name)"
              >
              <div>
                <h4 class="font-medium">{{ thickener.name }}</h4>
                <p class="text-xs text-gray-500">{{ thickener.inci }}</p>
                <div class="flex gap-2 mt-1">
                  <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Viscosité: {{ thickener.viscosity }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">{{ formData.thickenerPercent.toFixed(1) }}%</div>
              <div class="text-xs text-gray-500">{{ ((formData.thickenerPercent || 0) / 100 * (formData.volume || 0)).toFixed(0) }}g</div>
            </div>
          </div>

          <!-- Slider de dosage -->
          <div v-if="formData.thickener === thickener.name" class="mt-3">
            <input
                type="range"
                v-model.number="formData.thickenerPercent"
                :min="thickener.min"
                :max="thickener.max"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-amber"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {{ thickener.min }}%</span>
              <span>Max: {{ thickener.max }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ajusteurs de pH -->
    <div class="space-y-4">
      <h3 class="font-semibold text-gray-700">Ajusteurs de pH</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
            v-for="adjuster in phAdjusters"
            :key="adjuster.id"
            class="border-2 rounded-xl p-4 cursor-pointer transition-all duration-200"
            :class="formData.phAdjuster === adjuster.name ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'"
            @click="selectPhAdjuster(adjuster.name)"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <input
                  type="radio"
                  :value="adjuster.name"
                  :checked="formData.phAdjuster === adjuster.name"
                  class="mt-1 w-5 h-5 text-amber-600 focus:ring-amber-500"
                  @change="selectPhAdjuster(adjuster.name)"
              >
              <div>
                <h4 class="font-medium">{{ adjuster.name }}</h4>
                <p class="text-xs text-gray-500">{{ adjuster.inci }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ adjuster.function }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium">{{ (formData.phAdjusterPercent || 0).toFixed(2) }}%</div>
              <div class="text-xs text-gray-500">{{ ((formData.phAdjusterPercent || 0) / 100 * (formData.volume || 0)).toFixed(1) }}g</div>
            </div>
          </div>

          <!-- Slider de dosage -->
          <div v-if="formData.phAdjuster === adjuster.name" class="mt-3">
            <input
                type="range"
                v-model.number="formData.phAdjusterPercent"
                :min="adjuster.min"
                :max="adjuster.max"
                step="0.01"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-amber"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {{ adjuster.min }}%</span>
              <span>Max: {{ adjuster.max }}%</span>
            </div>
          </div>

          <!-- Avertissement -->
          <p v-if="adjuster.warning && formData.phAdjuster === adjuster.name" class="text-xs text-red-600 mt-2">
            ⚠️ {{ adjuster.warning }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  thickeners: {
    type: Array,
    required: true
  },
  phAdjusters: {
    type: Array,
    required: true
  },
  targetPh: {
    type: Number,
    default: 5.5
  },
  phWarnings: {
    type: Array,
    default: () => []
  },
  viscosityTarget: {
    type: String,
    default: 'medium'
  }
})

const emit = defineEmits(['update:targetPh', 'update:viscosityTarget'])

// Variables locales pour éviter les problèmes de réactivité directe
const targetPhLocal = computed({
  get: () => props.targetPh,
  set: (value) => emit('update:targetPh', value)
})

const viscosityTargetLocal = computed({
  get: () => props.viscosityTarget,
  set: (value) => emit('update:viscosityTarget', value)
})

// Copie locale des warnings pour éviter les problèmes de props
const phWarningsLocal = computed(() => props.phWarnings || [])

const phColor = computed(() => {
  const ph = targetPhLocal.value
  if (ph < 4.0) return 'text-red-600'
  if (ph > 6.0) return 'text-red-600'
  if (ph >= 4.5 && ph <= 5.5) return 'text-green-600'
  return 'text-amber-600'
})

// Méthodes de sélection
const selectThickener = (name) => {
  props.formData.thickener = name
}

const selectPhAdjuster = (name) => {
  props.formData.phAdjuster = name
}
</script>