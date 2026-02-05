<template>
    <section id="essential-oils"
             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
        <div class="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
            <div class="flex items-start gap-4">
                <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg" aria-hidden="true">
                    <span class="text-2xl text-white">🌿</span>
                </div>
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Huiles essentielles</h2>
                    <p class="text-gray-600">Sélectionnez parmi 100+ HE - Conformité stricte UE 1223/2009</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
                <!-- Indicateur de limite -->
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

        <!-- Filtres et recherche -->
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

                <!-- Filtre par propriété -->
                <div>
                    <label for="he-property" class="block text-sm font-medium text-gray-700 mb-2">
                        🏷️ Propriété
                    </label>
                    <select id="he-property"
                            :value="heFilterProperty"
                    class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    @change="$emit('update-property-filter', $event.target.value)">
                    <option value="">Toutes propriétés</option>
                    <option value="anti-âge">Anti-âge</option>
                    <option value="hydratant">Hydratant</option>
                    <option value="apaisant">Apaisant</option>
                    <option value="purifiant">Purifiant</option>
                    <option value="cicatrisant">Cicatrisant</option>
                    <option value="antioxydant">Antioxydant</option>
                    <option value="régénérant">Régénérant</option>
                    <option value="antiseptique">Antiseptique</option>
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
                </div>
            </div>
        </div>

        <!-- Grille des huiles essentielles -->
        <div class="space-y-8">
            <template v-for="(oils, category) in extendedEssentialOils" :key="category">
                <div v-if="oils.length > 0"
                     class="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-br from-green-50/30 to-emerald-50/30">
                    <!-- En-tête de catégorie -->
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
              <span class="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white">
                •
              </span>
                            {{ category }}
                            <span class="text-sm font-normal text-gray-500">
                ({{ oils.length }} HE)
              </span>
                        </h3>
                        <div class="text-sm text-green-600 font-medium">
                            Total catégorie: {{ getHECategoryTotal(category).toFixed(2) }}%
                        </div>
                    </div>

                    <!-- Grille d'HE -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div v-for="oil in oils"
                             :key="oil.name"
                             :class="[
                   'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1',
                   isHESelected(oil.name)
                     ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                     : 'border-gray-200 bg-white hover:border-green-300'
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
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
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

                <!-- Liste des HE -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="he in formData.selectedHE"
                         :key="he.name"
                         class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-bold text-gray-900">{{ he.name }}</h4>
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
import { computed } from 'vue'

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

// Pour l'exemple - devrait venir du parent
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

const getHECategoryTotal = (category) => {
    const oils = props.extendedEssentialOils[category] || []
    return oils.reduce((total, oil) => {
        const selected = props.formData.selectedHE.find(h => h.name === oil.name)
        return total + (selected?.percent || 0)
    }, 0)
}
</script>