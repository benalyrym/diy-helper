<template>
    <section id="oil-phase"
             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
        <div class="flex items-start gap-4 mb-8">
            <div class="p-3 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">🫒</span>
            </div>
            <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Phase huileuse</h2>
                        <p class="text-gray-600">Huiles végétales, beurres et cires - Nutrition et texture</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <div :class="[
              'px-4 py-2 rounded-full border font-semibold',
              oilPhaseExceeded
                ? 'bg-gradient-to-r from-red-100 to-orange-100 border-red-300 text-red-700'
                : 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 text-amber-700'
            ]">
              <span class="text-sm">
                Total: {{ oilPhaseTotal.toFixed(1) }}% / {{ skinProfiles[formData.skinType]?.oil || 20 }}%
              </span>
                        </div>
                        <button @click="$emit('auto-calculate')"
                                type="button"
                                class="px-4 py-2 text-sm bg-amber-950 text-amber-100 rounded-lg hover:bg-amber-700 transition-colors">
                            Auto-calcul
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Catégories d'huiles -->
        <div class="space-y-6">
            <div v-for="(category, catName) in oilPhaseOptions"
                 :key="catName"
                 :class="[
             'border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-md',
             selectedOilPhase.some(item => category.items.some(i => i.name === item.name))
               ? 'border-amber-300 bg-amber-50/50'
               : 'border-gray-200 hover:border-amber-200'
           ]">
                <!-- En-tête de catégorie -->
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
            <span class="p-2 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-lg text-white">
              {{ category.icon }}
            </span>
                        {{ catName }}
                        <span class="text-sm font-normal text-gray-500">
              ({{ category.items.filter(i => i.selected).length }}/{{ category.items.length }})
            </span>
                    </h3>
                    <button @click="$emit('toggle-category', category, 'oil')"
                            type="button"
                            class="text-sm text-amber-600 hover:text-amber-800"
                            :disabled="oilPhaseExceeded && !selectedOilPhase.some(item => category.items.some(i => i.name === item.name))">
                        {{ selectedOilPhase.some(item => category.items.some(i => i.name === item.name)) ? 'Tout désélectionner' : 'Tout sélectionner' }}
                    </button>
                </div>

                <!-- Grille d'huiles -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="oil in category.items"
                         :key="oil.name"
                         :class="[
                 'rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-1',
                 oil.selected
                   ? 'bg-gradient-to-br from-amber-50 to-white border-2 border-amber-300 shadow-md'
                   : 'bg-white border border-gray-200 hover:border-amber-200',
                 !oil.selected && oilPhaseExceeded ? 'opacity-50 cursor-not-allowed' : ''
               ]">
                        <div class="flex items-start gap-3">
                            <!-- Checkbox -->
                            <div class="flex items-center h-6 pt-1">
                                <input :id="`oil-${oil.name}`"
                                       type="checkbox"
                                       v-model="oil.selected"
                                       :disabled="!oil.selected && oilPhaseExceeded"
                                       class="h-5 w-5 rounded border-2 border-gray-300 checked:border-amber-600 checked:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                                       @change="$emit('update-oil-phase', catName, oil.name, { selected: oil.selected })">
                            </div>

                            <!-- Contenu -->
                            <div class="flex-1">
                                <!-- En-tête avec comédogénicité -->
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <label :for="`oil-${oil.name}`"
                                               :class="[
                             'font-bold cursor-pointer',
                             oil.selected ? 'text-gray-900 hover:text-amber-600' : 'text-gray-700'
                           ]">
                                            {{ oil.name }}
                                        </label>
                                        <p class="text-xs text-gray-500 mt-1">
                                            {{ oil.description }}
                                        </p>
                                    </div>

                                    <!-- Indicateur comédogénicité -->
                                    <div :class="[
                    'px-2 py-1 rounded-full text-xs font-bold',
                    oil.comedogenic <= 1 ? 'bg-green-100 text-green-800' :
                    oil.comedogenic <= 2 ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  ]"
                                         :title="`Indice comédogène: ${oil.comedogenic}/5`">
                                        COM: {{ oil.comedogenic }}
                                    </div>
                                </div>

                                <!-- Dosage -->
                                <div v-if="oil.selected" class="mt-4 space-y-3">
                                    <div>
                                        <label :for="`oil-percent-${oil.name}`"
                                               class="block text-xs font-medium text-gray-700 mb-1">
                                            Dosage (%)
                                        </label>
                                        <div class="flex items-center gap-2">
                                            <div class="relative flex-1">
                                                <input :id="`oil-percent-${oil.name}`"
                                                       type="number"
                                                       v-model.number="oil.percent"
                                                       :min="oil.min"
                                                       :max="Math.min(oil.max, getRemainingOilPercent())"
                                                       step="0.1"
                                                       :class="[
                                 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-1',
                                 oil.percent > getRemainingOilPercent() + oil.percent
                                   ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                   : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
                               ]"
                                                       @change="$emit('update-oil-phase', catName, oil.name, { percent: oil.percent })">
                                                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          %
                        </span>
                                            </div>
                                            <span class="text-xs text-gray-500 min-w-16 text-right">
                        {{ grams(oil.percent) }} g
                      </span>
                                        </div>
                                    </div>

                                    <!-- Slider pour dosage -->
                                    <div class="space-y-1">
                                        <div class="flex justify-between text-xs">
                                            <span class="text-gray-500">Min: {{ oil.min }}%</span>
                                            <span class="text-amber-600 font-medium">Recommandé</span>
                                            <span class="text-gray-500">Max: {{ oil.max }}%</span>
                                        </div>
                                        <input type="range"
                                               v-model.number="oil.percent"
                                               :min="oil.min"
                                               :max="Math.min(oil.max, getRemainingOilPercent() + oil.percent)"
                                               step="0.1"
                                               class="w-full h-2 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                               @change="$emit('update-oil-phase', catName, oil.name, { percent: oil.percent })">
                                    </div>
                                </div>

                                <!-- Propriétés -->
                                <div class="mt-3">
                                    <div class="flex flex-wrap gap-1">
                    <span v-for="prop in oil.properties.slice(0, 3)"
                          :key="prop"
                          :class="getOilPropertyClass(prop)">
                      {{ prop }}
                    </span>
                                        <span v-if="oil.properties.length > 3"
                                              class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      +{{ oil.properties.length - 3 }}
                    </span>
                                    </div>
                                </div>

                                <!-- Caractéristiques spécifiques -->
                                <div v-if="oil.specifics" class="mt-2">
                                    <div class="flex flex-wrap gap-1">
                    <span v-for="spec in oil.specifics"
                          :key="spec"
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
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

        <!-- Résumé phase huileuse -->
        <div v-if="selectedOilPhase.length > 0"
             class="mt-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-300">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
                    <span class="text-amber-600">📊</span>
                    Répartition phase huileuse
                </h3>
                <div class="flex items-center gap-3">
                    <div :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            oilPhaseExceeded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          ]">
                        {{ oilPhaseExceeded ? '⚠️ Dépassement' : '✅ Dans la limite' }}
                    </div>
                    <button @click="$emit('optimize')"
                            type="button"
                            class="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        Optimiser
                    </button>
                </div>
            </div>

            <!-- Graphique et détails -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Graphique -->
                <div class="lg:w-1/3">
                    <div class="relative">
                        <!-- Jauge de progression -->
                        <div class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden mb-2">
                            <div class="h-full rounded-full transition-all duration-1000"
                                 :class="oilPhaseExceeded ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'"
                                 :style="{ width: `${Math.min(oilPhaseTotal, 100)}%` }">
                            </div>
                        </div>

                        <div class="flex justify-between text-sm mb-6">
                            <span class="text-gray-600">0%</span>
                            <span class="font-bold" :class="oilPhaseExceeded ? 'text-red-600' : 'text-amber-600'">
                {{ oilPhaseTotal.toFixed(1) }}%
              </span>
                            <span class="text-gray-600">{{ skinProfiles[formData.skinType]?.oil || 20 }}% (max)</span>
                        </div>

                        <!-- Liste des huiles -->
                        <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
                            <div v-for="item in selectedOilPhase"
                                 :key="item.name"
                                 class="bg-white/80 rounded-lg p-3 border border-amber-200">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-900 truncate">{{ item.name }}</span>
                                        <span :class="[
                      'text-xs px-1.5 py-0.5 rounded',
                      item.comedogenic <= 1 ? 'bg-green-100 text-green-800' :
                      item.comedogenic <= 2 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      COM {{ item.comedogenic }}
                    </span>
                                    </div>
                                    <span class="font-bold text-amber-700">{{ item.percent }}%</span>
                                </div>
                                <div class="text-xs text-gray-500 flex justify-between">
                                    <span>{{ grams(item.percent) }} g</span>
                                    <span class="text-amber-600">{{ ((item.percent / oilPhaseTotal) * 100).toFixed(0) }}% de la phase</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="lg:w-2/3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Répartition par comédogénicité -->
                        <div class="bg-white rounded-xl p-4 border border-amber-200">
                            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span>📈</span>
                                Répartition COM
                            </h4>
                            <div class="space-y-3">
                                <div v-for="com in comedogenicDistribution"
                                     :key="com.level"
                                     class="space-y-1">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-700">COM {{ com.level }}</span>
                                        <span class="font-medium">{{ com.percent }}%</span>
                                    </div>
                                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all duration-500"
                                             :class="com.colorClass"
                                             :style="{ width: `${com.percent}%` }">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recommandations -->
                        <div class="bg-white rounded-xl p-4 border border-amber-200">
                            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span>💡</span>
                                Recommandations
                            </h4>
                            <div class="space-y-2">
                                <p class="text-sm text-gray-600">
                                    Pour une peau <span class="font-bold capitalize">{{ formData.skinType }}</span>,
                                    limitez la phase huileuse à
                                    <span class="font-bold text-amber-700">{{ skinProfiles[formData.skinType]?.oil || 20 }}%</span>.
                                </p>
                                <ul class="text-sm text-gray-600 space-y-1">
                                    <li class="flex items-start gap-2">
                                        <span class="text-green-500 mt-1">✓</span>
                                        <span>Privilégiez les huiles COM 0-1 pour peaux grasses</span>
                                    </li>
                                    <li class="flex items-start gap-2">
                                        <span class="text-amber-500 mt-1">✓</span>
                                        <span>Évitez les mélanges trop complexes (2-3 huiles max)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Avertissement dépassement -->
                    <div v-if="oilPhaseExceeded"
                         class="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-300">
                        <div class="flex items-start gap-3">
                            <span class="text-red-600 text-xl mt-1">⚠️</span>
                            <div>
                                <h4 class="font-bold text-red-800 mb-1">Dépassement détecté</h4>
                                <p class="text-sm text-red-700">
                                    La phase huileuse dépasse de
                                    <span class="font-bold">{{ (oilPhaseTotal - (skinProfiles[formData.skinType]?.oil || 20)).toFixed(1) }}%</span>
                                    la limite recommandée pour une peau {{ formData.skinType }}.
                                    Cela peut rendre la formule trop grasse et comédogène.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Total -->
                    <div class="mt-6 pt-6 border-t border-amber-200">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-bold text-gray-900">Total phase huileuse</span>
                                <p class="text-sm text-gray-500">Recommandé: {{ skinProfiles[formData.skinType]?.oil || 20 }}% max</p>
                            </div>
                            <div class="text-right">
                <span :class="[
                  'text-2xl font-bold',
                  oilPhaseExceeded ? 'text-red-600' : 'text-amber-700'
                ]">
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
    oilPhaseOptions: {
        type: Object,
        required: true
    },
    selectedOilPhase: {
        type: Array,
        required: true
    },
    oilPhaseTotal: {
        type: Number,
        required: true
    },
    formData: {
        type: Object,
        required: true
    },
    skinProfiles: {
        type: Object,
        required: true
    },
    oilPhaseExceeded: {
        type: Boolean,
        required: true
    },
    comedogenicDistribution: {
        type: Array,
        required: true
    }
})

const emit = defineEmits([
    'update-oil-phase',
    'toggle-category',
    'auto-calculate',
    'optimize'
])

// Pour l'exemple - devrait venir du parent
const volume = 50

const grams = (percent) => {
    return Number(((volume * percent) / 100).toFixed(2))
}

const getRemainingOilPercent = () => {
    const max = props.skinProfiles[props.formData.skinType]?.oil || 20
    return Math.max(0, max - props.oilPhaseTotal)
}

const getOilPropertyClass = (property) => {
    const classes = {
        'Non comédogène': 'bg-green-100 text-green-800 border border-green-200',
        'Régulateur': 'bg-blue-100 text-blue-800 border border-blue-200',
        'Anti-âge': 'bg-purple-100 text-purple-800 border border-purple-200',
        'Antioxydant': 'bg-orange-100 text-orange-800 border border-orange-200',
        'Hydratant': 'bg-cyan-100 text-cyan-800 border border-cyan-200',
        'Cicatrisant': 'bg-red-100 text-red-800 border border-red-200',
        'Anti-inflammatoire': 'bg-pink-100 text-pink-800 border border-pink-200',
        'Séborégulateur': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        'default': 'bg-gray-100 text-gray-800 border border-gray-200'
    }

    for (const [key, className] of Object.entries(classes)) {
        if (property.toLowerCase().includes(key.toLowerCase())) {
            return className
        }
    }

    return classes.default
}
</script>