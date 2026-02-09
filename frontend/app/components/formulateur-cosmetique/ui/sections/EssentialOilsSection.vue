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
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Huiles essentielles</h2>
          <p class="text-gray-600">Sélectionnez vos huiles essentielles selon votre type de peau</p>
          <div class="flex items-center gap-3 mt-2 text-sm">
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Sélection: {{ formData.selectedHE.length }}
            </span>
            <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              Total: {{ heTotal.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Indicateur de limite -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <div :class="[
          'px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-300',
          heTotal > 1
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
            : heTotal > 0.8
            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
        ]">
          <div class="text-center">
            <div class="text-2xl font-bold" :class="heTotal > 1 ? 'text-red-600' : 'text-green-600'">
              {{ heTotal.toFixed(2) }}%
            </div>
            <div class="text-sm" :class="heTotal > 1 ? 'text-red-700' : 'text-gray-600'">
              Limite UE: 1.00%
            </div>
          </div>
        </div>

        <!-- Contrôles -->
        <div class="flex gap-2">
          <button @click="$emit('clear-all-he')"
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
                   v-model="localHeSearchTerm"
                   type="text"
                   placeholder="Nom, latin, propriété..."
                   class="w-full pl-10 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                   @input="$emit('update-search', $event.target.value)">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔎
            </span>
          </div>
        </div>

        <!-- Filtre par type de peau -->
        <div>
          <label for="skin-type-filter" class="block text-sm font-medium text-gray-700 mb-2">
            💆 Type de peau
          </label>
          <select id="skin-type-filter"
                  :value="heFilterProperty"
                  class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  @change="$emit('update-property-filter', $event.target.value)">
            <option value="">Tous types de peau</option>
            <option v-for="category in skinCategories" :key="category.id" :value="category.id">
              {{ category.label }}
            </option>
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
                     :checked="heFilters.safeForPregnancy"
                     class="rounded border-green-300"
                     @change="$emit('update-filters', 'safeForPregnancy', $event.target.checked)">
              <span class="text-sm">Grossesse OK</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox"
                     :checked="heFilters.noPhotosensitivity"
                     class="rounded border-green-300"
                     @change="$emit('update-filters', 'noPhotosensitivity', $event.target.checked)">
              <span class="text-sm">Non photosensible</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox"
                     :checked="heFilters.noAllergen"
                     class="rounded border-green-300"
                     @change="$emit('update-filters', 'noAllergen', $event.target.checked)">
              <span class="text-sm">Non allergène</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Statistiques de recherche -->
      <div class="mt-4 pt-4 border-t border-green-200">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="text-sm text-gray-600">
            <span class="font-medium">{{ filteredHECount }}</span> HE trouvées
            <span v-if="formData.selectedHE.length > 0" class="ml-3">
              • <span class="font-medium text-green-600">{{ formData.selectedHE.length }}</span> sélectionnées
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

    <!-- Grille des huiles essentielles par catégorie -->
    <div class="space-y-8">
      <template v-for="group in groupedEssentialOils" :key="group.key">
        <div v-if="group.items.length > 0"
             :class="[
               'border-2 rounded-xl p-5 transition-all duration-300',
               getCategoryClass(group.key)
             ]">

          <!-- En-tête de catégorie -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div :class="[
                'p-2 rounded-lg text-white',
                getCategoryIconClass(group.key)
              ]">
                <span class="text-xl">{{ getCategoryIcon(group.key) }}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-900">{{ group.key }}</h3>
                <p class="text-sm text-gray-500">{{ group.items.length }} HE disponibles</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-sm font-medium" :class="getCategoryTextClass(group.key)">
                Sélection: {{ group.selectedCount }}/{{ group.items.length }}
              </div>
              <button @click="toggleGroup(group.key)"
                      class="text-gray-500 hover:text-gray-700">
                {{ isGroupCollapsed(group.key) ? '▶' : '▼' }}
              </button>
            </div>
          </div>

          <!-- Grille d'HE (collapsible) -->
          <div v-if="!isGroupCollapsed(group.key)" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="oil in group.items"
                 :key="oil.name"
                 :class="[
                   'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md',
                   isHESelected(oil.name)
                     ? getSelectedCardClass(group.key)
                     : getUnselectedCardClass(group.key),
                   heTotal >= 1 && !isHESelected(oil.name) ? 'opacity-50' : ''
                 ]">
              <div class="space-y-3">
                <!-- En-tête avec sélection -->
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <input :id="`he-${oil.name}`"
                             type="checkbox"
                             :checked="isHESelected(oil.name)"
                             @change="$emit('toggle-he', oil)"
                             :disabled="heTotal >= 1 && !isHESelected(oil.name)"
                             class="h-4 w-4 rounded border-2 border-gray-300 checked:border-green-600 checked:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1">
                      <label :for="`he-${oil.name}`"
                             class="font-bold text-gray-900 cursor-pointer hover:text-green-600 text-sm leading-tight">
                        {{ oil.name }}
                      </label>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 font-mono">
                      {{ oil.latinName }}
                    </p>
                  </div>

                  <!-- Indicateurs rapides -->
                  <div class="flex flex-col items-end gap-1">
                    <span :class="[
                      'px-2 py-0.5 rounded text-xs font-bold',
                      getHERiskClass(oil.ifra)
                    ]"
                          :title="`Limite IFRA: ${oil.ifra}%`">
                      IFRA: {{ oil.ifra }}%
                    </span>
                  </div>
                </div>

                <!-- Dosage -->
                <div v-if="isHESelected(oil.name)" class="space-y-2">
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                      <input type="number"
                             v-model.number="getSelectedHE(oil.name).percent"
                             :min="0"
                             :max="oil.maxFace"
                             step="0.01"
                             :class="[
                               'w-full px-3 py-2 border rounded-lg text-sm',
                               getSelectedHE(oil.name).percent > oil.maxFace
                                 ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                 : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                             ]">
                      <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                        %
                      </span>
                    </div>
                    <span class="text-xs text-gray-500 min-w-10">
                      {{ grams(getSelectedHE(oil.name).percent) }} g
                    </span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-500">Max visage: {{ oil.maxFace }}%</span>
                    <span v-if="getSelectedHE(oil.name).percent > oil.maxFace"
                          class="text-red-600 font-medium">
                      ⚠️ Dépassement
                    </span>
                  </div>
                </div>

                <!-- Propriétés -->
                <div class="flex flex-wrap gap-1">
                  <span v-for="prop in oil.properties.slice(0, 2)"
                        :key="prop"
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs border',
                          getPropertyClass(group.key)
                        ]">
                    {{ prop }}
                  </span>
                  <span v-if="oil.properties.length > 2"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    +{{ oil.properties.length - 2 }}
                  </span>
                </div>

                <!-- Avertissements -->
                <div class="space-y-1">
                  <span v-if="!oil.pregnancy"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
                    👶 Grossesse
                  </span>
                  <span v-if="oil.photo"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                    ☀️ Photosensible
                  </span>
                  <span v-if="oil.allergen"
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

    <!-- HE sélectionnées -->
    <div v-if="formData.selectedHE.length > 0" class="mt-8">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-2xl text-gray-900 flex items-center gap-3">
            <span class="text-green-600">🌿</span>
            Huiles essentielles sélectionnées
          </h3>
          <div :class="[
            'px-4 py-2 rounded-lg font-bold',
            heTotal > 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          ]">
            {{ heTotal.toFixed(2) }}% / 1% limite UE
          </div>
        </div>

        <!-- Liste des HE groupées par catégorie -->
        <div class="space-y-6">
          <template v-for="group in groupedEssentialOils" :key="group.key">
            <div v-if="group.selectedCount > 0">
              <h4 class="font-bold text-lg mb-3 flex items-center gap-2">
                <span :class="[
                  'p-1.5 rounded-md',
                  getCategoryBadgeClass(group.key)
                ]">
                  {{ getCategoryIcon(group.key) }}
                </span>
                {{ group.key }} ({{ group.selectedCount }})
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="he in getSelectedCategoryOils(group.key)"
                     :key="he.name"
                     class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h5 class="font-bold text-gray-900">{{ he.name }}</h5>
                      <p class="text-xs text-gray-500 mt-1">{{ he.latinName }}</p>
                    </div>
                    <button @click="$emit('remove-he', he.name)"
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
                        <span class="font-bold text-green-700 text-lg">{{ he.percent }}%</span>
                        <span class="block text-xs text-gray-500">{{ grams(he.percent) }} g</span>
                      </div>
                    </div>

                    <!-- Avertissements -->
                    <div class="space-y-1">
                      <div v-if="!he.pregnancy" class="text-xs text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>Contre-indiquée grossesse/allaitement</span>
                      </div>
                      <div v-if="he.photo" class="text-xs text-orange-600 flex items-center gap-1">
                        <span>☀️</span>
                        <span>Photosensible - éviter le soleil</span>
                      </div>
                      <div v-if="he.allergen" class="text-xs text-amber-600 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>Potentiel allergène - mention obligatoire</span>
                      </div>
                    </div>

                    <!-- Contrôle dosage -->
                    <div class="pt-3 border-t border-gray-100">
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Ajuster dosage
                      </label>
                      <div class="flex items-center gap-2">
                        <input type="range"
                               v-model.number="he.percent"
                               :min="0"
                               :max="he.maxFace"
                               step="0.01"
                               class="flex-1 h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600">
                        <span class="text-xs text-gray-500 w-12 text-right">
                          {{ he.percent }}%
                        </span>
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
                  heTotal > 1 ? 'text-red-600' : 'text-green-600'
                ]">
                  {{ heTotal.toFixed(2) }}%
                </span>
              </div>
              <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div :class="[
                  'h-full rounded-full transition-all duration-1000',
                  heTotal > 1 ? 'bg-red-500' : heTotal > 0.8 ? 'bg-amber-500' : 'bg-green-500'
                ]"
                     :style="{ width: `${Math.min(heTotal * 100, 100)}%` }">
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Limite UE</span>
                <span>1%</span>
              </div>
            </div>

            <!-- Avertissements -->
            <div v-if="heWarnings.length > 0" class="space-y-2">
              <div v-for="warning in heWarnings.slice(0, 2)"
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
          Les HE sont optionnelles. Vous pouvez les ajouter pour leurs propriétés spécifiques,
          mais n'oubliez pas la limite réglementaire de 1% pour les produits visage.
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
  extendedEssentialOils: {
    type: Object,
    required: true
  },
  heTotal: {
    type: Number,
    required: true
  },
  heWarnings: {
    type: Array,
    default: () => []
  },
  heSearchTerm: {
    type: String,
    default: ''
  },
  heFilterProperty: {
    type: String,
    default: ''
  },
  heFilters: {
    type: Object,
    default: () => ({})
  },
  filteredHECount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'update:form-data',
  'update-search',
  'update-property-filter',
  'update-filters',
  'toggle-he',
  'remove-he',
  'clear-all-he'
])

// Réactifs
const searchTerm = ref('')
const displayLimit = ref(12)
const collapsedGroups = ref({})

// Options d'affichage
const displayOptions = [
  { value: 12, label: '12' },
  { value: 24, label: '24' },
  { value: 48, label: '48' },
  { value: 'all', label: 'Tout' }
]

// Catégories pour types de peau
const skinCategories = [
  { id: 'Peau grasse', label: 'Peau grasse', icon: '💧', color: 'blue' },
  { id: 'Peau sèche', label: 'Peau sèche', icon: '🌵', color: 'orange' },
  { id: 'Peau mixte', label: 'Peau mixte', icon: '⚖️', color: 'purple' },
  { id: 'Peau sensible', label: 'Peau sensible', icon: '🌸', color: 'pink' },
  { id: 'Peau acnéique', label: 'Peau acnéique', icon: '🎯', color: 'red' },
  { id: 'Peau mature', label: 'Peau mature', icon: '🌹', color: 'rose' },
  { id: 'Peau normale', label: 'Peau normale', icon: '✨', color: 'green' },
  { id: 'Peau déshydratée', label: 'Peau déshydratée', icon: '💦', color: 'cyan' }
]

// Fonctions utilitaires
const volume = 50

const grams = (percent) => {
  return Number(((volume * percent) / 100).toFixed(2))
}

const isHESelected = (heName) => {
  return props.formData.selectedHE.some(h => h.name === heName)
}

const localHeSearchTerm = computed({
  get() {
    return props.heSearchTerm
  },
  set(value) {
    emit('update-search', value)
  }
})

const getSelectedHE = (heName) => {
  return props.formData.selectedHE.find(h => h.name === heName)
}

const getHERiskClass = (ifra) => {
  if (ifra <= 0.3) return 'bg-red-100 text-red-800'
  if (ifra <= 0.8) return 'bg-amber-100 text-amber-800'
  return 'bg-green-100 text-green-800'
}

// Grouper les HE par catégorie
const groupedEssentialOils = computed(() => {
  const groups = []

  // Parcourir chaque catégorie dans extendedEssentialOils
  for (const [category, oils] of Object.entries(props.extendedEssentialOils)) {
    // Appliquer les filtres si nécessaire
    let filteredOils = oils

    // Filtre par recherche
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      filteredOils = oils.filter(oil =>
          oil.name.toLowerCase().includes(term) ||
          oil.latinName?.toLowerCase().includes(term) ||
          oil.properties?.some(prop => prop.toLowerCase().includes(term))
      )
    }

    // Filtre par type de peau
    if (props.heFilterProperty && props.heFilterProperty !== category) {
      continue
    }

    if (filteredOils.length > 0) {
      // Compter les HE sélectionnées dans cette catégorie
      const selectedCount = filteredOils.filter(oil =>
          isHESelected(oil.name)
      ).length

      groups.push({
        key: category,
        items: filteredOils,
        selectedCount,
        icon: getCategoryIcon(category)
      })
    }
  }

  return groups
})

// Fonctions pour les groupes
const isGroupCollapsed = (key) => {
  return collapsedGroups.value[key] === true
}

const toggleGroup = (key) => {
  collapsedGroups.value[key] = !collapsedGroups.value[key]
}

// Récupérer les HE sélectionnées par catégorie
const getSelectedCategoryOils = (category) => {
  const oils = props.extendedEssentialOils[category] || []
  return props.formData.selectedHE.filter(he =>
      oils.some(oil => oil.name === he.name)
  )
}

// Classes dynamiques pour les catégories
const getCategoryClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'border-green-200 bg-gradient-to-br from-green-50/30 to-emerald-50/30'

  const colorMap = {
    'blue': 'border-blue-200 bg-gradient-to-br from-blue-50/30 to-cyan-50/30',
    'orange': 'border-orange-200 bg-gradient-to-br from-orange-50/30 to-amber-50/30',
    'purple': 'border-purple-200 bg-gradient-to-br from-purple-50/30 to-violet-50/30',
    'pink': 'border-pink-200 bg-gradient-to-br from-pink-50/30 to-rose-50/30',
    'red': 'border-red-200 bg-gradient-to-br from-red-50/30 to-pink-50/30',
    'rose': 'border-rose-200 bg-gradient-to-br from-rose-50/30 to-pink-50/30',
    'green': 'border-green-200 bg-gradient-to-br from-green-50/30 to-emerald-50/30',
    'cyan': 'border-cyan-200 bg-gradient-to-br from-cyan-50/30 to-blue-50/30'
  }
  return colorMap[categoryData.color] || 'border-green-200 bg-gradient-to-br from-green-50/30 to-emerald-50/30'
}

const getCategoryIconClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'bg-gradient-to-br from-green-500 to-emerald-600'

  const colorMap = {
    'blue': 'bg-gradient-to-br from-blue-500 to-cyan-600',
    'orange': 'bg-gradient-to-br from-orange-500 to-amber-600',
    'purple': 'bg-gradient-to-br from-purple-500 to-violet-600',
    'pink': 'bg-gradient-to-br from-pink-500 to-rose-600',
    'red': 'bg-gradient-to-br from-red-500 to-pink-600',
    'rose': 'bg-gradient-to-br from-rose-500 to-pink-600',
    'green': 'bg-gradient-to-br from-green-500 to-emerald-600',
    'cyan': 'bg-gradient-to-br from-cyan-500 to-blue-600'
  }
  return colorMap[categoryData.color] || 'bg-gradient-to-br from-green-500 to-emerald-600'
}

const getCategoryIcon = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  return categoryData?.icon || '🌿'
}

const getCategoryTextClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'text-green-600'

  const colorMap = {
    'blue': 'text-blue-600',
    'orange': 'text-orange-600',
    'purple': 'text-purple-600',
    'pink': 'text-pink-600',
    'red': 'text-red-600',
    'rose': 'text-rose-600',
    'green': 'text-green-600',
    'cyan': 'text-cyan-600'
  }
  return colorMap[categoryData.color] || 'text-green-600'
}

const getSelectedCardClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'

  const colorMap = {
    'blue': 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg',
    'orange': 'border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg',
    'purple': 'border-purple-400 bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg',
    'pink': 'border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg',
    'red': 'border-red-400 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg',
    'rose': 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg',
    'green': 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg',
    'cyan': 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg'
  }
  return colorMap[categoryData.color] || 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
}

const getUnselectedCardClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'border-gray-200 bg-white hover:border-green-300'

  const colorMap = {
    'blue': 'border-blue-200 bg-white hover:border-blue-300',
    'orange': 'border-orange-200 bg-white hover:border-orange-300',
    'purple': 'border-purple-200 bg-white hover:border-purple-300',
    'pink': 'border-pink-200 bg-white hover:border-pink-300',
    'red': 'border-red-200 bg-white hover:border-red-300',
    'rose': 'border-rose-200 bg-white hover:border-rose-300',
    'green': 'border-green-200 bg-white hover:border-green-300',
    'cyan': 'border-cyan-200 bg-white hover:border-cyan-300'
  }
  return colorMap[categoryData.color] || 'border-gray-200 bg-white hover:border-gray-300'
}

const getPropertyClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'bg-green-100 text-green-800 border-green-200'

  const colorMap = {
    'blue': 'bg-blue-100 text-blue-800 border-blue-200',
    'orange': 'bg-orange-100 text-orange-800 border-orange-200',
    'purple': 'bg-purple-100 text-purple-800 border-purple-200',
    'pink': 'bg-pink-100 text-pink-800 border-pink-200',
    'red': 'bg-red-100 text-red-800 border-red-200',
    'rose': 'bg-rose-100 text-rose-800 border-rose-200',
    'green': 'bg-green-100 text-green-800 border-green-200',
    'cyan': 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }
  return colorMap[categoryData.color] || 'bg-green-100 text-green-800 border-green-200'
}

const getCategoryBadgeClass = (category) => {
  const categoryData = skinCategories.find(c => c.id === category)
  if (!categoryData) return 'bg-green-100 text-green-800'

  const colorMap = {
    'blue': 'bg-blue-100 text-blue-800',
    'orange': 'bg-orange-100 text-orange-800',
    'purple': 'bg-purple-100 text-purple-800',
    'pink': 'bg-pink-100 text-pink-800',
    'red': 'bg-red-100 text-red-800',
    'rose': 'bg-rose-100 text-rose-800',
    'green': 'bg-green-100 text-green-800',
    'cyan': 'bg-cyan-100 text-cyan-800'
  }
  return colorMap[categoryData.color] || 'bg-green-100 text-green-800'
}

// Fonction pour calculer le total par catégorie
const getHECategoryTotal = (category) => {
  const oils = props.extendedEssentialOils[category] || []
  return oils.reduce((total, oil) => {
    const selected = props.formData.selectedHE.find(h => h.name === oil.name)
    return total + (selected?.percent || 0)
  }, 0)
}

// Expansion automatique des groupes avec sélection
watch(() => props.formData.selectedHE, (newSelection) => {
  if (newSelection.length > 0) {
    groupedEssentialOils.value.forEach(group => {
      if (group.selectedCount > 0 && isGroupCollapsed(group.key)) {
        collapsedGroups.value[group.key] = false
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