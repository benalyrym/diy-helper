<template>
  <section id="hair-actives"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <!-- En-tête avec compteur -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
             aria-hidden="true">
          <span class="text-2xl text-white">💆</span>
        </div>
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Actifs capillaires</h2>
          <p class="text-gray-600">Sélectionnez et dosez vos actifs selon le type de cheveux et les besoins spécifiques</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div
            class="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-50 border border-blue-200">
                    <span class="text-sm font-semibold text-blue-700">
                        <span class="text-lg">{{ enabledActivesCount }}</span>
                        <span class="text-gray-500">/</span>
                        <span>{{ hairProfiles[formData.hairType]?.maxActives || 4 }}</span>
                        <span class="text-gray-500 ml-1">actifs</span>
                    </span>
        </div>
      </div>
    </div>

    <!-- Filtres d'actifs -->
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <label for="active-search" class="block text-sm font-medium text-gray-700 mb-2">
            🔍 Rechercher un actif
          </label>
          <input id="active-search"
                 :value="activeSearch"
                 type="text"
                 placeholder="Nom, INCI ou bénéfice..."
                 class="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 @input="$emit('update-search', $event.target.value)">
        </div>

        <div>
          <label for="active-type" class="block text-sm font-medium text-gray-700 mb-2">
            🏷️ Type d'actif
          </label>
          <select id="active-type"
                  :value="activeTypeFilter"
                  class="px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @change="$emit('update-type-filter', $event.target.value)">
            <option value="">Tous les types</option>
            <option value="repair">Réparation</option>
            <option value="moisture">Hydratation</option>
            <option value="humectant">Humectant</option>
            <option value="oil">Huiles & Beurres</option>
            <option value="scalp">Cuir chevelu</option>
            <option value="strength">Résistance</option>
            <option value="antioxidant">Antioxydant</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des actifs -->
    <div class="space-y-4">
      <div v-for="active in filteredActives"
           :key="active.id"
           :class="[
                     'active-card transform transition-all duration-300 hover:-translate-y-1',
                     active.enabled ? 'active-card-enabled shadow-lg border-l-4 border-blue-500' : 'active-card-disabled'
                 ]">
        <div class="flex items-start gap-4 p-4">
          <!-- Checkbox -->
          <div class="flex items-center h-6 pt-1">
            <input :id="`active-${active.id}`"
                   type="checkbox"
                   :checked="active.enabled"
                   :disabled="!active.enabled && enabledActivesCount >= hairProfiles[formData.hairType]?.maxActives"
                   class="h-5 w-5 rounded border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                   @change="updateActive(active.id, { enabled: $event.target.checked })">
          </div>

          <!-- Contenu de l'actif -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-4 mb-3">
              <!-- Nom et INCI -->
              <div class="md:w-1/3">
                <label :for="`active-${active.id}`" class="block cursor-pointer">
                  <h3 class="font-bold text-gray-900 text-lg mb-1">{{ active.label }}</h3>
                  <p class="text-sm text-gray-500 font-mono">
                    INCI: {{ active.inci }}
                  </p>
                </label>

                <!-- Badges -->
                <div class="flex flex-wrap gap-1 mt-2">
                                    <span :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        getTypeBadgeClass(active.type)
                                    ]">
                                        {{ getTypeLabel(active.type) }}
                                    </span>
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {{ active.benefit }}
                                    </span>
                </div>
              </div>

              <!-- Contrôles de dosage -->
              <div v-if="active.enabled" class="flex-1 space-y-4">
                <!-- Slider -->
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">Concentration</span>
                    <div class="flex items-center gap-2">
                                            <span class="text-lg font-bold"
                                                  :class="getPercentClass(active)">
                                                {{ active.percent }}%
                                            </span>
                      <span class="text-sm text-gray-500">
                                                ({{ grams(active.percent) }} g)
                                            </span>
                    </div>
                  </div>

                  <div class="relative">
                    <input :id="`active-range-${active.id}`"
                           type="range"
                           :value="active.percent"
                           :min="active.min"
                           :max="active.max"
                           step="0.1"
                           :class="getSliderClass(active)"
                           @input="updateActive(active.id, { percent: parseFloat($event.target.value) })">

                    <!-- Graduations -->
                    <div class="flex justify-between px-1 mt-1">
                      <span class="text-xs text-gray-400">{{ active.min }}%</span>
                      <span class="text-xs text-gray-400">
                                                {{ ((active.max - active.min) / 2 + active.min).toFixed(1) }}%
                                            </span>
                      <span class="text-xs text-gray-400">{{ active.max }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Contrôle numérique -->
                <div class="flex items-center gap-4">
                  <div class="relative flex-1">
                    <input type="number"
                           :value="active.percent"
                           :min="active.min"
                           :max="active.max"
                           step="0.1"
                           :class="[
                                                   'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center pr-10',
                                                   active.percent < active.min || active.percent > active.max
                                                   ? 'border-red-300 bg-red-50'
                                                   : 'border-blue-300'
                                               ]"
                           @change="updateActive(active.id, { percent: parseFloat($event.target.value) })">
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>

                  <!-- Boutons rapides -->
                  <div class="flex gap-1">
                    <button type="button"
                            @click="updateActive(active.id, { percent: active.min })"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Min
                    </button>
                    <button type="button"
                            @click="updateActive(active.id, { percent: active.percent || ((active.min + active.max) / 2) })"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Rec
                    </button>
                    <button type="button"
                            @click="updateActive(active.id, { percent: active.max })"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Max
                    </button>
                  </div>
                </div>
              </div>

              <!-- Info inactive -->
              <div v-else class="flex-1">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">
                    <span class="font-semibold">{{ active.benefit }}</span> - {{ active.description }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Plage recommandée: {{ active.min }}% - {{ active.max }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Description et détails -->
            <div v-if="active.enabled" class="mt-4 pt-4 border-t border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <span>📝</span>
                    Description
                  </h4>
                  <p class="text-sm text-gray-600">{{ active.description }}</p>
                </div>

                <div class="space-y-3">
                  <!-- Compatibilités -->
                  <div v-if="active.compatibility && active.compatibility.length > 0">
                    <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <span>🤝</span>
                      Compatibilité
                    </h4>
                    <div class="flex flex-wrap gap-1">
                                            <span v-for="comp in active.compatibility"
                                                  :key="comp"
                                                  class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                {{ comp }}
                                            </span>
                    </div>
                  </div>

                  <!-- Restrictions -->
                  <div v-if="active.restrictions && active.restrictions !== 'Aucune restriction particulière'">
                    <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <span>⚠️</span>
                      Précautions
                    </h4>
                    <p class="text-xs text-red-600">{{ active.restrictions }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avertissement limites -->
    <div v-if="tooManyActives"
         class="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300 animate-pulse"
         role="alert">
      <div class="flex items-start gap-3">
        <span class="text-amber-600 text-xl mt-1">⚠️</span>
        <div class="flex-1">
          <h3 class="font-bold text-amber-800 mb-1">
            Limite d'actifs atteinte
          </h3>
          <p class="text-sm text-amber-700">
            Pour les cheveux {{ formData.hairType }}, il est recommandé de ne pas dépasser
            <span class="font-bold">{{ hairProfiles[formData.hairType]?.maxActives }} actifs</span>.
            Trop d'actifs peuvent réduire leur efficacité.
          </p>
        </div>
      </div>
    </div>

    <!-- Recommandations par type de cheveux -->
    <div v-if="hairProfiles[formData.hairType]"
         class="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
      <div class="flex items-start gap-3">
        <span class="text-indigo-600 text-xl">💡</span>
        <div class="flex-1">
          <h3 class="font-bold text-indigo-800 mb-2">
            Recommandations pour cheveux {{ hairProfiles[formData.hairType].label }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">Types recommandés</h4>
              <div class="flex flex-wrap gap-1">
                                <span v-for="type in hairProfiles[formData.hairType].recommendedTypes"
                                      :key="type"
                                      class="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {{ getTypeLabel(type) }}
                                </span>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-1">Conseils</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li v-for="(tip, index) in hairProfiles[formData.hairType].tips.slice(0, 2)"
                    :key="index" class="flex items-start gap-1">
                  <span class="text-indigo-500 mt-0.5">•</span>
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  hairProfiles: {
    type: Object,
    required: true
  },
  enabledActivesCount: {
    type: Number,
    required: true
  },
  tooManyActives: {
    type: Boolean,
    required: true
  },
  filteredActives: {
    type: Array,
    required: true
  },
  activeSearch: {
    type: String,
    default: ''
  },
  activeTypeFilter: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update-active', 'update-search', 'update-type-filter'])

const grams = (percent) => {
  return Number(((props.formData.volume * percent) / 100).toFixed(2))
}

const getTypeLabel = (type) => {
  const labels = {
    'repair': 'Réparation',
    'moisture': 'Hydratation',
    'humectant': 'Humectant',
    'oil': 'Huile/Beurre',
    'scalp': 'Cuir chevelu',
    'strength': 'Résistance',
    'antioxidant': 'Antioxydant',
    'shine': 'Brillance',
    'volume': 'Volume'
  }
  return labels[type] || type
}

const getTypeBadgeClass = (type) => {
  const classes = {
    'repair': 'bg-orange-100 text-orange-800',
    'moisture': 'bg-blue-100 text-blue-800',
    'humectant': 'bg-green-100 text-green-800',
    'oil': 'bg-amber-100 text-amber-800',
    'scalp': 'bg-purple-100 text-purple-800',
    'strength': 'bg-red-100 text-red-800',
    'antioxidant': 'bg-emerald-100 text-emerald-800',
    'shine': 'bg-yellow-100 text-yellow-800',
    'volume': 'bg-cyan-100 text-cyan-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getPercentClass = (active) => {
  const percent = active.percent
  if (percent < active.min) return 'text-red-600'
  if (percent > active.max) return 'text-red-600'
  return 'text-blue-600'
}

const getSliderClass = (active) => {
  const percent = active.percent
  if (percent < active.min || percent > active.max) {
    return 'w-full h-2 bg-gradient-to-r from-red-300 via-red-400 to-red-500 rounded-lg appearance-none cursor-pointer'
  }
  return 'w-full h-2 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 rounded-lg appearance-none cursor-pointer'
}

const updateActive = (id, updates) => {
  emit('update-active', id, updates)
}

const updateSearch = (value) => {
  emit('update-search', value)
}

const updateTypeFilter = (value) => {
  emit('update-type-filter', value)
}
</script>

<style scoped>
.active-card-enabled {
  @apply bg-gradient-to-r from-blue-50 to-white border border-blue-200;
}

.active-card-disabled {
  @apply bg-gray-50 border border-gray-200;
}

.active-card {
  @apply rounded-xl transition-all duration-300;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none h-5 w-5 rounded-full bg-white border-2 border-blue-500 shadow-lg cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply h-5 w-5 rounded-full bg-white border-2 border-blue-500 shadow-lg cursor-pointer;
}
</style>