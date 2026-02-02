<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <!-- Navigation supérieure -->
        <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <!-- Logo et titre -->
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <span class="text-2xl text-white">🧪</span>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                                Formulateur Pro
                            </h1>
                            <p class="text-xs text-gray-500">Création de formules cosmétiques et ménagères</p>
                        </div>
                    </div>

                    <!-- Statistiques -->
                    <div class="flex items-center gap-4">
                        <div class="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {{ recipes.length }} formules
              </span>
                            <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {{ categoriesCount }} catégories
              </span>
                        </div>

                        <!-- Bouton nouvelle formule -->
                        <NuxtLink
                            to="/recette/create"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <span class="text-xl">+</span>
                            <span>Nouvelle formule</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <div class="max-w-7xl mx-auto p-4 md:p-8">
            <!-- En-tête avec recherche et filtres -->
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
                    <!-- Recherche -->
                    <div class="relative flex-1 max-w-2xl">
                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            🔍
                        </div>
                        <input
                            v-model="searchTerm"
                            type="text"
                            placeholder="Rechercher une formule par nom, ingrédient ou catégorie..."
                            class="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 transition-all duration-300"
                            @input="debouncedSearch"
                        />
                        <div v-if="searchTerm" class="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <button
                                @click="clearSearch"
                                class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                aria-label="Effacer la recherche"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <!-- Filtres rapides -->
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="category in popularCategories"
                            :key="category.id"
                            @click="toggleCategoryFilter(category.id)"
                            :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2',
                activeFilters.includes(category.id)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              ]"
                        >
                            <span>{{ category.icon }}</span>
                            <span>{{ category.name }}</span>
                            <span class="text-xs opacity-75">
                {{ getCategoryCount(category.id) }}
              </span>
                        </button>
                        <button
                            @click="showAllCategories = !showAllCategories"
                            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                        >
                            {{ showAllCategories ? 'Moins' : 'Plus' }} de filtres
                        </button>
                    </div>
                </div>

                <!-- Tous les filtres catégories -->
                <div v-if="showAllCategories" class="mt-4 p-4 bg-white/80 rounded-xl border border-gray-200">
                    <h3 class="font-semibold text-gray-900 mb-3">Toutes les catégories</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        <button
                            v-for="category in allCategories"
                            :key="category.id"
                            @click="toggleCategoryFilter(category.id)"
                            :class="[
                'px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center justify-between',
                activeFilters.includes(category.id)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              ]"
                        >
                            <div class="flex items-center gap-2">
                                <span>{{ category.icon }}</span>
                                <span class="truncate">{{ category.name }}</span>
                            </div>
                            <span class="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {{ getCategoryCount(category.id) }}
              </span>
                        </button>
                    </div>
                </div>

                <!-- Filtres actifs -->
                <div v-if="activeFilters.length > 0" class="flex items-center gap-2 mt-4">
                    <span class="text-sm text-gray-600">Filtres actifs:</span>
                    <div class="flex flex-wrap gap-2">
            <span
                v-for="filterId in activeFilters"
                :key="filterId"
                class="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
            >
              {{ getCategoryName(filterId) }}
              <button
                  @click="removeFilter(filterId)"
                  class="text-blue-600 hover:text-blue-800 ml-1"
                  aria-label="Retirer ce filtre"
              >
                ×
              </button>
            </span>
                        <button
                            @click="clearAllFilters"
                            class="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Effacer tout
                        </button>
                    </div>
                </div>
            </div>

            <!-- État de chargement -->
            <div v-if="loading" class="py-16">
                <div class="max-w-md mx-auto text-center">
                    <div class="relative inline-block mb-6">
                        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <span class="text-blue-600 text-2xl">🧴</span>
                        </div>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Chargement des formules</h2>
                    <p class="text-gray-600">Analyse et organisation des données cosmétiques...</p>
                </div>
            </div>

            <!-- État d'erreur -->
            <div v-else-if="error" class="py-16">
                <div class="max-w-lg mx-auto bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
                    <div class="flex items-start gap-4 mb-6">
                        <div class="flex-shrink-0">
                            <div class="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                                <span class="text-2xl text-white">❌</span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h2 class="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
                            <p class="text-gray-700 mb-4">{{ error }}</p>
                            <div class="bg-white/80 p-4 rounded-lg border border-red-100">
                                <p class="text-sm text-gray-600">
                                    Vérifiez votre connexion internet ou contactez le support si le problème persiste.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button
                            @click="retryLoad"
                            class="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                        >
                            <span>↻</span>
                            <span>Réessayer</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- État vide -->
            <div v-else-if="filteredRecipes.length === 0" class="py-16">
                <div class="max-w-md mx-auto text-center">
                    <div class="inline-block p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-dashed border-blue-200 mb-6">
                        <span class="text-6xl text-blue-400">🧪</span>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-3">
                        {{ searchTerm ? 'Aucun résultat trouvé' : 'Aucune formule pour le moment' }}
                    </h2>
                    <p class="text-gray-600 mb-8 max-w-sm mx-auto">
                        {{ searchTerm
                        ? `Aucune formule ne correspond à "${searchTerm}". Essayez avec d'autres termes.`
                        : 'Commencez par créer votre première formule cosmétique ou ménagère.'
                        }}
                    </p>
                    <div class="space-y-3">
                        <NuxtLink
                            to="/recette/create"
                            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span class="text-2xl">+</span>
                            <div class="text-left">
                                <div class="font-bold">Créer votre première formule</div>
                                <div class="text-sm opacity-90">Crèmes, shampoings, lessives, etc.</div>
                            </div>
                        </NuxtLink>
                        <div v-if="searchTerm" class="pt-4">
                            <button
                                @click="clearSearch"
                                class="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← Retour à toutes les formules
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des formules -->
            <div v-else>
                <!-- Vue par catégories -->
                <div v-if="groupedByCategory" class="space-y-8">
                    <div v-for="(recipesInCategory, categoryId) in groupedRecipesByCategory" :key="categoryId">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                    <span class="text-xl text-white">{{ getCategoryIcon(categoryId) }}</span>
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-gray-900">{{ getCategoryName(categoryId) }}</h2>
                                    <p class="text-sm text-gray-600">{{ getCategoryDescription(categoryId) }}</p>
                                </div>
                            </div>
                            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {{ recipesInCategory.length }} formule{{ recipesInCategory.length > 1 ? 's' : '' }}
              </span>
                        </div>

                        <!-- Grille de cartes -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                v-for="recipe in recipesInCategory"
                                :key="recipe.id"
                                class="recipe-card group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                            >
                                <NuxtLink :to="`/recette/${recipe.id}`" class="block h-full flex flex-col">
                                    <!-- En-tête de la carte -->
                                    <div class="p-6 pb-4 flex-grow">
                                        <div class="flex items-start justify-between mb-4">
                                            <div class="flex-1 min-w-0">
                                                <h3 class="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                                    {{ recipe.name }}
                                                </h3>
                                                <div class="flex items-center gap-2 mt-1">
                          <span class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                            {{ getCategoryName(recipe.category) }}
                          </span>
                                                    <span v-if="recipe.skinType" class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200">
                            Peau {{ recipe.skinType }}
                          </span>
                                                    <span v-if="recipe.hairType" class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200">
                            Cheveux {{ recipe.hairType }}
                          </span>
                                                </div>
                                            </div>
                                            <div class="flex-shrink-0 ml-3">
                                                <span class="text-3xl">{{ getCategoryIcon(recipe.category) }}</span>
                                            </div>
                                        </div>

                                        <!-- Description -->
                                        <p v-if="recipe.description" class="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {{ recipe.description }}
                                        </p>
                                        <p v-else class="text-sm text-gray-400 italic mb-4">
                                            Aucune description
                                        </p>

                                        <!-- Métadonnées -->
                                        <div class="space-y-3">
                                            <!-- Spécifiques au type -->
                                            <div class="grid grid-cols-2 gap-3">
                                                <div v-if="recipe.volume" class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                                                    <div class="text-xs text-gray-500 mb-1">Volume</div>
                                                    <div class="font-bold text-blue-700">{{ recipe.volume }} ml</div>
                                                </div>
                                                <div v-if="recipe.prepTime" class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-100">
                                                    <div class="text-xs text-gray-500 mb-1">Temps</div>
                                                    <div class="font-bold text-amber-700">{{ recipe.prepTime }} min</div>
                                                </div>
                                            </div>

                                            <!-- Ingénierie -->
                                            <div class="flex items-center justify-between text-xs text-gray-500">
                                                <div class="flex items-center gap-2">
                                                    <span>🔄 {{ formatDate(recipe.updatedAt) }}</span>
                                                </div>
                                                <div class="flex items-center gap-1">
                          <span v-if="recipe.ingredients?.length" class="flex items-center gap-1">
                            <span>🧪</span>
                            <span>{{ recipe.ingredients.length }} ingrédients</span>
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Footer de la carte -->
                                    <div class="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white group-hover:from-blue-50/50 transition-all duration-300">
                                        <div class="flex items-center justify-between">
                                            <div class="text-sm text-gray-600">
                                                Créé le {{ formatDateShort(recipe.createdAt) }}
                                            </div>
                                            <div class="flex items-center gap-2">
                        <span v-if="recipe.compliance?.isValid !== undefined"
                              :class="[
                            'px-2 py-1 rounded-full text-xs font-bold',
                            recipe.compliance.isValid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          ]">
                          {{ recipe.compliance.isValid ? '✅ Conforme' : '⚠️ Non conforme' }}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vue simple (si non groupé) -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="recipe in paginatedRecipes"
                        :key="recipe.id"
                        class="recipe-card group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                    >
                        <NuxtLink :to="`/recette/${recipe.id}`" class="block h-full flex flex-col">
                            <div class="p-6 pb-4 flex-grow">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                            {{ recipe.name }}
                                        </h3>
                                        <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                        {{ getCategoryName(recipe.category) }}
                      </span>
                                            <span v-if="recipe.skinType" class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200">
                        Peau {{ recipe.skinType }}
                      </span>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 ml-3">
                                        <span class="text-3xl">{{ getCategoryIcon(recipe.category) }}</span>
                                    </div>
                                </div>

                                <p v-if="recipe.description" class="text-sm text-gray-600 line-clamp-2 mb-4">
                                    {{ recipe.description }}
                                </p>
                                <p v-else class="text-sm text-gray-400 italic mb-4">
                                    Aucune description
                                </p>

                                <div class="space-y-3">
                                    <div class="grid grid-cols-2 gap-3">
                                        <div v-if="recipe.volume" class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                                            <div class="text-xs text-gray-500 mb-1">Volume</div>
                                            <div class="font-bold text-blue-700">{{ recipe.volume }} ml</div>
                                        </div>
                                        <div v-if="recipe.prepTime" class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-100">
                                            <div class="text-xs text-gray-500 mb-1">Temps</div>
                                            <div class="font-bold text-amber-700">{{ recipe.prepTime }} min</div>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between text-xs text-gray-500">
                                        <div class="flex items-center gap-2">
                                            <span>🔄 {{ formatDate(recipe.updatedAt) }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                      <span v-if="recipe.ingredients?.length" class="flex items-center gap-1">
                        <span>🧪</span>
                        <span>{{ recipe.ingredients.length }}</span>
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white group-hover:from-blue-50/50 transition-all duration-300">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-gray-600">
                                        Créé le {{ formatDateShort(recipe.createdAt) }}
                                    </div>
                                    <div class="flex items-center gap-2">
                    <span v-if="recipe.compliance?.isValid !== undefined"
                          :class="[
                        'px-2 py-1 rounded-full text-xs font-bold',
                        recipe.compliance.isValid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]">
                      {{ recipe.compliance.isValid ? '✅ Conforme' : '⚠️ Non conforme' }}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="mt-8 pt-8 border-t border-gray-200">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="text-sm text-gray-600">
                            Page {{ currentPage }} sur {{ totalPages }} •
                            {{ filteredRecipes.length }} formule{{ filteredRecipes.length > 1 ? 's' : '' }} affichée{{ filteredRecipes.length > 1 ? 's' : '' }}
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                @click="currentPage--"
                                :disabled="currentPage === 1"
                                class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                ← Précédent
                            </button>
                            <div class="flex items-center gap-1">
                                <button
                                    v-for="page in visiblePages"
                                    :key="page"
                                    @click="currentPage = page"
                                    :class="[
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                                >
                                    {{ page }}
                                </button>
                                <span v-if="hasMorePages" class="px-2 text-gray-400">...</span>
                            </div>
                            <button
                                @click="currentPage++"
                                :disabled="currentPage === totalPages"
                                class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bouton flottant pour nouvelle formule (mobile) -->
        <NuxtLink
            to="/recette/create"
            class="fixed bottom-6 right-6 md:hidden p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 z-50"
            aria-label="Créer une nouvelle formule"
        >
            <span class="text-2xl">+</span>
        </NuxtLink>

        <!-- Footer -->
        <footer class="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <div class="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Informations -->
                    <div>
                        <h3 class="font-bold text-gray-900 mb-3">Formulateur Pro</h3>
                        <p class="text-sm text-gray-600">
                            Outil professionnel de formulation cosmétique et ménagère.
                            Conforme aux réglementations européennes.
                        </p>
                    </div>

                    <!-- Catégories -->
                    <div>
                        <h3 class="font-bold text-gray-900 mb-3">Catégories</h3>
                        <div class="flex flex-wrap gap-2">
              <span
                  v-for="category in allCategories.slice(0, 6)"
                  :key="category.id"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                <span>{{ category.icon }}</span>
                <span>{{ category.name }}</span>
              </span>
                        </div>
                    </div>

                    <!-- Statistiques -->
                    <div>
                        <h3 class="font-bold text-gray-900 mb-3">Votre atelier</h3>
                        <div class="space-y-2 text-sm text-gray-600">
                            <div class="flex justify-between">
                                <span>Formules totales</span>
                                <span class="font-bold text-gray-900">{{ recipes.length }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Formules conformes UE</span>
                                <span class="font-bold text-green-600">{{ compliantRecipesCount }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Dernière mise à jour</span>
                                <span class="font-bold text-gray-900">{{ lastUpdate }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
                    <p>© {{ currentYear }} Formulateur Pro • Version 2.3 • Conforme UE 1223/2009</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'

// API
const { listRecipes } = useApi()

// États
const recipes = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const activeFilters = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(12)
const groupedByCategory = ref(true)
const showAllCategories = ref(false)

// Catégories complètes avec toutes les formulations
const allCategories = [
    // Cosmétique visage
    { id: 'face-cream', name: 'Crèmes visage', icon: '🧴', description: 'Soins hydratants, anti-âge, spécialisés' },
    { id: 'serum', name: 'Sérums', icon: '✨', description: 'Concentrés d\'actifs haute performance' },
    { id: 'mask', name: 'Masques', icon: '😷', description: 'Masques visage, exfoliants, modelants' },
    { id: 'toner', name: 'Toniques', icon: '💦', description: 'Lotions tonifiantes, équilibrantes' },

    // Soins corps
    { id: 'body-lotion', name: 'Laits corps', icon: '🦵', description: 'Hydratants, raffermissants, anti-vergetures' },
    { id: 'body-butter', name: 'Beurres corps', icon: '🧈', description: 'Textures riches, nourrissantes' },
    { id: 'scrub', name: 'Gommages', icon: '🌀', description: 'Exfoliants corps et visage' },

    // Soins cheveux
    { id: 'shampoo', name: 'Shampoings', icon: '🧴', description: 'Nettoyants, spécialisés, traitants' },
    { id: 'conditioner', name: 'Après-shampoings', icon: '💆', description: 'Démêlants, nourrissants, gainants' },
    { id: 'hair-mask', name: 'Masques cheveux', icon: '🧖', description: 'Traitements profonds, réparateurs' },
    { id: 'hair-oil', name: 'Huiles cheveux', icon: '💧', description: 'Brillance, nutrition, pointes' },
    { id: 'hair-serenum', name: 'Sérums cheveux', icon: '🌟', description: 'Brillance, anti-frisottis, protection' },

    // Soins spécifiques
    { id: 'suncare', name: 'Protection solaire', icon: '☀️', description: 'Crèmes SPF, sticks, après-soleil' },
    { id: 'lip-care', name: 'Soins lèvres', icon: '👄', description: 'Baumes, sticks, exfoliants' },
    { id: 'eye-cream', name: 'Soins contour yeux', icon: '👁️', description: 'Anti-cernes, anti-poches, anti-rides' },
    { id: 'hand-cream', name: 'Crèmes mains', icon: '✋', description: 'Nourrissantes, réparatrices' },
    { id: 'foot-cream', name: 'Crèmes pieds', icon: '🦶', description: 'Hydratantes, kératolytiques' },

    // Maquillage
    { id: 'makeup', name: 'Maquillage', icon: '💄', description: 'Fonds de teint, correcteurs, poudres' },
    { id: 'lipstick', name: 'Rouges à lèvres', icon: '👄', description: 'Teintées, brillants, mates' },

    // Ménager et hygiène
    { id: 'laundry', name: 'Lessives', icon: '👕', description: 'Liquides, poudres, capsules' },
    { id: 'fabric-softener', name: 'Adoucissants', icon: '🌸', description: 'Textiles doux et parfumés' },
    { id: 'detergent', name: 'Détergents', icon: '🧼', description: 'Multi-surfaces, spécialisés' },
    { id: 'soap', name: 'Savons', icon: '🧼', description: 'Solides, liquides, surgras' },
    { id: 'disinfectant', name: 'Désinfectants', icon: '🦠', description: 'Surfaces, mains, sprays' },

    // Autres
    { id: 'perfume', name: 'Parfums', icon: '🌺', description: 'Eaux de toilette, parfums solides' },
    { id: 'candle', name: 'Bougies', icon: '🕯️', description: 'Parfumées, décoratives' },
    { id: 'other', name: 'Autres', icon: '🧪', description: 'Formulations diverses' }
]

// Catégories populaires (affichées par défaut)
const popularCategories = computed(() => {
    return [
        allCategories.find(c => c.id === 'face-cream'),
        allCategories.find(c => c.id === 'shampoo'),
        allCategories.find(c => c.id === 'laundry'),
        allCategories.find(c => c.id === 'serum'),
        allCategories.find(c => c.id === 'body-lotion'),
        allCategories.find(c => c.id === 'detergent')
    ].filter(Boolean)
})

// Computed properties
// Statistiques
const categoriesCount = computed(() => {
    const uniqueCategories = new Set(recipes.value.map(r => r.category))
    return uniqueCategories.size
})

const compliantRecipesCount = computed(() => {
    return recipes.value.filter(r => r.compliance?.isValid === true).length
})

const lastUpdate = computed(() => {
    if (recipes.value.length === 0) return '—'
    const dates = recipes.value.map(r => new Date(r.updatedAt || r.createdAt))
    const latest = new Date(Math.max(...dates.map(d => d.getTime())))
    return formatDateShort(latest.toISOString())
})

const currentYear = computed(() => new Date().getFullYear())

// Filtrage et recherche
const filteredRecipes = computed(() => {
    let result = recipes.value

    // Filtre par recherche
    if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim()
        result = result.filter(recipe =>
            recipe.name.toLowerCase().includes(term) ||
            recipe.description?.toLowerCase().includes(term) ||
            recipe.category?.toLowerCase().includes(term) ||
            recipe.skinType?.toLowerCase().includes(term) ||
            recipe.ingredients?.some((ing: any) =>
                ing.name.toLowerCase().includes(term)
            )
        )
    }

    // Filtre par catégories
    if (activeFilters.value.length > 0) {
        result = result.filter(recipe =>
            activeFilters.value.includes(recipe.category)
        )
    }

    return result
})

// Pagination
const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredRecipes.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredRecipes.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
    const pages: number[] = []
    const maxVisible = 5

    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

const hasMorePages = computed(() => {
    return visiblePages.value[visiblePages.value.length - 1] < totalPages.value
})

// Groupement par catégorie
const groupedRecipesByCategory = computed(() => {
    const grouped: Record<string, any[]> = {}

    filteredRecipes.value.forEach(recipe => {
        const category = recipe.category || 'other'
        if (!grouped[category]) {
            grouped[category] = []
        }
        grouped[category].push(recipe)
    })

    // Trier les catégories par nombre de recettes
    const sortedEntries = Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length)

    return Object.fromEntries(sortedEntries)
})

// Fonctions utilitaires
const getCategoryName = (categoryId: string): string => {
    const category = allCategories.find(c => c.id === categoryId)
    return category?.name || 'Non catégorisé'
}

const getCategoryIcon = (categoryId: string): string => {
    const category = allCategories.find(c => c.id === categoryId)
    return category?.icon || '🧪'
}

const getCategoryDescription = (categoryId: string): string => {
    const category = allCategories.find(c => c.id === categoryId)
    return category?.description || 'Formulation diverse'
}

const getCategoryCount = (categoryId: string): number => {
    return recipes.value.filter(r => r.category === categoryId).length
}

const formatDate = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const formatDateShort = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
    })
}

// Méthodes de filtrage
const toggleCategoryFilter = (categoryId: string) => {
    const index = activeFilters.value.indexOf(categoryId)
    if (index === -1) {
        activeFilters.value.push(categoryId)
    } else {
        activeFilters.value.splice(index, 1)
    }
    currentPage.value = 1
}

const removeFilter = (categoryId: string) => {
    const index = activeFilters.value.indexOf(categoryId)
    if (index !== -1) {
        activeFilters.value.splice(index, 1)
    }
    currentPage.value = 1
}

const clearAllFilters = () => {
    activeFilters.value = []
    currentPage.value = 1
}

const clearSearch = () => {
    searchTerm.value = ''
    currentPage.value = 1
}

// Recherche avec debounce
const debouncedSearch = () => {
    currentPage.value = 1
}

// Chargement des données
const retryLoad = async () => {
    loading.value = true
    error.value = ''
    await loadRecipes()
}

const loadRecipes = async () => {
    try {
        loading.value = true
        error.value = ''

        // Simulation de données - À remplacer par votre appel API
        await new Promise(resolve => setTimeout(resolve, 800))

        // Données de démonstration pour chaque catégorie
        recipes.value = [
            // Crèmes visage
            {
                id: '1',
                name: 'Crème hydratante intense',
                description: 'Formule riche en acide hyaluronique et vitamine E pour peaux très sèches',
                category: 'face-cream',
                skinType: 'seche',
                volume: 50,
                prepTime: 15,
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-01-20T14:45:00Z',
                ingredients: [
                    { name: 'Acide hyaluronique', quantity: 1.5 },
                    { name: 'Vitamine E', quantity: 0.3 },
                    { name: 'Beurre de karité', quantity: 5.0 }
                ],
                compliance: { isValid: true }
            },
            {
                id: '2',
                name: 'Gel matifiant anti-brillance',
                description: 'Texture légère pour réguler l\'excès de sébum, avec extrait de thé vert',
                category: 'face-cream',
                skinType: 'grasse',
                volume: 30,
                prepTime: 20,
                createdAt: '2024-01-18T09:15:00Z',
                updatedAt: '2024-01-25T11:20:00Z',
                ingredients: [
                    { name: 'Extrait de thé vert', quantity: 2.0 },
                    { name: 'Zinc PCA', quantity: 0.5 }
                ],
                compliance: { isValid: true }
            },

            // Sérums
            {
                id: '3',
                name: 'Sérum vitaminé éclat',
                description: 'Concentré de vitamine C 20% pour un teint lumineux et uniforme',
                category: 'serum',
                skinType: 'mixte',
                volume: 15,
                prepTime: 25,
                createdAt: '2024-01-20T14:00:00Z',
                updatedAt: '2024-01-22T16:30:00Z',
                ingredients: [
                    { name: 'Vitamine C (ascorbic acid)', quantity: 20.0 },
                    { name: 'Acide ferulique', quantity: 0.5 }
                ],
                compliance: { isValid: true }
            },

            // Shampoings
            {
                id: '4',
                name: 'Shampoing doux bébé',
                description: 'Sans sulfates, pH neutre, doux pour le cuir chevelu sensible',
                category: 'shampoo',
                hairType: 'fins',
                volume: 200,
                prepTime: 30,
                createdAt: '2024-01-10T08:45:00Z',
                updatedAt: '2024-01-28T10:15:00Z',
                ingredients: [
                    { name: 'Base lavante douce', quantity: 30.0 },
                    { name: 'Glycérine', quantity: 3.0 }
                ],
                compliance: { isValid: true }
            },
            {
                id: '5',
                name: 'Shampoing fortifiant kératine',
                description: 'Avec protéines de riz et biotine pour cheveux cassants et abîmés',
                category: 'shampoo',
                hairType: 'abimés',
                volume: 250,
                prepTime: 35,
                createdAt: '2024-02-01T11:30:00Z',
                updatedAt: '2024-02-05T09:45:00Z',
                ingredients: [
                    { name: 'Kératine hydrolysée', quantity: 2.0 },
                    { name: 'Biotine', quantity: 0.1 }
                ],
                compliance: { isValid: true }
            },

            // Masques cheveux
            {
                id: '6',
                name: 'Masque reconstructeur avocat',
                description: 'Riche en acides gras essentiels, 20 minutes de pose pour une réparation profonde',
                category: 'hair-mask',
                hairType: 'secs',
                prepTime: 40,
                volume: 150,
                createdAt: '2024-01-25T16:20:00Z',
                updatedAt: '2024-01-30T14:10:00Z',
                ingredients: [
                    { name: 'Huile d\'avocat', quantity: 10.0 },
                    { name: 'Beurre de mangue', quantity: 8.0 }
                ],
                compliance: { isValid: true }
            },

            // Lessives
            {
                id: '7',
                name: 'Lessive liquide hypoallergénique',
                description: 'Sans parfum, sans colorant, pour peaux sensibles et bébés',
                category: 'laundry',
                volume: 1000,
                prepTime: 45,
                createdAt: '2024-02-03T13:45:00Z',
                updatedAt: '2024-01-30T14:10:00Z',
                ingredients: [
                    { name: 'Tensioactifs doux', quantity: 20.0 },
                    { name: 'Carbonate de sodium', quantity: 5.0 }
                ],
                compliance: { isValid: true }
            },

            // Savons
            {
                id: '8',
                name: 'Savon surgras à l\'avoine',
                description: 'Doux et nourrissant pour les peaux sèches et sensibles',
                category: 'soap',
                skinType: 'sensible',
                prepTime: 60,
                volume: 100,
                createdAt: '2024-02-08T09:30:00Z',
                updatedAt: '2024-02-10T15:20:00Z',
                ingredients: [
                    { name: 'Huile d\'olive', quantity: 40.0 },
                    { name: 'Flocons d\'avoine', quantity: 5.0 }
                ],
                compliance: { isValid: true }
            },

            // Crèmes mains
            {
                id: '9',
                name: 'Crème réparatrice mains',
                description: 'Avec allantoïne et panthénol pour mains très abîmées',
                category: 'hand-cream',
                volume: 75,
                prepTime: 25,
                createdAt: '2024-02-05T14:15:00Z',
                updatedAt: '2024-02-12T11:45:00Z',
                ingredients: [
                    { name: 'Allantoïne', quantity: 0.5 },
                    { name: 'Panthénol', quantity: 1.0 }
                ],
                compliance: { isValid: true }
            },

            // Détergents
            {
                id: '10',
                name: 'Détergent multi-surfaces',
                description: 'Nettoyant écologique aux huiles essentielles d\'agrumes',
                category: 'detergent',
                volume: 500,
                prepTime: 20,
                createdAt: '2024-02-07T10:00:00Z',
                updatedAt: '2024-02-14T16:30:00Z',
                ingredients: [
                    { name: 'Tensioactifs végétaux', quantity: 15.0 },
                    { name: 'Huile essentielle citron', quantity: 0.5 }
                ],
                compliance: { isValid: false }
            }
        ]
    } catch (err: any) {
        console.error('Erreur de chargement:', err)
        error.value = err.message || 'Impossible de charger les formules'
    } finally {
        loading.value = false
    }
}

// Watch pour la pagination
watch(currentPage, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Initialisation
onMounted(async () => {
    await loadRecipes()
})
</script>

<style scoped>
.recipe-card {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.recipe-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>