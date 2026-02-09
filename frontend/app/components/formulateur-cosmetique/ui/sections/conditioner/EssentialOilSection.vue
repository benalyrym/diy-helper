<template>
  <section id="essential-oils"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">

    <!-- Header unifié -->
    <div class="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg" aria-hidden="true">
          <span class="text-2xl text-white">🌿</span>
        </div>
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Huiles essentielles pour cheveux</h2>
          <p class="text-gray-600">Sélectionnez vos huiles essentielles selon votre type de cheveux</p>
          <div class="flex items-center gap-3 mt-2 text-sm">
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Sélection: {{ selectedEssentialOils.length }}
            </span>
            <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              Total: {{ totalEssentialOilsPercent.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Indicateur de limite -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <div :class="[
          'px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-300',
          totalEssentialOilsPercent > 1
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
            : totalEssentialOilsPercent > 0.8
            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
        ]">
          <div class="text-center">
            <div class="text-2xl font-bold" :class="totalEssentialOilsPercent > 1 ? 'text-red-600' : 'text-green-600'">
              {{ totalEssentialOilsPercent.toFixed(2) }}%
            </div>
            <div class="text-sm" :class="totalEssentialOilsPercent > 1 ? 'text-red-700' : 'text-gray-600'">
              Limite UE: 1.00%
            </div>
          </div>
        </div>

        <!-- Contrôles -->
        <div class="flex gap-2">
          <button @click="clearAll"
                  type="button"
                  class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Tout effacer
          </button>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche améliorés -->
    <div class="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Recherche -->
        <div>
          <label for="he-search" class="block text-sm font-medium text-gray-700 mb-2">
            🔍 Recherche
          </label>
          <div class="relative">
            <input id="he-search"
                   v-model="searchTerm"
                   type="text"
                   placeholder="Nom, latin, propriété..."
                   class="w-full pl-10 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔎
            </span>
          </div>
        </div>

        <!-- Filtre par type de cheveux -->
        <div>
          <label for="hair-type-filter" class="block text-sm font-medium text-gray-700 mb-2">
            💇 Type de cheveux
          </label>
          <select id="hair-type-filter"
                  v-model="hairTypeFilter"
                  class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">Tous les types</option>
            <option value="greasy">Cheveux gras</option>
            <option value="dry">Cheveux secs</option>
            <option value="loss">Chute de cheveux</option>
            <option value="dandruff">Pellicules</option>
            <option value="sensitive">Cuir chevelu sensible</option>
            <option value="shine">Brillance et éclat</option>
            <option value="curly">Bouclés/Frisés</option>
            <option value="colored">Cheveux colorés</option>
            <option value="thin">Cheveux fins</option>
            <option value="thick">Cheveux épais</option>
          </select>
        </div>

        <!-- Filtre par sécurité -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🛡️ Filtres sécurité
          </label>
          <div class="flex flex-wrap gap-2">
            <label class="flex items-center gap-2">
              <input type="checkbox"
                     v-model="securityFilters.safeForPregnancy"
                     class="rounded border-green-300">
              <span class="text-sm">Grossesse OK</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox"
                     v-model="securityFilters.noPhotosensitivity"
                     class="rounded border-green-300">
              <span class="text-sm">Non photosensible</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox"
                     v-model="securityFilters.noAllergen"
                     class="rounded border-green-300">
              <span class="text-sm">Non allergène</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Statistiques de recherche -->
      <div class="mt-4 pt-4 border-t border-green-200">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="text-sm text-gray-600">
            <span class="font-medium">{{ filteredEssentialOils.length }}</span> HE trouvées
            <span v-if="selectedEssentialOils.length > 0" class="ml-3">
              • <span class="font-medium text-green-600">{{ selectedEssentialOils.length }}</span> sélectionnées
            </span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">
              Affichage:
              <select v-model="displayLimit" class="ml-1 border-none bg-transparent focus:ring-0">
                <option v-for="option in displayOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grille des huiles essentielles par catégorie cheveux -->
    <div class="space-y-8">
      <template v-for="category in hairCategories" :key="category.id">
        <div v-if="getCategoryOils(category.id).length > 0"
             :class="[
               'border-2 rounded-xl p-5 transition-all duration-300',
               getCategoryClass(category.id)
             ]">

          <!-- En-tête de catégorie -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div :class="[
                'p-3 rounded-lg text-white shadow-sm',
                getCategoryIconClass(category.id)
              ]">
                <span class="text-xl">{{ category.icon }}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-900">{{ category.label }}</h3>
                <p class="text-sm text-gray-500">{{ getCategoryDescription(category.id) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-sm font-medium" :class="getCategoryTextClass(category.id)">
                {{ getCategoryOils(category.id).length }} HE •
                {{ getCategorySelectedCount(category.id) }} sélectionnées
              </div>
              <button @click="toggleCategory(category.id)"
                      class="text-gray-500 hover:text-gray-700 transition-colors">
                {{ isCategoryCollapsed(category.id) ? '▶' : '▼' }}
              </button>
            </div>
          </div>

          <!-- Grille d'HE (collapsible) -->
          <div v-if="!isCategoryCollapsed(category.id)"
               class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="he in getCategoryOils(category.id)"
                 :key="he.name"
                 :class="[
                   'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md',
                   isEssentialOilSelected(he)
                     ? getSelectedCardClass(category.id)
                     : getUnselectedCardClass(category.id),
                   totalEssentialOilsPercent >= 1 && !isEssentialOilSelected(he) ? 'opacity-50' : ''
                 ]">
              <div class="space-y-3">
                <!-- En-tête avec sélection -->
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <input :id="`he-${he.name}`"
                             type="checkbox"
                             :checked="isEssentialOilSelected(he)"
                             @change="handleToggleEssentialOil(he)"
                             :disabled="totalEssentialOilsPercent >= 1 && !isEssentialOilSelected(he)"
                             class="h-4 w-4 rounded border-2 border-gray-300 checked:border-green-600 checked:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1">
                      <label :for="`he-${he.name}`"
                             class="font-bold text-gray-900 cursor-pointer hover:text-green-600 text-sm leading-tight">
                        {{ he.name }}
                      </label>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 font-mono">
                      {{ he.latinName }}
                    </p>
                  </div>

                  <!-- Aroma -->
                  <div v-if="he.aroma" class="flex flex-col items-end gap-1">
                    <span class="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                      {{ he.aroma }}
                    </span>
                  </div>
                </div>

                <!-- Dosage -->
                <div v-if="isEssentialOilSelected(he)" class="space-y-2">
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                      <input type="number"
                             :value="getEssentialOilPercent(he)"
                             :min="getConcentrationRange(he).min"
                             :max="getConcentrationRange(he).max"
                             step="0.01"
                             @input="updateEssentialOilPercent(he, $event.target.value)"
                             :class="[
                               'w-full px-3 py-2 border rounded-lg text-sm',
                               getEssentialOilPercent(he) > getConcentrationRange(he).max
                                 ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                 : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                             ]">
                      <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                        %
                      </span>
                    </div>
                    <span class="text-xs text-gray-500 min-w-10">
                      {{ grams(getEssentialOilPercent(he)) }} g
                    </span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-500">Min: {{ getConcentrationRange(he).min }}%</span>
                    <span v-if="getEssentialOilPercent(he) > getConcentrationRange(he).max"
                          class="text-red-600 font-medium">
                      ⚠️ Dépassement
                    </span>
                    <span class="text-gray-500">Max: {{ getConcentrationRange(he).max }}%</span>
                  </div>
                </div>

                <!-- Propriétés principales -->
                <div class="flex flex-wrap gap-1">
                  <span v-for="prop in he.properties.slice(0, 3)"
                        :key="prop"
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs border',
                          getPropertyClass(category.id)
                        ]">
                    {{ prop }}
                  </span>
                  <span v-if="he.properties.length > 3"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    +{{ he.properties.length - 3 }}
                  </span>
                </div>

                <!-- Bénéfices spécifiques cheveux -->
                <div v-if="he.hairBenefits && he.hairBenefits.length > 0" class="space-y-1">
                  <div v-for="benefit in he.hairBenefits.slice(0, 2)"
                       :key="benefit"
                       class="text-xs text-gray-600 flex items-center gap-1">
                    <span class="text-green-500">✓</span>
                    <span>{{ benefit }}</span>
                  </div>
                </div>

                <!-- Avertissements de sécurité -->
                <div v-if="he.warnings" class="space-y-1">
                  <span v-if="he.warnings.includes('pregnancy')"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
                    👶 Contre-indiquée grossesse
                  </span>
                  <span v-if="he.warnings.includes('photo')"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                    ☀️ Photosensible
                  </span>
                  <span v-if="he.warnings.includes('allergen')"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800">
                    ⚠️ Allergène
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Section des HE sélectionnées -->
    <div v-if="selectedEssentialOils.length > 0" class="mt-8">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-2xl text-gray-900 flex items-center gap-3">
            <span class="text-green-600">📊</span>
            Répartition des huiles essentielles
          </h3>
          <div :class="[
            'px-4 py-2 rounded-lg font-bold',
            totalEssentialOilsPercent > 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          ]">
            {{ totalEssentialOilsPercent.toFixed(2) }}% / 1% limite UE
          </div>
        </div>

        <!-- Liste des HE par catégorie -->
        <div class="space-y-6">
          <template v-for="category in hairCategories" :key="category.id">
            <div v-if="getSelectedCategoryOils(category.id).length > 0">
              <h4 class="font-bold text-lg mb-3 flex items-center gap-2">
                <span class="p-1.5 rounded-md bg-green-100 text-green-800">
                  {{ category.icon }}
                </span>
                {{ category.label }} ({{ getSelectedCategoryOils(category.id).length }})
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="item in getSelectedCategoryOils(category.id)"
                     :key="item.name"
                     class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h5 class="font-bold text-gray-900">{{ item.name }}</h5>
                      <p class="text-xs text-gray-500 mt-1">{{ item.latinName }}</p>
                    </div>
                    <button @click="handleToggleEssentialOil(item)"
                            class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
                            aria-label="Retirer cette huile essentielle">
                      <span class="text-xl">×</span>
                    </button>
                  </div>

                  <div class="space-y-3">
                    <!-- Dosage -->
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Dosage:</span>
                      <div class="text-right">
                        <span class="font-bold text-green-700 text-lg">{{ getEssentialOilPercent(item) }}%</span>
                        <span class="block text-xs text-gray-500">{{ grams(getEssentialOilPercent(item)) }} g</span>
                      </div>
                    </div>

                    <!-- Contrôle dosage -->
                    <div class="pt-3 border-t border-gray-100">
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Ajuster dosage
                      </label>
                      <div class="space-y-2">
                        <input type="range"
                               :value="getEssentialOilPercent(item)"
                               :min="getConcentrationRange(item).min"
                               :max="getConcentrationRange(item).max"
                               step="0.01"
                               @input="updateEssentialOilPercent(item, $event.target.value)"
                               class="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600">
                        <div class="flex justify-between text-xs text-gray-500">
                          <span>{{ getConcentrationRange(item).min }}%</span>
                          <span>Concentration</span>
                          <span>{{ getConcentrationRange(item).max }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Total et avertissements -->
        <div class="mt-6 pt-6 border-t border-green-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Total -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-gray-900">Total HE</span>
                <span :class="[
                  'text-2xl font-bold',
                  totalEssentialOilsPercent > 1 ? 'text-red-600' : 'text-green-600'
                ]">
                  {{ totalEssentialOilsPercent.toFixed(2) }}%
                </span>
              </div>
              <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div :class="[
                  'h-full rounded-full transition-all duration-1000',
                  totalEssentialOilsPercent > 1 ? 'bg-red-500' : totalEssentialOilsPercent > 0.8 ? 'bg-amber-500' : 'bg-green-500'
                ]"
                     :style="{ width: `${Math.min(totalEssentialOilsPercent * 100, 100)}%` }">
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Limite UE</span>
                <span>1%</span>
              </div>
            </div>

            <!-- Avertissements -->
            <div v-if="warnings.length > 0" class="space-y-2">
              <div v-for="warning in warnings.slice(0, 2)"
                   :key="warning"
                   class="text-sm text-amber-700 flex items-start gap-2">
                <span>⚠️</span>
                <span>{{ warning }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune HE -->
    <div v-else class="text-center py-12">
      <div class="inline-block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <span class="text-6xl mb-4 block">🌿</span>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Aucune huile essentielle sélectionnée</h3>
        <p class="text-gray-600 max-w-md">
          Sélectionnez des huiles essentielles adaptées à votre type de cheveux pour bénéficier
          de leurs propriétés spécifiques. Limite réglementaire : 1% maximum.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  hairEssentialOils: {
    type: Array,
    required: true
  },
  toggleEssentialOil: {
    type: Function,
    required: true
  },
  clearEssentialOils: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update'])

// Réactifs
const searchTerm = ref('')
const hairTypeFilter = ref('')
const displayLimit = ref(12)
const collapsedCategories = ref({})
const securityFilters = ref({
  safeForPregnancy: false,
  noPhotosensitivity: false,
  noAllergen: false
})

// Options d'affichage
const displayOptions = [
  { value: 12, label: '12' },
  { value: 24, label: '24' },
  { value: 48, label: '48' },
  { value: 'all', label: 'Tout' }
]

// Catégories pour cheveux
const hairCategories = [
  { id: 'greasy', label: 'Cheveux gras', icon: '💧', color: 'blue' },
  { id: 'dry', label: 'Cheveux secs', icon: '🌵', color: 'orange' },
  { id: 'loss', label: 'Chute de cheveux', icon: '🍃', color: 'green' },
  { id: 'dandruff', label: 'Pellicules', icon: '❄️', color: 'purple' },
  { id: 'sensitive', label: 'Cuir chevelu sensible', icon: '🌸', color: 'pink' },
  { id: 'shine', label: 'Brillance et éclat', icon: '✨', color: 'yellow' },
  { id: 'curly', label: 'Bouclés/Frisés', icon: '🌀', color: 'indigo' },
  { id: 'colored', label: 'Cheveux colorés', icon: '🎨', color: 'red' },
  { id: 'thin', label: 'Cheveux fins', icon: '🪶', color: 'teal' },
  { id: 'thick', label: 'Cheveux épais', icon: '🪵', color: 'amber' }
]

// Mappage HE -> Catégories (à adapter selon vos données)
const getHECategories = (he) => {
  const categories = []

  // Exemple de logique de catégorisation basée sur les propriétés
  if (he.properties?.some(p =>
      ['séborégulateur', 'purifiant', 'astringent', 'antibactérien'].includes(p.toLowerCase())
  )) {
    categories.push('greasy')
  }

  if (he.properties?.some(p =>
      ['hydratant', 'nourrissant', 'réparateur', 'émollient'].includes(p.toLowerCase())
  )) {
    categories.push('dry')
  }

  if (he.properties?.some(p =>
      ['stimulant', 'tonifiant', 'circulation', 'antichute'].includes(p.toLowerCase())
  )) {
    categories.push('loss')
  }

  if (he.properties?.some(p =>
      ['antifongique', 'antipelliculaire', 'apaisant'].includes(p.toLowerCase())
  )) {
    categories.push('dandruff')
  }

  if (he.properties?.some(p =>
      ['apaisant', 'anti-inflammatoire', 'calmant'].includes(p.toLowerCase())
  )) {
    categories.push('sensitive')
  }

  if (he.properties?.some(p =>
      ['brillance', 'éclat', 'lissant', 'gainant'].includes(p.toLowerCase())
  )) {
    categories.push('shine')
  }

  return categories.length > 0 ? categories : ['general']
}

// Computed
const volume = computed(() => props.formData?.volume || 100)

const normalizeText = (value) => {
  return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
}

const grams = (percent) => {
  return Number(((volume.value * percent) / 100).toFixed(2))
}

const parseConcentrationRange = (concentration) => {
  if (typeof concentration !== 'string') {
    return { min: 0.1, max: 2 }
  }

  const matches = concentration.match(/(\d+(?:\.\d+)?)/g) || []
  if (matches.length >= 2) {
    const min = parseFloat(matches[0])
    const max = parseFloat(matches[1])
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return min <= max ? { min, max } : { min: max, max: min }
    }
  }

  if (matches.length === 1) {
    const max = parseFloat(matches[0])
    if (Number.isFinite(max)) {
      return { min: Math.min(0.1, max), max }
    }
  }

  return { min: 0.1, max: 2 }
}

const getConcentrationRange = (he) => {
  return parseConcentrationRange(he.concentration)
}

const isEssentialOilSelected = (he) => {
  return props.formData.selectedEssentialOils.some((eo) => eo.name === he.name)
}

const getSelectedEssentialOil = (he) => {
  return props.formData.selectedEssentialOils.find((eo) => eo.name === he.name)
}

const getEssentialOilPercent = (he) => {
  const selected = getSelectedEssentialOil(he)
  if (selected && typeof selected.percent === 'number') {
    return selected.percent
  }
  return getConcentrationRange(he).min
}

const updateEssentialOilPercent = (he, value) => {
  const selected = getSelectedEssentialOil(he)
  if (!selected) return

  const range = getConcentrationRange(he)
  const parsed = parseFloat(value)
  const safeValue = Number.isFinite(parsed) ? parsed : range.min
  selected.percent = Math.min(range.max, Math.max(range.min, safeValue))
  emit('update')
}

const handleToggleEssentialOil = (he) => {
  props.toggleEssentialOil(he)
  const selected = getSelectedEssentialOil(he)
  if (selected && typeof selected.percent !== 'number') {
    selected.percent = getConcentrationRange(he).min
  }
  emit('update')
}

const clearAll = () => {
  props.clearEssentialOils()
  emit('update')
}

const selectedEssentialOils = computed(() => {
  return props.formData.selectedEssentialOils || []
})

const totalEssentialOilsPercent = computed(() => {
  return selectedEssentialOils.value.reduce((sum, he) => {
    return sum + (typeof he.percent === 'number' ? he.percent : 0)
  }, 0)
})

// Filtrage des HE
const filteredEssentialOils = computed(() => {
  let list = props.hairEssentialOils

  // Filtre par recherche textuelle
  if (searchTerm.value) {
    const term = normalizeText(searchTerm.value)
    list = list.filter((he) => {
      const haystack = [
        he.name,
        he.latinName,
        ...(he.properties || []),
        ...(he.benefits || []),
        ...(he.hairBenefits || [])
      ].map(normalizeText)
      return haystack.some((value) => value.includes(term))
    })
  }

  // Filtre par type de cheveux
  if (hairTypeFilter.value) {
    list = list.filter((he) =>
        getHECategories(he).includes(hairTypeFilter.value)
    )
  }

  // Filtres de sécurité
  if (securityFilters.value.safeForPregnancy) {
    list = list.filter(he => he.warnings?.includes('pregnancy') === false)
  }
  if (securityFilters.value.noPhotosensitivity) {
    list = list.filter(he => he.warnings?.includes('photo') === false)
  }
  if (securityFilters.value.noAllergen) {
    list = list.filter(he => he.warnings?.includes('allergen') === false)
  }

  return list
})

const limitedEssentialOils = computed(() => {
  if (displayLimit.value === 'all') return filteredEssentialOils.value
  return filteredEssentialOils.value.slice(0, displayLimit.value)
})

// Fonctions pour les catégories
const getCategoryOils = (categoryId) => {
  return limitedEssentialOils.value.filter(he =>
      getHECategories(he).includes(categoryId)
  )
}

const getSelectedCategoryOils = (categoryId) => {
  return selectedEssentialOils.value.filter(he =>
      getHECategories(he).includes(categoryId)
  )
}

const getCategorySelectedCount = (categoryId) => {
  return getSelectedCategoryOils(categoryId).length
}

const isCategoryCollapsed = (categoryId) => {
  return collapsedCategories.value[categoryId] === true
}

const toggleCategory = (categoryId) => {
  collapsedCategories.value[categoryId] = !collapsedCategories.value[categoryId]
}

// Classes dynamiques pour les catégories
const getCategoryClass = (categoryId) => {
  const colorMap = {
    greasy: 'border-blue-200 bg-gradient-to-br from-blue-50/30 to-cyan-50/30',
    dry: 'border-orange-200 bg-gradient-to-br from-orange-50/30 to-amber-50/30',
    loss: 'border-green-200 bg-gradient-to-br from-green-50/30 to-emerald-50/30',
    dandruff: 'border-purple-200 bg-gradient-to-br from-purple-50/30 to-violet-50/30',
    sensitive: 'border-pink-200 bg-gradient-to-br from-pink-50/30 to-rose-50/30',
    shine: 'border-yellow-200 bg-gradient-to-br from-yellow-50/30 to-amber-50/30',
    curly: 'border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-blue-50/30',
    colored: 'border-red-200 bg-gradient-to-br from-red-50/30 to-pink-50/30',
    thin: 'border-teal-200 bg-gradient-to-br from-teal-50/30 to-cyan-50/30',
    thick: 'border-amber-200 bg-gradient-to-br from-amber-50/30 to-yellow-50/30'
  }
  return colorMap[categoryId] || 'border-gray-200 bg-gray-50/30'
}

const getCategoryIconClass = (categoryId) => {
  const colorMap = {
    greasy: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    dry: 'bg-gradient-to-br from-orange-500 to-amber-600',
    loss: 'bg-gradient-to-br from-green-500 to-emerald-600',
    dandruff: 'bg-gradient-to-br from-purple-500 to-violet-600',
    sensitive: 'bg-gradient-to-br from-pink-500 to-rose-600',
    shine: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    curly: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    colored: 'bg-gradient-to-br from-red-500 to-pink-600',
    thin: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    thick: 'bg-gradient-to-br from-amber-500 to-yellow-600'
  }
  return colorMap[categoryId] || 'bg-gradient-to-br from-gray-500 to-gray-600'
}

const getCategoryTextClass = (categoryId) => {
  const colorMap = {
    greasy: 'text-blue-600',
    dry: 'text-orange-600',
    loss: 'text-green-600',
    dandruff: 'text-purple-600',
    sensitive: 'text-pink-600',
    shine: 'text-yellow-600',
    curly: 'text-indigo-600',
    colored: 'text-red-600',
    thin: 'text-teal-600',
    thick: 'text-amber-600'
  }
  return colorMap[categoryId] || 'text-gray-600'
}

const getSelectedCardClass = (categoryId) => {
  const colorMap = {
    greasy: 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg',
    dry: 'border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg',
    loss: 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg',
    dandruff: 'border-purple-400 bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg',
    sensitive: 'border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg',
    shine: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg',
    curly: 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg',
    colored: 'border-red-400 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg',
    thin: 'border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg',
    thick: 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg'
  }
  return colorMap[categoryId] || 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
}

const getUnselectedCardClass = (categoryId) => {
  const colorMap = {
    greasy: 'border-blue-200 bg-white hover:border-blue-300',
    dry: 'border-orange-200 bg-white hover:border-orange-300',
    loss: 'border-green-200 bg-white hover:border-green-300',
    dandruff: 'border-purple-200 bg-white hover:border-purple-300',
    sensitive: 'border-pink-200 bg-white hover:border-pink-300',
    shine: 'border-yellow-200 bg-white hover:border-yellow-300',
    curly: 'border-indigo-200 bg-white hover:border-indigo-300',
    colored: 'border-red-200 bg-white hover:border-red-300',
    thin: 'border-teal-200 bg-white hover:border-teal-300',
    thick: 'border-amber-200 bg-white hover:border-amber-300'
  }
  return colorMap[categoryId] || 'border-gray-200 bg-white hover:border-gray-300'
}

const getPropertyClass = (categoryId) => {
  const colorMap = {
    greasy: 'bg-blue-100 text-blue-800 border-blue-200',
    dry: 'bg-orange-100 text-orange-800 border-orange-200',
    loss: 'bg-green-100 text-green-800 border-green-200',
    dandruff: 'bg-purple-100 text-purple-800 border-purple-200',
    sensitive: 'bg-pink-100 text-pink-800 border-pink-200',
    shine: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    curly: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    colored: 'bg-red-100 text-red-800 border-red-200',
    thin: 'bg-teal-100 text-teal-800 border-teal-200',
    thick: 'bg-amber-100 text-amber-800 border-amber-200'
  }
  return colorMap[categoryId] || 'bg-green-100 text-green-800 border-green-200'
}

const getCategoryDescription = (categoryId) => {
  const descriptions = {
    greasy: 'Pour réguler l\'excès de sébum et purifier le cuir chevelu',
    dry: 'Pour nourrir, hydrater et réparer les cheveux secs ou abîmés',
    loss: 'Pour stimuler la pousse et renforcer les racines',
    dandruff: 'Pour lutter contre les pellicules et apaiser les démangeaisons',
    sensitive: 'Pour calmer les irritations et les rougeurs',
    shine: 'Pour redonner éclat et brillance aux cheveux ternes',
    curly: 'Pour définir les boucles et réduire les frisottis',
    colored: 'Pour protéger et prolonger la couleur des cheveux teints',
    thin: 'Pour donner du volume et de la densité aux cheveux fins',
    thick: 'Pour discipliner et dompter les cheveux épais'
  }
  return descriptions[categoryId] || 'Huiles essentielles polyvalentes'
}

// Avertissements
const warnings = computed(() => {
  const warnings = []

  if (totalEssentialOilsPercent > 1) {
    warnings.push(`Dépassement de la limite UE (${totalEssentialOilsPercent.toFixed(2)}% > 1%)`)
  }

  if (totalEssentialOilsPercent > 0.8) {
    warnings.push(`Approche de la limite UE (${totalEssentialOilsPercent.toFixed(2)}%)`)
  }

  // Vérifier les dépassements de concentration max
  selectedEssentialOils.value.forEach(he => {
    const range = getConcentrationRange(he)
    const percent = getEssentialOilPercent(he)
    if (percent > range.max) {
      warnings.push(`${he.name} dépasse sa concentration max recommandée (${percent}% > ${range.max}%)`)
    }
  })

  return warnings
})

// Expansion automatique des catégories avec sélection
watch(selectedEssentialOils, (newSelection) => {
  if (newSelection.length > 0) {
    hairCategories.forEach(category => {
      if (getSelectedCategoryOils(category.id).length > 0 && isCategoryCollapsed(category.id)) {
        collapsedCategories.value[category.id] = false
      }
    })
  }
}, { deep: true })
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #16a34a;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Transition pour les cartes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Animation pour les nouveaux éléments */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>