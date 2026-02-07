<template>
  <section
      id="fragrances"
      class="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      aria-labelledby="fragrances-title"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg">
          <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 id="fragrances-title" class="text-2xl font-bold text-gray-900">
          Parfums et fragrances
        </h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium" :class="[
          fragranceTotal > 1 ? 'text-red-600 bg-red-50' : 'text-pink-600 bg-pink-50'
        ]">
          Total : {{ fragranceTotal.toFixed(1) }}%
        </div>
        <div v-if="fragranceTotal > 1" class="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Limite dépassée !
        </div>
      </div>
    </div>

    <!-- Introduction et avertissement -->
    <div class="mb-6 space-y-4">
      <div class="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm text-gray-700">
              <strong>Important :</strong> La limite réglementaire pour les parfums dans les cosmétiques est de 1%.
              Certaines fragrances peuvent contenir des allergènes qui doivent être déclarés sur l'étiquette.
            </p>
          </div>
        </div>
      </div>

      <!-- Avertissement si limite dépassée -->
      <div v-if="fragranceTotal > 1" class="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-300">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-bold text-red-800">Limite réglementaire dépassée !</p>
            <p class="text-sm text-red-700 mt-1">
              Le total des fragrances ({{ fragranceTotal.toFixed(1) }}%) dépasse la limite de 1% imposée par le règlement cosmétique.
              Réduisez les pourcentages ou retirez certaines fragrances.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des fragrances -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="fragrance in fragranceOptions"
          :key="fragrance.id"
          :class="[
          'fragrance-card p-4',
          isFragranceSelected(fragrance.id) ? 'fragrance-card-selected' : 'fragrance-card-default'
        ]"
          role="checkbox"
          :aria-checked="isFragranceSelected(fragrance.id)"
          tabindex="0"
          @click="toggleFragrance(fragrance)"
          @keydown.enter="toggleFragrance(fragrance)"
          @keydown.space.prevent="toggleFragrance(fragrance)"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="font-bold text-gray-900 mb-1">
              {{ fragrance.name }}
            </div>
            <div class="flex items-center gap-2 mb-2">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getCategoryClass(fragrance.category)
              ]">
                {{ getCategoryLabel(fragrance.category) }}
              </span>
              <span v-if="fragrance.allergen" class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Allergène
              </span>
              <span v-else class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Sans allergène
              </span>
            </div>
          </div>
          <div class="text-right">
            <div v-if="isFragranceSelected(fragrance.id)" class="text-lg font-bold text-pink-700">
              {{ getSelectedPercent(fragrance.id).toFixed(1) }}%
            </div>
            <div class="text-xs text-gray-500">0.1-0.5%</div>
          </div>
        </div>

        <!-- Contrôles pour fragrance sélectionnée -->
        <div v-if="isFragranceSelected(fragrance.id)" class="space-y-3">
          <!-- Contrôle de pourcentage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">
                Concentration :
              </label>
              <div class="flex items-center gap-2">
                <button
                    @click.stop="adjustFragrancePercent(fragrance.id, -0.05)"
                    :disabled="getSelectedPercent(fragrance.id) <= 0.05"
                    class="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    type="button"
                    aria-label="Diminuer la concentration"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="text-sm font-bold text-pink-700 min-w-[50px] text-center">
                  {{ getSelectedPercent(fragrance.id).toFixed(2) }}%
                </span>
                <button
                    @click.stop="adjustFragrancePercent(fragrance.id, 0.05)"
                    :disabled="getSelectedPercent(fragrance.id) >= 0.5"
                    class="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    type="button"
                    aria-label="Augmenter la concentration"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <input
                type="range"
                :value="getSelectedPercent(fragrance.id)"
                @input="updateFragrancePercent(fragrance.id, $event.target.value)"
                min="0.05"
                max="0.5"
                step="0.01"
                class="w-full h-2 bg-gradient-to-r from-pink-100 to-pink-300 rounded-lg appearance-none cursor-pointer"
                aria-label="Concentration de la fragrance"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.05%</span>
              <span>0.5%</span>
            </div>
          </div>

          <!-- Description -->
          <div class="pt-3 border-t border-gray-200">
            <div class="text-sm text-gray-600">
              <p>{{ getFragranceDescription(fragrance) }}</p>
              <p v-if="fragrance.allergen" class="mt-1 text-red-600 text-xs">
                <strong>Note :</strong> Contient des allergènes qui doivent être déclarés sur l'étiquette INCI
              </p>
            </div>
          </div>
        </div>

        <!-- Description pour fragrance non sélectionnée -->
        <div v-else class="pt-3 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            <p>{{ getFragranceDescription(fragrance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques et recommandations -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Statistiques -->
      <div class="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
        <h3 class="font-bold text-gray-900 mb-3">Statistiques des fragrances</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Fragrances sélectionnées :</span>
            <span class="font-medium text-gray-900">{{ formData.selectedFragrances.length }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Pourcentage total :</span>
            <span :class="[
              'font-medium',
              fragranceTotal > 1 ? 'text-red-700' : 'text-pink-700'
            ]">
              {{ fragranceTotal.toFixed(2) }}%
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Moyenne par fragrance :</span>
            <span class="font-medium text-gray-900">
              {{ formData.selectedFragrances.length > 0 ? (fragranceTotal / formData.selectedFragrances.length).toFixed(2) : '0' }}%
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Catégorie principale :</span>
            <span :class="[
              'font-medium rounded-full px-2 py-1 text-xs',
              getDominantCategoryClass()
            ]">
              {{ getDominantCategoryLabel() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recommandations et avertissements -->
      <div class="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
        <h3 class="font-bold text-gray-900 mb-3">Recommandations et avertissements</h3>
        <div class="space-y-2 text-sm">
          <div v-for="warning in fragranceWarnings" :key="warning.type" class="flex items-start gap-2">
            <svg
                :class="[
                'w-4 h-4 mt-0.5 flex-shrink-0',
                warning.type === 'error' ? 'text-red-500' : 'text-amber-500'
              ]"
                fill="currentColor" viewBox="0 0 20 20"
            >
              <path v-if="warning.type === 'error'" fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
              <path v-if="warning.type === 'warning'" fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
            </svg>
            <span :class="warning.type === 'error' ? 'text-red-700' : 'text-amber-700'">
              {{ warning.message }}
            </span>
          </div>

          <div class="pt-2 border-t border-pink-200 mt-2">
            <p class="text-gray-700">
              <strong>Conseils :</strong>
            </p>
            <ul class="text-gray-600 space-y-1 mt-1">
              <li>• Pour un conditionneur doux : 0.1-0.3% total</li>
              <li>• Pour une fragrance marquée : 0.3-0.8% total</li>
              <li>• Les fragrances gourmandes sont populaires pour les soins capillaires</li>
              <li>• Testez toujours la fragrance dans la formule finale</li>
              <li>• Tenez compte des préférences de votre public cible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex flex-wrap gap-2">
      <button
          @click="clearAllFragrances"
          :disabled="formData.selectedFragrances.length === 0"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
      >
        Tout effacer
      </button>
      <button
          @click="optimizeFragrances"
          class="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-lg hover:bg-pink-200"
          type="button"
      >
        Optimiser les concentrations
      </button>
      <button
          @click="applyStandardConcentrations"
          class="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
          type="button"
      >
        Appliquer concentrations standard
      </button>
    </div>
  </section>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  fragranceOptions: {
    type: Array,
    required: true
  },
  fragranceTotal: {
    type: Number,
    required: true
  },
  fragranceWarnings: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:formData', 'toggle-fragrance'])

const isFragranceSelected = (fragranceId) => {
  return props.formData.selectedFragrances.some(f => f.id === fragranceId)
}

const getSelectedPercent = (fragranceId) => {
  const selected = props.formData.selectedFragrances.find(f => f.id === fragranceId)
  return selected ? selected.percent : 0
}

const toggleFragrance = (fragrance) => {
  emit('toggle-fragrance', fragrance)
}

const updateFragrancePercent = (fragranceId, percent) => {
  const newFragrances = [...props.formData.selectedFragrances]
  const index = newFragrances.findIndex(f => f.id === fragranceId)

  if (index !== -1) {
    newFragrances[index] = {
      ...newFragrances[index],
      percent: parseFloat(percent)
    }

    emit('update:formData', { selectedFragrances: newFragrances })
  }
}

const adjustFragrancePercent = (fragranceId, adjustment) => {
  const newFragrances = [...props.formData.selectedFragrances]
  const index = newFragrances.findIndex(f => f.id === fragranceId)

  if (index !== -1) {
    const newPercent = Math.max(
        0.05,
        Math.min(0.5, newFragrances[index].percent + adjustment)
    )

    newFragrances[index] = {
      ...newFragrances[index],
      percent: newPercent
    }

    emit('update:formData', { selectedFragrances: newFragrances })
  }
}

const clearAllFragrances = () => {
  emit('update:formData', { selectedFragrances: [] })
}

const optimizeFragrances = () => {
  if (props.formData.selectedFragrances.length === 0) return

  const totalLimit = 1.0
  const currentTotal = props.fragranceTotal

  if (currentTotal <= totalLimit) return

  // Réduire proportionnellement toutes les fragrances
  const reductionFactor = totalLimit / currentTotal
  const newFragrances = props.formData.selectedFragrances.map(fragrance => ({
    ...fragrance,
    percent: Math.max(0.05, fragrance.percent * reductionFactor)
  }))

  emit('update:formData', { selectedFragrances: newFragrances })
}

const applyStandardConcentrations = () => {
  const newFragrances = props.formData.selectedFragrances.map(fragrance => ({
    ...fragrance,
    percent: 0.2 // Concentration standard
  }))

  emit('update:formData', { selectedFragrances: newFragrances })
}

// Méthodes helpers
const getCategoryLabel = (category) => {
  const labels = {
    'gourmand': 'Gourmand',
    'fresh': 'Frais',
    'floral': 'Floral',
    'woody': 'Boisé',
    'spicy': 'Épicé',
    'fruity': 'Fruité'
  }
  return labels[category] || category
}

const getCategoryClass = (category) => {
  const classes = {
    'gourmand': 'bg-amber-100 text-amber-800',
    'fresh': 'bg-blue-100 text-blue-800',
    'floral': 'bg-pink-100 text-pink-800',
    'woody': 'bg-yellow-100 text-yellow-800',
    'spicy': 'bg-red-100 text-red-800',
    'fruity': 'bg-green-100 text-green-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const getFragranceDescription = (fragrance) => {
  const descriptions = {
    'vanilla': 'Douce et réconfortante, très populaire pour les soins capillaires',
    'citrus': 'Fraîche et énergisante, idéale pour les shampooings matinaux',
    'lavender': 'Apaisante et relaxante, parfaite pour les soins du soir',
    'rose': 'Féminine et romantique, appréciée pour son élégance',
    'sandalwood': 'Chaleureux et sensuel, notes boisées durables',
    'peppermint': 'Rafraîchissante et stimulante, sensation de fraîcheur'
  }
  return descriptions[fragrance.id] || 'Fragrance agréable et équilibrée'
}

const getDominantCategory = () => {
  if (props.formData.selectedFragrances.length === 0) return 'none'

  const categories = props.formData.selectedFragrances.reduce((acc, fragrance) => {
    const fragranceData = props.fragranceOptions.find(f => f.id === fragrance.id)
    if (fragranceData) {
      acc[fragranceData.category] = (acc[fragranceData.category] || 0) + 1
    }
    return acc
  }, {})

  return Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
}

const getDominantCategoryLabel = () => {
  const category = getDominantCategory()
  if (category === 'none') return 'Aucune'
  return getCategoryLabel(category)
}

const getDominantCategoryClass = () => {
  const category = getDominantCategory()
  if (category === 'none') return 'bg-gray-100 text-gray-800'
  return getCategoryClass(category)
}
</script>