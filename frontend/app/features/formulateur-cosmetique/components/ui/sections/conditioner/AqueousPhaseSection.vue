<template>
  <section id="aqueous-phase"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">💧</span>
      </div>
      <div class="flex-1">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Phase aqueuse</h2>
            <p class="text-gray-600">Infusions et hydrolats - Base de votre après-shampoing</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
              <span class="text-sm font-semibold text-blue-700">
                Total: {{ aqueousPhaseTotal.toFixed(1) }}%
              </span>
            </div>
            <button @click="autoCalculateWaterPhase"
                    type="button"
                    class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Auto-calcul
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sélection des infusions -->
    <div class="space-y-6">
      <div v-for="(category, catName) in aqueousPhaseOptions"
           :key="catName"
           :class="[
             'border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-md',
             selectedAqueousPhase.some(item => category.items.some(i => i.name === item.name))
               ? 'border-blue-300 bg-blue-50/50'
               : 'border-gray-200 hover:border-blue-200'
           ]">
        <!-- En-tête de catégorie -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
            <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              {{ category.icon }}
            </span>
            {{ catName }}
            <span class="text-sm font-normal text-gray-500">
              ({{ category.items.filter(i => i.selected).length }}/{{ category.items.length }})
            </span>
          </h3>
          <button @click="toggleCategory(category, 'aqueous')"
                  type="button"
                  class="text-sm text-blue-600 hover:text-blue-800">
            {{ selectedAqueousPhase.some(item => category.items.some(i => i.name === item.name)) ? 'Tout désélectionner' : 'Tout sélectionner' }}
          </button>
        </div>

        <!-- Grille d'infusions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="infusion in category.items"
               :key="infusion.name"
               :class="[
                 'rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-1',
                 infusion.selected
                   ? 'bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 shadow-md'
                   : 'bg-white border border-gray-200 hover:border-blue-200'
               ]">
            <div class="flex items-start gap-3">
              <!-- Checkbox -->
              <div class="flex items-center h-6 pt-1">
                <input :id="`aq-${infusion.name}`"
                       type="checkbox"
                       v-model="infusion.selected"
                       class="h-5 w-5 rounded border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              </div>

              <!-- Contenu -->
              <div class="flex-1">
                <!-- En-tête -->
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <label :for="`aq-${infusion.name}`"
                           class="font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                      {{ infusion.name }}
                    </label>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ infusion.description }}
                    </p>
                  </div>

                  <!-- Indicateur de dosage -->
                  <div v-if="infusion.selected"
                       class="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    {{ infusion.percent }}%
                  </div>
                </div>

                <!-- Dosage -->
                <div v-if="infusion.selected" class="mt-4 space-y-3">
                  <div>
                    <label :for="`aq-percent-${infusion.name}`"
                           class="block text-xs font-medium text-gray-700 mb-1">
                      Dosage (%)
                    </label>
                    <div class="flex items-center gap-2">
                      <div class="relative flex-1">
                        <input :id="`aq-percent-${infusion.name}`"
                               type="number"
                               v-model.number="infusion.percent"
                               :min="infusion.min"
                               :max="infusion.max"
                               step="0.1"
                               class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          %
                        </span>
                      </div>
                      <span class="text-xs text-gray-500 min-w-16 text-right">
                        {{ grams(infusion.percent) }} g
                      </span>
                    </div>
                  </div>

                  <!-- Slider pour dosage -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-500">Min: {{ infusion.min }}%</span>
                      <span class="text-blue-600 font-medium">Recommandé</span>
                      <span class="text-gray-500">Max: {{ infusion.max }}%</span>
                    </div>
                    <input type="range"
                           v-model.number="infusion.percent"
                           :min="infusion.min"
                           :max="infusion.max"
                           step="0.1"
                           class="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg">
                  </div>
                </div>

                <!-- Propriétés -->
                <div class="mt-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="prop in infusion.properties"
                          :key="prop"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200">
                      {{ prop }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé phase aqueuse -->
    <div v-if="selectedAqueousPhase.length > 0"
         class="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-300">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
          <span class="text-blue-600">📊</span>
          Répartition phase aqueuse
        </h3>
        <button @click="optimizeAqueousPhase"
                type="button"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Optimiser
        </button>
      </div>

      <!-- Graphique circulaire -->
      <div class="flex flex-col lg:flex-row gap-8 items-center">
        <div class="lg:w-1/3 relative">
          <div class="w-48 h-48 mx-auto relative">
            <!-- SVG pour graphique circulaire -->
            <svg width="100%" height="100%" viewBox="0 0 100 100" class="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="20" />
              <circle cx="50" cy="50" r="40" fill="none"
                      stroke="url(#gradient-blue)"
                      stroke-width="20"
                      stroke-dasharray="251.2"
                      :stroke-dashoffset="251.2 - (aqueousPhaseTotal * 2.512)"
                      stroke-linecap="round"
                      class="transition-all duration-1000">
                <animate v-if="!reducedMotion"
                         attributeName="stroke-dashoffset"
                         :from="251.2"
                         :to="251.2 - (aqueousPhaseTotal * 2.512)"
                         dur="1s"
                         fill="freeze" />
              </circle>
              <defs>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3b82f6" />
                  <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
              <span class="text-4xl font-bold text-gray-900">{{ aqueousPhaseTotal.toFixed(1) }}%</span>
              <span class="text-sm text-gray-600">du total</span>
            </div>
          </div>
        </div>

        <!-- Liste détaillée -->
        <div class="lg:w-2/3 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in selectedAqueousPhase.slice(0, 4)"
                 :key="item.name"
                 class="bg-white/80 rounded-lg p-3 border border-blue-200">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-900">{{ item.name }}</span>
                <span class="font-bold text-blue-700">{{ item.percent }}%</span>
              </div>
              <div class="text-xs text-gray-500 mt-1 flex justify-between">
                <span>{{ grams(item.percent) }} g</span>
                <span class="text-blue-600">{{ ((item.percent / aqueousPhaseTotal) * 100).toFixed(0) }}% de la phase</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-blue-200">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-900">Total phase aqueuse:</span>
              <div class="text-right">
                <span class="text-xl font-bold text-blue-700">{{ aqueousPhaseTotal.toFixed(1) }}%</span>
                <span class="block text-sm text-gray-500">{{ grams(aqueousPhaseTotal) }} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  aqueousPhaseOptions: { type: Object, required: true },
  selectedAqueousPhase: { type: Array, required: true },
  aqueousPhaseTotal: { type: Number, required: true },
  grams: { type: Function, required: true },
  autoCalculateWaterPhase: { type: Function, required: true },
  optimizeAqueousPhase: { type: Function, required: true },
  toggleCategory: { type: Function, required: true },
  reducedMotion: { type: Boolean, required: true }
})
</script>


