<template>
  <section id="actives"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg" aria-hidden="true">
          <span class="text-2xl text-white">🧴</span>
        </div>
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Actifs capillaires</h2>
          <p class="text-gray-600">Sélectionnez et dosez vos actifs selon les besoins capillaires</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-200">
          <span class="text-sm font-semibold text-purple-700">
            <span class="text-lg">{{ enabledActivesCount }}</span>
            <span class="text-gray-500">/</span>
            <span>{{ hairProfiles[formData.hairType]?.maxActives || 4 }}</span>
            <span class="text-gray-500 ml-1">actifs</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Filtres d'actifs -->
    <div class="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <label for="active-search" class="block text-sm font-medium text-gray-700 mb-2">
            🔍 Rechercher un actif
          </label>
          <input id="active-search"
                 :value="activeSearch"
                 type="text"
                 placeholder="Nom, INCI ou propriété..."
                 class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                 @input="updateActiveSearch($event.target.value)">
        </div>

        <div>
          <label for="active-type" class="block text-sm font-medium text-gray-700 mb-2">
            🏷️ Filtrer par type
          </label>
          <select id="active-type"
                  :value="activeTypeFilter"
                  class="px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  @change="updateActiveTypeFilter($event.target.value)">
            <option value="">Tous les types</option>
            <option value="hydratant">Hydratant</option>
            <option value="reparateur">Réparateur</option>
            <option value="gainant">Gainant</option>
            <option value="antistatique">Antistatique</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des actifs -->
    <div class="space-y-4">
      <div v-for="active in filteredActives"
           :key="active.key"
           :class="[
             'active-card transform transition-all duration-300 hover:-translate-y-1',
             active.enabled ? 'active-card-enabled shadow-lg' : 'active-card-disabled'
           ]">
        <div class="flex items-start gap-4 p-4">
          <!-- Checkbox avec état -->
          <div class="flex items-center h-6 pt-1">
            <input :id="`active-${active.key}`"
                   type="checkbox"
                   v-model="active.enabled"
                   :disabled="!active.enabled && enabledActivesCount >= hairProfiles[formData.hairType]?.maxActives"
                   class="h-5 w-5 rounded border-2 border-gray-300 checked:border-purple-600 checked:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                   :aria-describedby="`active-desc-${active.key}`">
          </div>

          <!-- Contenu de l'actif -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-4 mb-3">
              <!-- Nom et INCI -->
              <div class="md:w-1/3">
                <label :for="`active-${active.key}`" class="block">
                  <h3 class="font-bold text-gray-900 text-lg mb-1">{{ active.label }}</h3>
                  <p class="text-sm text-gray-500 font-mono" :id="`active-desc-${active.key}`">
                    INCI: {{ active.inci }}
                  </p>
                </label>

                <!-- Badges -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    active.type === 'hydratant' ? 'bg-blue-100 text-blue-800' :
                    active.type === 'reparateur' ? 'bg-green-100 text-green-800' :
                    active.type === 'gainant' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  ]">
                    {{ getActiveTypeLabel(active.type) }}
                  </span>
                  <span v-if="active.stability"
                        class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ active.stability }}
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
                            :class="getActivePercentClass(active)">
                        {{ active.percent }}%
                      </span>
                      <span class="text-sm text-gray-500">
                        ({{ grams(active.percent) }} g)
                      </span>
                    </div>
                  </div>

                  <div class="relative">
                    <input :id="`active-range-${active.key}`"
                           type="range"
                           v-model.number="active.percent"
                           :min="active.min"
                           :max="active.max"
                           step="0.1"
                           :class="getActiveSliderClass(active)"
                           :aria-valuetext="`${active.percent} pourcent`"
                           aria-valuemin="active.min"
                           aria-valuemax="active.max"
                           aria-valuenow="active.percent">

                    <!-- Graduations -->
                    <div class="flex justify-between px-1 mt-1">
                      <span class="text-xs text-gray-400">{{ active.min }}%</span>
                      <span class="text-xs text-gray-400">{{ ((active.max - active.min) / 2 + active.min).toFixed(1) }}%</span>
                      <span class="text-xs text-gray-400">{{ active.max }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Contrôle numérique -->
                <div class="flex items-center gap-4">
                  <div class="relative flex-1">
                    <input type="number"
                           v-model.number="active.percent"
                           :min="active.min"
                           :max="active.max"
                           step="0.1"
                           :class="[
                             'input-field text-center pr-10',
                             active.percent < active.min || active.percent > active.max ? 'input-error' : 'input-valid'
                           ]"
                           aria-label="Pourcentage numérique">
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>

                  <!-- Boutons rapides -->
                  <div class="flex gap-1">
                    <button type="button"
                            @click="active.percent = active.min"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      Min
                    </button>
                    <button type="button"
                            @click="active.percent = (active.min + active.max) / 2"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      Moyen
                    </button>
                    <button type="button"
                            @click="active.percent = active.max"
                            class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      Max
                    </button>
                  </div>
                </div>
              </div>

              <!-- Info inactive -->
              <div v-else class="flex-1">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600">
                    Plage recommandée:
                    <span class="font-semibold">{{ active.min }}% - {{ active.max }}%</span>
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ active.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Compatibilités et avertissements -->
            <div v-if="active.enabled" class="mt-4 pt-4 border-t border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="active.compatibility && active.compatibility.length > 0">
                  <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <span>🤝</span>
                    Compatible avec
                  </h4>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="comp in active.compatibility"
                          :key="comp"
                          class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {{ comp }}
                    </span>
                  </div>
                </div>

                <div v-if="active.restrictions">
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
            Pour des cheveux {{ formData.hairType }}, il est recommandé de ne pas dépasser
            <span class="font-bold">{{ hairProfiles[formData.hairType]?.maxActives }} actifs</span>.
            Trop d'actifs peuvent réduire leur efficacité et alourdir les cheveux.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  formData: { type: Object, required: true },
  hairProfiles: { type: Object, required: true },
  enabledActivesCount: { type: Number, required: true },
  tooManyActives: { type: Boolean, required: true },
  filteredActives: { type: Array, required: true },
  activeSearch: { type: String, default: '' },
  activeTypeFilter: { type: String, default: '' },
  updateActiveSearch: { type: Function, required: true },
  updateActiveTypeFilter: { type: Function, required: true },
  grams: { type: Function, required: true }
})

const getActiveTypeLabel = (type) => {
  const labels = {
    hydratant: 'Hydratant',
    reparateur: 'Réparateur',
    gainant: 'Gainant',
    antistatique: 'Antistatique',
    nutritif: 'Nutritif'
  }

  return labels[type] || type
}

const getActivePercentClass = (active) => {
  const percent = active.percent
  const optimal = (active.min + active.max) / 2

  if (percent < active.min) return 'text-red-600'
  if (percent > active.max) return 'text-red-600'
  if (Math.abs(percent - optimal) < (active.max - active.min) * 0.2) return 'text-green-600'
  return 'text-amber-600'
}

const getActiveSliderClass = (active) => {
  const percent = active.percent
  const optimal = (active.min + active.max) / 2
  const range = active.max - active.min

  if (percent < active.min || percent > active.max) return 'range-red'
  if (Math.abs(percent - optimal) < range * 0.2) return 'range-green'
  return 'range-amber'
}
</script>


