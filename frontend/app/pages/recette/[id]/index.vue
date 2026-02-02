<template>
    <!-- Écran de chargement -->
    <div v-if="loading" class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div class="text-center max-w-md">
            <div class="relative inline-block mb-6">
                <div class="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-blue-600 text-2xl">🧴</span>
                </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Analyse de la formule</h2>
            <p class="text-gray-600 mb-6">Chargement et validation des données cosmétiques selon les normes UE</p>
            <div class="space-y-2">
                <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span class="animate-pulse">⌛</span>
                    <span>Validation réglementaire en cours...</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Écran d'erreur -->
    <div v-else-if="error" class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-red-200">
            <div class="flex items-start gap-4 mb-6">
                <div class="flex-shrink-0">
                    <div class="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                        <span class="text-2xl text-white">❌</span>
                    </div>
                </div>
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Formule introuvable</h2>
                    <p class="text-gray-600 mb-4">{{ error }}</p>
                    <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <p>Vérifiez que l'identifiant de la formule est correct ou que vous avez les permissions nécessaires.</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <NuxtLink
                    to="/recettes"
                    class="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    <span>←</span>
                    <span>Retour aux formules</span>
                </NuxtLink>
                <button
                    @click="retryLoad"
                    class="flex-1 py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300"
                >
                    <span>↻</span>
                    <span>Réessayer</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="formula" class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <!-- Barre de navigation supérieure -->
        <div class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-3">
                <div class="flex items-center justify-between gap-4">
                    <!-- Navigation -->
                    <div class="flex items-center gap-3">
                        <NuxtLink
                            to="/recettes"
                            class="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            aria-label="Retour à la liste des formules"
                        >
                            <span class="text-xl transition-transform group-hover:-translate-x-1">←</span>
                            <span class="hidden sm:inline font-medium">Formules</span>
                        </NuxtLink>

                        <div class="h-6 w-px bg-gray-300"></div>

                        <!-- Actions rapides -->
                        <div class="flex items-center gap-2">
                            <NuxtLink
                                :to="`/recette/${formula.id}/edit`"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                aria-label="Modifier cette formule"
                            >
                                <span>✏️</span>
                                <span class="hidden sm:inline">Modifier</span>
                            </NuxtLink>

                            <button
                                @click="generatePDF"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                aria-label="Générer un PDF de cette formule"
                            >
                                <span>📄</span>
                                <span class="hidden sm:inline">PDF</span>
                            </button>

                            <button
                                @click="togglePrintMode"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                aria-label="Mode impression"
                            >
                                <span>🖨️</span>
                                <span class="hidden sm:inline">Imprimer</span>
                            </button>
                        </div>
                    </div>

                    <!-- Titre -->
                    <div class="flex-1 min-w-0">
                        <h1 class="text-lg font-bold text-gray-900 truncate text-center sm:text-left">
                            {{ formula.name }}
                        </h1>
                        <p class="text-xs text-gray-500 text-center sm:text-left truncate">
                            ID: {{ formula.id }} • {{ formatDateShort(formula.updatedAt) }}
                        </p>
                    </div>

                    <!-- Indicateur de statut -->
                    <div class="flex-shrink-0">
                        <div :class="[
              'px-4 py-2 rounded-full text-sm font-bold shadow-sm',
              isFormulaValid
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
            ]">
                            <span class="hidden sm:inline">{{ isFormulaValid ? '✅ Conforme UE' : '⚠️ Non conforme' }}</span>
                            <span class="sm:hidden">{{ isFormulaValid ? '✅' : '⚠️' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
            <!-- En-tête avec métadonnées -->
            <header class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <!-- Titre et description -->
                    <div class="flex-1">
                        <div class="flex items-start gap-4 mb-4">
                            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                <span class="text-2xl text-white">🧴</span>
                            </div>
                            <div class="flex-1">
                                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{{ formula.name }}</h1>
                                <p v-if="formula.description" class="text-lg text-gray-600 mb-4">
                                    {{ formula.description }}
                                </p>

                                <!-- Tags -->
                                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    Type: {{ formula.type || 'skincare' }}
                  </span>
                                    <span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                    Peau: {{ formula.skinType }}
                  </span>
                                    <span class="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                    {{ formula.volume }} ml
                  </span>
                                    <span v-if="formula.compliance?.version" class="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                    v{{ formula.compliance.version }}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Indicateur de volume -->
                    <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                        <div class="text-center">
                            <div class="text-4xl font-bold text-blue-700 mb-1">{{ formula.volume }}</div>
                            <div class="text-lg text-blue-600 font-medium mb-2">ml</div>
                            <div class="text-sm text-gray-600">
                                {{ calculateTotalGrams() }} g total
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Métadonnées en grille -->
                <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- Type de peau -->
                    <div class="metadata-card">
                        <div class="metadata-label">
                            <span class="text-purple-600 mr-2">👤</span>
                            Type de peau
                        </div>
                        <div class="metadata-value text-purple-700 capitalize">
                            {{ formula.skinType }}
                        </div>
                        <div class="metadata-subtext">
                            {{ getSkinTypeDescription(formula.skinType) }}
                        </div>
                    </div>

                    <!-- Total HE -->
                    <div class="metadata-card">
                        <div class="metadata-label">
                            <span class="text-green-600 mr-2">🌿</span>
                            Huiles essentielles
                        </div>
                        <div class="metadata-value" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                            {{ heTotal.toFixed(2) }}%
                        </div>
                        <div class="metadata-subtext">
                            {{ calculateGrams(heTotal) }} g • {{ essentialOils.length }} HE
                        </div>
                    </div>

                    <!-- Actifs -->
                    <div class="metadata-card">
                        <div class="metadata-label">
                            <span class="text-blue-600 mr-2">✨</span>
                            Actifs cosmétiques
                        </div>
                        <div class="metadata-value text-blue-700">
                            {{ actives.length }}
                        </div>
                        <div class="metadata-subtext">
                            {{ getActiveTotalPercentage().toFixed(1) }}% du total
                        </div>
                    </div>

                    <!-- Conformité UE -->
                    <div class="metadata-card">
                        <div class="metadata-label">
                            <span class="text-emerald-600 mr-2">🏛️</span>
                            Statut UE
                        </div>
                        <div class="metadata-value" :class="isFormulaValid ? 'text-emerald-700' : 'text-red-700'">
                            {{ isFormulaValid ? 'Conforme' : 'Non conforme' }}
                        </div>
                        <div class="metadata-subtext">
                            Règlement UE 1223/2009
                            <span v-if="!isFormulaValid" class="text-red-600 font-medium ml-1">
                ({{ regulatoryErrors.length }} erreur{{ regulatoryErrors.length > 1 ? 's' : '' }})
              </span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Navigation rapide -->
            <nav class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-100 sticky top-20 z-40">
                <div class="flex flex-wrap gap-2 justify-center">
                    <a v-for="section in sections"
                       :key="section.id"
                       :href="`#${section.id}`"
                       @click.prevent="scrollToSection(section.id)"
                       class="nav-link group"
                       :aria-label="`Aller à la section ${section.name}`">
                        <span class="text-lg mr-2 transition-transform group-hover:scale-110">{{ section.icon }}</span>
                        <span>{{ section.name }}</span>
                        <span class="nav-link-indicator" :class="{ 'active': activeSection === section.id }"></span>
                    </a>
                </div>
            </nav>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar -->
                <aside class="lg:w-1/4">
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-40">
                        <!-- Aperçu rapide -->
                        <div class="mb-8">
                            <h2 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                                <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">📋</span>
                                <span>Aperçu rapide</span>
                            </h2>

                            <!-- Actifs principaux -->
                            <div class="mb-6">
                                <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span>✨</span>
                                    <span>Ingrédients principaux</span>
                                </h3>
                                <div v-if="actives.length" class="space-y-3">
                                    <div v-for="(active, idx) in actives.slice(0, 3)"
                                         :key="idx"
                                         class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium text-gray-900 truncate text-sm">{{ active.name }}</span>
                                            <span class="font-bold text-blue-700">{{ active.quantity }}%</span>
                                        </div>
                                        <div class="text-xs text-gray-500 mt-1">
                                            {{ calculateGrams(active.quantity) }} g
                                        </div>
                                    </div>
                                    <div v-if="actives.length > 3" class="text-center">
                                        <button @click="showAllActives = !showAllActives"
                                                class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                            {{ showAllActives ? 'Voir moins' : `+ ${actives.length - 3} autre(s)` }}
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border">
                                    Aucun actif fonctionnel
                                </div>
                            </div>

                            <!-- Huiles essentielles -->
                            <div class="mb-6">
                                <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span>🌿</span>
                                    <span>Huiles essentielles</span>
                                </h3>
                                <div v-if="essentialOils.length" class="space-y-3">
                                    <div v-for="(he, idx) in essentialOils.slice(0, 3)"
                                         :key="idx"
                                         :class="[
                         'rounded-lg p-3 border',
                         isHENotSafeForPregnancy(he.name) ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
                         isHEPhotosensitive(he.name) ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
                         'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                       ]">
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium text-gray-900 truncate text-sm">{{ he.name.replace('HE ', '') }}</span>
                                            <span class="font-bold" :class="he.quantity > getHEMaxLimit(he.name) ? 'text-red-700' : 'text-green-700'">
                        {{ he.quantity }}%
                      </span>
                                        </div>
                                        <div class="text-xs text-gray-500 mt-1 flex justify-between">
                                            <span>{{ calculateGrams(he.quantity) }} g</span>
                                            <span v-if="he.quantity > getHEMaxLimit(he.name)" class="text-red-600 font-medium">
                        ⚠️ Limite dépassée
                      </span>
                                        </div>
                                    </div>
                                    <div v-if="essentialOils.length > 3" class="text-center">
                                        <button @click="showAllHE = !showAllHE"
                                                class="text-sm text-green-600 hover:text-green-800 font-medium">
                                            {{ showAllHE ? 'Voir moins' : `+ ${essentialOils.length - 3} autre(s)` }}
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border">
                                    Aucune huile essentielle
                                </div>
                            </div>
                        </div>

                        <!-- Informations techniques -->
                        <div class="mb-8">
                            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <span>📊</span>
                                <span>Informations techniques</span>
                            </h3>
                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Densité estimée</span>
                                    <span class="font-medium text-gray-900">1.0 g/ml</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span class="text-gray-600">pH optimal</span>
                                    <span class="font-medium text-gray-900">5.5 - 6.5</span>
                                </div>
                                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Durée de conservation</span>
                                    <span class="font-medium text-gray-900">6 mois</span>
                                </div>
                                <div class="flex justify-between items-center py-2">
                                    <span class="text-gray-600">Catégorie</span>
                                    <span class="font-medium text-gray-900 capitalize">{{ formula.type || 'skincare' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Métadonnées -->
                        <div class="pt-6 border-t border-gray-200">
                            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <span>📅</span>
                                <span>Métadonnées</span>
                            </h3>
                            <div class="space-y-3 text-sm">
                                <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-gray-600">Créée le</span>
                                        <span class="font-medium text-gray-900">{{ formatDateShort(formula.createdAt) }}</span>
                                    </div>
                                    <div class="text-xs text-gray-500">{{ formatTime(formula.createdAt) }}</div>
                                </div>
                                <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-gray-600">Dernière modification</span>
                                        <span class="font-medium text-gray-900">{{ formatDateShort(formula.updatedAt) }}</span>
                                    </div>
                                    <div class="text-xs text-gray-500">{{ formatTime(formula.updatedAt) }}</div>
                                </div>
                                <div v-if="formula.compliance?.euRegulation" class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-200">
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600">Conformité</span>
                                        <span class="font-medium text-emerald-700">UE {{ formula.compliance.euRegulation }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions rapides -->
                        <div class="mt-8 pt-6 border-t border-gray-200 space-y-3">
                            <button
                                @click="copyFormula"
                                class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 flex items-center justify-center gap-3 border border-blue-200 shadow-sm hover:shadow-md"
                                aria-label="Copier les données de la formule"
                            >
                                <span class="text-xl">📋</span>
                                <span>Copier les données</span>
                            </button>
                            <button
                                @click="exportFormula"
                                class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200 shadow-sm hover:shadow-md"
                                aria-label="Exporter la formule en JSON"
                            >
                                <span class="text-xl">📤</span>
                                <span>Exporter JSON</span>
                            </button>
                            <button
                                @click="shareFormula"
                                class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 flex items-center justify-center gap-3 border border-purple-200 shadow-sm hover:shadow-md"
                                aria-label="Partager cette formule"
                            >
                                <span class="text-xl">🔗</span>
                                <span>Partager</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Contenu principal -->
                <main class="lg:w-3/4 space-y-8">
                    <!-- Section 1: Description -->
                    <section id="description"
                             ref="descriptionSection"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 section-card">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">📝</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Description de la formule</h2>
                                <p class="text-gray-600">Informations générales et caractéristiques principales</p>
                            </div>
                        </div>

                        <!-- Contenu -->
                        <div class="space-y-8">
                            <!-- Description principale -->
                            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                                <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span class="text-blue-600">📋</span>
                                    <span>Résumé de la formule</span>
                                </h3>
                                <div class="prose max-w-none">
                                    <p class="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {{ formula.description || 'Aucune description fournie pour cette formule.' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Caractéristiques -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                                    <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <span class="text-purple-600">🎯</span>
                                        <span>Caractéristiques principales</span>
                                    </h4>
                                    <ul class="space-y-3">
                                        <li class="flex items-start gap-3">
                                            <span class="text-purple-600 mt-1">•</span>
                                            <div>
                                                <span class="font-medium text-gray-900">Type de formule:</span>
                                                <span class="text-gray-700 ml-2 capitalize">{{ formula.type || 'skincare' }}</span>
                                            </div>
                                        </li>
                                        <li class="flex items-start gap-3">
                                            <span class="text-purple-600 mt-1">•</span>
                                            <div>
                                                <span class="font-medium text-gray-900">Volume total:</span>
                                                <span class="text-gray-700 ml-2">{{ formula.volume }} ml</span>
                                            </div>
                                        </li>
                                        <li class="flex items-start gap-3">
                                            <span class="text-purple-600 mt-1">•</span>
                                            <div>
                                                <span class="font-medium text-gray-900">Type de peau cible:</span>
                                                <span class="text-gray-700 ml-2 capitalize">{{ formula.skinType }}</span>
                                            </div>
                                        </li>
                                        <li class="flex items-start gap-3">
                                            <span class="text-purple-600 mt-1">•</span>
                                            <div>
                                                <span class="font-medium text-gray-900">Système de conservation:</span>
                                                <span class="text-gray-700 ml-2">{{ getPreservativeSystem() }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                                    <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <span class="text-emerald-600">📊</span>
                                        <span>Statistiques techniques</span>
                                    </h4>
                                    <div class="space-y-4">
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="text-center">
                                                <div class="text-2xl font-bold text-emerald-700">{{ formula.ingredients.length }}</div>
                                                <div class="text-sm text-gray-600">Ingrédients totaux</div>
                                            </div>
                                            <div class="text-center">
                                                <div class="text-2xl font-bold text-blue-700">{{ actives.length }}</div>
                                                <div class="text-sm text-gray-600">Actifs cosmétiques</div>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="text-center">
                                                <div class="text-2xl font-bold" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                                                    {{ heTotal.toFixed(2) }}%
                                                </div>
                                                <div class="text-sm text-gray-600">Total HE</div>
                                            </div>
                                            <div class="text-center">
                                                <div class="text-2xl font-bold text-purple-700">{{ essentialOils.length }}</div>
                                                <div class="text-sm text-gray-600">Huiles essentielles</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recommandations pour le type de peau -->
                            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                                <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span class="text-amber-600">💡</span>
                                    <span>Recommandations pour peau {{ formula.skinType }}</span>
                                </h4>
                                <div class="prose max-w-none">
                                    <ul class="space-y-2">
                                        <li v-for="(tip, index) in getSkinTypeTips(formula.skinType)"
                                            :key="index"
                                            class="flex items-start gap-2 text-gray-700">
                                            <span class="text-amber-500 mt-1">✓</span>
                                            <span>{{ tip }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 2: Composition détaillée -->
                    <section id="ingredients"
                             ref="ingredientsSection"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 section-card">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">🧪</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Composition détaillée</h2>
                                <p class="text-gray-600">Analyse complète des ingrédients et de leurs dosages</p>
                            </div>
                        </div>

                        <!-- Actifs cosmétiques -->
                        <div class="mb-10">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                                    <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">✨</span>
                                    <span>Actifs cosmétiques</span>
                                    <span class="badge-info">{{ actives.length }} actif{{ actives.length > 1 ? 's' : '' }}</span>
                                </h3>
                                <div class="text-sm text-gray-500">
                                    Total: {{ getActiveTotalPercentage().toFixed(1) }}%
                                </div>
                            </div>

                            <div v-if="actives.length" class="space-y-4">
                                <div v-for="(active, idx) in (showAllActives ? actives : actives.slice(0, 3))"
                                     :key="idx"
                                     :class="[
                       'ingredient-card transform transition-all duration-300 hover:-translate-y-1',
                       getActiveStatus(active.quantity, active.name) === 'Surdosage' ? 'ingredient-warning' :
                       getActiveStatus(active.quantity, active.name) === 'Sous-dosage' ? 'ingredient-low' :
                       'ingredient-normal'
                     ]">
                                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                                        <!-- Informations -->
                                        <div class="flex-1">
                                            <div class="flex items-start justify-between mb-2">
                                                <h4 class="font-bold text-gray-900 text-lg">{{ active.name }}</h4>
                                                <div class="text-right">
                                                    <div class="text-2xl font-bold text-gray-900">{{ active.quantity }}%</div>
                                                    <div class="text-sm text-gray-500">{{ calculateGrams(active.quantity) }} g</div>
                                                </div>
                                            </div>

                                            <p class="text-sm text-gray-600 mb-3">
                                                {{ getActiveDescription(active.name) }}
                                            </p>

                                            <!-- Status -->
                                            <div class="flex items-center gap-3">
                        <span :class="getActiveStatusClass(active.quantity, active.name)">
                          {{ getActiveStatus(active.quantity, active.name) }}
                        </span>
                                                <div class="text-xs text-gray-500">
                                                    Recommandé: {{ getActiveRecommendation(active.name) }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Graphique de dosage -->
                                        <div class="md:w-48">
                                            <div class="space-y-2">
                                                <div class="flex justify-between text-xs">
                                                    <span class="text-gray-500">Min: {{ getActiveMin(active.name) }}%</span>
                                                    <span class="font-medium text-blue-600">{{ active.quantity }}%</span>
                                                    <span class="text-gray-500">Max: {{ getActiveMax(active.name) }}%</span>
                                                </div>
                                                <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div class="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                                                    <div class="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                                         :style="{ width: getActiveProgress(active.quantity, active.name) }">
                                                    </div>
                                                    <div class="absolute h-full w-0.5 bg-gray-900 opacity-50"
                                                         :style="{ left: getActiveProgress(active.quantity, active.name) }">
                                                    </div>
                                                </div>
                                                <div class="flex justify-between text-xs text-gray-500">
                                                    <span>Sous-dosage</span>
                                                    <span>Optimal</span>
                                                    <span>Surdosage</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bouton Voir plus/moins -->
                                <div v-if="actives.length > 3" class="text-center pt-4">
                                    <button @click="showAllActives = !showAllActives"
                                            class="px-6 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border border-blue-200 font-medium">
                                        {{ showAllActives ? 'Voir moins' : `Voir les ${actives.length - 3} autres actifs` }}
                                    </button>
                                </div>
                            </div>
                            <div v-else class="empty-state">
                                <div class="text-center py-12">
                                    <span class="text-6xl mb-4 block opacity-50">✨</span>
                                    <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun actif cosmétique</h3>
                                    <p class="text-gray-600 max-w-md mx-auto">
                                        Cette formule ne contient pas d'actifs fonctionnels spécifiques.
                                        Vous pouvez en ajouter lors de l'édition.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Huiles essentielles -->
                        <div class="mb-10">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                                    <span class="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white">🌿</span>
                                    <span>Huiles essentielles</span>
                                    <span class="badge-info">{{ essentialOils.length }} HE</span>
                                </h3>
                                <div class="text-right">
                                    <div class="text-2xl font-bold" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                                        {{ heTotal.toFixed(2) }}%
                                    </div>
                                    <div class="text-sm text-gray-500">{{ calculateGrams(heTotal) }} g total</div>
                                </div>
                            </div>

                            <div v-if="essentialOils.length" class="space-y-4">
                                <div v-for="(he, idx) in (showAllHE ? essentialOils : essentialOils.slice(0, 3))"
                                     :key="idx"
                                     :class="[
                       'ingredient-card transform transition-all duration-300 hover:-translate-y-1',
                       he.quantity > getHEMaxLimit(he.name) ? 'ingredient-danger' :
                       isHENotSafeForPregnancy(he.name) ? 'ingredient-warning' :
                       'ingredient-normal'
                     ]">
                                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                                        <!-- Informations -->
                                        <div class="flex-1">
                                            <div class="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 class="font-bold text-gray-900 text-lg">{{ he.name.replace('HE ', '') }}</h4>
                                                    <p class="text-sm text-gray-500 font-mono">{{ getHELatinName(he.name) }}</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-2xl font-bold" :class="he.quantity > getHEMaxLimit(he.name) ? 'text-red-700' : 'text-green-700'">
                                                        {{ he.quantity }}%
                                                    </div>
                                                    <div class="text-sm text-gray-500">{{ calculateGrams(he.quantity) }} g</div>
                                                </div>
                                            </div>

                                            <!-- Propriétés et avertissements -->
                                            <div class="space-y-2">
                                                <div class="flex flex-wrap gap-1">
                          <span v-for="property in getHEProperties(he.name)"
                                :key="property"
                                class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                            {{ property }}
                          </span>
                                                </div>

                                                <div class="flex flex-wrap gap-2">
                          <span v-if="isHENotSafeForPregnancy(he.name)"
                                class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-100 text-red-800 border border-red-200">
                            <span>👶</span>
                            <span>Contre-indiqué grossesse</span>
                          </span>
                                                    <span v-if="isHEPhotosensitive(he.name)"
                                                          class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-100 text-orange-800 border border-orange-200">
                            <span>☀️</span>
                            <span>Photosensible</span>
                          </span>
                                                    <span v-if="isHEAllergen(he.name)"
                                                          class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 border border-amber-200">
                            <span>⚠️</span>
                            <span>Allergène</span>
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Graphique de sécurité -->
                                        <div class="md:w-64">
                                            <div class="space-y-3">
                                                <div class="flex justify-between text-xs">
                                                    <span class="text-gray-500">Limite: {{ getHEMaxLimit(he.name) }}%</span>
                                                    <span :class="he.quantity > getHEMaxLimit(he.name) ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
                            {{ he.quantity }}%
                          </span>
                                                </div>
                                                <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div class="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                                                    <div :class="[
                            'absolute h-full rounded-full transition-all duration-1000',
                            he.quantity > getHEMaxLimit(he.name)
                              ? 'bg-gradient-to-r from-red-500 to-red-600'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600'
                          ]"
                                                         :style="{ width: Math.min((he.quantity / getHEMaxLimit(he.name)) * 100, 100) + '%' }">
                                                    </div>
                                                    <!-- Marqueur de limite -->
                                                    <div class="absolute h-full w-0.5 bg-gray-900 opacity-50"
                                                         :style="{ left: '100%' }">
                                                    </div>
                                                </div>

                                                <!-- Avertissement dépassement -->
                                                <div v-if="he.quantity > getHEMaxLimit(he.name)"
                                                     class="p-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                                                    <p class="text-xs text-red-700 font-medium flex items-center gap-1">
                                                        <span>⚠️</span>
                                                        <span>Dépassement de {{ (he.quantity - getHEMaxLimit(he.name)).toFixed(2) }}%</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bouton Voir plus/moins -->
                                <div v-if="essentialOils.length > 3" class="text-center pt-4">
                                    <button @click="showAllHE = !showAllHE"
                                            class="px-6 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-200 font-medium">
                                        {{ showAllHE ? 'Voir moins' : `Voir les ${essentialOils.length - 3} autres HE` }}
                                    </button>
                                </div>

                                <!-- Total HE -->
                                <div class="mt-8 pt-8 border-t border-gray-200">
                                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 class="font-bold text-gray-900 text-lg mb-2">Total des huiles essentielles</h4>
                                                <p class="text-sm text-gray-600">
                                                    Limite réglementaire UE 1223/2009:
                                                    <span class="font-bold">1% maximum</span> pour les produits visage
                                                </p>
                                            </div>

                                            <div class="text-center md:text-right">
                                                <div class="text-3xl font-bold" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                                                    {{ heTotal.toFixed(2) }}%
                                                </div>
                                                <div class="text-sm text-gray-500">{{ calculateGrams(heTotal) }} g</div>
                                                <div class="mt-2">
                          <span :class="[
                            'px-3 py-1 rounded-full text-xs font-bold',
                            heTotal > 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          ]">
                            {{ heTotal > 1 ? '⚠️ Limite dépassée' : '✅ Dans la limite' }}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Jauge totale -->
                                        <div class="mt-6">
                                            <div class="flex justify-between text-sm mb-2">
                                                <span class="text-gray-600">0%</span>
                                                <span class="font-bold" :class="heTotal > 1 ? 'text-red-600' : 'text-green-600'">
                          {{ heTotal.toFixed(2) }}%
                        </span>
                                                <span class="text-gray-600">1% (limite UE)</span>
                                            </div>
                                            <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div :class="[
                          'h-full rounded-full transition-all duration-1000',
                          heTotal > 1 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          heTotal > 0.8 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-600'
                        ]"
                                                     :style="{ width: Math.min(heTotal * 100, 100) + '%' }">
                                                </div>
                                            </div>
                                            <div class="flex justify-between text-xs text-gray-500 mt-2">
                                                <span>Sécuritaire</span>
                                                <span>Limite UE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="empty-state">
                                <div class="text-center py-12">
                                    <span class="text-6xl mb-4 block opacity-50">🌿</span>
                                    <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune huile essentielle</h3>
                                    <p class="text-gray-600 max-w-md mx-auto">
                                        Cette formule ne contient pas d'huiles essentielles.
                                        L'ajout d'HE est optionnel mais soumis à la limite réglementaire de 1%.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Tableau récapitulatif -->
                        <div>
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                                    <span class="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg text-white">📋</span>
                                    <span>Tableau récapitulatif</span>
                                </h3>
                                <div class="text-sm text-gray-500">
                                    {{ formula.ingredients.length }} ingrédients
                                </div>
                            </div>

                            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm text-left text-gray-700">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th class="px-6 py-4 font-bold">Ingrédient</th>
                                            <th class="px-6 py-4 font-bold">Type</th>
                                            <th class="px-6 py-4 font-bold text-right">Pourcentage</th>
                                            <th class="px-6 py-4 font-bold text-right">Grammes</th>
                                            <th class="px-6 py-4 font-bold">Statut</th>
                                        </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100">
                                        <tr v-for="(ingredient, idx) in formula.ingredients"
                                            :key="idx"
                                            class="bg-white hover:bg-gray-50 transition-colors duration-150">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                                                         :class="getIngredientTypeColor(ingredient)">
                                                        <span class="text-xs">{{ getIngredientIcon(ingredient) }}</span>
                                                    </div>
                                                    <div>
                                                        <div class="font-medium text-gray-900">{{ ingredient.name }}</div>
                                                        <div v-if="ingredient.latinName" class="text-xs text-gray-500 font-mono">
                                                            {{ ingredient.latinName }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                          <span :class="getIngredientTypeClass(ingredient)">
                            {{ getIngredientType(ingredient) }}
                          </span>
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <div class="font-bold text-gray-900">{{ ingredient.quantity }}%</div>
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <div class="text-gray-600">{{ calculateGrams(ingredient.quantity) }} g</div>
                                            </td>
                                            <td class="px-6 py-4">
                          <span :class="getIngredientStatusClass(ingredient)">
                            {{ getIngredientStatus(ingredient) }}
                          </span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Total du tableau -->
                                <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div class="flex justify-between items-center">
                                        <div class="text-sm text-gray-600">
                                            {{ formula.ingredients.length }} ingrédients • Total: 100%
                                        </div>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-gray-900">{{ calculateTotalGrams() }} g</div>
                                            <div class="text-sm text-gray-500">Volume: {{ formula.volume }} ml</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 3: Analyse et conformité -->
                    <section id="compliance"
                             ref="complianceSection"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 section-card">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">✅</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyse et conformité</h2>
                                <p class="text-gray-600">Validation complète selon le Règlement UE 1223/2009</p>
                            </div>
                        </div>

                        <!-- Résumé de conformité -->
                        <div class="mb-10">
                            <div :class="[
                'status-card rounded-xl p-8 border-2 transition-all duration-300',
                isFormulaValid ? 'status-valid-card' : 'status-invalid-card'
              ]">
                                <div class="flex flex-col md:flex-row md:items-center gap-6">
                                    <!-- Icone -->
                                    <div class="flex-shrink-0">
                                        <div :class="[
                      'status-icon w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg',
                      isFormulaValid ? 'status-valid-icon' : 'status-invalid-icon'
                    ]">
                                            <span class="text-4xl">{{ isFormulaValid ? '✅' : '❌' }}</span>
                                        </div>
                                    </div>

                                    <!-- Contenu -->
                                    <div class="flex-1">
                                        <h3 class="text-2xl font-bold mb-3">
                                            {{ isFormulaValid ? 'Formule conforme aux réglementations UE' : 'Formule non conforme - Attention requise' }}
                                        </h3>
                                        <p class="text-gray-700 mb-4">
                                            {{ isFormulaValid
                                            ? 'Cette formule respecte toutes les exigences du Règlement cosmétique européen 1223/2009 et est prête pour une évaluation finale par un Responsable de la Conformité.'
                                            : 'Cette formule présente des non-conformités réglementaires nécessitant une correction avant toute utilisation ou commercialisation.'
                                            }}
                                        </p>

                                        <div class="flex flex-wrap gap-3">
                                            <div :class="[
                        'px-4 py-2 rounded-lg font-bold',
                        isFormulaValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      ]">
                                                {{ validationChecks.filter(c => c.passed).length }}/{{ validationChecks.length }} critères validés
                                            </div>

                                            <div v-if="!isFormulaValid" class="px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-800 rounded-lg font-bold">
                                                {{ regulatoryErrors.length }} erreur{{ regulatoryErrors.length > 1 ? 's' : '' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Critères de validation détaillés -->
                        <div class="mb-10">
                            <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                                <span class="text-emerald-600">📋</span>
                                <span>Critères de validation détaillés</span>
                            </h3>

                            <div class="space-y-4">
                                <div v-for="check in validationChecks"
                                     :key="check.name"
                                     :class="[
                       'validation-item rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-md',
                       check.passed
                         ? 'bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-emerald-200'
                         : 'bg-gradient-to-r from-red-50/50 to-orange-50/50 border-red-200'
                     ]">
                                    <div class="flex items-start gap-4">
                                        <!-- Icone -->
                                        <div class="flex-shrink-0">
                                            <div :class="[
                        'validation-icon w-12 h-12 rounded-xl flex items-center justify-center',
                        check.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      ]">
                                                <span class="text-xl font-bold">{{ check.passed ? '✓' : '✗' }}</span>
                                            </div>
                                        </div>

                                        <!-- Contenu -->
                                        <div class="flex-1">
                                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                                <h4 class="font-bold text-lg text-gray-900">{{ check.name }}</h4>
                                                <span :class="[
                          'px-3 py-1 rounded-full text-sm font-bold',
                          check.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        ]">
                          {{ check.passed ? 'Conforme' : 'Non conforme' }}
                        </span>
                                            </div>

                                            <p class="text-gray-600 mb-4">{{ check.description }}</p>

                                            <div v-if="!check.passed"
                                                 class="bg-white rounded-lg p-4 border border-red-200">
                                                <div class="flex items-start gap-2">
                                                    <span class="text-red-500 mt-1">⚠️</span>
                                                    <div>
                                                        <p class="font-medium text-red-800 mb-2">{{ check.error }}</p>
                                                        <p v-if="check.recommendation" class="text-sm text-gray-700">
                                                            <span class="font-medium">Recommandation:</span> {{ check.recommendation }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Liste INCI -->
                        <div class="mb-10">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                                    <span class="text-blue-600">🧾</span>
                                    <span>Liste INCI (International Nomenclature of Cosmetic Ingredients)</span>
                                </h3>
                                <button
                                    @click="copyINCI"
                                    class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                                    :class="{ 'bg-green-600': copied }"
                                    aria-label="Copier la liste INCI"
                                >
                                    <span>{{ copied ? '✅' : '📋' }}</span>
                                    <span>{{ copied ? 'Copié !' : 'Copier INCI' }}</span>
                                </button>
                            </div>

                            <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100 overflow-hidden">
                                <div class="p-6 bg-white/50 border-b border-blue-100">
                                    <div class="flex items-center justify-between text-sm text-gray-600">
                                        <div class="flex items-center gap-2">
                                            <span>📝</span>
                                            <span>Conforme à l'Annexe I du Règlement UE 1223/2009</span>
                                        </div>
                                        <span>{{ inciList.split(', ').length }} ingrédients</span>
                                    </div>
                                </div>

                                <div class="relative">
                  <pre class="text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto p-6 min-h-[200px] max-h-[400px] overflow-y-auto"
                       id="inci-list"
                       aria-label="Liste INCI des ingrédients">
{{ formatINCIList() }}</pre>
                                </div>
                            </div>

                            <p class="text-sm text-gray-500 mt-3">
                                L'ordre INCI suit la concentration décroissante (>1%) conformément aux exigences du Règlement UE 1223/2009.
                                Les ingrédients à moins de 1% peuvent être listés dans n'importe quel ordre après les ingrédients à plus de 1%.
                            </p>
                        </div>

                        <!-- Avertissements et mentions obligatoires -->
                        <div class="space-y-8">
                            <!-- Avertissements -->
                            <div v-if="warnings.length > 0">
                                <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                                    <span class="text-amber-600">⚠️</span>
                                    <span>Avertissements et recommandations</span>
                                </h3>

                                <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                                    <div class="space-y-4">
                                        <div v-for="(warning, idx) in warnings"
                                             :key="idx"
                                             class="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-amber-100">
                                            <span class="text-amber-500 text-xl mt-1">⚠️</span>
                                            <div>
                                                <p class="font-medium text-amber-800">{{ warning }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mentions obligatoires -->
                            <div v-if="mandatoryMentions.length > 0">
                                <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                                    <span class="text-purple-600">📝</span>
                                    <span>Mentions obligatoires pour l'étiquetage</span>
                                </h3>

                                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="(mention, idx) in mandatoryMentions.slice(0, showAllMentions ? mandatoryMentions.length : 6)"
                                             :key="idx"
                                             class="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-purple-100">
                                            <span class="text-purple-500 mt-1">•</span>
                                            <span class="text-sm text-gray-800">{{ mention }}</span>
                                        </div>
                                    </div>

                                    <div v-if="mandatoryMentions.length > 6" class="mt-6 text-center">
                                        <button @click="showAllMentions = !showAllMentions"
                                                class="px-6 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg hover:from-purple-100 hover:to-violet-100 transition-all duration-300 border border-purple-200 font-medium">
                                            {{ showAllMentions ? 'Voir moins' : `Voir les ${mandatoryMentions.length - 6} mentions supplémentaires` }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Rapport de sécurité -->
                            <div>
                                <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                                    <span class="text-red-600">🛡️</span>
                                    <span>Rapport de sécurité</span>
                                </h3>

                                <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                                    <div class="space-y-6">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 class="font-medium text-gray-900 mb-3">Classification de risque</h4>
                                                <div :class="[
                          'px-4 py-3 rounded-lg font-bold text-center',
                          riskLevel === 'Élevé' ? 'bg-red-100 text-red-800' :
                          riskLevel === 'Modéré' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        ]">
                                                    {{ riskLevel }}
                                                </div>
                                                <p class="text-sm text-gray-600 mt-2">{{ riskDescription }}</p>
                                            </div>

                                            <div>
                                                <h4 class="font-medium text-gray-900 mb-3">Mesures de précaution</h4>
                                                <ul class="space-y-2">
                                                    <li v-for="(measure, idx) in safetyMeasures"
                                                        :key="idx"
                                                        class="text-sm text-gray-700 flex items-start gap-2">
                                                        <span class="text-green-500 mt-1">✓</span>
                                                        <span>{{ measure }}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <!-- Bouton de rapport complet -->
                                        <div class="pt-6 border-t border-red-200">
                                            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                                                <div>
                                                    <h4 class="font-medium text-gray-900">Rapport de sécurité complet</h4>
                                                    <p class="text-sm text-gray-600">Générez un rapport PDF détaillé pour vos archives réglementaires</p>
                                                </div>
                                                <button @click="generateSafetyReport"
                                                        class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2">
                                                    <span>📄</span>
                                                    <span>Générer rapport PDF</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <!-- Footer informatif -->
            <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="text-center space-y-4">
                    <p class="text-sm text-gray-500 max-w-3xl mx-auto">
                        <span class="font-medium">Avertissement important :</span>
                        Cet outil fournit des recommandations techniques basées sur le Règlement UE 1223/2009.
                        Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable de la Conformité (PRC).
                        Toute commercialisation nécessite une évaluation de sécurité complète par un expert qualifié.
                    </p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
                        <span>Formule ID: {{ formula.id }}</span>
                        <span class="hidden sm:inline">•</span>
                        <span>Créée le: {{ formatDate(formula.createdAt) }}</span>
                        <span class="hidden sm:inline">•</span>
                        <span>Dernière modification: {{ formatDate(formula.updatedAt) }}</span>
                    </div>
                    <div class="text-xs text-gray-400">
                        Version de l'analyse: {{ formula.compliance?.version || '1.0' }} •
                        © {{ new Date().getFullYear() }} Formulateur Cosmétique Pro
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const { copy, copied } = useClipboard()

// Références aux sections pour l'intersection observer
const descriptionSection = ref<HTMLElement>()
const ingredientsSection = ref<HTMLElement>()
const complianceSection = ref<HTMLElement>()

// États
const formula = ref<any>(null)
const loading = ref(true)
const error = ref('')
const activeSection = ref('description')
const showAllActives = ref(false)
const showAllHE = ref(false)
const showAllMentions = ref(false)
const printMode = ref(false)

// Sections pour navigation
const sections = [
    { id: 'description', name: 'Description', icon: '📝' },
    { id: 'ingredients', name: 'Composition', icon: '🧪' },
    { id: 'compliance', name: 'Conformité', icon: '✅' }
]

// Données de référence pour les actifs
const activeReferences: Record<string, {
    min: number
    max: number
    recommendation: string
    description: string
}> = {
    'Acide hyaluronique': {
        min: 0.1,
        max: 2,
        recommendation: '0.1-2%',
        description: 'Humectant puissant, retient jusqu\'à 1000x son poids en eau'
    },
    'Vitamine E': {
        min: 0.1,
        max: 1,
        recommendation: '0.1-1%',
        description: 'Antioxydant liposoluble, protège des radicaux libres'
    },
    'Acide salicylique': {
        min: 0.5,
        max: 2,
        recommendation: '0.5-2%',
        description: 'BHA liposoluble, pénètre dans les pores pour un nettoyage en profondeur'
    },
    'Panthénol (B5)': {
        min: 0.5,
        max: 5,
        recommendation: '0.5-5%',
        description: 'Provitamine B5, favorise la régénération et la réparation cutanée'
    },
    'Niacinamide': {
        min: 2,
        max: 10,
        recommendation: '2-10%',
        description: 'Améliore la barrière cutanée, réduit les rougeurs et les pores'
    },
    'Vitamine C': {
        min: 5,
        max: 20,
        recommendation: '5-20%',
        description: 'Antioxydant puissant, stimule la synthèse de collagène'
    }
}

// Données de référence pour les HE
const HEReferences: Record<string, {
    max: number
    pregnancy: boolean
    photo: boolean
    allergen: boolean
    latin: string
    properties: string[]
}> = {
    'Encens (Boswellia carterii)': {
        max: 0.5,
        pregnancy: true,
        photo: false,
        allergen: false,
        latin: 'Boswellia carterii',
        properties: ['Anti-âge', 'Régénérant', 'Cicatrisant']
    },
    'Carotte sauvage': {
        max: 0.3,
        pregnancy: true,
        photo: true,
        allergen: false,
        latin: 'Daucus carota',
        properties: ['Détoxifiant', 'Régénérant', 'Tonique']
    },
    'Immortelle (Hélichryse)': {
        max: 0.4,
        pregnancy: true,
        photo: false,
        allergen: false,
        latin: 'Helichrysum italicum',
        properties: ['Anti-hématome', 'Régénérant', 'Anti-couperose']
    },
    'Orange douce': {
        max: 1.0,
        pregnancy: true,
        photo: true,
        allergen: true,
        latin: 'Citrus sinensis',
        properties: ['Antioxydant', 'Calmant', 'Digestif']
    },
    'Lavande vraie': {
        max: 1.0,
        pregnancy: true,
        photo: false,
        allergen: false,
        latin: 'Lavandula angustifolia',
        properties: ['Cicatrisant', 'Apaisant', 'Régénérant']
    },
    'Tea tree': {
        max: 1.0,
        pregnancy: false,
        photo: false,
        allergen: false,
        latin: 'Melaleuca alternifolia',
        properties: ['Antibactérien', 'Antifongique', 'Immunostimulant']
    },
    'Romarin à cinéole': {
        max: 0.4,
        pregnancy: false,
        photo: false,
        allergen: true,
        latin: 'Rosmarinus officinalis',
        properties: ['Stimulant', 'Antioxydant', 'Expectorant']
    }
}

// Types de peau avec descriptions et conseils
const skinTypes: Record<string, {
    description: string
    tips: string[]
}> = {
    'seche': {
        description: 'Peau déshydratée, besoin en nutrition élevé',
        tips: [
            'Privilégiez les huiles riches (avocat, amande douce)',
            'Utilisez des actifs hydratants (acide hyaluronique, B5)',
            'Évitez les textures trop légères',
            'Incorporez des émollients nourrissants',
            'Protégez la barrière cutanée avec des céramides'
        ]
    },
    'grasse': {
        description: 'Sécrétion sébacée importante, pores dilatés',
        tips: [
            'Optez pour des huiles légères (jojoba, noisette)',
            'Utilisez des actifs séborégulateurs (acide salicylique, niacinamide)',
            'Privilégiez les textures fluides et non comédogènes',
            'Évitez les formules trop riches',
            'Incorporez des ingrédients matifiants'
        ]
    },
    'sensible': {
        description: 'Réactivité cutanée élevée, tolérance limitée',
        tips: [
            'Choisissez des ingrédients apaisants (camomille, calendula)',
            'Limitez le nombre d\'actifs à maximum 2-3',
            'Évitez les parfums, alcools et ingrédients irritants',
            'Testez toujours la formule sur une petite zone avant usage',
            'Privilégiez les textures simples et minimalistes'
        ]
    },
    'mixte': {
        description: 'Combinaison de zones sèches et grasses',
        tips: [
            'Équilibrez hydratation et légèreté',
            'Ciblez les zones avec des actifs spécifiques',
            'Utilisez des textures adaptées aux deux types (crèmes-gels)',
            'Évitez les formules trop lourdes sur la zone T',
            'Appliquez différemment selon les zones du visage'
        ]
    },
    'mature': {
        description: 'Besoins anti-âge et restructuration',
        tips: [
            'Intégrez des actifs anti-âge (vitamines C et E, rétinol)',
            'Utilisez des huiles régénérantes (rose musquée, argan)',
            'Privilégiez les textures nourrissantes et onctueuses',
            'Incorporez des antioxydants et des peptides',
            'Protégez avec des filtres UV si usage diurne'
        ]
    }
}

// Computed properties
// Calculs de base
const calculateGrams = (percent: number): string => {
    const volume = formula.value?.volume || 50
    return ((volume * percent) / 100).toFixed(2)
}

const calculateTotalGrams = (): string => {
    const volume = formula.value?.volume || 50
    return volume.toFixed(2)
}

// Filtrage des ingrédients
const actives = computed(() => {
    if (!formula.value?.ingredients) return []
    return formula.value.ingredients.filter((ing: any) =>
        ing.type === 'active' ||
        ing.name.includes('Acide') ||
        ing.name.includes('Vitamine') ||
        ing.name.includes('Panthénol') ||
        ing.name.includes('Niacinamide') ||
        (!ing.name.startsWith('HE ') && !ing.name.includes('Eau') && !ing.name.includes('Conservateur'))
    )
})

const essentialOils = computed(() => {
    if (!formula.value?.ingredients) return []
    return formula.value.ingredients.filter((ing: any) =>
        ing.type === 'essential_oil' || ing.name.startsWith('HE ')
    )
})

const heTotal = computed(() => {
    if (!essentialOils.value.length) return 0
    return essentialOils.value.reduce((total: number, he: any) => total + he.quantity, 0)
})

const getActiveTotalPercentage = (): number => {
    return actives.value.reduce((total: number, active: any) => total + active.quantity, 0)
}

// Validation de conformité
const isFormulaValid = computed(() => {
    return heTotal.value <= 1 &&
        essentialOils.value.every((he: any) =>
            he.quantity <= (getHEMaxLimit(he.name) || 1)
        ) &&
        actives.value.every((active: any) => {
            const ref = activeReferences[active.name]
            if (!ref) return true
            return active.quantity >= ref.min && active.quantity <= ref.max
        })
})

// Fonctions utilitaires pour les actifs
const getActiveRecommendation = (name: string): string => {
    return activeReferences[name]?.recommendation || '1-5%'
}

const getActiveMin = (name: string): number => {
    return activeReferences[name]?.min || 0.5
}

const getActiveMax = (name: string): number => {
    return activeReferences[name]?.max || 5
}

const getActiveDescription = (name: string): string => {
    return activeReferences[name]?.description || 'Actif cosmétique fonctionnel'
}

const getActiveProgress = (quantity: number, name: string): string => {
    const ref = activeReferences[name]
    if (!ref) return '50%'
    const percentage = ((quantity - ref.min) / (ref.max - ref.min)) * 100
    return Math.min(Math.max(percentage, 0), 100) + '%'
}

const getActiveStatus = (quantity: number, name: string): string => {
    const ref = activeReferences[name]
    if (!ref) return 'Standard'

    if (quantity < ref.min) return 'Sous-dosage'
    if (quantity > ref.max) return 'Surdosage'
    if (Math.abs(quantity - ((ref.min + ref.max) / 2)) < (ref.max - ref.min) * 0.2) return 'Optimal'
    return 'Standard'
}

const getActiveStatusClass = (quantity: number, name: string): string => {
    const status = getActiveStatus(quantity, name)
    switch(status) {
        case 'Optimal':
        case 'Standard':
            return 'px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold rounded-full'
        case 'Surdosage':
            return 'px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-xs font-bold rounded-full'
        case 'Sous-dosage':
            return 'px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full'
        default:
            return 'px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full'
    }
}

// Fonctions utilitaires pour les HE
const getHEMaxLimit = (name: string): number => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.max || 1
}

const getHELatinName = (name: string): string => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.latin || heName
}

const getHEProperties = (name: string): string[] => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.properties || ['Propriétés non spécifiées']
}

const isHENotSafeForPregnancy = (name: string): boolean => {
    const heName = name.replace('HE ', '')
    return !HEReferences[heName]?.pregnancy || false
}

const isHEPhotosensitive = (name: string): boolean => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.photo || false
}

const isHEAllergen = (name: string): boolean => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.allergen || false
}

// Fonctions pour le type de peau
const getSkinTypeDescription = (skinType: string): string => {
    return skinTypes[skinType]?.description || 'Non spécifié'
}

const getSkinTypeTips = (skinType: string): string[] => {
    return skinTypes[skinType]?.tips || ['Aucune recommandation spécifique']
}

const getPreservativeSystem = (): string => {
    const preservative = formula.value?.ingredients?.find((ing: any) =>
        ing.type === 'preservative' || ing.name.includes('Cosgard') || ing.name.includes('Conservateur')
    )
    return preservative?.name || 'Non spécifié'
}

// Validation détaillée
const validationChecks = computed(() => {
    const checks = [
        {
            name: 'Limite totale des huiles essentielles',
            description: 'Maximum 1% d\'HE total dans les produits cosmétiques pour le visage (Article 3, Règlement UE 1223/2009)',
            passed: heTotal.value <= 1,
            error: `Dépassement de la limite UE: ${heTotal.value.toFixed(2)}% > 1%`,
            recommendation: 'Réduire le total des HE à 1% maximum en ajustant les pourcentages individuels'
        },
        {
            name: 'Dosages sécuritaires des HE individuelles',
            description: 'Respect des limites maximales recommandées pour chaque huile essentielle (IFRA)',
            passed: essentialOils.value.every((he: any) =>
                he.quantity <= (getHEMaxLimit(he.name) || 1)
            ),
            error: 'Une ou plusieurs HE dépassent leur limite de sécurité recommandée',
            recommendation: 'Vérifier et ajuster les dosages des HE signalées'
        },
        {
            name: 'Dosages des actifs cosmétiques',
            description: 'Respect des plages recommandées pour les actifs fonctionnels',
            passed: actives.value.every((active: any) => {
                const ref = activeReferences[active.name]
                if (!ref) return true
                return active.quantity >= ref.min && active.quantity <= ref.max
            }),
            error: 'Un ou plusieurs actifs sont hors de leur plage recommandée',
            recommendation: 'Ajuster les pourcentages des actifs problématiques'
        },
        {
            name: 'Présence d\'un système de conservation',
            description: 'Toute formule contenant de l\'eau doit inclure un conservateur conforme (Annexe V)',
            passed: !!formula.value?.ingredients?.find((ing: any) =>
                ing.type === 'preservative' || ing.name.includes('Cosgard') || ing.name.includes('Conservateur')
            ),
            error: 'Aucun système de conservation détecté',
            recommendation: 'Ajouter un conservateur conforme à l\'Annexe V du Règlement UE'
        }
    ]

    // Ajouter des vérifications spécifiques si disponibles
    if (formula.value?.compliance?.checks) {
        checks.push(...formula.value.compliance.checks)
    }

    return checks
})

const regulatoryErrors = computed(() => {
    return validationChecks.value
        .filter(check => !check.passed)
        .map(check => check.error)
})

const warnings = computed(() => {
    const warnings: string[] = []

    // Avertissements réglementaires
    if (heTotal.value > 1) {
        warnings.push(`⚠️ Dépassement de la limite UE pour les HE: ${heTotal.value.toFixed(2)}% > 1% (Règlement UE 1223/2009) - Une reformulation est nécessaire`)
    } else if (heTotal.value > 0.8) {
        warnings.push(`⚠️ Approche de la limite UE pour les HE: ${heTotal.value.toFixed(2)}% - Surveillance recommandée`)
    }

    // Avertissements sécurité HE
    const pregnancyUnsafe = essentialOils.value.filter((he: any) => isHENotSafeForPregnancy(he.name))
    if (pregnancyUnsafe.length > 0) {
        warnings.push(`👶 ${pregnancyUnsafe.length} HE contre-indiquées pendant la grossesse/allaitement - Mention obligatoire sur l\'étiquetage`)
    }

    const photosensitive = essentialOils.value.filter((he: any) => isHEPhotosensitive(he.name))
    if (photosensitive.length > 0) {
        warnings.push(`☀️ ${photosensitive.length} HE photosensibilisantes - Éviter l\'exposition au soleil pendant 12h après application`)
    }

    const overdosedHE = essentialOils.value.filter((he: any) =>
        he.quantity > (getHEMaxLimit(he.name) || 1)
    )
    if (overdosedHE.length > 0) {
        warnings.push(`⚠️ ${overdosedHE.length} HE dépassent leur limite de sécurité recommandée - Risque d\'irritation`)
    }

    // Avertissements actifs
    const overdosedActives = actives.value.filter((active: any) => {
        const ref = activeReferences[active.name]
        if (!ref) return false
        return active.quantity > ref.max
    })
    if (overdosedActives.length > 0) {
        warnings.push(`⚡ ${overdosedActives.length} actifs potentiellement surdosés - Révision recommandée`)
    }

    const underdosedActives = actives.value.filter((active: any) => {
        const ref = activeReferences[active.name]
        if (!ref) return false
        return active.quantity < ref.min
    })
    if (underdosedActives.length > 0) {
        warnings.push(`📉 ${underdosedActives.length} actifs sous-dosés - Efficacité potentiellement réduite`)
    }

    return warnings
})

const mandatoryMentions = computed(() => {
    const mentions: string[] = []

    // Mentions génériques obligatoires
    mentions.push('À conserver hors de la portée des enfants')
    mentions.push('Éviter le contact avec les yeux')
    mentions.push('Usage externe uniquement')
    mentions.push('Conserver à température ambiante, à l\'abri de la lumière')

    // Mentions HE
    if (essentialOils.value.length > 0) {
        mentions.push('Contient des huiles essentielles')

        const allergens = essentialOils.value.filter((he: any) => isHEAllergen(he.name))
        if (allergens.length > 0) {
            allergens.forEach((he: any) => {
                mentions.push(`Allergène: ${he.name.replace('HE ', '')}`)
            })
        }

        const pregnancyUnsafe = essentialOils.value.filter((he: any) => isHENotSafeForPregnancy(he.name))
        if (pregnancyUnsafe.length > 0) {
            mentions.push('Contre-indiqué pendant la grossesse et l\'allaitement')
        }

        const photosensitive = essentialOils.value.filter((he: any) => isHEPhotosensitive(he.name))
        if (photosensitive.length > 0) {
            mentions.push('Éviter l\'exposition au soleil après application')
        }
    }

    // Mentions spéciales pour certains actifs
    if (actives.value.some((a: any) => a.name.includes('Acide salicylique'))) {
        mentions.push('Utiliser avec une protection solaire')
    }

    if (actives.value.some((a: any) => a.name.includes('Vitamine C'))) {
        mentions.push('Protéger de la lumière et de la chaleur')
    }

    // Mention durée de vie
    mentions.push('Durée d\'utilisation après ouverture: 6 mois')

    return mentions
})

// Liste INCI
const inciList = computed(() => {
    if (!formula.value?.ingredients) return 'Aqua'

    const ingredients = [...formula.value.ingredients]

    // Trier par pourcentage décroissant
    ingredients.sort((a: any, b: any) => b.quantity - a.quantity)

    // Convertir en noms INCI
    const inciNames = ingredients.map((ing: any) => {
        let name = ing.name

        // Conversion des noms français vers INCI
        const conversions: Record<string, string> = {
            'Acide hyaluronique': 'Sodium Hyaluronate',
            'Vitamine E': 'Tocopherol',
            'Acide salicylique': 'Salicylic Acid',
            'Panthénol (B5)': 'Panthenol',
            'Niacinamide': 'Niacinamide',
            'Vitamine C': 'Ascorbic Acid',
            'Eau déminéralisée': 'Aqua',
            'Eau': 'Aqua'
        }

        // Gestion des HE
        if (name.startsWith('HE ')) {
            return `Parfum (${name.replace('HE ', '')})`
        }

        // Gestion des conservateurs
        if (name.includes('Cosgard')) {
            return 'Benzyl Alcohol, Dehydroacetic Acid'
        }

        return conversions[name] || name
    })

    // Ajouter l'eau en premier si pas déjà présent
    if (!inciNames.includes('Aqua')) {
        inciNames.unshift('Aqua')
    }

    return inciNames.join(', ')
})

const formatINCIList = (): string => {
    const list = inciList.value.split(', ')
    const formatted = list.map((item, index) => {
        const prefix = index === 0 ? '' : '  '
        return `${prefix}${item}${index < list.length - 1 ? ',' : ''}`
    }).join('\n')

    return formatted
}

// Évaluation des risques
const riskLevel = computed(() => {
    let riskScore = 0

    // Points pour les HE
    if (heTotal.value > 1) riskScore += 3
    if (heTotal.value > 0.8) riskScore += 1

    // Points pour les HE à risque
    const pregnancyUnsafe = essentialOils.value.filter((he: any) => isHENotSafeForPregnancy(he.name)).length
    const photosensitive = essentialOils.value.filter((he: any) => isHEPhotosensitive(he.name)).length
    const allergens = essentialOils.value.filter((he: any) => isHEAllergen(he.name)).length

    riskScore += pregnancyUnsafe * 2
    riskScore += photosensitive * 1
    riskScore += allergens * 1

    // Points pour les actifs surdosés
    const overdosedActives = actives.value.filter((active: any) => {
        const ref = activeReferences[active.name]
        return ref && active.quantity > ref.max
    }).length

    riskScore += overdosedActives * 2

    // Détermination du niveau de risque
    if (riskScore >= 5) return 'Élevé'
    if (riskScore >= 3) return 'Modéré'
    return 'Faible'
})

const riskDescription = computed(() => {
    switch(riskLevel.value) {
        case 'Élevé':
            return 'Cette formule présente plusieurs risques significatifs nécessitant une reformulation avant toute utilisation.'
        case 'Modéré':
            return 'Cette formule présente certains risques modérés. Une surveillance attentive est recommandée.'
        case 'Faible':
            return 'Cette formule présente des risques minimes et est généralement sûre pour une utilisation selon les instructions.'
        default:
            return 'Évaluation des risques non disponible.'
    }
})

const safetyMeasures = computed(() => {
    const measures: string[] = [
        'Effectuer un test de tolérance cutanée avant la première utilisation',
        'Respecter les contre-indications spécifiques (grossesse, allergies)',
        'Conserver dans un endroit frais et sec, à l\'abri de la lumière'
    ]

    if (essentialOils.value.length > 0) {
        measures.push('Éviter le contact avec les muqueuses et les yeux')
    }

    if (actives.value.some((a: any) => a.name.includes('Acide'))) {
        measures.push('Utiliser une protection solaire SPF 30+ lors de l\'exposition au soleil')
    }

    return measures
})

// Fonctions pour le tableau
const getIngredientType = (ingredient: any): string => {
    if (ingredient.type) {
        switch(ingredient.type) {
            case 'active': return 'Actif cosmétique'
            case 'essential_oil': return 'Huile essentielle'
            case 'preservative': return 'Conservateur'
            case 'oil': return 'Huile végétale'
            case 'aqueous': return 'Phase aqueuse'
            case 'water': return 'Eau'
            case 'emulsifier': return 'Émulsifiant'
            default: return 'Ingrédient'
        }
    }

    if (ingredient.name.startsWith('HE ')) return 'Huile essentielle'
    if (ingredient.name.includes('Acide') || ingredient.name.includes('Vitamine')) return 'Actif cosmétique'
    if (ingredient.name.includes('Eau')) return 'Eau'
    return 'Ingrédient'
}

const getIngredientIcon = (ingredient: any): string => {
    const type = getIngredientType(ingredient)
    switch(type) {
        case 'Huile essentielle': return '🌿'
        case 'Actif cosmétique': return '✨'
        case 'Conservateur': return '🛡️'
        case 'Huile végétale': return '🫒'
        case 'Phase aqueuse': return '💧'
        case 'Eau': return '💦'
        case 'Émulsifiant': return '⚗️'
        default: return '🧪'
    }
}

const getIngredientTypeColor = (ingredient: any): string => {
    const type = getIngredientType(ingredient)
    switch(type) {
        case 'Huile essentielle': return 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700'
        case 'Actif cosmétique': return 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700'
        case 'Conservateur': return 'bg-gradient-to-br from-red-100 to-orange-100 text-red-700'
        case 'Huile végétale': return 'bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700'
        case 'Phase aqueuse': return 'bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700'
        case 'Eau': return 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600'
        case 'Émulsifiant': return 'bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700'
        default: return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
    }
}

const getIngredientTypeClass = (ingredient: any): string => {
    const type = getIngredientType(ingredient)
    switch(type) {
        case 'Huile essentielle': return 'px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold rounded-full'
        case 'Actif cosmétique': return 'px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-bold rounded-full'
        case 'Conservateur': return 'px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-xs font-bold rounded-full'
        case 'Huile végétale': return 'px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full'
        default: return 'px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full'
    }
}

const getIngredientStatus = (ingredient: any): string => {
    if (ingredient.name.startsWith('HE ')) {
        const heName = ingredient.name.replace('HE ', '')
        const max = getHEMaxLimit(ingredient.name)
        return ingredient.quantity <= max ? 'Sécuritaire' : 'Surdosage'
    }

    const ref = activeReferences[ingredient.name]
    if (ref) {
        if (ingredient.quantity < ref.min) return 'Sous-dosage'
        if (ingredient.quantity > ref.max) return 'Surdosage'
        return 'Optimal'
    }

    return 'Standard'
}

const getIngredientStatusClass = (ingredient: any): string => {
    const status = getIngredientStatus(ingredient)
    switch(status) {
        case 'Optimal':
        case 'Sécuritaire':
        case 'Standard':
            return 'px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold rounded-full'
        case 'Surdosage':
            return 'px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-xs font-bold rounded-full'
        case 'Sous-dosage':
            return 'px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full'
        default:
            return 'px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full'
    }
}

// Méthodes de navigation
const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        activeSection.value = sectionId
    }
}

// Méthodes d'action
const copyINCI = async () => {
    try {
        await copy(formatINCIList())
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (err) {
        console.error('Erreur lors de la copie:', err)
        alert('Erreur lors de la copie de la liste INCI')
    }
}

const copyFormula = async () => {
    try {
        const text = `Formule: ${formula.value.name}

Description: ${formula.value.description || 'Non renseignée'}

Volume: ${formula.value.volume} ml
Type de peau: ${formula.value.skinType}
Statut UE: ${isFormulaValid.value ? 'Conforme' : 'Non conforme'}

Ingrédients:
${formula.value.ingredients.map((i: any) => `• ${i.name}: ${i.quantity}% (${calculateGrams(i.quantity)} g)`).join('\n')}

Total HE: ${heTotal.value.toFixed(2)}%
Actifs: ${actives.value.length}
Conformité: ${validationChecks.value.filter(c => c.passed).length}/${validationChecks.value.length} critères validés

---
Généré avec Formulateur Cosmétique Pro - ${new Date().toLocaleDateString('fr-FR')}`

        await copy(text)

        // Feedback visuel
        const button = event?.target as HTMLElement
        if (button) {
            const originalText = button.textContent
            button.textContent = '✅ Copié !'
            setTimeout(() => {
                button.textContent = originalText
            }, 2000)
        }
    } catch (err) {
        console.error('Erreur lors de la copie:', err)
        alert('Erreur lors de la copie de la formule')
    }
}

const generatePDF = () => {
    console.log('Génération du PDF de la formule...')
    alert('Génération PDF - Cette fonctionnalité sera disponible prochainement')
}

const exportFormula = () => {
    if (!formula.value) return

    const exportData = {
        ...formula.value,
        analysis: {
            activesCount: actives.value.length,
            heCount: essentialOils.value.length,
            heTotal: heTotal.value,
            isValid: isFormulaValid.value,
            warnings: warnings.value,
            mandatoryMentions: mandatoryMentions.value,
            inciList: inciList.value,
            riskLevel: riskLevel.value,
            validationChecks: validationChecks.value
        },
        exportDate: new Date().toISOString(),
        exportFormat: 'skincare-formulator-json-v2'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const fileName = `formule-${formula.value.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`

    const link = document.createElement('a')
    link.setAttribute('href', dataUri)
    link.setAttribute('download', fileName)
    link.click()
}

const shareFormula = () => {
    if (navigator.share) {
        navigator.share({
            title: formula.value.name,
            text: `Découvrez ma formule cosmétique "${formula.value.name}" - ${formula.value.volume} ml pour peau ${formula.value.skinType}`,
            url: window.location.href
        })
    } else {
        copyFormula()
    }
}

const generateSafetyReport = () => {
    console.log('Génération du rapport de sécurité...')
    alert('Génération du rapport de sécurité - Cette fonctionnalité sera disponible prochainement')
}

const togglePrintMode = () => {
    printMode.value = !printMode.value
    if (printMode.value) {
        document.body.classList.add('print-mode')
        window.print()
        setTimeout(() => {
            document.body.classList.remove('print-mode')
            printMode.value = false
        }, 1000)
    }
}

// Méthodes de formatage
const formatDate = (dateString: string): string => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatDateShort = (dateString: string): string => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
}

const formatTime = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Méthodes de chargement
const retryLoad = async () => {
    loading.value = true
    error.value = ''
    await loadFormula()
}

const loadFormula = async () => {
    try {
        const id = route.params.id
        // Simulation de chargement - À remplacer par votre appel API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Données de démonstration
        formula.value = {
            id: id,
            name: 'Crème hydratante réparatrice',
            description: 'Une crème riche en actifs hydratants et régénérants, spécialement formulée pour les peaux sèches et sensibles. Formule équilibrée avec des ingrédients naturels et des actifs scientifiquement prouvés.',
            volume: 50,
            skinType: 'seche',
            type: 'skincare',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:45:00Z',
            ingredients: [
                { name: 'Eau déminéralisée', type: 'water', quantity: 65.2 },
                { name: 'Acide hyaluronique', type: 'active', quantity: 1.5 },
                { name: 'Panthénol (B5)', type: 'active', quantity: 2 },
                { name: 'Vitamine E', type: 'active', quantity: 0.3 },
                { name: 'HE Lavande vraie', type: 'essential_oil', quantity: 0.5 },
                { name: 'HE Encens (Boswellia carterii)', type: 'essential_oil', quantity: 0.3 },
                { name: 'Cosgard', type: 'preservative', quantity: 0.8 },
                { name: 'Huile d\'Amande douce', type: 'oil', quantity: 15 },
                { name: 'Huile de Jojoba', type: 'oil', quantity: 10 },
                { name: 'Émulsifiant', type: 'emulsifier', quantity: 5 }
            ],
            compliance: {
                version: '2.2',
                euRegulation: '1223/2009',
                heLimitCompliant: true,
                preservativeCompliant: true
            }
        }

        // Si ce n'est pas une formule skincare, rediriger
        if (formula.value.type === 'recipe') {
            router.push(`/recette/${id}`)
            return
        }
    } catch (err: any) {
        console.error('Erreur de chargement:', err)
        error.value = err.message || 'Impossible de charger la formule. Vérifiez votre connexion et réessayez.'
    } finally {
        loading.value = false
    }
}

// Intersection Observer pour la navigation
let observer: IntersectionObserver

const setupIntersectionObserver = () => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id
                    if (sectionId && sections.some(s => s.id === sectionId)) {
                        activeSection.value = sectionId
                    }
                }
            })
        },
        {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        }
    )

    // Observer les sections
    if (descriptionSection.value) observer.observe(descriptionSection.value)
    if (ingredientsSection.value) observer.observe(ingredientsSection.value)
    if (complianceSection.value) observer.observe(complianceSection.value)
}

// Initialisation
onMounted(async () => {
    await loadFormula()
    if (formula.value) {
        setupIntersectionObserver()
    }

    // Gestionnaire de raccourcis clavier
    document.addEventListener('keydown', handleKeyboardShortcuts)
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
    document.removeEventListener('keydown', handleKeyboardShortcuts)
})

const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    // Ctrl/Cmd + P pour imprimer
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        togglePrintMode()
    }

    // Échap pour retour
    if (e.key === 'Escape') {
        router.push('/recettes')
    }

    // Navigation par flèches
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const currentIndex = sections.findIndex(s => s.id === activeSection.value)
        let nextIndex = currentIndex

        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            nextIndex = currentIndex + 1
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            nextIndex = currentIndex - 1
        }

        if (nextIndex !== currentIndex) {
            scrollToSection(sections[nextIndex].id)
        }
    }
}
</script>

<style scoped>
/* Styles spécifiques */
.metadata-card {
    @apply bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300;
}

.metadata-label {
    @apply text-sm text-gray-600 mb-2 flex items-center gap-1;
}

.metadata-value {
    @apply text-2xl font-bold mb-1;
}

.metadata-subtext {
    @apply text-xs text-gray-500;
}

.badge-info {
    @apply px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-sm font-bold rounded-full border border-blue-200;
}

.nav-link {
    @apply relative px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-all duration-300
    hover:border-gray-300;
}

.nav-link-indicator {
    @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-blue-600 rounded-t-full transition-all duration-300 opacity-0;
}

.nav-link-indicator.active {
    @apply w-3/4 opacity-100;
}

.ingredient-card {
    @apply rounded-xl p-6 border-2 transition-all duration-300;
}

.ingredient-normal {
    @apply border-gray-200 bg-gradient-to-br from-white to-gray-50;
}

.ingredient-warning {
    @apply border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50;
}

.ingredient-danger {
    @apply border-red-300 bg-gradient-to-br from-red-50 to-orange-50;
}

.ingredient-low {
    @apply border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50;
}

.status-card {
    @apply rounded-xl p-8 border-2 transition-all duration-300;
}

.status-valid-card {
    @apply bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200;
}

.status-invalid-card {
    @apply bg-gradient-to-br from-red-50 to-orange-50 border-red-200;
}

.status-icon {
    @apply w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg;
}

.status-valid-icon {
    @apply bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-700;
}

.status-invalid-icon {
    @apply bg-gradient-to-br from-red-100 to-orange-100 text-red-700;
}

.validation-item {
    @apply rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-md;
}

.validation-icon {
    @apply w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-card {
    animation: fadeIn 0.6s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.nav-link {
    animation: slideIn 0.5s ease-out;
}

/* Print styles */
@media print {
    .no-print {
        display: none !important;
    }

    .section-card {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    body {
        background: white !important;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .metadata-card {
        @apply p-3;
    }

    .metadata-value {
        @apply text-xl;
    }

    .nav-link {
        @apply px-3 py-2 text-sm;
    }

    .ingredient-card {
        @apply p-4;
    }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

@media (prefers-contrast: high) {
    .metadata-card,
    .ingredient-card,
    .status-card,
    .validation-item {
        @apply border-2 border-black;
    }

    .nav-link.active {
        @apply border-2 border-blue-800;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .metadata-card,
    .ingredient-card,
    .status-card,
    .validation-item {
        @apply bg-gray-800 border-gray-700;
    }

    .nav-link {
        @apply bg-gray-800 border-gray-700 text-gray-300;
    }

    .metadata-label,
    .metadata-subtext {
        @apply text-gray-400;
    }

    .metadata-value {
        @apply text-gray-100;
    }
}

/* Focus styles pour l'accessibilité */
:focus-visible {
    @apply outline-2 outline-blue-500 outline-offset-2;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded-full hover:bg-gray-500;
}

::-webkit-scrollbar-corner {
    @apply bg-transparent;
}
</style>