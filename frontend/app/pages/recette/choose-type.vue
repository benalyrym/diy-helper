<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
      <div class=" mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button
              @click="goBack"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Retour</span>
          </button>

          <div class="text-center">
            <h1 class="text-xl font-bold text-gray-900">Nouvelle formule</h1>
            <p class="text-sm text-gray-600">Sélectionnez le type de produit</p>
          </div>

          <div class="w-20"></div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="border-purple mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar - Catégories principales -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <!-- En-tête sidebar -->
            <div class="mb-8">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4">
                <span class="text-2xl">🧴</span>
              </div>
              <h2 class="text-lg font-bold text-gray-900 mb-2">Étapes de création</h2>
              <p class="text-sm text-gray-600">Sélectionnez étape par étape</p>
            </div>

            <!-- Indicateur de progression -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Progression</span>
                <span class="text-sm font-bold text-blue-600">{{ progress }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Navigation des étapes -->
            <div class="space-y-2">
              <!-- Étape 1 -->
              <button
                  @click="goToStep(1)"
                  :class="[
                    'w-full text-left p-4 rounded-xl transition-all duration-300',
                    currentStep >= 1
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  ]"
              >
                <div class="flex items-center gap-4">
                  <div :class="[
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                    currentStep >= 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  ]">
                    1
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Catégorie principale</div>
                    <div class="text-sm text-gray-600">Type de produit</div>
                  </div>
                  <svg
                      v-if="currentStep >= 1"
                      class="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </button>

              <!-- Étape 2 -->
              <button
                  @click="goToStep(2)"
                  :disabled="!selectedMainCategory"
                  :class="[
                    'w-full text-left p-4 rounded-xl transition-all duration-300',
                    currentStep >= 2
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'
                      : selectedMainCategory
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-gray-50 opacity-50 cursor-not-allowed'
                  ]"
              >
                <div class="flex items-center gap-4">
                  <div :class="[
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                    currentStep >= 2
                      ? 'bg-green-600 text-white'
                      : selectedMainCategory
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-gray-200 text-gray-400'
                  ]">
                    2
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Type spécifique</div>
                    <div class="text-sm text-gray-600">Sous-catégorie</div>
                  </div>
                  <svg
                      v-if="currentStep >= 2"
                      class="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </button>

              <!-- Étape 3 -->
              <button
                  @click="goToStep(3)"
                  :disabled="!selectedMainCategory"
                  :class="[
                    'w-full text-left p-4 rounded-xl transition-all duration-300',
                    currentStep >= 3
                      ? 'bg-gradient-to-r from-purple-50 to-pink-100 border border-purple-200'
                      : selectedMainCategory
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-gray-50 opacity-50 cursor-not-allowed'
                  ]"
              >
                <div class="flex items-center gap-4">
                  <div :class="[
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                    currentStep >= 3
                      ? 'bg-purple-600 text-white'
                      : selectedMainCategory
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-gray-200 text-gray-400'
                  ]">
                    3
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900">Personnalisation</div>
                    <div class="text-sm text-gray-600">Optionnel</div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Résumé de sélection -->
            <div v-if="selectedMainCategory" class="mt-8 pt-8 border-t border-gray-200">
              <h3 class="font-bold text-gray-900 mb-3">Votre sélection</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <span class="text-lg">{{ getMainCategoryIcon() }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm text-gray-600">Catégorie</div>
                    <div class="font-semibold text-gray-900">{{ getSelectedCategoryName() }}</div>
                  </div>
                </div>

                <div v-if="selectedSubtype && selectedSubtype !== 'custom'" class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div class="p-2 bg-green-100 text-green-600 rounded-lg">
                    <span class="text-lg">{{ getSubtypeIcon() }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm text-gray-600">Type</div>
                    <div class="font-semibold text-gray-900">{{ getSelectedSubtypeName() }}</div>
                  </div>
                </div>

                <div v-if="customProductName && selectedSubtype === 'custom'" class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <span class="text-lg">✨</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm text-gray-600">Personnalisé</div>
                    <div class="font-semibold text-gray-900">{{ customProductName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal - Zone de droite (2/3) -->
        <div class="lg:col-span-3">
          <!-- Étape 1: Catégories principales -->
          <div v-if="currentStep === 1" class="animate-fadeIn">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Sélectionnez une catégorie principale</h2>
                <p class="text-gray-600">Choisissez le type de produit que vous souhaitez créer</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    v-for="category in mainCategories"
                    :key="category.id"
                    @click="selectMainCategory(category.id)"
                    :class="[
                      'group cursor-pointer p-5 rounded-xl border-2 transition-all duration-300',
                      selectedMainCategory === category.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    ]"
                >
                  <div class="flex items-start gap-4">
                    <div
                        class="flex-shrink-0 p-3 rounded-lg text-2xl"
                        :style="{ backgroundColor: category.color + '20', color: category.color }"
                    >
                      {{ category.icon }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-bold text-gray-900">{{ category.name }}</h3>
                        <svg
                            v-if="selectedMainCategory === category.id"
                            class="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-sm text-gray-600 mb-3">{{ category.description }}</p>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                            v-for="example in category.examples.slice(0, 3)"
                            :key="example"
                            class="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {{ example }}
                        </span>
                        <span
                            v-if="category.examples.length > 3"
                            class="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium"
                        >
                          +{{ category.examples.length - 3 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedMainCategory" class="mt-8 pt-8 border-t border-gray-200">
                <button
                    @click="goToStep(2)"
                    class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Continuer vers le type spécifique</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Étape 2: Sous-types -->
          <div v-if="currentStep === 2 && selectedMainCategory" class="animate-fadeIn">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div class="flex items-center gap-4 mb-8">
                <button
                    @click="goToStep(1)"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Sélectionnez un type spécifique</h2>
                  <p class="text-gray-600">Choisissez une sous-catégorie ou créez un type personnalisé</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div
                    v-for="subtype in filteredSubtypes"
                    :key="subtype.id"
                    @click="selectSubtype(subtype.id)"
                    :class="[
                      'group cursor-pointer p-5 rounded-xl border-2 transition-all duration-300',
                      selectedSubtype === subtype.id
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    ]"
                >
                  <div class="flex items-start gap-3 mb-3">
                    <div
                        class="flex-shrink-0 p-2.5 rounded-lg text-xl"
                        :style="{ backgroundColor: subtype.color + '20', color: subtype.color }"
                    >
                      {{ subtype.icon }}
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900">{{ subtype.name }}</h3>
                      <p class="text-xs text-gray-500">{{ subtype.category }}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">{{ subtype.description }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Difficulté</span>
                    <div class="flex gap-0.5">
                      <span
                          v-for="n in 3"
                          :key="n"
                          :class="[
                          'w-2 h-2 rounded-full',
                          n <= subtype.difficulty ? 'bg-green-500' : 'bg-gray-300'
                        ]"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Option personnalisée -->
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <span class="text-xl text-white">✨</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900">Créez un type personnalisé</h3>
                    <p class="text-sm text-gray-600">Si vous ne trouvez pas votre type de produit</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nom de votre produit personnalisé
                    </label>
                    <input
                        v-model="customProductName"
                        type="text"
                        placeholder="Ex: Masque anti-âge maison, Sérum hydratant spécifique..."
                        class="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:ring-offset-1 transition-colors"
                        @input="selectCustomType"
                    />
                  </div>

                  <div class="text-sm text-gray-500">
                    <p>Notre assistant vous guidera dans la création de votre formulation personnalisée.</p>
                  </div>
                </div>
              </div>

              <div v-if="selectedSubtype" class="mt-8 pt-8 border-t border-gray-200">
                <button
                    @click="proceedToCreation"
                    class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Finaliser la sélection</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Étape 3: Confirmation -->
          <div v-if="currentStep === 3 && (selectedSubtype || customProductName)" class="animate-fadeIn">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div class="flex items-center gap-4 mb-8">
                <button
                    @click="goToStep(2)"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Confirmation</h2>
                  <p class="text-gray-600">Vérifiez les informations avant de continuer</p>
                </div>
              </div>

              <!-- Résumé détaillé -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
                <div class="max-w-2xl mx-auto">
                  <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                      <span class="text-3xl text-white">✨</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Prêt à créer votre formule !</h3>
                    <p class="text-gray-600">Votre sélection a été enregistrée</p>
                  </div>

                  <div class="space-y-6">
                    <!-- Catégorie principale -->
                    <div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div class="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <span class="text-lg">{{ getMainCategoryIcon() }}</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-sm text-gray-500">Catégorie</div>
                        <div class="font-bold text-gray-900">{{ getSelectedCategoryName() }}</div>
                      </div>
                      <div class="text-sm text-gray-400">Étape 1</div>
                    </div>

                    <!-- Type spécifique -->
                    <div v-if="selectedSubtype !== 'custom'" class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div class="flex-shrink-0 p-3 bg-green-100 text-green-600 rounded-lg">
                        <span class="text-lg">{{ getSubtypeIcon() }}</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-sm text-gray-500">Type de produit</div>
                        <div class="font-bold text-gray-900">{{ getSelectedSubtypeName() }}</div>
                        <p class="text-sm text-gray-600 mt-1">{{ getSubtypeDescription() }}</p>
                      </div>
                      <div class="text-sm text-gray-400">Étape 2</div>
                    </div>

                    <!-- Personnalisé -->
                    <div v-if="customProductName && selectedSubtype === 'custom'" class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div class="flex-shrink-0 p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <span class="text-lg">✨</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-sm text-gray-500">Produit personnalisé</div>
                        <div class="font-bold text-gray-900">{{ customProductName }}</div>
                        <p class="text-sm text-gray-600 mt-1">Formulation sur mesure</p>
                      </div>
                      <div class="text-sm text-gray-400">Étape 3</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-xl">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 mb-1">Prochaines étapes</h4>
                  <p class="text-sm text-gray-600">
                    Vous allez être redirigé vers l'assistant de formulation où vous pourrez ajouter vos ingrédients et spécifications.
                  </p>
                </div>
                <div class="flex gap-4">
                  <button
                      @click="goToStep(2)"
                      class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                      @click="proceedToCreation"
                      class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Commencer la formulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// États
const selectedMainCategory = ref<string>('')
const selectedSubtype = ref<string>('')
const customProductName = ref('')
const currentStep = ref(1)

// Catégories principales (même données)
const mainCategories = [
  { id: 'skincare', name: 'Soin de la peau', icon: '🧴', color: '#3B82F6', description: 'Produits pour le visage et le corps', examples: ['Crèmes', 'Sérums', 'Gommages', 'Masques'] },
  { id: 'haircare', name: 'Soin des cheveux', icon: '💇', color: '#8B5CF6', description: 'Produits capillaires et traitements', examples: ['Shampoings', 'Après-shampoings', 'Masques', 'Huiles'] },
  { id: 'bodycare', name: 'Soin du corps', icon: '🦵', color: '#10B981', description: 'Produits pour le soin corporel', examples: ['Laits', 'Beurres', 'Gels douche', 'Sels de bain'] },
  { id: 'cosmetic', name: 'Cosmétique', icon: '💄', color: '#EC4899', description: 'Maquillage et produits de beauté', examples: ['Fond de teint', 'Rouge à lèvres', 'Fards', 'Mascaras'] },
  { id: 'household', name: 'Ménager', icon: '🏠', color: '#F59E0B', description: "Produits d'entretien et nettoyants", examples: ['Lessives', 'Détergents', 'Nettoyants', 'Assouplissants'] },
  { id: 'other', name: 'Autre', icon: '🧪', color: '#6B7280', description: 'Autres types de formulations', examples: ['Parfums', 'Encens', 'Produits spéciaux'] }
]

// Sous-types (même données)
const allSubtypes = [
  { id: 'face_cream', name: 'Crème visage', icon: '🧴', category: 'skincare', description: 'Crème hydratante ou traitante pour le visage', difficulty: 2, color: '#3B82F6' },
  { id: 'serum', name: 'Sérum visage', icon: '💧', category: 'skincare', description: 'Sérum concentré pour cibles spécifiques', difficulty: 3, color: '#3B82F6' },
  { id: 'face_mask', name: 'Masque visage', icon: '🧖', category: 'skincare', description: 'Masque traitant ou hydratant', difficulty: 1, color: '#3B82F6' },
  { id: 'cleanser', name: 'Nettoyant visage', icon: '🚿', category: 'skincare', description: 'Gel, mousse ou huile nettoyante', difficulty: 2, color: '#3B82F6' },
  { id: 'toner', name: 'Tonique/lotion', icon: '🌊', category: 'skincare', description: 'Lotion pour équilibrer le pH', difficulty: 1, color: '#3B82F6' },
  { id: 'eye_cream', name: 'Crème contour des yeux', icon: '👁️', category: 'skincare', description: 'Soin spécifique pour le contour des yeux', difficulty: 3, color: '#3B82F6' },
  { id: 'sunscreen', name: 'Crème solaire', icon: '☀️', category: 'skincare', description: 'Protection solaire visage/corps', difficulty: 3, color: '#3B82F6' },
  { id: 'shampoo', name: 'Shampoing', icon: '🧼', category: 'haircare', description: 'Shampoing nettoyant pour cheveux', difficulty: 2, color: '#8B5CF6' },
  { id: 'conditioner', name: 'Après-shampoing', icon: '💆', category: 'haircare', description: 'Après-shampoing démêlant et nourrissant', difficulty: 1, color: '#8B5CF6' },
  { id: 'hair_mask', name: 'Masque capillaire', icon: '🧖‍♀️', category: 'haircare', description: 'Masque profond pour cheveux', difficulty: 2, color: '#8B5CF6' },
  { id: 'hair_oil', name: 'Huile capillaire', icon: '💧', category: 'haircare', description: 'Huile nourrissante pour pointes ou cuir chevelu', difficulty: 1, color: '#8B5CF6' },
  { id: 'hair_serum', name: 'Sérum capillaire', icon: '✨', category: 'haircare', description: 'Sérum pour brillance ou anti-frisottis', difficulty: 2, color: '#8B5CF6' },
  { id: 'scalp_treatment', name: 'Traitement cuir chevelu', icon: '🧠', category: 'haircare', description: 'Soin spécifique pour le cuir chevelu', difficulty: 3, color: '#8B5CF6' },
  { id: 'body_lotion', name: 'Lait corporel', icon: '🦵', category: 'bodycare', description: 'Lait hydratant pour le corps', difficulty: 1, color: '#10B981' },
  { id: 'body_butter', name: 'Beurre corporel', icon: '🧈', category: 'bodycare', description: 'Beurre riche pour peau très sèche', difficulty: 2, color: '#10B981' },
  { id: 'body_scrub', name: 'Gommage corporel', icon: '✨', category: 'bodycare', description: 'Gommage exfoliant pour le corps', difficulty: 1, color: '#10B981' },
  { id: 'shower_gel', name: 'Gel douche', icon: '🚿', category: 'bodycare', description: 'Gel nettoyant pour la douche', difficulty: 2, color: '#10B981' },
  { id: 'hand_cream', name: 'Crème mains', icon: '🤲', category: 'bodycare', description: 'Crème hydratante pour les mains', difficulty: 1, color: '#10B981' },
  { id: 'laundry_detergent', name: 'Lessive', icon: '👕', category: 'household', description: 'Détergent pour machine à laver', difficulty: 2, color: '#F59E0B' },
  { id: 'dish_soap', name: 'Liquide vaisselle', icon: '🍽️', category: 'household', description: 'Produit pour laver la vaisselle', difficulty: 1, color: '#F59E0B' },
  { id: 'all_purpose_cleaner', name: 'Nettoyant multi-usages', icon: '🧹', category: 'household', description: 'Nettoyant pour surfaces diverses', difficulty: 1, color: '#F59E0B' },
  { id: 'fabric_softener', name: 'Assouplissant', icon: '👚', category: 'household', description: 'Assouplissant pour linge', difficulty: 1, color: '#F59E0B' }
]

// Computed
const filteredSubtypes = computed(() => {
  if (!selectedMainCategory.value) return []
  return allSubtypes.filter(subtype => subtype.category === selectedMainCategory.value)
})

const progress = computed(() => {
  if (currentStep.value === 1) return 33
  if (currentStep.value === 2) return 66
  if (currentStep.value === 3) return 100
  return 0
})

// Méthodes
const selectMainCategory = (categoryId: string) => {
  selectedMainCategory.value = categoryId
  selectedSubtype.value = ''
  customProductName.value = ''
  currentStep.value = 2
}

const selectSubtype = (subtypeId: string) => {
  selectedSubtype.value = subtypeId
  customProductName.value = ''
  currentStep.value = 3
}

const selectCustomType = () => {
  if (customProductName.value.trim()) {
    selectedSubtype.value = 'custom'
    currentStep.value = 3
  }
}

const getSelectedSubtypeName = () => {
  if (selectedSubtype.value === 'custom') {
    return customProductName.value
  }
  const subtype = allSubtypes.find(s => s.id === selectedSubtype.value)
  return subtype ? subtype.name : ''
}

const getSelectedCategoryName = () => {
  const category = mainCategories.find(c => c.id === selectedMainCategory.value)
  return category ? category.name : ''
}

const getMainCategoryIcon = () => {
  const category = mainCategories.find(c => c.id === selectedMainCategory.value)
  return category ? category.icon : '🧴'
}

const getSubtypeIcon = () => {
  if (selectedSubtype.value === 'custom') return '✨'
  const subtype = allSubtypes.find(s => s.id === selectedSubtype.value)
  return subtype ? subtype.icon : '🧴'
}

const getSubtypeDescription = () => {
  if (selectedSubtype.value === 'custom') return 'Formulation personnalisée'
  const subtype = allSubtypes.find(s => s.id === selectedSubtype.value)
  return subtype ? subtype.description : ''
}

const goToStep = (step: number) => {
  if (step === 2 && !selectedMainCategory.value) return
  if (step === 3 && !selectedMainCategory.value) return
  currentStep.value = step
}

const proceedToCreation = () => {
  if (selectedSubtype.value || customProductName.value) {
    const recipeType = {
      mainCategory: selectedMainCategory.value,
      subtype: selectedSubtype.value,
      customName: customProductName.value,
      productName: getSelectedSubtypeName(),
      categoryName: getSelectedCategoryName()
    }

    sessionStorage.setItem('selectedRecipeType', JSON.stringify(recipeType))
    router.push('/recette/create')
  }
}

const goBack = () => {
  router.back()
}

// Watchers
watch(selectedMainCategory, (newVal) => {
  if (newVal && currentStep.value === 1) {
    currentStep.value = 2
  }
})

watch(selectedSubtype, (newVal) => {
  if (newVal && currentStep.value === 2) {
    currentStep.value = 3
  }
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

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

/* Transition pour les changements d'étape */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>