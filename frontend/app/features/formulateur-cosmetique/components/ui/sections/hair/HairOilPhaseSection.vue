<template>
  <section
      id="hair-oil-phase"
      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn"
  >
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-purple-200 to-fuchsia-200 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">🧴</span>
      </div>

      <div class="flex-1">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Phase lipidique</h2>
            <p class="text-gray-600">Huiles, beurres, cires - Nutrition, anti-frisottis et toucher</p>
          </div>

          <div class="flex items-center gap-3">
            <div
                :class="[
                'px-4 py-2 rounded-full border font-semibold',
                oilPhaseExceeded
                  ? 'bg-gradient-to-r from-red-100 to-orange-100 border-red-300 text-red-700'
                  : 'bg-gradient-to-r from-purple-100 to-fuchsia-100 border-purple-300 text-purple-700'
              ]"
            >
              <span class="text-sm">
                Total: {{ oilPhaseTotal.toFixed(1) }}% / {{ hairProfiles[formData.hairType]?.oil || 12 }}%
              </span>
            </div>

            <button
                @click="$emit('auto-calculate')"
                type="button"
                class="px-4 py-2 text-sm bg-purple-950 text-purple-100 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Auto-calcul
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Catégories -->
    <div class="space-y-6">
      <div
          v-for="(category, catName) in oilPhaseOptions"
          :key="catName"
          :class="[
          'border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-md',
          selectedOilPhase.some(item => category.items.some(i => i.name === item.name))
            ? 'border-purple-300 bg-purple-50/50'
            : 'border-gray-200 hover:border-purple-200'
        ]"
      >
        <!-- En-tête catégorie -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
            <span class="p-2 bg-gradient-to-br from-purple-100 to-fuchsia-200 rounded-lg text-white">
              {{ category.icon }}
            </span>
            {{ catName }}
            <span class="text-sm font-normal text-gray-500">
              ({{ category.items.filter(i => i.selected).length }}/{{ category.items.length }})
            </span>
          </h3>

          <button
              @click="$emit('toggle-category', category, 'oil')"
              type="button"
              class="text-sm text-purple-600 hover:text-purple-800"
              :disabled="oilPhaseExceeded && !selectedOilPhase.some(item => category.items.some(i => i.name === item.name))"
          >
            {{
              selectedOilPhase.some(item => category.items.some(i => i.name === item.name))
                  ? 'Tout désélectionner'
                  : 'Tout sélectionner'
            }}
          </button>
        </div>

        <!-- Grille -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
              v-for="oil in category.items"
              :key="oil.name"
              :class="[
              'rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-1',
              oil.selected
                ? 'bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 shadow-md'
                : 'bg-white border border-gray-200 hover:border-purple-200',
              !oil.selected && oilPhaseExceeded ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <div class="flex items-start gap-3">
              <!-- Checkbox -->
              <div class="flex items-center h-6 pt-1">
                <input
                    :id="`hair-oil-${oil.name}`"
                    type="checkbox"
                    v-model="oil.selected"
                    :disabled="!oil.selected && oilPhaseExceeded"
                    class="h-5 w-5 rounded border-2 border-gray-300 checked:border-purple-600 checked:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                    @change="$emit('update-oil-phase', catName, oil.name, { selected: oil.selected })"
                />
              </div>

              <!-- Contenu -->
              <div class="flex-1">
                <!-- En-tête + indicateur (lourd/léger) -->
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <label
                        :for="`hair-oil-${oil.name}`"
                        :class="[
                        'font-bold cursor-pointer',
                        oil.selected ? 'text-gray-900 hover:text-purple-600' : 'text-gray-700'
                      ]"
                    >
                      {{ oil.name }}
                    </label>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ oil.description }}
                    </p>
                  </div>

                  <!-- Indicateur "poids" sur cheveux -->
                  <div
                      :class="[
                      'px-2 py-1 rounded-full text-xs font-bold',
                      oil.weight <= 1 ? 'bg-green-100 text-green-800' :
                      oil.weight <= 2 ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    ]"
                      :title="`Indice d'alourdissement (poids): ${oil.weight}/5 (1=très léger, 5=très lourd)`"
                  >
                    POIDS: {{ oil.weight }}
                  </div>
                </div>

                <!-- Dosage -->
                <div v-if="oil.selected" class="mt-4 space-y-3">
                  <div>
                    <label
                        :for="`hair-oil-percent-${oil.name}`"
                        class="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Dosage (%)
                    </label>

                    <div class="flex items-center gap-2">
                      <div class="relative flex-1">
                        <input
                            :id="`hair-oil-percent-${oil.name}`"
                            type="number"
                            v-model.number="oil.percent"
                            :min="oil.min"
                            :max="Math.min(oil.max, getRemainingOilPercent() + oil.percent)"
                            step="0.1"
                            :class="[
                            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-1',
                            oil.percent > getRemainingOilPercent() + oil.percent
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-purple-300 focus:ring-purple-500 focus:border-purple-500'
                          ]"
                            @change="$emit('update-oil-phase', catName, oil.name, { percent: oil.percent })"
                        />
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          %
                        </span>
                      </div>

                      <span class="text-xs text-gray-500 min-w-16 text-right">
                        {{ grams(oil.percent) }} g
                      </span>
                    </div>
                  </div>

                  <!-- Slider -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-500">Min: {{ oil.min }}%</span>
                      <span class="text-purple-600 font-medium">Recommandé</span>
                      <span class="text-gray-500">Max: {{ oil.max }}%</span>
                    </div>

                    <input
                        type="range"
                        v-model.number="oil.percent"
                        :min="oil.min"
                        :max="Math.min(oil.max, getRemainingOilPercent() + oil.percent)"
                        step="0.1"
                        class="w-full h-2 bg-gradient-to-r from-purple-200 to-fuchsia-400 rounded-lg appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600
                             [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                        @change="$emit('update-oil-phase', catName, oil.name, { percent: oil.percent })"
                    />
                  </div>
                </div>

                <!-- Propriétés -->
                <div class="mt-3">
                  <div class="flex flex-wrap gap-1">
                    <span
                        v-for="prop in (oil.properties ?? []).slice(0, 3)"
                        :key="prop"
                        :class="getOilPropertyClass(prop)"
                    >
                      {{ prop }}
                    </span>

                    <span
                        v-if="(oil.properties ?? []).length > 3"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                    >
                      +{{ (oil.properties ?? []).length - 3 }}
                    </span>
                  </div>
                </div>


                <!-- Spécificités -->
                <div v-if="(oil.specifics ?? []).length" class="mt-2">
                  <div class="flex flex-wrap gap-1">
                    <span
                        v-for="spec in (oil.specifics ?? [])"
                        :key="spec"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {{ spec }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé -->
    <div
        v-if="selectedOilPhase.length > 0"
        class="mt-8 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-6 border border-purple-300"
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
          <span class="text-purple-600">📊</span>
          Répartition phase lipidique
        </h3>

        <div class="flex items-center gap-3">
          <div
              :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              oilPhaseExceeded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            ]"
          >
            {{ oilPhaseExceeded ? '⚠️ Dépassement' : '✅ Dans la limite' }}
          </div>

          <button
              @click="$emit('optimize')"
              type="button"
              class="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Optimiser
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Jauge + liste -->
        <div class="lg:w-1/3">
          <div class="relative">
            <div class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden mb-2">
              <div
                  class="h-full rounded-full transition-all duration-1000"
                  :class="oilPhaseExceeded ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'"
                  :style="{ width: `${Math.min(oilPhaseTotal, 100)}%` }"
              />
            </div>

            <div class="flex justify-between text-sm mb-6">
              <span class="text-gray-600">0%</span>
              <span class="font-bold" :class="oilPhaseExceeded ? 'text-red-600' : 'text-purple-600'">
                {{ oilPhaseTotal.toFixed(1) }}%
              </span>
              <span class="text-gray-600">{{ hairProfiles[formData.hairType]?.oil || 12 }}% (max)</span>
            </div>

            <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
              <div
                  v-for="item in selectedOilPhase"
                  :key="item.name"
                  class="bg-white/80 rounded-lg p-3 border border-purple-200"
              >
                <div class="flex justify-between items-center mb-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900 truncate">{{ item.name }}</span>
                    <span
                        :class="[
                        'text-xs px-1.5 py-0.5 rounded',
                        item.weight <= 1 ? 'bg-green-100 text-green-800' :
                        item.weight <= 2 ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      ]"
                    >
                      POIDS {{ item.weight }}
                    </span>
                  </div>
                  <span class="font-bold text-purple-700">{{ item.percent }}%</span>
                </div>

                <div class="text-xs text-gray-500 flex justify-between">
                  <span>{{ grams(item.percent) }} g</span>
                  <span class="text-purple-600">
                    {{ ((item.percent / oilPhaseTotal) * 100).toFixed(0) }}% de la phase
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats + reco -->
        <div class="lg:w-2/3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Distribution poids -->
            <div class="bg-white rounded-xl p-4 border border-purple-200">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📈</span>
                Répartition POIDS
              </h4>

              <div class="space-y-3">
                <div v-for="lvl in weightDistribution" :key="lvl.level" class="space-y-1">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-700">POIDS {{ lvl.level }}</span>
                    <span class="font-medium">{{ lvl.percent }}%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="lvl.colorClass"
                        :style="{ width: `${lvl.percent}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Recos -->
            <div class="bg-white rounded-xl p-4 border border-purple-200">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                Recommandations
              </h4>

              <div class="space-y-2">
                <p class="text-sm text-gray-600">
                  Pour des cheveux <span class="font-bold capitalize">{{ formData.hairType }}</span>,
                  limitez la phase lipidique à
                  <span class="font-bold text-purple-700">{{ hairProfiles[formData.hairType]?.oil || 12 }}%</span>.
                </p>

                <ul class="text-sm text-gray-600 space-y-1">
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>Cheveux fins/gras: privilégiez POIDS 0–1 et peu d’huiles</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-purple-500 mt-1">✓</span>
                    <span>Cheveux secs/bouclés: POIDS 1–2 ok, ajoutez des beurres avec modération</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-amber-500 mt-1">✓</span>
                    <span>Évitez les mélanges trop complexes (2–3 lipides max)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Warning -->
          <div
              v-if="oilPhaseExceeded"
              class="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-300"
          >
            <div class="flex items-start gap-3">
              <span class="text-red-600 text-xl mt-1">⚠️</span>
              <div>
                <h4 class="font-bold text-red-800 mb-1">Dépassement détecté</h4>
                <p class="text-sm text-red-700">
                  La phase lipidique dépasse de
                  <span class="font-bold">
                    {{ (oilPhaseTotal - (hairProfiles[formData.hairType]?.oil || 12)).toFixed(1) }}%
                  </span>
                  la limite recommandée pour des cheveux {{ formData.hairType }}.
                  Risque: alourdissement, manque de volume, aspect gras.
                </p>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-6 pt-6 border-t border-purple-200">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-bold text-gray-900">Total phase lipidique</span>
                <p class="text-sm text-gray-500">
                  Recommandé: {{ hairProfiles[formData.hairType]?.oil || 12 }}% max
                </p>
              </div>

              <div class="text-right">
                <span :class="['text-2xl font-bold', oilPhaseExceeded ? 'text-red-600' : 'text-purple-700']">
                  {{ oilPhaseTotal.toFixed(1) }}%
                </span>
                <span class="block text-sm text-gray-500">{{ grams(oilPhaseTotal) }} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  oilPhaseOptions: { type: Object, required: true },
  selectedOilPhase: { type: Array, required: true },
  oilPhaseTotal: { type: Number, required: true },
  formData: { type: Object, required: true }, // doit contenir hairType
  hairProfiles: { type: Object, required: true }, // profils cheveux avec .oil (max)
  oilPhaseExceeded: { type: Boolean, required: true },
  weightDistribution: { type: Array, required: true } // [{level, percent, colorClass}]
})

const emit = defineEmits(['update-oil-phase', 'toggle-category', 'auto-calculate', 'optimize'])

// Pour l'exemple - idéalement vient du parent (formData.volume)
const volume = computed(() => props.formData?.volume || 200)

const grams = (percent) => Number(((volume.value * percent) / 100).toFixed(2))

const getRemainingOilPercent = () => {
  const max = props.hairProfiles[props.formData.hairType]?.oil || 12
  return Math.max(0, max - props.oilPhaseTotal)
}

const getOilPropertyClass = (property) => {
  const classes = {
    'Léger': 'bg-green-100 text-green-800 border border-green-200',
    'Anti-frisottis': 'bg-purple-100 text-purple-800 border border-purple-200',
    'Brillance': 'bg-amber-100 text-amber-800 border border-amber-200',
    'Fortifiant': 'bg-blue-100 text-blue-800 border border-blue-200',
    'Protecteur': 'bg-gray-100 text-gray-800 border border-gray-200',
    'Réparateur': 'bg-red-100 text-red-800 border border-red-200',
    'Nourrissant': 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200',
    default: 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  for (const [key, className] of Object.entries(classes)) {
    if (property.toLowerCase().includes(key.toLowerCase())) return className
  }
  return classes.default
}
</script>


