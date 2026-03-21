<template>
  <section id="preservatives" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
        <span class="text-red-600 text-xl">🛡️</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Système de conservation</h2>
    </div>

    <!-- Alertes conservation -->
    <div v-if="preservativeWarnings.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="text-red-600 text-xl">⚠️</span>
        <div>
          <h3 class="font-semibold text-red-800">Alertes conservation</h3>
          <ul class="text-sm text-red-700 space-y-1 mt-1">
            <li v-for="(warning, index) in preservativeWarnings" :key="index">
              • {{ warning }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Sélection du conservateur -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
          v-for="system in preservativeSystems"
          :key="system.id"
          class="border-2 rounded-xl p-4 cursor-pointer transition-all duration-200"
          :class="formData.preservativeSystem === system.id
          ? 'border-red-500 bg-red-50 shadow-md'
          : 'border-gray-200 hover:border-red-300'"
          @click="selectPreservative(system.id)"
      >
        <div class="flex items-start gap-3">
          <input
              type="radio"
              :value="system.id"
              v-model="formData.preservativeSystem"
              class="mt-1 w-5 h-5 text-red-600 focus:ring-red-500"
          >
          <div class="flex-1">
            <h4 class="font-medium">{{ system.name }}</h4>
            <p class="text-xs text-gray-500">{{ system.inci }}</p>

            <!-- Informations -->
            <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <span class="text-gray-500">Dosage:</span>
                <span class="font-medium ml-1">{{ system.min }}-{{ system.max }}%</span>
              </div>
              <div>
                <span class="text-gray-500">pH optimal:</span>
                <span class="font-medium ml-1">{{ system.ph_range?.join('-') || '3-6' }}</span>
              </div>
            </div>

            <!-- Notes -->
            <p class="text-xs text-gray-600 mt-2">{{ system.notes }}</p>

            <!-- Allergènes -->
            <div v-if="system.allergens" class="flex flex-wrap gap-1 mt-2">
              <span v-for="allergen in system.allergens" :key="allergen" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                ⚠️ {{ allergen }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dosage spécifique pour Cosgard -->
        <div v-if="formData.preservativeSystem === 'cosgard' && system.id === 'cosgard'" class="mt-4 pt-4 border-t border-red-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Concentration Cosgard (%)
          </label>
          <div class="flex items-center gap-4">
            <input
                type="range"
                v-model.number="formData.cosgardPercent"
                min="0.5"
                max="1.0"
                step="0.1"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-red"
            >
            <span class="text-lg font-bold text-red-600">{{ formData.cosgardPercent.toFixed(1) }}%</span>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min: 0.5%</span>
            <span>Max: 1.0%</span>
          </div>
        </div>

        <!-- Vérification compatibilité -->
        <div v-if="formData.preservativeSystem === system.id" class="mt-3">
          <div class="bg-white rounded-lg p-2 text-sm">
            <div class="flex items-center gap-2">
              <span :class="compatibilityIcon.color">{{ compatibilityIcon.icon }}</span>
              <span :class="compatibilityIcon.text">{{ compatibilityMessage }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommandations -->
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <h3 class="font-semibold text-blue-800 mb-2 flex items-center gap-2">
        <span>💡</span> Recommandations
      </h3>
      <ul class="text-sm text-blue-700 space-y-1">
        <li>• Choisissez un conservateur adapté au pH de votre formule (actuellement {{ targetPh.toFixed(1) }})</li>
        <li>• Respectez toujours les doses minimales et maximales</li>
        <li>• Pour les produits rincés, les conservateurs sont OBLIGATOIRES</li>
        <li>• Vérifiez la déclaration des allergènes sur l'étiquetage</li>
      </ul>
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
  preservativeSystems: {
    type: Array,
    required: true
  },
  preservativeWarnings: {
    type: Array,
    default: () => []
  },
  checkPreservativeCompatibility: {
    type: Function,
    default: () => ({ compatible: true, issues: [] })
  }
})

const targetPh = computed(() => 5.5) // À remplacer par la valeur réelle

const selectPreservative = (id) => {
  props.formData.preservativeSystem = id
}

const compatibilityIcon = computed(() => {
  if (!props.formData.preservativeSystem) return { icon: '❓', color: 'text-gray-500', text: 'text-gray-700' }

  const system = props.preservativeSystems.find(s => s.id === props.formData.preservativeSystem)
  if (!system) return { icon: '❓', color: 'text-gray-500', text: 'text-gray-700' }

  if (system.ph_range) {
    const [min, max] = system.ph_range
    if (targetPh.value >= min && targetPh.value <= max) {
      return { icon: '✅', color: 'text-green-600', text: 'text-green-700' }
    } else {
      return { icon: '⚠️', color: 'text-red-600', text: 'text-red-700' }
    }
  }

  return { icon: 'ℹ️', color: 'text-blue-600', text: 'text-blue-700' }
})

const compatibilityMessage = computed(() => {
  if (!props.formData.preservativeSystem) return 'Sélectionnez un conservateur'

  const system = props.preservativeSystems.find(s => s.id === props.formData.preservativeSystem)
  if (!system) return 'Conservateur inconnu'

  if (system.ph_range) {
    const [min, max] = system.ph_range
    if (targetPh.value >= min && targetPh.value <= max) {
      return `Compatible avec le pH (${targetPh.value})`
    } else {
      return `Incompatible avec le pH (optimal ${min}-${max})`
    }
  }

  return 'Vérifiez la compatibilité'
})
</script>