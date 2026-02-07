<template>
  <div :class="containerClasses">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-3 rounded-lg z-50">
      Passer au contenu principal
    </a>

    <div class="mx-auto space-y-8" role="application" aria-label="Formulaire de formulation shampooing">
      <!-- En-tête spécifique shampooing -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-white rounded-xl shadow-sm">
              <span class="text-3xl">🧴</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Formulaire Shampooing</h1>
              <p class="text-gray-600">Créez votre shampooing personnalisé selon vos besoins capillaires</p>
            </div>
          </div>
          <div class="text-right">
                        <span class="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            Complétion: {{ completionPercentage }}%
                        </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar résumé -->
        <aside class="lg:w-1/4" v-if="!isMobile || summaryExpanded">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Résumé du Shampooing</h3>

            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-700 mb-2">Composition globale</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Base lavante</span>
                    <span class="font-medium">{{ baseLavanteTotal.toFixed(1) }}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Conditionneurs</span>
                    <span class="font-medium">{{ conditionersTotal.toFixed(1) }}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Eau</span>
                    <span class="font-medium">{{ waterPercent.toFixed(1) }}%</span>
                  </div>
                </div>
              </div>

              <div class="border-t pt-4">
                <h4 class="font-medium text-gray-700 mb-2">Type de cheveux</h4>
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ getHairTypeEmoji(formData.hairType) }}</span>
                  <span class="font-medium">{{ getHairTypeLabel(formData.hairType) }}</span>
                </div>
              </div>

              <div class="border-t pt-4">
                <h4 class="font-medium text-gray-700 mb-2">pH cible</h4>
                <div class="flex items-center justify-between">
                  <span class="text-lg">🧪</span>
                  <span class="font-bold text-blue-600">pH {{ formData.targetPH }}</span>
                </div>
              </div>

              <button @click="toggleSummary" v-if="isMobile" class="w-full mt-4 btn-secondary">
                Masquer le résumé
              </button>
            </div>
          </div>
        </aside>

        <!-- Contenu principal -->
        <main id="main-content" class="lg:w-3/4 space-y-8">
          <!-- Section 1: Informations de base -->
          <section class="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Informations de base</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="label required">Nom du shampooing</label>
                <input
                    v-model="formData.name"
                    type="text"
                    class="input-field"
                    placeholder="Ex: Shampooing doux à l'avocat"
                    required
                >
              </div>

              <div>
                <label class="label required">Volume total (ml)</label>
                <input
                    v-model="formData.volume"
                    type="number"
                    min="50"
                    max="1000"
                    class="input-field"
                    placeholder="250"
                    required
                >
              </div>

              <div>
                <label class="label required">Type de cheveux</label>
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="type in hairTypes" :key="type.id"
                       :class="[
                                             'skin-type-card p-4 text-center',
                                             formData.hairType === type.id ? 'skin-type-card-selected' : 'skin-type-card-default'
                                         ]"
                       @click="formData.hairType = type.id">
                    <span class="text-2xl block mb-2">{{ type.emoji }}</span>
                    <span class="font-medium">{{ type.label }}</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="label">Objectifs capillaires</label>
                <div class="space-y-2">
                  <div v-for="goal in hairGoals" :key="goal.id"
                       class="flex items-center gap-3">
                    <input
                        :id="`goal-${goal.id}`"
                        v-model="formData.hairGoals"
                        type="checkbox"
                        :value="goal.id"
                        class="w-4 h-4 text-blue-600 rounded"
                    >
                    <label :for="`goal-${goal.id}`" class="flex items-center gap-2 cursor-pointer">
                      <span>{{ goal.emoji }}</span>
                      <span>{{ goal.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 2: Système lavant -->
          <section class="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <span class="text-xl">🧼</span>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Système lavant</h2>
              </div>
              <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                                {{ baseLavanteTotal.toFixed(1) }}%
                            </span>
            </div>

            <div class="space-y-6">
              <!-- Tensioactifs primaires -->
              <div>
                <h3 class="font-bold text-gray-900 mb-4">Tensioactifs primaires ({{ primarySurfactants.length }})</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="surfactant in primarySurfactants" :key="surfactant.id"
                       class="border rounded-xl p-4">
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <h4 class="font-medium">{{ surfactant.name }}</h4>
                        <p class="text-sm text-gray-600">{{ surfactant.inci }}</p>
                      </div>
                      <input
                          v-model="surfactant.percent"
                          type="number"
                          step="0.1"
                          min="0"
                          :max="surfactant.max"
                          class="w-20 px-3 py-1 border rounded"
                      >
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">Mousse: {{ surfactant.foam }}</span>
                      <span class="text-gray-500">Douceur: {{ surfactant.mildness }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tensioactifs secondaires -->
              <div>
                <h3 class="font-bold text-gray-900 mb-4">Tensioactifs secondaires</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div v-for="surfactant in secondarySurfactants" :key="surfactant.id"
                       class="border rounded-xl p-4">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-medium">{{ surfactant.name }}</h4>
                      <input
                          v-model="surfactant.selected"
                          type="checkbox"
                          class="w-4 h-4"
                      >
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ surfactant.function }}</p>
                    <input
                        v-if="surfactant.selected"
                        v-model="surfactant.percent"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        class="w-full px-3 py-1 border rounded"
                    >
                  </div>
                </div>
              </div>

              <!-- Épaississants -->
              <div>
                <h3 class="font-bold text-gray-900 mb-4">Système d'épaississement</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="label">Épaississant</label>
                    <select v-model="formData.thickener" class="input-field">
                      <option value="">Sélectionner...</option>
                      <option value="salt">Sel (NaCl)</option>
                      <option value="xanthan">Gomme Xanthane</option>
                      <option value="cocoamide">Cocoamide DEA</option>
                      <option value="acrylates">Polyacrylate</option>
                    </select>
                  </div>
                  <div>
                    <label class="label">Pourcentage</label>
                    <input
                        v-model="formData.thickenerPercent"
                        type="number"
                        step="0.1"
                        min="0"
                        max="3"
                        class="input-field"
                    >
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 3: Conditionneurs et actifs -->
          <section class="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <span class="text-xl">✨</span>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Conditionneurs et actifs</h2>
              </div>
              <span class="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
                                {{ conditionersTotal.toFixed(1) }}%
                            </span>
            </div>

            <div class="space-y-6">
              <!-- Conditionneurs cationiques -->
              <div>
                <h3 class="font-bold text-gray-900 mb-4">Conditionneurs</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div v-for="conditioner in conditioners" :key="conditioner.id"
                       :class="[
                                             'p-4 border rounded-xl cursor-pointer transition-all',
                                             conditioner.selected ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                                         ]"
                       @click="toggleConditioner(conditioner)">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-medium">{{ conditioner.name }}</h4>
                      <input
                          v-model="conditioner.selected"
                          type="checkbox"
                          class="w-4 h-4"
                          @click.stop
                      >
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ conditioner.benefit }}</p>
                    <div v-if="conditioner.selected" class="mt-3">
                      <label class="text-xs text-gray-500">Pourcentage (%)</label>
                      <input
                          v-model="conditioner.percent"
                          type="number"
                          step="0.1"
                          min="0"
                          :max="conditioner.max"
                          class="w-full px-3 py-1 border rounded"
                          @click.stop
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actifs capillaires -->
              <div>
                <h3 class="font-bold text-gray-900 mb-4">Actifs capillaires</h3>
                <div class="space-y-4">
                  <div v-for="active in hairActives" :key="active.id"
                       class="flex items-center justify-between p-4 border rounded-xl">
                    <div>
                      <h4 class="font-medium">{{ active.name }}</h4>
                      <p class="text-sm text-gray-600">{{ active.description }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <input
                          v-model="active.percent"
                          type="number"
                          step="0.1"
                          min="0"
                          max="active.max"
                          class="w-20 px-3 py-1 border rounded"
                      >
                      <span class="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 4: pH et ajustements -->
          <section class="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <span class="text-xl">⚗️</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">pH et ajustements</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="label">pH cible</label>
                <div class="flex items-center gap-4">
                  <input
                      v-model="formData.targetPH"
                      type="range"
                      min="4"
                      max="7"
                      step="0.1"
                      class="flex-1 range-green"
                  >
                  <span class="text-2xl font-bold text-gray-900">{{ formData.targetPH }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Acide (4.0)</span>
                  <span>Neutre (5.5)</span>
                  <span>Alcalin (7.0)</span>
                </div>
              </div>

              <div>
                <label class="label">Ajusteur de pH</label>
                <select v-model="formData.pHAdjuster" class="input-field">
                  <option value="citric">Acide citrique</option>
                  <option value="lactic">Acide lactique</option>
                  <option value="sodium_bicarbonate">Bicarbonate de sodium</option>
                </select>
              </div>

              <div>
                <label class="label">Parfum</label>
                <select v-model="formData.fragrance" class="input-field">
                  <option value="">Sans parfum</option>
                  <option value="floral">Floral</option>
                  <option value="fruity">Fruité</option>
                  <option value="herbal">Herbal</option>
                  <option value="woody">Boisé</option>
                </select>
              </div>

              <div>
                <label class="label">Colorant (optionnel)</label>
                <input
                    v-model="formData.color"
                    type="text"
                    class="input-field"
                    placeholder="Ex: Bleu ciel"
                >
              </div>
            </div>
          </section>

          <!-- Section 5: Eau et proportions -->
          <section class="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <span class="text-xl">💧</span>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Eau et proportions</h2>
              </div>
              <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                                Total: {{ totalPercent.toFixed(1) }}%
                            </span>
            </div>

            <div class="space-y-6">
              <!-- Diagramme circulaire simplifié -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-2xl font-bold text-blue-600">{{ baseLavanteTotal.toFixed(1) }}%</div>
                  <div class="text-sm text-gray-600">Base lavante</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-2xl font-bold text-purple-600">{{ conditionersTotal.toFixed(1) }}%</div>
                  <div class="text-sm text-gray-600">Conditionneurs</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-2xl font-bold text-green-600">{{ waterPercent.toFixed(1) }}%</div>
                  <div class="text-sm text-gray-600">Eau</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-2xl font-bold text-yellow-600">{{ (100 - totalPercent).toFixed(1) }}%</div>
                  <div class="text-sm text-gray-600">Restant</div>
                </div>
              </div>

              <!-- Équilibre automatique -->
              <div class="p-4 bg-blue-50 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-blue-900">Équilibre automatique</h4>
                    <p class="text-sm text-blue-700">Ajustez automatiquement l'eau pour atteindre 100%</p>
                  </div>
                  <button @click="autoBalance" class="btn-primary px-4 py-2">
                    Équilibrer
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 6: Instructions et notes -->
          <section class="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Instructions et notes</h2>
            </div>

            <div class="space-y-6">
              <div>
                <label class="label">Instructions de fabrication</label>
                <textarea
                    v-model="formData.instructions"
                    rows="6"
                    class="input-field"
                    placeholder="Étapes détaillées pour fabriquer le shampooing..."
                ></textarea>
              </div>

              <div>
                <label class="label">Notes de formulation</label>
                <textarea
                    v-model="formData.notes"
                    rows="4"
                    class="input-field"
                    placeholder="Observations, conseils, variantes..."
                ></textarea>
              </div>

              <div>
                <label class="label">Durée de conservation (mois)</label>
                <input
                    v-model="formData.shelfLife"
                    type="number"
                    min="3"
                    max="24"
                    class="input-field w-32"
                >
              </div>
            </div>
          </section>
        </main>
      </div>

      <!-- Actions -->
      <div class="flex justify-between gap-4 pt-8 border-t">
        <button @click="cancel" class="btn-secondary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Annuler
        </button>

        <div class="flex gap-4">
          <button @click="saveDraft" class="btn-outline">
            Sauvegarder comme brouillon
          </button>
          <button @click="save" :disabled="!isValid" class="btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Créer le shampooing
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  recipeType: any
})

const emit = defineEmits(['save', 'cancel', 'save-draft'])

// États UI
const isMobile = ref(false)
const summaryExpanded = ref(true)

// Données du formulaire
const formData = ref({
  name: '',
  volume: 250,
  hairType: 'normal',
  hairGoals: [],
  targetPH: 5.5,
  thickener: '',
  thickenerPercent: 0,
  pHAdjuster: 'citric',
  fragrance: '',
  color: '',
  instructions: '',
  notes: '',
  shelfLife: 12,
  preservativeSystem: 'cosgard',
  preservativePercent: 0.5
})

// Tensioactifs primaires
const primarySurfactants = ref([
  { id: 'sls', name: 'Sodium Laureth Sulfate', inci: 'Sodium Laureth Sulfate', percent: 15, max: 25, foam: 'Élevée', mildness: 'Faible' },
  { id: 'sles', name: 'Sodium Lauryl Sulfate', inci: 'Sodium Lauryl Sulfate', percent: 10, max: 20, foam: 'Très élevée', mildness: 'Très faible' },
  { id: 'coco_betaine', name: 'Coco-Betaine', inci: 'Cocamidopropyl Betaine', percent: 8, max: 15, foam: 'Bonne', mildness: 'Élevée' },
  { id: 'decyl_glucoside', name: 'Decyl Glucoside', inci: 'Decyl Glucoside', percent: 12, max: 20, foam: 'Moyenne', mildness: 'Très élevée' }
])

// Tensioactifs secondaires
const secondarySurfactants = ref([
  { id: 'cocoamide', name: 'Cocoamide DEA', function: 'Épaississant/mousse', selected: false, percent: 0 },
  { id: 'lauramide', name: 'Lauramide DEA', function: 'Épaississant', selected: false, percent: 0 },
  { id: 'cocamidopropyl', name: 'Cocamidopropyl', function: 'Surgraissage', selected: false, percent: 0 }
])

// Conditionneurs
const conditioners = ref([
  { id: 'behentrimonium', name: 'Behentrimonium Chloride', benefit: 'Démêlage', selected: false, percent: 1, max: 3 },
  { id: 'cetrimonium', name: 'Cetrimonium Chloride', benefit: 'Brillance', selected: false, percent: 0.5, max: 2 },
  { id: 'guar_hydroxypropyl', name: 'Guar Hydroxypropyltrimonium', benefit: 'Volume', selected: false, percent: 0.3, max: 1 },
  { id: 'polyquaternium', name: 'Polyquaternium-7', benefit: 'Fixation légère', selected: false, percent: 0.2, max: 1 },
  { id: 'panthenol', name: 'Panthenol', benefit: 'Hydratation', selected: false, percent: 0.5, max: 2 },
  { id: 'silicone', name: 'Dimethicone', benefit: 'Lissage', selected: false, percent: 0.5, max: 2 }
])

// Actifs capillaires
const hairActives = ref([
  { id: 'keratin', name: 'Kératine hydrolysée', description: 'Réparation', percent: 1, max: 3 },
  { id: 'collagen', name: 'Collagène', description: 'Élasticité', percent: 0.5, max: 2 },
  { id: 'biotin', name: 'Biotine', description: 'Croissance', percent: 0.1, max: 0.5 },
  { id: 'caffeine', name: 'Caféine', description: 'Stimulant', percent: 0.2, max: 1 }
])

// Types de cheveux
const hairTypes = [
  { id: 'normal', label: 'Normaux', emoji: '✨' },
  { id: 'dry', label: 'Secs', emoji: '🌵' },
  { id: 'oily', label: 'Gras', emoji: '💦' },
  { id: 'damaged', label: 'Abîmés', emoji: '⚡' },
  { id: 'colored', label: 'Colorés', emoji: '🎨' },
  { id: 'curly', label: 'Bouclés', emoji: '🌀' }
]

// Objectifs capillaires
const hairGoals = [
  { id: 'moisture', label: 'Hydratation', emoji: '💧' },
  { id: 'repair', label: 'Réparation', emoji: '🔧' },
  { id: 'volume', label: 'Volume', emoji: '📈' },
  { id: 'shine', label: 'Brillance', emoji: '✨' },
  { id: 'curl_definition', label: 'Définition des boucles', emoji: '🌀' },
  { id: 'anti_dandruff', label: 'Anti-pelliculaire', emoji: '❄️' }
]

// Computed properties
const baseLavanteTotal = computed(() => {
  const primary = primarySurfactants.value.reduce((sum, s) => sum + s.percent, 0)
  const secondary = secondarySurfactants.value
      .filter(s => s.selected)
      .reduce((sum, s) => sum + s.percent, 0)
  return primary + secondary
})

const conditionersTotal = computed(() => {
  const conditionerSum = conditioners.value
      .filter(c => c.selected)
      .reduce((sum, c) => sum + c.percent, 0)
  const activesSum = hairActives.value.reduce((sum, a) => sum + a.percent, 0)
  return conditionerSum + activesSum + (formData.value.thickenerPercent || 0)
})

const waterPercent = computed(() => {
  const otherComponents = baseLavanteTotal.value +
      conditionersTotal.value +
      (formData.value.preservativePercent || 0.5)
  return Math.max(0, 100 - otherComponents)
})

const totalPercent = computed(() => {
  return baseLavanteTotal.value +
      conditionersTotal.value +
      waterPercent.value +
      (formData.value.preservativePercent || 0.5)
})

const completionPercentage = computed(() => {
  let score = 0
  if (formData.value.name) score += 20
  if (formData.value.hairType) score += 20
  if (baseLavanteTotal.value > 0) score += 30
  if (conditionersTotal.value > 0) score += 20
  if (waterPercent.value > 0) score += 10
  return Math.min(100, score)
})

const isValid = computed(() => {
  return formData.value.name &&
      formData.value.hairType &&
      baseLavanteTotal.value > 0 &&
      baseLavanteTotal.value <= 40 &&
      conditionersTotal.value <= 15 &&
      waterPercent.value > 0 &&
      totalPercent.value === 100
})

const containerClasses = computed(() => {
  return 'max-w-7xl mx-auto p-4 md:p-8'
})

// Méthodes
const getHairTypeEmoji = (type) => {
  const typeObj = hairTypes.find(t => t.id === type)
  return typeObj?.emoji || '✨'
}

const getHairTypeLabel = (type) => {
  const typeObj = hairTypes.find(t => t.id === type)
  return typeObj?.label || 'Non spécifié'
}

const toggleConditioner = (conditioner) => {
  conditioner.selected = !conditioner.selected
  if (!conditioner.selected) {
    conditioner.percent = 0
  }
}

const autoBalance = () => {
  // Ajuste automatiquement l'eau pour atteindre 100%
  const currentTotal = baseLavanteTotal.value + conditionersTotal.value + 0.5
  const neededWater = 100 - currentTotal

  if (neededWater > 0) {
    // On peut ajuster ici si nécessaire
    console.log(`Eau nécessaire: ${neededWater}%`)
  }
}

const save = () => {
  if (!isValid.value) {
    alert('Veuillez compléter correctement le formulaire avant de sauvegarder')
    return
  }

  const formulaData = {
    name: formData.value.name,
    description: generateDescription(),
    type: 'shampoo',
    hairType: formData.value.hairType,
    hairGoals: formData.value.hairGoals,
    volume: formData.value.volume,
    pH: formData.value.targetPH,
    ingredients: generateIngredients(),
    instructions: formData.value.instructions,
    notes: formData.value.notes,
    shelfLife: formData.value.shelfLife,
    preservative: formData.value.preservativeSystem,
    preservativePercent: formData.value.preservativePercent,
    createdAt: new Date().toISOString(),
    totalPercent: totalPercent.value,
    composition: {
      surfactants: baseLavanteTotal.value,
      conditioners: conditionersTotal.value,
      water: waterPercent.value
    }
  }

  emit('save', formulaData)
}

const saveDraft = () => {
  emit('save-draft', {
    ...formData.value,
    primarySurfactants: primarySurfactants.value,
    secondarySurfactants: secondarySurfactants.value.filter(s => s.selected),
    conditioners: conditioners.value.filter(c => c.selected),
    hairActives: hairActives.value,
    isDraft: true,
    savedAt: new Date().toISOString(),
    progress: completionPercentage.value
  })
}

const cancel = () => {
  emit('cancel')
}

const generateDescription = () => {
  const hairTypeLabel = getHairTypeLabel(formData.value.hairType)
  const surfactantCount = primarySurfactants.value.length +
      secondarySurfactants.value.filter(s => s.selected).length
  const conditionerCount = conditioners.value.filter(c => c.selected).length

  return `Shampooing ${formData.value.name} pour cheveux ${hairTypeLabel}
• Volume: ${formData.value.volume}ml
• pH: ${formData.value.targetPH}
• Tensioactifs: ${surfactantCount} types (${baseLavanteTotal.value.toFixed(1)}%)
• Conditionneurs: ${conditionerCount} types (${conditionersTotal.value.toFixed(1)}%)
• Phase aqueuse: ${waterPercent.value.toFixed(1)}%`
}

const generateIngredients = () => {
  const ingredients = []

  // Tensioactifs primaires
  primarySurfactants.value.forEach(s => {
    if (s.percent > 0) {
      ingredients.push({
        name: s.name,
        inci: s.inci,
        percent: s.percent,
        type: 'surfactant_primary'
      })
    }
  })

  // Tensioactifs secondaires
  secondarySurfactants.value
      .filter(s => s.selected && s.percent > 0)
      .forEach(s => {
        ingredients.push({
          name: s.name,
          percent: s.percent,
          type: 'surfactant_secondary'
        })
      })

  // Conditionneurs
  conditioners.value
      .filter(c => c.selected && c.percent > 0)
      .forEach(c => {
        ingredients.push({
          name: c.name,
          percent: c.percent,
          type: 'conditioner'
        })
      })

  // Actifs
  hairActives.value
      .filter(a => a.percent > 0)
      .forEach(a => {
        ingredients.push({
          name: a.name,
          percent: a.percent,
          type: 'active'
        })
      })

  // Épaississant
  if (formData.value.thickener && formData.value.thickenerPercent > 0) {
    ingredients.push({
      name: `Épaississant (${formData.value.thickener})`,
      percent: formData.value.thickenerPercent,
      type: 'thickener'
    })
  }

  // Conservateur
  ingredients.push({
    name: 'Système de conservation',
    percent: formData.value.preservativePercent,
    type: 'preservative'
  })

  // Eau
  ingredients.push({
    name: 'Eau déminéralisée',
    percent: waterPercent.value,
    type: 'water'
  })

  // Ajusteur pH
  ingredients.push({
    name: `Ajusteur pH (${formData.value.pHAdjuster})`,
    percent: 0.1, // Valeur indicative
    type: 'ph_adjuster'
  })

  return ingredients
}

// Lifecycle hooks
onMounted(() => {
  isMobile.value = window.innerWidth < 1024

  // Pré-remplir avec des valeurs par défaut
  if (!formData.value.name && props.recipeType?.productName) {
    formData.value.name = `Mon ${props.recipeType.productName}`
  }
})
</script>

<style scoped>
/* Utilisez les mêmes styles que dans votre template principal */
.input-field {
  @apply w-full px-4 py-3 border-2 border-gray-300 rounded-xl
  bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-200 placeholder:text-gray-400;
}

.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700
  text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
  flex items-center justify-center gap-2 shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50
  text-gray-700 font-bold rounded-xl border-2 border-gray-300
  hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  transition-all duration-300 flex items-center justify-center gap-2;
}

.btn-outline {
  @apply px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl
  hover:border-gray-400 hover:bg-gray-50
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  transition-all duration-300 flex items-center justify-center gap-2;
}

.label {
  @apply block text-base font-bold text-gray-900 mb-2 tracking-tight;
}

.label.required::after {
  content: " *";
  @apply text-red-600;
}

.skin-type-card {
  @apply border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg;
}

.skin-type-card-selected {
  @apply border-blue-500 bg-gradient-to-br from-blue-50 to-white;
}

.skin-type-card-default {
  @apply border-gray-200 hover:border-blue-300;
}

.range-green::-webkit-slider-thumb {
  @apply appearance-none h-5 w-5 rounded-full border-4 border-white shadow-xl cursor-pointer bg-green-500;
}
</style>