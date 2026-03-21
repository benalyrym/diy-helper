<template>
  <section id="analysis" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
        <span class="text-indigo-600 text-xl">📊</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Analyse & Liste INCI</h2>
    </div>

    <!-- Statut réglementaire -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-50 rounded-xl p-4">
        <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚖️</span> Statut réglementaire
        </h3>
        <div class="flex items-center gap-3 mb-4">
          <div :class="regulatoryStatus?.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
               class="px-4 py-2 rounded-full font-medium">
            {{ regulatoryStatus?.isValid ? '✅ Conforme UE' : '❌ Non conforme' }}
          </div>
          <div class="text-sm text-gray-500">
            Score: {{ regulatoryStatus?.score || 0 }}/100
          </div>
        </div>

        <!-- Liste des erreurs -->
        <div v-if="regulatoryErrors.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-700">Erreurs à corriger:</h4>
          <ul class="text-sm text-red-600 space-y-1">
            <li v-for="(error, index) in regulatoryErrors" :key="index" class="flex items-start gap-2">
              <span>•</span>
              <span>{{ error }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Graphique en camembert -->
      <div class="bg-gray-50 rounded-xl p-4">
        <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>🥧</span> Composition
        </h3>
        <div class="flex items-center justify-center">
          <svg viewBox="0 0 100 100" class="w-48 h-48 transform -rotate-90">
            <circle
                v-for="(phase, index) in phases"
                :key="index"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                :stroke="phase.color"
                stroke-width="15"
                :stroke-dasharray="`${phase.percent * 2.51} 251`"
                :stroke-dashoffset="getPhaseDashOffset(phase, index)"
            />
            <circle cx="50" cy="50" r="32" fill="white" stroke="#e5e7eb" stroke-width="1" />
          </svg>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div v-for="phase in phases" :key="phase.name" class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: phase.color }"></span>
            <span>{{ phase.name }}: {{ phase.percent.toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé des pourcentages -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 rounded-lg p-3 text-center">
        <div class="text-xs text-blue-600">Total tensioactifs</div>
        <div class="text-xl font-bold text-blue-700">{{ totalSurfactants.toFixed(1) }}%</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-3 text-center">
        <div class="text-xs text-purple-600">Total actifs</div>
        <div class="text-xl font-bold text-purple-700">{{ totalActives.toFixed(1) }}%</div>
      </div>
      <div class="bg-pink-50 rounded-lg p-3 text-center">
        <div class="text-xs text-pink-600">Conditionneurs</div>
        <div class="text-xl font-bold text-pink-700">{{ totalConditioning.toFixed(1) }}%</div>
      </div>
      <div class="bg-green-50 rounded-lg p-3 text-center">
        <div class="text-xs text-green-600">Phase aqueuse</div>
        <div class="text-xl font-bold text-green-700">{{ waterPhase.toFixed(1) }}%</div>
      </div>
    </div>

    <!-- Liste INCI -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-700">Liste INCI (ordre décroissant)</h3>
        <div class="flex gap-2">
          <button
              @click="copyINCI"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <span>{{ copied ? '✅' : '📋' }}</span>
            {{ copied ? 'Copié !' : 'Copier INCI' }}
          </button>
          <button
              @click="generateComplianceReport"
              class="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <span>📄</span> Rapport conformité
          </button>
        </div>
      </div>

      <!-- INCI avec CAS -->
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="max-h-96 overflow-y-auto">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-gray-100">
            <tr>
              <th class="text-left p-2">Ingrédient (INCI)</th>
              <th class="text-right p-2">%</th>
              <th class="text-left p-2">N° CAS</th>
              <th class="text-left p-2">Fonction</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in inciWithCas" :key="index" class="border-t border-gray-200">
              <td class="p-2 font-medium">{{ item.name }}</td>
              <td class="p-2 text-right">{{ item.percent.toFixed(2) }}%</td>
              <td class="p-2 text-xs text-gray-500">{{ item.cas }}</td>
              <td class="p-2 text-xs text-gray-500">{{ item.function }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Version texte pour copie -->
      <div class="hidden">
        <pre id="inci-text">{{ formatINCIList() }}</pre>
      </div>

      <!-- Allergènes -->
      <div v-if="allergensList.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h3 class="font-semibold text-yellow-800 mb-2">Allergènes à déclarer</h3>
        <div class="flex flex-wrap gap-2">
          <span
              v-for="allergen in allergensList"
              :key="allergen.name"
              class="bg-white border border-yellow-300 px-3 py-1 rounded-full text-sm"
          >
            {{ allergen.name }} ({{ allergen.concentration }})
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  phases: {
    type: Array,
    default: () => []
  },
  totalFormulationPercent: {
    type: Number,
    default: 0
  },
  waterPhase: {
    type: Number,
    default: 0
  },
  waterPhaseGrams: {
    type: Number,
    default: 0
  },
  getPhaseDashOffset: {
    type: Function,
    default: () => 0
  },
  formatINCIList: {
    type: Function,
    default: () => ''
  },
  copyINCI: {
    type: Function,
    default: async () => {}
  },
  copied: {
    type: Boolean,
    default: false
  },
  inciList: {
    type: Array,
    default: () => []
  },
  inciWithCas: {
    type: Array,
    default: () => []
  },
  regulatoryStatus: {
    type: Object,
    default: () => ({})
  },
  regulatoryErrors: {
    type: Array,
    default: () => []
  },
  regulatoryChecks: {
    type: Array,
    default: () => []
  },
  allergensList: {
    type: Array,
    default: () => []
  },
  generateComplianceReport: {
    type: Function,
    default: () => {}
  }
})

// Pour le résumé (valeurs à passer depuis le parent)
const totalSurfactants = computed(() => {
  return props.phases.find(p => p.name === 'Tensioactifs')?.percent || 0
})

const totalActives = computed(() => {
  return props.phases.find(p => p.name === 'Actifs')?.percent || 0
})

const totalConditioning = computed(() => {
  return props.phases.find(p => p.name === 'Conditionneurs')?.percent || 0
})
</script>