<template>
  <section id="analysis"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">📊</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyse technique</h2>
        <p class="text-gray-600">Répartition des phases et validation réglementaire complète</p>
      </div>
    </div>

    <!-- Vue d'ensemble des phases -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-xl text-gray-900">Répartition des phases</h3>
        <div class="text-sm text-gray-600">
          Total: {{ totalFormulationPercent.toFixed(1) }}%
        </div>
      </div>

      <!-- Graphique circulaire -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Graphique SVG -->
        <div class="lg:col-span-2">
          <div class="relative h-64 lg:h-80">
            <svg width="100%" height="100%" viewBox="0 0 400 400" class="transform -rotate-90">
              <!-- Arrière-plan -->
              <circle cx="200" cy="200" r="150" fill="none" stroke="#f3f4f6" stroke-width="80" />

              <!-- Tranches -->
              <g v-for="(phase, index) in phases" :key="phase.name">
                <circle cx="200" cy="200" r="150" fill="none"
                        :stroke="phase.color"
                        stroke-width="80"
                        :stroke-dasharray="942"
                        :stroke-dashoffset="942 - (getPhaseDashOffset(phase, index))"
                        stroke-linecap="round"
                        class="transition-all duration-1000">
                  <title>{{ phase.name }}: {{ phase.percent }}%</title>
                </circle>
              </g>
            </svg>

            <!-- Texte au centre -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-5xl font-bold text-gray-900">{{ totalFormulationPercent.toFixed(1) }}%</span>
              <span class="text-gray-600">de la formule</span>
              <div class="mt-2 text-sm text-gray-500">
                {{ waterPhase.toFixed(1) }}% d'eau restante
              </div>
            </div>
          </div>
        </div>

        <!-- Légende -->
        <div class="space-y-4">
          <div v-for="phase in phases" :key="phase.name" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg" :style="{ backgroundColor: phase.color }"></div>
            <div class="flex-1">
              <div class="flex justify-between">
                <span class="font-medium text-gray-900">{{ phase.name }}</span>
                <span class="font-bold" :style="{ color: phase.color }">{{ phase.percent }}%</span>
              </div>
              <div class="text-xs text-gray-500">{{ phase.grams }} g</div>
            </div>
          </div>

          <!-- Eau restante -->
          <div class="pt-4 border-t border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200"></div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-900">Eau déminéralisée</span>
                  <span class="font-bold text-blue-600">{{ waterPhase.toFixed(1) }}%</span>
                </div>
                <div class="text-xs text-gray-500">{{ waterPhaseGrams }} g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste INCI -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
          <span>🧾</span>
          Liste INCI (ordre décroissant)
        </h3>
        <div class="flex gap-2">
          <button @click="copyInci"
                  class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span>📋</span>
            Copier INCI
          </button>
        </div>
      </div>

      <div class="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-5 border border-gray-300">
        <div class="relative">
          <pre class="text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto p-4 bg-white/50 rounded-lg border"
               id="inci-list"
               aria-label="Liste INCI des ingrédients">
{{ formatInciList() }}</pre>

          <!-- Indicateur de copie -->
          <div v-if="copied"
               class="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white rounded-lg text-sm animate-fadeOut">
            Copié !
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span>📝</span>
            <span>Conforme à l'Annexe I du Règlement UE 1223/2009</span>
          </div>
          <span>{{ inciList.length }} ingrédients</span>
        </div>
      </div>
    </div>

    <!-- Validation réglementaire -->
    <div class="border-2 border-gray-200 rounded-xl overflow-hidden">
      <!-- En-tête -->
      <div class="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <h3 class="font-bold text-xl text-white flex items-center gap-3">
          <span class="text-green-400">✅</span>
          Validation réglementaire UE 1223/2009
        </h3>
      </div>

      <!-- Contenu -->
      <div class="p-6">
        <!-- Résumé -->
        <div class="mb-6 p-4 rounded-lg"
             :class="regulatoryStatus.isValid
               ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
               : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <span v-if="regulatoryStatus.isValid"
                    class="text-3xl text-green-600">✅</span>
              <span v-else
                    class="text-3xl text-red-600">❌</span>
            </div>
            <div>
              <h4 class="font-bold"
                  :class="regulatoryStatus.isValid ? 'text-green-800' : 'text-red-800'">
                {{ regulatoryStatus.isValid ? 'FORMULE CONFORME' : 'FORMULE NON CONFORME' }}
              </h4>
              <p class="text-sm"
                 :class="regulatoryStatus.isValid ? 'text-green-700' : 'text-red-700'">
                {{ regulatoryStatus.isValid
                  ? 'Tous les critères réglementaires sont respectés.'
                  : `${regulatoryErrors.length} critère(s) non conforme(s).` }}
              </p>
            </div>
          </div>
        </div>

        <!-- Liste des vérifications -->
        <div class="space-y-4">
          <div v-for="check in regulatoryChecks"
               :key="check.name"
               class="flex items-start gap-4 p-4 rounded-lg border transition-all duration-300"
               :class="check.passed
                 ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200'
                 : 'bg-gradient-to-r from-red-50/50 to-orange-50/50 border-red-200'">
            <!-- Icone -->
            <span :class="[
              'flex-shrink-0 mt-1 text-2xl',
              check.passed ? 'text-green-500' : 'text-red-500'
            ]">
              {{ check.passed ? '✓' : '✗' }}
            </span>

            <!-- Contenu -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h5 class="font-bold text-gray-900">{{ check.name }}</h5>
                <span :class="[
                  'px-2 py-1 rounded text-xs font-bold',
                  check.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ check.passed ? 'Conforme' : 'Non conforme' }}
                </span>
              </div>

              <p class="text-sm text-gray-600 mb-2">{{ check.description }}</p>

              <div v-if="!check.passed" class="mt-3 p-3 bg-white rounded border border-red-200">
                <p class="text-sm text-red-700 font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{{ check.error }}</span>
                </p>
                <p v-if="check.recommendation" class="text-sm text-gray-700 mt-2">
                  <span class="font-medium">Recommandation:</span> {{ check.recommendation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rapport de conformité -->
        <div class="mt-8">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div>
              <h4 class="font-bold text-gray-900">Rapport de conformité complet</h4>
              <p class="text-sm text-gray-600">Générez un rapport PDF détaillé pour vos archives</p>
            </div>
            <button @click="generateComplianceReport"
                    class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
              📄 Générer rapport PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  phases: { type: Array, required: true },
  totalFormulationPercent: { type: Number, required: true },
  waterPhase: { type: Number, required: true },
  waterPhaseGrams: { type: Number, required: true },
  getPhaseDashOffset: { type: Function, required: true },
  formatInciList: { type: Function, required: true },
  copyInci: { type: Function, required: true },
  copied: { type: Boolean, required: true },
  inciList: { type: Array, required: true },
  regulatoryStatus: { type: Object, required: true },
  regulatoryErrors: { type: Array, required: true },
  regulatoryChecks: { type: Array, required: true },
  generateComplianceReport: { type: Function, required: true }
})
</script>
