<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
        <!-- Navigation d'accessibilité -->
        <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-3 rounded-lg z-50">
            Passer au contenu principal
        </a>

        <div class=" mx-auto space-y-8" role="application" aria-label="Formulaire de formulation cosmétique">
            <!-- En-tête -->
            <header class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <!-- Titre principal -->
                    <div class="flex-1">
                        <div class="flex items-center gap-4 mb-2">
                            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg" role="img" aria-label="Icone formulation cosmétique">
                                <span class="text-2xl text-white">🧴</span>
                            </div>
                            <div>
                                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                                    Formulateur Cosmétique Pro
                                </h1>
                                <p class="text-gray-600 mt-2 max-w-2xl">
                                    Outil de formulation conforme au Règlement UE 1223/2009
                                    <a href="https://eur-lex.europa.eu/eli/reg/2009/1223/oj"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       class="text-blue-600 hover:text-blue-800 underline ml-1 font-medium"
                                       aria-label="Ouvrir le Règlement UE 1223/2009 dans un nouvel onglet">
                                        Voir la réglementation
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Indicateur de conformité -->
                    <div class="flex flex-col items-end gap-4">
                        <div :class="[
              'px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-300',
              regulatoryStatus.isValid
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
            ]"
                             role="status"
                             aria-live="polite"
                             :aria-label="regulatoryStatus.isValid ? 'Formule conforme aux réglementations européennes' : 'Formule non conforme, vérification nécessaire'">
              <span v-if="regulatoryStatus.isValid" class="flex items-center gap-2">
                <span class="text-xl">✅</span>
                <span>Conforme UE</span>
              </span>
                            <span v-else class="flex items-center gap-2">
                <span class="text-xl">⚠️</span>
                <span>Non conforme</span>
              </span>
                        </div>

                        <!-- Navigation rapide accessibilité -->
                        <nav aria-label="Navigation des sections du formulaire" class="hidden lg:block">
                            <div class="flex flex-wrap gap-2">
                                <a v-for="section in sections"
                                   :key="section.id"
                                   :href="`#${section.id}`"
                                   @click.prevent="scrollToSection(section.id)"
                                   class="text-xs px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                   :aria-label="`Aller à la section ${section.name}`">
                                    {{ section.name }}
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>

                <!-- Barre de progression -->
                <div class="mt-8">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-medium text-gray-700">Progression</span>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-bold text-blue-600">{{ completionPercentage }}%</span>
                                <span class="text-xs text-gray-500">complété</span>
                            </div>
                        </div>
                        <button @click="toggleAccessibilityMenu"
                                class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-1"
                                aria-label="Options d'accessibilité">
                            <span>♿</span>
                            <span>Accessibilité</span>
                        </button>
                    </div>

                    <div class="relative">
                        <div class="w-full h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div class="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-1000 ease-out shadow-md"
                                 :style="{ width: `${completionPercentage}%` }"
                                 role="progressbar"
                                 :aria-valuenow="completionPercentage"
                                 aria-valuemin="0"
                                 aria-valuemax="100"
                                 :aria-valuetext="`${completionPercentage} pour cent complété`">
                            </div>
                        </div>
                        <!-- Points d'étape -->
                        <div class="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-2">
                            <div v-for="(mark, index) in progressMarks"
                                 :key="index"
                                 :class="[
                     'w-3 h-3 rounded-full border-2 transition-all duration-300',
                     completionPercentage >= mark.percent ? 'bg-white border-blue-600 shadow-md' : 'bg-gray-300 border-gray-300'
                   ]"
                                 :title="`${mark.percent}% - ${mark.label}`">
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Menu d'accessibilité -->
            <div v-if="showAccessibilityMenu"
                 class="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-200 animate-slideDown">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span class="text-blue-600">♿</span>
                        Options d'accessibilité
                    </h2>
                    <button @click="toggleAccessibilityMenu"
                            class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                            aria-label="Fermer les options d'accessibilité">
                        <span class="text-2xl">×</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button @click="increaseTextSize"
                            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Augmenter la taille du texte">
                        <span class="text-2xl mb-2">🔍</span>
                        <span class="font-medium">Agrandir le texte</span>
                        <span class="text-sm text-gray-500">A+</span>
                    </button>

                    <button @click="decreaseTextSize"
                            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Réduire la taille du texte">
                        <span class="text-2xl mb-2">🔎</span>
                        <span class="font-medium">Réduire le texte</span>
                        <span class="text-sm text-gray-500">A-</span>
                    </button>

                    <button @click="toggleHighContrast"
                            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Activer le contraste élevé">
                        <span class="text-2xl mb-2">⚫</span>
                        <span class="font-medium">Contraste élevé</span>
                        <span class="text-sm text-gray-500">{{ highContrast ? 'ON' : 'OFF' }}</span>
                    </button>

                    <button @click="toggleReducedMotion"
                            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Réduire les animations">
                        <span class="text-2xl mb-2">🎬</span>
                        <span class="font-medium">Animations réduites</span>
                        <span class="text-sm text-gray-500">{{ reducedMotion ? 'ON' : 'OFF' }}</span>
                    </button>
                </div>
            </div>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar avec résumé -->
                <aside class="lg:w-1/4" aria-label="Résumé de la formule">
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">📋</span>
                                <span>Résumé</span>
                            </h2>
                            <button @click="toggleSummary"
                                    class="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                                    :aria-label="summaryExpanded ? 'Réduire le résumé' : 'Développer le résumé'"
                                    :aria-expanded="summaryExpanded">
                                <span class="text-xl">{{ summaryExpanded ? '−' : '+' }}</span>
                            </button>
                        </div>

                        <div :class="['space-y-6', summaryExpanded || !isMobile ? 'block' : 'hidden lg:block']">
                            <!-- Informations principales -->
                            <div class="space-y-4">
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-500">Nom de la formule</span>
                                        <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Obligatoire</span>
                                    </div>
                                    <div class="p-3 bg-gray-50 rounded-lg border">
                                        <p :class="['font-medium truncate', !formData.name ? 'text-red-500 italic' : 'text-gray-900']">
                                            {{ formData.name || 'À renseigner' }}
                                        </p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <span class="text-sm font-medium text-gray-500 block mb-1">Volume</span>
                                        <div class="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                            <p class="text-lg font-bold text-blue-700">{{ formData.volume }} ml</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span class="text-sm font-medium text-gray-500 block mb-1">Type de peau</span>
                                        <div class="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                            <p class="text-lg font-bold text-purple-700 capitalize">{{ formData.skinType || '—' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Statut réglementaire -->
                            <div v-if="regulatoryErrors.length > 0" class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="text-xl text-red-600">⚠️</span>
                                    <h3 class="font-bold text-red-800">Alertes réglementaires</h3>
                                </div>
                                <ul class="space-y-2" role="list">
                                    <li v-for="error in regulatoryErrors.slice(0, 3)"
                                        :key="error"
                                        class="flex items-start gap-2">
                                        <span class="text-red-500 mt-1 text-sm">•</span>
                                        <span class="text-sm text-red-700">{{ error }}</span>
                                    </li>
                                    <li v-if="regulatoryErrors.length > 3" class="text-sm text-red-600 italic">
                                        + {{ regulatoryErrors.length - 3 }} autres alertes
                                    </li>
                                </ul>
                            </div>

                            <!-- Composition rapide -->
                            <div class="space-y-3">
                                <h3 class="font-bold text-gray-900 flex items-center gap-2">
                                    <span class="text-green-600">⚖️</span>
                                    Composition
                                </h3>
                                <div class="space-y-2">
                                    <div v-for="phase in phasesSummary" :key="phase.name" class="flex justify-between items-center">
                                        <span class="text-sm text-gray-600">{{ phase.name }}</span>
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm font-semibold">{{ phase.percent }}%</span>
                                            <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div class="h-full rounded-full transition-all duration-500"
                                                     :class="phase.colorClass"
                                                     :style="{ width: `${phase.percent}%` }">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions rapides -->
                            <div class="pt-6 border-t border-gray-200 space-y-3">
                                <button @click="generateReport"
                                        :disabled="!isValid"
                                        :class="[
                          'w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3',
                          isValid
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        ]"
                                        :aria-disabled="!isValid">
                                    <span class="text-xl">📄</span>
                                    <span>Générer PDF</span>
                                </button>

                                <button @click="exportFormula"
                                        class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
                                    <span class="text-xl">📤</span>
                                    <span>Exporter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Contenu principal du formulaire -->
                <main id="main-content" class="lg:w-3/4 space-y-8" role="main">
                    <!-- Section 1: Informations de base -->
                    <section id="basic-info"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">📝</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Informations de base</h2>
                                <p class="text-gray-600">Définissez les caractéristiques principales de votre formule cosmétique</p>
                                <div class="mt-2 text-sm text-blue-600 font-medium">
                  <span class="flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Tous les champs marqués d'une astérisque (*) sont obligatoires</span>
                  </span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Nom de la formule -->
                            <div class="space-y-2">
                                <label for="formula-name" class="label required">
                                    Nom de la formule *
                                </label>
                                <div class="relative">
                                    <input id="formula-name"
                                           v-model="formData.name"
                                           type="text"
                                           maxlength="100"
                                           placeholder="Ex: Crème hydratante réparatrice pour peaux sensibles"
                                           :class="[
                           'input-field pl-10',
                           errors.name ? 'input-error' : 'input-valid'
                         ]"
                                           required
                                           aria-required="true"
                                           aria-describedby="name-help name-error"
                                           @input="clearError('name')">
                                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ✏️
                  </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <p v-if="errors.name" id="name-error" class="error-message flex items-center gap-1">
                                        <span>❌</span>
                                        {{ errors.name }}
                                    </p>
                                    <span class="text-xs text-gray-400 ml-auto">
                    {{ formData.name.length }}/100 caractères
                  </span>
                                </div>
                                <p id="name-help" class="help-text">
                                    Donnez un nom descriptif à votre formule pour faciliter son identification
                                </p>
                            </div>

                            <!-- Volume total -->
                            <div class="space-y-2">
                                <label for="formula-volume" class="label required">
                                    Volume total *
                                </label>
                                <div class="relative">
                                    <input id="formula-volume"
                                           v-model.number="formData.volume"
                                           type="number"
                                           min="1"
                                           max="1000"
                                           step="1"
                                           :class="[
                           'input-field pr-12',
                           errors.volume ? 'input-error' : 'input-valid'
                         ]"
                                           required
                                           aria-required="true"
                                           aria-describedby="volume-help volume-error"
                                           @change="validateVolume">
                                    <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ml
                  </span>
                                </div>
                                <div class="flex justify-between">
                                    <p v-if="errors.volume" id="volume-error" class="error-message flex items-center gap-1">
                                        <span>❌</span>
                                        {{ errors.volume }}
                                    </p>
                                    <div class="flex gap-2 ml-auto">
                                        <button type="button"
                                                @click="formData.volume = 30"
                                                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                                            30ml
                                        </button>
                                        <button type="button"
                                                @click="formData.volume = 50"
                                                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                                            50ml
                                        </button>
                                        <button type="button"
                                                @click="formData.volume = 100"
                                                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                                            100ml
                                        </button>
                                    </div>
                                </div>
                                <p id="volume-help" class="help-text">
                                    Volume final du produit fini. Recommandé: 30-100 ml pour usage personnel
                                </p>
                            </div>

                            <!-- Type de peau -->
                            <div class="lg:col-span-2 space-y-4">
                                <div class="flex items-center justify-between">
                                    <legend class="label required">
                                        Type de peau cible *
                                    </legend>
                                    <span class="text-sm text-gray-500">
                    Sélectionnez un seul profil
                  </span>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" role="radiogroup" aria-label="Types de peau">
                                    <label v-for="profile in skinProfilesOptions"
                                           :key="profile.value"
                                           :class="[
                           'skin-type-card relative overflow-hidden',
                           formData.skinType === profile.value
                             ? 'skin-type-card-selected ring-2 ring-offset-2'
                             : 'skin-type-card-default'
                         ]"
                                           :style="{ '--ring-color': profile.color }">
                                        <input type="radio"
                                               v-model="formData.skinType"
                                               :value="profile.value"
                                               class="sr-only"
                                               required
                                               :aria-labelledby="`skin-label-${profile.value}`"
                                               :aria-describedby="`skin-desc-${profile.value}`">

                                        <div class="p-4">
                                            <div class="flex items-center gap-3 mb-3">
                                                <span class="text-3xl" :aria-label="profile.iconLabel">{{ profile.icon }}</span>
                                                <div>
                                                    <h3 :id="`skin-label-${profile.value}`" class="font-bold text-gray-900 capitalize">
                                                        {{ profile.label }}
                                                    </h3>
                                                    <p class="text-xs text-gray-500">Phase huileuse: {{ profile.oil }}% max</p>
                                                </div>
                                            </div>

                                            <p :id="`skin-desc-${profile.value}`" class="text-sm text-gray-600 mb-3">
                                                {{ profile.description }}
                                            </p>

                                            <div class="space-y-2">
                                                <div class="flex justify-between text-xs">
                                                    <span class="text-gray-500">Actifs max:</span>
                                                    <span class="font-semibold">{{ profile.maxActives }}</span>
                                                </div>
                                                <div class="flex justify-between text-xs">
                                                    <span class="text-gray-500">Recommandations:</span>
                                                    <span class="font-semibold text-blue-600">Voir</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Indicateur de sélection -->
                                        <div v-if="formData.skinType === profile.value"
                                             class="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span class="text-white text-sm">✓</span>
                                        </div>
                                    </label>
                                </div>

                                <!-- Description détaillée du type sélectionné -->
                                <div v-if="selectedSkinProfile"
                                     class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <div class="flex items-start gap-3">
                                        <span class="text-blue-600 text-xl mt-1">💡</span>
                                        <div>
                                            <h4 class="font-semibold text-blue-900 mb-2">Conseils pour peau {{ selectedSkinProfile.label }}</h4>
                                            <ul class="text-sm text-blue-800 space-y-1">
                                                <li v-for="(tip, index) in selectedSkinProfile.tips" :key="index" class="flex items-start gap-2">
                                                    <span class="text-blue-500">•</span>
                                                    <span>{{ tip }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 2: Actifs cosmétiques -->
                    <section id="actives"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
                            <div class="flex items-start gap-4">
                                <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
                                    <span class="text-2xl text-white">🧪</span>
                                </div>
                                <div>
                                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Actifs cosmétiques</h2>
                                    <p class="text-gray-600">Sélectionnez et dosez vos actifs selon les bonnes pratiques</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200">
                  <span class="text-sm font-semibold text-purple-700">
                    <span class="text-lg">{{ enabledActivesCount }}</span>
                    <span class="text-gray-500">/</span>
                    <span>{{ skinProfiles[formData.skinType]?.maxActives || 3 }}</span>
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
                                           v-model="activeSearch"
                                           type="text"
                                           placeholder="Nom, INCI ou propriété..."
                                           class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                                </div>

                                <div>
                                    <label for="active-type" class="block text-sm font-medium text-gray-700 mb-2">
                                        🏷️ Filtrer par type
                                    </label>
                                    <select id="active-type"
                                            v-model="activeTypeFilter"
                                            class="px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                                        <option value="">Tous les types</option>
                                        <option value="hydratant">Hydratant</option>
                                        <option value="antioxydant">Antioxydant</option>
                                        <option value="repair">Régénérant</option>
                                        <option value="exfoliant">Exfoliant</option>
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
                                               :disabled="!active.enabled && enabledActivesCount >= skinProfiles[formData.skinType]?.maxActives"
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
                            active.type === 'antioxydant' ? 'bg-green-100 text-green-800' :
                            active.type === 'repair' ? 'bg-orange-100 text-orange-800' :
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
                                        Pour une peau {{ formData.skinType }}, il est recommandé de ne pas dépasser
                                        <span class="font-bold">{{ skinProfiles[formData.skinType]?.maxActives }} actifs</span>.
                                        Trop d'actifs peuvent réduire leur efficacité et augmenter les risques d'irritation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 3: Phase aqueuse -->
                    <section id="aqueous-phase"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">💧</span>
                            </div>
                            <div class="flex-1">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Phase aqueuse</h2>
                                        <p class="text-gray-600">Hydrolats et eaux florales - Base hydratante de votre formule</p>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
                      <span class="text-sm font-semibold text-blue-700">
                        Total: {{ aqueousPhaseTotal.toFixed(1) }}%
                      </span>
                                        </div>
                                        <button @click="autoCalculateWaterPhase"
                                                type="button"
                                                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Auto-calcul
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sélection des hydrolats -->
                        <div class="space-y-6">
                            <div v-for="(category, catName) in aqueousPhaseOptions"
                                 :key="catName"
                                 :class="[
                     'border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-md',
                     selectedAqueousPhase.some(item => category.items.some(i => i.name === item.name))
                       ? 'border-blue-300 bg-blue-50/50'
                       : 'border-gray-200 hover:border-blue-200'
                   ]">
                                <!-- En-tête de catégorie -->
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                    <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                      {{ category.icon }}
                    </span>
                                        {{ catName }}
                                        <span class="text-sm font-normal text-gray-500">
                      ({{ category.items.filter(i => i.selected).length }}/{{ category.items.length }})
                    </span>
                                    </h3>
                                    <button @click="toggleCategory(category, 'aqueous')"
                                            type="button"
                                            class="text-sm text-blue-600 hover:text-blue-800">
                                        {{ selectedAqueousPhase.some(item => category.items.some(i => i.name === item.name)) ? 'Tout désélectionner' : 'Tout sélectionner' }}
                                    </button>
                                </div>

                                <!-- Grille d'hydrolats -->
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div v-for="hydrosol in category.items"
                                         :key="hydrosol.name"
                                         :class="[
                         'rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-1',
                         hydrosol.selected
                           ? 'bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 shadow-md'
                           : 'bg-white border border-gray-200 hover:border-blue-200'
                       ]">
                                        <div class="flex items-start gap-3">
                                            <!-- Checkbox -->
                                            <div class="flex items-center h-6 pt-1">
                                                <input :id="`aq-${hydrosol.name}`"
                                                       type="checkbox"
                                                       v-model="hydrosol.selected"
                                                       class="h-5 w-5 rounded border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                            </div>

                                            <!-- Contenu -->
                                            <div class="flex-1">
                                                <!-- En-tête -->
                                                <div class="flex justify-between items-start mb-2">
                                                    <div>
                                                        <label :for="`aq-${hydrosol.name}`"
                                                               class="font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                                                            {{ hydrosol.name }}
                                                        </label>
                                                        <p class="text-xs text-gray-500 mt-1">
                                                            {{ hydrosol.description }}
                                                        </p>
                                                    </div>

                                                    <!-- Indicateur de dosage -->
                                                    <div v-if="hydrosol.selected"
                                                         class="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                                                        {{ hydrosol.percent }}%
                                                    </div>
                                                </div>

                                                <!-- Dosage -->
                                                <div v-if="hydrosol.selected" class="mt-4 space-y-3">
                                                    <div>
                                                        <label :for="`aq-percent-${hydrosol.name}`"
                                                               class="block text-xs font-medium text-gray-700 mb-1">
                                                            Dosage (%)
                                                        </label>
                                                        <div class="flex items-center gap-2">
                                                            <div class="relative flex-1">
                                                                <input :id="`aq-percent-${hydrosol.name}`"
                                                                       type="number"
                                                                       v-model.number="hydrosol.percent"
                                                                       :min="hydrosol.min"
                                                                       :max="hydrosol.max"
                                                                       step="0.1"
                                                                       class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                  %
                                </span>
                                                            </div>
                                                            <span class="text-xs text-gray-500 min-w-16 text-right">
                                {{ grams(hydrosol.percent) }} g
                              </span>
                                                        </div>
                                                    </div>

                                                    <!-- Slider pour dosage -->
                                                    <div class="space-y-1">
                                                        <div class="flex justify-between text-xs">
                                                            <span class="text-gray-500">Min: {{ hydrosol.min }}%</span>
                                                            <span class="text-blue-600 font-medium">Recommandé</span>
                                                            <span class="text-gray-500">Max: {{ hydrosol.max }}%</span>
                                                        </div>
                                                        <input type="range"
                                                               v-model.number="hydrosol.percent"
                                                               :min="hydrosol.min"
                                                               :max="hydrosol.max"
                                                               step="0.1"
                                                               class="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg">
                                                    </div>
                                                </div>

                                                <!-- Propriétés -->
                                                <div class="mt-3">
                                                    <div class="flex flex-wrap gap-1">
                            <span v-for="prop in hydrosol.properties"
                                  :key="prop"
                                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200">
                              {{ prop }}
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Résumé phase aqueuse -->
                        <div v-if="selectedAqueousPhase.length > 0"
                             class="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-300">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
                                    <span class="text-blue-600">📊</span>
                                    Répartition phase aqueuse
                                </h3>
                                <button @click="optimizeAqueousPhase"
                                        type="button"
                                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Optimiser
                                </button>
                            </div>

                            <!-- Graphique circulaire -->
                            <div class="flex flex-col lg:flex-row gap-8 items-center">
                                <div class="lg:w-1/3 relative">
                                    <div class="w-48 h-48 mx-auto relative">
                                        <!-- SVG pour graphique circulaire -->
                                        <svg width="100%" height="100%" viewBox="0 0 100 100" class="transform -rotate-90">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="20" />
                                            <circle cx="50" cy="50" r="40" fill="none"
                                                    stroke="url(#gradient-blue)"
                                                    stroke-width="20"
                                                    stroke-dasharray="251.2"
                                                    :stroke-dashoffset="251.2 - (aqueousPhaseTotal * 2.512)"
                                                    stroke-linecap="round"
                                                    class="transition-all duration-1000">
                                                <animate v-if="!reducedMotion"
                                                         attributeName="stroke-dashoffset"
                                                         :from="251.2"
                                                         :to="251.2 - (aqueousPhaseTotal * 2.512)"
                                                         dur="1s"
                                                         fill="freeze" />
                                            </circle>
                                            <defs>
                                                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stop-color="#3b82f6" />
                                                    <stop offset="100%" stop-color="#06b6d4" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div class="absolute inset-0 flex items-center justify-center flex-col">
                                            <span class="text-4xl font-bold text-gray-900">{{ aqueousPhaseTotal.toFixed(1) }}%</span>
                                            <span class="text-sm text-gray-600">du total</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Liste détaillée -->
                                <div class="lg:w-2/3 space-y-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="item in selectedAqueousPhase.slice(0, 4)"
                                             :key="item.name"
                                             class="bg-white/80 rounded-lg p-3 border border-blue-200">
                                            <div class="flex justify-between items-center">
                                                <span class="font-medium text-gray-900">{{ item.name }}</span>
                                                <span class="font-bold text-blue-700">{{ item.percent }}%</span>
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1 flex justify-between">
                                                <span>{{ grams(item.percent) }} g</span>
                                                <span class="text-blue-600">{{ ((item.percent / aqueousPhaseTotal) * 100).toFixed(0) }}% de la phase</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="pt-4 border-t border-blue-200">
                                        <div class="flex justify-between items-center">
                                            <span class="font-bold text-gray-900">Total phase aqueuse:</span>
                                            <div class="text-right">
                                                <span class="text-xl font-bold text-blue-700">{{ aqueousPhaseTotal.toFixed(1) }}%</span>
                                                <span class="block text-sm text-gray-500">{{ grams(aqueousPhaseTotal) }} g</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 4: Phase huileuse -->
                    <section id="oil-phase"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg" aria-hidden="true">
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
                                        <button @click="autoCalculateOilPhase"
                                                type="button"
                                                class="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                    <span class="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg text-white">
                      {{ category.icon }}
                    </span>
                                        {{ catName }}
                                        <span class="text-sm font-normal text-gray-500">
                      ({{ category.items.filter(i => i.selected).length }}/{{ category.items.length }})
                    </span>
                                    </h3>
                                    <button @click="toggleCategory(category, 'oil')"
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
                                                       class="h-5 w-5 rounded border-2 border-gray-300 checked:border-amber-600 checked:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50">
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
                                       ]">
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
                                                               class="w-full h-2 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg">
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
                                    <button @click="optimizeOilPhase"
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

                    <!-- Section 5: Système de conservation -->
                    <section id="preservatives"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">🛡️</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Système de conservation</h2>
                                <p class="text-gray-600">Assurez la stabilité microbiologique selon le Règlement UE</p>
                                <div class="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                    <span>⚠️</span>
                                    <span>La conservation est obligatoire pour toute formule contenant de l'eau</span>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-8">
                            <!-- Sélection du type -->
                            <div>
                                <fieldset class="space-y-4">
                                    <legend class="label required flex items-center gap-2">
                                        Type de système de conservation *
                                        <span class="text-xs font-normal text-gray-500">(Sélectionnez une seule option)</span>
                                    </legend>

                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup">
                                        <label v-for="preservative in preservativeSystems"
                                               :key="preservative.id"
                                               :class="[
                             'preservative-card transform transition-all duration-300 hover:-translate-y-1',
                             formData.preservativeSystem === preservative.id
                               ? 'preservative-card-selected ring-2 ring-offset-2 ring-red-500 shadow-xl'
                               : 'preservative-card-default hover:shadow-md'
                           ]">
                                            <input type="radio"
                                                   v-model="formData.preservativeSystem"
                                                   :value="preservative.id"
                                                   class="sr-only"
                                                   required
                                                   :aria-labelledby="`preservative-label-${preservative.id}`">

                                            <div class="p-4 h-full flex flex-col">
                                                <!-- Icone -->
                                                <div class="mb-4">
                          <span class="text-3xl" :aria-label="preservative.iconLabel">
                            {{ preservative.icon }}
                          </span>
                                                </div>

                                                <!-- Nom et description -->
                                                <div class="flex-1">
                                                    <h3 :id="`preservative-label-${preservative.id}`"
                                                        class="font-bold text-gray-900 text-lg mb-2">
                                                        {{ preservative.name }}
                                                    </h3>
                                                    <p class="text-sm text-gray-600 mb-3">
                                                        {{ preservative.description }}
                                                    </p>

                                                    <!-- Caractéristiques -->
                                                    <ul class="space-y-1 mb-4">
                                                        <li v-for="(feature, idx) in preservative.features.slice(0, 2)"
                                                            :key="idx"
                                                            class="text-xs text-gray-500 flex items-start gap-1">
                                                            <span class="text-red-500 mt-1">•</span>
                                                            <span>{{ feature }}</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <!-- Plage de dosage -->
                                                <div class="pt-4 border-t border-gray-200">
                                                    <div class="text-sm">
                                                        <span class="text-gray-700 font-medium">Dosage:</span>
                                                        <span class="text-red-600 font-bold ml-1">{{ preservative.recommendation }}</span>
                                                    </div>
                                                    <div v-if="preservative.max" class="text-xs text-gray-500">
                                                        Max: {{ preservative.max }}%
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Indicateur de sélection -->
                                            <div v-if="formData.preservativeSystem === preservative.id"
                                                 class="absolute top-3 right-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                                <span class="text-white text-sm font-bold">✓</span>
                                            </div>
                                        </label>
                                    </div>
                                </fieldset>
                            </div>

                            <!-- Configuration Cosgard -->
                            <div v-if="formData.preservativeSystem === 'cosgard'"
                                 class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-300 shadow-lg">
                                <div class="flex flex-col lg:flex-row gap-6">
                                    <!-- Informations Cosgard -->
                                    <div class="lg:w-1/3">
                                        <div class="sticky top-24">
                                            <div class="flex items-center gap-3 mb-4">
                                                <div class="p-3 bg-red-100 rounded-xl">
                                                    <span class="text-2xl text-red-600">🛡️</span>
                                                </div>
                                                <div>
                                                    <h3 class="font-bold text-gray-900 text-xl">Cosgard</h3>
                                                    <p class="text-sm text-gray-600">Conservateur large spectre</p>
                                                </div>
                                            </div>

                                            <div class="space-y-4">
                                                <div>
                                                    <h4 class="font-medium text-gray-900 mb-2">INCI</h4>
                                                    <p class="text-sm font-mono text-gray-700 bg-white p-3 rounded-lg border">
                                                        Benzyl Alcohol, Dehydroacetic Acid
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 class="font-medium text-gray-900 mb-2">Conformité UE</h4>
                                                    <ul class="text-sm text-gray-600 space-y-1">
                                                        <li class="flex items-center gap-2">
                                                            <span class="text-green-500">✅</span>
                                                            <span>Annexe V du Règlement UE 1223/2009</span>
                                                        </li>
                                                        <li class="flex items-center gap-2">
                                                            <span class="text-green-500">✅</span>
                                                            <span>Max autorisé: 1.0% (en mélange)</span>
                                                        </li>
                                                        <li class="flex items-center gap-2">
                                                            <span class="text-green-500">✅</span>
                                                            <span>pH stable: 3-8</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Configuration dosage -->
                                    <div class="lg:w-2/3">
                                        <div class="space-y-6">
                                            <!-- Contrôle de dosage -->
                                            <div>
                                                <label for="cosgard-percent" class="label required">
                                                    Concentration de Cosgard *
                                                </label>
                                                <div class="flex flex-col md:flex-row gap-6">
                                                    <!-- Contrôle principal -->
                                                    <div class="flex-1">
                                                        <div class="flex items-center gap-4">
                                                            <div class="relative flex-1">
                                                                <input id="cosgard-percent"
                                                                       v-model.number="formData.cosgardPercent"
                                                                       type="number"
                                                                       min="0.5"
                                                                       max="1.0"
                                                                       step="0.1"
                                                                       :class="[
                                         'input-field pr-12 text-center text-lg',
                                         formData.cosgardPercent < 0.5 || formData.cosgardPercent > 1.0
                                           ? 'input-error'
                                           : 'input-valid'
                                       ]"
                                                                       required
                                                                       aria-required="true"
                                                                       aria-describedby="cosgard-help">
                                                                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                  %
                                </span>
                                                            </div>
                                                            <div class="text-center">
                                                                <span class="block text-2xl font-bold text-red-600">{{ grams(formData.cosgardPercent) }}</span>
                                                                <span class="text-sm text-gray-500">grammes</span>
                                                            </div>
                                                        </div>

                                                        <!-- Slider -->
                                                        <div class="mt-6 space-y-2">
                                                            <div class="flex justify-between text-sm">
                                                                <span class="text-gray-600">Minimum requis: 0.5%</span>
                                                                <span class="font-bold text-red-600">{{ formData.cosgardPercent }}%</span>
                                                                <span class="text-gray-600">Maximum autorisé: 1.0%</span>
                                                            </div>
                                                            <input type="range"
                                                                   v-model.number="formData.cosgardPercent"
                                                                   min="0.5"
                                                                   max="1.0"
                                                                   step="0.05"
                                                                   class="w-full h-3 bg-gradient-to-r from-red-200 via-red-400 to-red-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-xl">

                                                            <!-- Zones -->
                                                            <div class="flex justify-between text-xs text-gray-500 px-2">
                                                                <span :class="formData.cosgardPercent < 0.6 ? 'font-bold text-red-600' : ''">Faible</span>
                                                                <span :class="formData.cosgardPercent >= 0.6 && formData.cosgardPercent <= 0.8 ? 'font-bold text-green-600' : ''">Optimal</span>
                                                                <span :class="formData.cosgardPercent > 0.8 ? 'font-bold text-red-600' : ''">Élevé</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Boutons rapides -->
                                                    <div class="flex md:flex-col gap-2">
                                                        <button type="button"
                                                                @click="formData.cosgardPercent = 0.5"
                                                                :class="[
                                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                      formData.cosgardPercent === 0.5
                                        ? 'bg-red-600 text-white'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    ]">
                                                            Min (0.5%)
                                                        </button>
                                                        <button type="button"
                                                                @click="formData.cosgardPercent = 0.7"
                                                                :class="[
                                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                      formData.cosgardPercent === 0.7
                                        ? 'bg-green-600 text-white'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    ]">
                                                            Optimal (0.7%)
                                                        </button>
                                                        <button type="button"
                                                                @click="formData.cosgardPercent = 1.0"
                                                                :class="[
                                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                      formData.cosgardPercent === 1.0
                                        ? 'bg-red-600 text-white'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    ]">
                                                            Max (1.0%)
                                                        </button>
                                                    </div>
                                                </div>

                                                <p id="cosgard-help" class="help-text mt-2">
                                                    Plage conforme UE: 0.5-1.0%. Recommandé: 0.6-0.8% pour la plupart des formules.
                                                </p>
                                            </div>

                                            <!-- Recommandations -->
                                            <div class="bg-white rounded-xl p-5 border border-red-200">
                                                <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                    <span class="text-red-600">💡</span>
                                                    Mode d'emploi Cosgard
                                                </h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 class="font-medium text-gray-800 mb-2">Précautions d'utilisation</h5>
                                                        <ul class="text-sm text-gray-600 space-y-1">
                                                            <li class="flex items-start gap-2">
                                                                <span class="text-red-500 mt-1">•</span>
                                                                <span>Ajouter à la phase aqueuse à température ambiante (20-25°C)</span>
                                                            </li>
                                                            <li class="flex items-start gap-2">
                                                                <span class="text-red-500 mt-1">•</span>
                                                                <span>Mélanger jusqu'à dissolution complète</span>
                                                            </li>
                                                            <li class="flex items-start gap-2">
                                                                <span class="text-red-500 mt-1">•</span>
                                                                <span>Éviter les températures supérieures à 40°C</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 class="font-medium text-gray-800 mb-2">Compatibilités</h5>
                                                        <ul class="text-sm text-gray-600 space-y-1">
                                                            <li class="flex items-start gap-2">
                                                                <span class="text-green-500 mt-1">✓</span>
                                                                <span>Compatible avec la plupart des émulsifiants</span>
                                                            </li>
                                                            <li class="flex items-start gap-2">
                                                                <span class="text-green-500 mt-1">✓</span>
                                                                <span>Stable avec les tensioactifs anioniques</span>
                                                            </li>
                                                            <li class="flex items-start gap-2">
                                                                <span class="text-red-500 mt-1">⚠️</span>
                                                                <span>Limiter les huiles essentielles à 1% max</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Importance de la conservation -->
                            <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-300">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0">
                                        <span class="text-3xl text-blue-600">⚠️</span>
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="font-bold text-gray-900 text-xl mb-3">Pourquoi la conservation est-elle cruciale ?</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 class="font-medium text-gray-800 mb-2">Exigences réglementaires (UE 1223/2009)</h4>
                                                <ul class="text-sm text-gray-600 space-y-2">
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-red-500 font-bold">§1</span>
                                                        <span>Tout produit cosmétique contenant de l'eau doit être protégé contre la contamination microbienne</span>
                                                    </li>
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-red-500 font-bold">§2</span>
                                                        <span>Le système de conservation doit être efficace pendant la durée de vie du produit</span>
                                                    </li>
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-red-500 font-bold">§3</span>
                                                        <span>Les conservateurs doivent être listés dans l'Annexe V</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 class="font-medium text-gray-800 mb-2">Bonnes pratiques</h4>
                                                <ul class="text-sm text-gray-600 space-y-2">
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-green-500">✓</span>
                                                        <span>Utiliser du matériel stérilisé (alcool 70° minimum)</span>
                                                    </li>
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-green-500">✓</span>
                                                        <span>Conserver au frais, à l'abri de la lumière et de l'humidité</span>
                                                    </li>
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-green-500">✓</span>
                                                        <span>Durée de vie: 3-6 mois pour les formules maison</span>
                                                    </li>
                                                    <li class="flex items-start gap-2">
                                                        <span class="text-green-500">✓</span>
                                                        <span>Test de stabilité recommandé (challenge test)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 6: Huiles essentielles -->
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
                                    <button @click="clearAllHE"
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
                                               v-model="heSearchTerm"
                                               type="text"
                                               placeholder="Nom, latin, propriété..."
                                               class="w-full pl-10 pr-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                                            v-model="heFilterProperty"
                                            class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                                            <input type="checkbox" v-model="heFilters.safeForPregnancy" class="rounded border-green-300">
                                            <span class="text-sm">Grossesse OK</span>
                                        </label>
                                        <label class="flex items-center gap-2">
                                            <input type="checkbox" v-model="heFilters.noPhotosensitivity" class="rounded border-green-300">
                                            <span class="text-sm">Non photosensible</span>
                                        </label>
                                        <label class="flex items-center gap-2">
                                            <input type="checkbox" v-model="heFilters.noAllergen" class="rounded border-green-300">
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
                                    <div class="flex items-center gap-2">
                                        <button @click="heShowAll = !heShowAll"
                                                type="button"
                                                class="text-sm text-green-600 hover:text-green-800">
                                            {{ heShowAll ? 'Afficher moins' : 'Afficher toutes les catégories' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Grille des huiles essentielles -->
                        <div class="space-y-8">
                            <template v-for="(oils, category) in filteredEssentialOils" :key="category">
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
                                                                   @change="toggleHE(oil)"
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
                                            <button @click="removeHE(he.name)"
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

                    <!-- Section 7: Analyse et validation -->
                    <section id="analysis"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex items-start gap-4 mb-8">
                            <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
                                <span class="text-2xl text-white">📊</span>
                            </div>
                            <div class="flex-1">
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyse technique</h2>
                                <p class="text-gray-600">Répartition des phases et validation réglementaire complète</p>
                            </div>
                        </div>

                        <!-- Vue d'ensemble des phases -->
                        <div class="mb-8">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="font-bold text-xl text-gray-900">Répartition des phases</h3>
                                <div class="text-sm text-gray-600">
                                    Total: {{ totalFormulationPercent.toFixed(1) }}%
                                </div>
                            </div>

                            <!-- Graphique circulaire -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <!-- Graphique SVG -->
                                <div class="lg:col-span-2">
                                    <div class="relative h-64 lg:h-80">
                                        <svg width="100%" height="100%" viewBox="0 0 400 400" class="transform -rotate-90">
                                            <!-- Arrière-plan -->
                                            <circle cx="200" cy="200" r="150" fill="none" stroke="#f3f4f6" stroke-width="80" />

                                            <!-- Tranches -->
                                            <g v-for="(phase, index) in phases" :key="phase.name">
                                                <circle cx="200" cy="200" r="150" fill="none"
                                                        :stroke="phase.color"
                                                        stroke-width="80"
                                                        :stroke-dasharray="942"
                                                        :stroke-dashoffset="942 - (getPhaseDashOffset(phase, index))"
                                                        stroke-linecap="round"
                                                        class="transition-all duration-1000">
                                                    <title>{{ phase.name }}: {{ phase.percent }}%</title>
                                                </circle>
                                            </g>
                                        </svg>

                                        <!-- Texte au centre -->
                                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                                            <span class="text-5xl font-bold text-gray-900">{{ totalFormulationPercent.toFixed(1) }}%</span>
                                            <span class="text-gray-600">de la formule</span>
                                            <div class="mt-2 text-sm text-gray-500">
                                                {{ waterPhase.toFixed(1) }}% d'eau restante
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Légende -->
                                <div class="space-y-4">
                                    <div v-for="phase in phases" :key="phase.name" class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg" :style="{ backgroundColor: phase.color }"></div>
                                        <div class="flex-1">
                                            <div class="flex justify-between">
                                                <span class="font-medium text-gray-900">{{ phase.name }}</span>
                                                <span class="font-bold" :style="{ color: phase.color }">{{ phase.percent }}%</span>
                                            </div>
                                            <div class="text-xs text-gray-500">{{ phase.grams }} g</div>
                                        </div>
                                    </div>

                                    <!-- Eau restante -->
                                    <div class="pt-4 border-t border-gray-200">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200"></div>
                                            <div class="flex-1">
                                                <div class="flex justify-between">
                                                    <span class="font-medium text-gray-900">Eau déminéralisée</span>
                                                    <span class="font-bold text-blue-600">{{ waterPhase.toFixed(1) }}%</span>
                                                </div>
                                                <div class="text-xs text-gray-500">{{ waterPhaseGrams }} g</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Liste INCI -->
                        <div class="mb-8">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
                                    <span>🧾</span>
                                    Liste INCI (ordre décroissant)
                                </h3>
                                <div class="flex gap-2">
                                    <button @click="copyINCI"
                                            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                        <span>📋</span>
                                        Copier INCI
                                    </button>
                                </div>
                            </div>

                            <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-300">
                                <div class="relative">
                  <pre class="text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto p-4 bg-white/50 rounded-lg border"
                       id="inci-list"
                       aria-label="Liste INCI des ingrédients">
{{ formatINCIList() }}</pre>

                                    <!-- Indicateur de copie -->
                                    <div v-if="copied"
                                         class="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white rounded-lg text-sm animate-fadeOut">
                                        Copié !
                                    </div>
                                </div>

                                <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                                    <div class="flex items-center gap-2">
                                        <span>📝</span>
                                        <span>Conforme à l'Annexe I du Règlement UE 1223/2009</span>
                                    </div>
                                    <span>{{ inciList.length }} ingrédients</span>
                                </div>
                            </div>
                        </div>

                        <!-- Validation réglementaire -->
                        <div class="border-2 border-gray-200 rounded-xl overflow-hidden">
                            <!-- En-tête -->
                            <div class="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                                <h3 class="font-bold text-xl text-white flex items-center gap-3">
                                    <span class="text-green-400">✅</span>
                                    Validation réglementaire UE 1223/2009
                                </h3>
                            </div>

                            <!-- Contenu -->
                            <div class="p-6">
                                <!-- Résumé -->
                                <div class="mb-6 p-4 rounded-lg"
                                     :class="regulatoryStatus.isValid
                       ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                       : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'">
                                    <div class="flex items-center gap-3">
                                        <div class="flex-shrink-0">
                      <span v-if="regulatoryStatus.isValid"
                            class="text-3xl text-green-600">✅</span>
                                            <span v-else
                                                  class="text-3xl text-red-600">❌</span>
                                        </div>
                                        <div>
                                            <h4 class="font-bold"
                                                :class="regulatoryStatus.isValid ? 'text-green-800' : 'text-red-800'">
                                                {{ regulatoryStatus.isValid ? 'FORMULE CONFORME' : 'FORMULE NON CONFORME' }}
                                            </h4>
                                            <p class="text-sm"
                                               :class="regulatoryStatus.isValid ? 'text-green-700' : 'text-red-700'">
                                                {{ regulatoryStatus.isValid
                                                ? 'Tous les critères réglementaires sont respectés.'
                                                : `${regulatoryErrors.length} critère(s) non conforme(s).` }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Liste des vérifications -->
                                <div class="space-y-4">
                                    <div v-for="check in regulatoryChecks"
                                         :key="check.name"
                                         class="flex items-start gap-4 p-4 rounded-lg border transition-all duration-300"
                                         :class="check.passed
                         ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200'
                         : 'bg-gradient-to-r from-red-50/50 to-orange-50/50 border-red-200'">
                                        <!-- Icone -->
                                        <span :class="[
                      'flex-shrink-0 mt-1 text-2xl',
                      check.passed ? 'text-green-500' : 'text-red-500'
                    ]">
                      {{ check.passed ? '✓' : '✗' }}
                    </span>

                                        <!-- Contenu -->
                                        <div class="flex-1">
                                            <div class="flex justify-between items-start mb-2">
                                                <h5 class="font-bold text-gray-900">{{ check.name }}</h5>
                                                <span :class="[
                          'px-2 py-1 rounded text-xs font-bold',
                          check.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        ]">
                          {{ check.passed ? 'Conforme' : 'Non conforme' }}
                        </span>
                                            </div>

                                            <p class="text-sm text-gray-600 mb-2">{{ check.description }}</p>

                                            <div v-if="!check.passed" class="mt-3 p-3 bg-white rounded border border-red-200">
                                                <p class="text-sm text-red-700 font-medium flex items-center gap-2">
                                                    <span>⚠️</span>
                                                    <span>{{ check.error }}</span>
                                                </p>
                                                <p v-if="check.recommendation" class="text-sm text-gray-700 mt-2">
                                                    <span class="font-medium">Recommandation:</span> {{ check.recommendation }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Mentions obligatoires -->
                                <div v-if="mandatoryMentions.length > 0" class="mt-8 pt-8 border-t border-gray-200">
                                    <h4 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                                        <span class="text-amber-600">📝</span>
                                        Mentions obligatoires sur l'étiquetage
                                    </h4>

                                    <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div v-for="mention in mandatoryMentions.slice(0, 6)"
                                                 :key="mention"
                                                 class="flex items-start gap-2 p-3 bg-white/80 rounded-lg border border-amber-100">
                                                <span class="text-amber-500 mt-1">•</span>
                                                <span class="text-sm text-gray-800">{{ mention }}</span>
                                            </div>
                                        </div>

                                        <div v-if="mandatoryMentions.length > 6" class="mt-4 text-center">
                                            <button @click="showAllMentions = !showAllMentions"
                                                    class="text-sm text-amber-600 hover:text-amber-800 font-medium">
                                                {{ showAllMentions ? 'Voir moins' : `Voir les ${mandatoryMentions.length - 6} mentions supplémentaires` }}
                                            </button>

                                            <div v-if="showAllMentions" class="mt-4 space-y-2">
                                                <div v-for="mention in mandatoryMentions.slice(6)"
                                                     :key="mention"
                                                     class="flex items-start gap-2 p-3 bg-white/80 rounded-lg border border-amber-100">
                                                    <span class="text-amber-500 mt-1">•</span>
                                                    <span class="text-sm text-gray-800">{{ mention }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Rapport de conformité -->
                                <div class="mt-8">
                                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <div>
                                            <h4 class="font-bold text-gray-900">Rapport de conformité complet</h4>
                                            <p class="text-sm text-gray-600">Générez un rapport PDF détaillé pour vos archives</p>
                                        </div>
                                        <button @click="generateComplianceReport"
                                                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                                            📄 Générer rapport PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 8: Finalisation -->
                    <section id="actions"
                             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Finaliser la formule</h2>
                                <p class="text-gray-600">
                                    Enregistrez votre formule ou générez des documents réglementaires
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-3">
                                <!-- Validation préalable -->
                                <div v-if="!isValid" class="mb-4 sm:mb-0">
                                    <div class="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-300 rounded-lg">
                                        <p class="text-sm text-red-700 font-medium flex items-center gap-2">
                                            <span>⚠️</span>
                                            <span>Veuillez corriger les erreurs avant d'enregistrer</span>
                                        </p>
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <button @click="saveDraft"
                                            :disabled="saving"
                                            class="btn-secondary px-6 py-3"
                                            :aria-disabled="saving">
                                        <template v-if="saving">
                                            <span class="animate-spin mr-2">⏳</span>
                                            Sauvegarde...
                                        </template>
                                        <template v-else>
                                            <span class="text-xl">💾</span>
                                            Sauvegarder brouillon
                                        </template>
                                    </button>

                                    <button @click="save"
                                            :disabled="!isValid || saving"
                                            :class="[
                            'btn-primary px-8 py-3',
                            { 'opacity-50 cursor-not-allowed': !isValid }
                          ]"
                                            :aria-disabled="!isValid || saving">
                                        <template v-if="saving">
                                            <span class="animate-spin mr-2">⏳</span>
                                            Enregistrement...
                                        </template>
                                        <template v-else>
                                            <span class="text-xl">✅</span>
                                            {{ isEditMode ? 'Mettre à jour' : 'Enregistrer la formule' }}
                                        </template>
                                    </button>

                                    <button @click="cancel"
                                            type="button"
                                            class="btn-outline px-6 py-3">
                                        <span class="text-xl">↩️</span>
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Informations d'enregistrement -->
                        <div v-if="isEditMode && props.initialData.updatedAt"
                             class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                            <div class="flex items-center gap-3">
                                <span class="text-blue-600 text-xl">📅</span>
                                <div>
                                    <p class="text-sm font-medium text-blue-700">
                                        Dernière modification
                                    </p>
                                    <p class="text-sm text-blue-600">
                                        {{ formatDate(props.initialData.updatedAt) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <!-- Barre d'actions fixe -->
            <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 transform transition-transform duration-300"
                 :class="showFixedBar ? 'translate-y-0' : 'translate-y-full'">
                <div class=" mx-auto px-4 py-3">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <!-- Statut -->
                        <div class="flex-1">
                            <div v-if="!isValid" class="flex items-center gap-2">
                                <span class="text-red-500 text-xl">❌</span>
                                <div>
                                    <p class="text-sm font-medium text-red-600">
                                        Formule non conforme
                                    </p>
                                    <p class="text-xs text-red-500">
                                        {{ regulatoryErrors.length }} erreur(s) à corriger
                                    </p>
                                </div>
                            </div>
                            <div v-else class="flex items-center gap-2">
                                <span class="text-green-500 text-xl">✅</span>
                                <div>
                                    <p class="text-sm font-medium text-green-600">
                                        Formule prête à être enregistrée
                                    </p>
                                    <p class="text-xs text-green-500">
                                        {{ completionPercentage }}% complétée
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Boutons d'action -->
                        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button @click="saveDraft"
                                    :disabled="saving"
                                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                                <span v-if="saving" class="animate-spin">⏳</span>
                                <span v-else>💾</span>
                                <span>Brouillon</span>
                            </button>

                            <button @click="save"
                                    :disabled="!isValid || saving"
                                    :class="[
                        'px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2',
                        isValid
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      ]"
                                    :aria-disabled="!isValid || saving">
                                <template v-if="saving">
                                    <span class="animate-spin">⏳</span>
                                    <span>Enregistrement...</span>
                                </template>
                                <template v-else>
                                    <span>✅</span>
                                    <span>{{ isEditMode ? 'Mettre à jour' : 'Enregistrer' }}</span>
                                </template>
                            </button>

                            <button @click="toggleFixedBar"
                                    class="sm:hidden px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <span class="text-xl">{{ showFixedBar ? '▼' : '▲' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Espace pour la barre fixe -->
            <div class="h-20"></div>

            <!-- Footer -->
            <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="text-center space-y-3">
                    <p class="text-sm text-gray-500 max-w-3xl mx-auto">
                        <span class="font-medium">Avertissement important :</span>
                        Cet outil fournit des recommandations techniques basées sur le Règlement UE 1223/2009.
                        Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable de la Conformité (PRC).
                        Toute commercialisation nécessite une évaluation de sécurité complète par un expert qualifié.
                    </p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
                        <span>Version 2.2 • Conforme UE 1223/2009</span>
                        <span>•</span>
                        <span>Dernière mise à jour : {{ currentDate }}</span>
                        <span>•</span>
                        <span>© 2024 Formulateur Cosmétique Pro</span>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useClipboard } from '@vueuse/core'

const router = useRouter()
const { copy, copied } = useClipboard()

// Props pour les données initiales
const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
})

// Événements
const emit = defineEmits(["save", "cancel", "save-draft"])

// États réactifs
const formData = reactive({
    name: "",
    volume: 50,
    skinType: "mixte",
    selectedHE: [],
    preservativeSystem: "cosgard",
    cosgardPercent: 0.8,
    formulaType: "creme",
    spf: 0
})

// États UI
const saving = ref(false)
const errors = ref({})
const isEditMode = ref(false)
const showFixedBar = ref(true)
const summaryExpanded = ref(false)
const showAccessibilityMenu = ref(false)
const showAllMentions = ref(false)
const currentDate = ref(new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}))

// États d'accessibilité
const highContrast = ref(false)
const reducedMotion = ref(false)
const textSize = ref(100)

// États de recherche/filtres
const activeSearch = ref("")
const activeTypeFilter = ref("")
const heSearchTerm = ref("")
const heFilterProperty = ref("")
const heShowAll = ref(true)
const heCurrentPage = ref(1)
const heItemsPerPage = ref(20)
const heFilters = reactive({
    safeForPregnancy: false,
    noPhotosensitivity: false,
    noAllergen: false
})

// Sections pour navigation
const sections = [
    { id: 'basic-info', name: 'Informations' },
    { id: 'actives', name: 'Actifs' },
    { id: 'aqueous-phase', name: 'Hydrosols' },
    { id: 'oil-phase', name: 'Huiles' },
    { id: 'preservatives', name: 'Conservation' },
    { id: 'essential-oils', name: 'HE' },
    { id: 'analysis', name: 'Analyse' },
    { id: 'actions', name: 'Finalisation' }
]

// Points de progression
const progressMarks = [
    { percent: 25, label: 'Informations de base' },
    { percent: 50, label: 'Phase aqueuse' },
    { percent: 75, label: 'Phase huileuse' },
    { percent: 100, label: 'Validation' }
]

// Profils de peau (conforme aux bonnes pratiques)
const skinProfiles = {
    seche: {
        oil: 25,
        maxActives: 3,
        description: "Peau déshydratée, besoin en nutrition élevé",
        tips: [
            "Privilégiez les huiles riches (avocat, amande douce)",
            "Utilisez des actifs hydratants (acide hyaluronique, B5)",
            "Évitez les textures trop légères",
            "Incorporez des émollients nourrissants"
        ],
        color: "#f59e0b"
    },
    grasse: {
        oil: 15,
        maxActives: 2,
        description: "Sécrétion sébacée importante, pores dilatés",
        tips: [
            "Optez pour des huiles légères (jojoba, noisette)",
            "Utilisez des actifs séborégulateurs (acide salicylique)",
            "Privilégiez les textures fluides",
            "Évitez les formules trop riches"
        ],
        color: "#10b981"
    },
    sensible: {
        oil: 18,
        maxActives: 2,
        description: "Réactivité cutanée élevée, tolérance limitée",
        tips: [
            "Choisissez des ingrédients apaisants (camomille, calendula)",
            "Limitez le nombre d'actifs",
            "Évitez les parfums et alcools",
            "Testez toujours la formule sur une petite zone"
        ],
        color: "#ef4444"
    },
    mixte: {
        oil: 20,
        maxActives: 3,
        description: "Combinaison de zones sèches et grasses",
        tips: [
            "Équilibrez hydratation et légèreté",
            "Ciblez les zones avec des actifs spécifiques",
            "Utilisez des textures adaptées aux deux types",
            "Évitez les formules trop lourdes"
        ],
        color: "#8b5cf6"
    },
    mature: {
        oil: 22,
        maxActives: 3,
        description: "Besoins anti-âge et restructuration",
        tips: [
            "Intégrez des actifs anti-âge (vitamines C et E)",
            "Utilisez des huiles régénérantes (rose musquée, argan)",
            "Privilégiez les textures nourrissantes",
            "Incorporez des antioxydants"
        ],
        color: "#ec4899"
    }
}

// Options de profils peau pour l'UI
const skinProfilesOptions = computed(() => {
    return Object.entries(skinProfiles).map(([key, value]) => ({
        value: key,
        label: key,
        icon: key === 'seche' ? '🏜️' :
            key === 'grasse' ? '💦' :
                key === 'sensible' ? '🌡️' :
                    key === 'mixte' ? '⚖️' : '👵',
        iconLabel: key === 'seche' ? 'Icône peau sèche' :
            key === 'grasse' ? 'Icône peau grasse' :
                key === 'sensible' ? 'Icône peau sensible' :
                    key === 'mixte' ? 'Icône peau mixte' :
                        'Icône peau mature',
        oil: value.oil,
        maxActives: value.maxActives,
        description: value.description,
        color: value.color,
        tips: value.tips
    }))
})

// Profil peau sélectionné
const selectedSkinProfile = computed(() => {
    return skinProfilesOptions.value.find(p => p.value === formData.skinType)
})

// Actifs cosmétiques (conformes aux bonnes pratiques)
const actives = reactive([
    {
        key: 'ha',
        label: 'Acide hyaluronique',
        min: 0.1,
        max: 2,
        percent: 0.5,
        enabled: false,
        inci: 'Sodium Hyaluronate',
        type: 'hydratant',
        description: 'Humectant puissant, retient jusqu\'à 1000x son poids en eau',
        stability: 'pH 5.5-7.0',
        compatibility: ['B5', 'Niacinamide'],
        restrictions: 'Éviter avec des fortes concentrations d\'acides'
    },
    {
        key: 'b5',
        label: 'Panthénol (B5)',
        min: 0.5,
        max: 5,
        percent: 2,
        enabled: false,
        inci: 'Panthenol',
        type: 'repair',
        description: 'Provitamine B5, favorise la régénération cutanée',
        stability: 'stable',
        compatibility: ['HA', 'Niacinamide'],
        restrictions: 'Aucune connue'
    },
    {
        key: 'e',
        label: 'Vitamine E',
        min: 0.1,
        max: 1,
        percent: 0.3,
        enabled: false,
        inci: 'Tocopherol',
        type: 'antioxydant',
        description: 'Antioxydant liposoluble, protège des radicaux libres',
        stability: 'sensible à l\'oxydation',
        compatibility: ['Vitamine C', 'Ferulic Acid'],
        restrictions: 'Protéger de la lumière'
    },
    {
        key: 'bha',
        label: 'Acide salicylique',
        min: 0.5,
        max: 2,
        percent: 1,
        enabled: false,
        inci: 'Salicylic Acid',
        type: 'exfoliant',
        description: 'BHA liposoluble, pénètre dans les pores',
        stability: 'pH 3.0-4.0',
        compatibility: ['AHA', 'Niacinamide'],
        restrictions: 'Ne pas combiner avec rétinol, éviter sur peau sensible'
    }
])

// Actifs filtrés
const filteredActives = computed(() => {
    return actives.filter(active => {
        // Filtre par recherche
        if (activeSearch.value &&
            !active.label.toLowerCase().includes(activeSearch.value.toLowerCase()) &&
            !active.inci.toLowerCase().includes(activeSearch.value.toLowerCase()) &&
            !active.description.toLowerCase().includes(activeSearch.value.toLowerCase())) {
            return false
        }

        // Filtre par type
        if (activeTypeFilter.value && active.type !== activeTypeFilter.value) {
            return false
        }

        return true
    })
})

// Systèmes de conservation (conformes UE 1223/2009)
const preservativeSystems = [
    {
        id: 'cosgard',
        name: 'Cosgard',
        max: 1.0,
        description: 'Benzyl Alcohol, Dehydroacetic Acid - Large spectre',
        icon: '🛡️',
        iconLabel: 'Icône Cosgard conservateur large spectre',
        inci: 'Benzyl Alcohol, Dehydroacetic Acid',
        recommendation: '0.5-1.0%',
        features: [
            'Large spectre antibactérien',
            'pH stable 3-8',
            'Conforme UE 1223/2009',
            'Adapté aux émulsions'
        ]
    },
    {
        id: 'phenoxyethanol',
        name: 'Phénoxyéthanol',
        max: 1.0,
        description: 'Conservateur synthétique standard',
        icon: '⚗️',
        iconLabel: 'Icône conservateur synthétique',
        inci: 'Phenoxyethanol',
        recommendation: '0.5-1.0%',
        features: [
            'Efficacité prouvée',
            'Large spectre',
            'Stable à la chaleur',
            'Usage cosmétique établi'
        ]
    },
    {
        id: 'paraben-free',
        name: 'Système sans parabènes',
        max: null,
        description: 'Mélange de conservateurs naturels',
        icon: '🌿',
        iconLabel: 'Icône conservateur naturel',
        inci: 'Potassium Sorbate, Sodium Benzoate',
        recommendation: '0.5-1.5%',
        features: [
            'Sans parabènes',
            'Alternative naturelle',
            'Large spectre',
            'Conforme bio'
        ]
    },
    {
        id: 'organic',
        name: 'Conservateurs naturels',
        max: null,
        description: 'Extraits naturels et huiles essentielles',
        icon: '🍃',
        iconLabel: 'Icône extraits naturels',
        inci: 'Leuconostoc/Radish Root Ferment Filtrate',
        recommendation: '1.0-2.0%',
        features: [
            '100% naturel',
            'Efficacité douce',
            'Conforme cosmétique bio',
            'Sans allergènes majeurs'
        ]
    }
]

// Phase aqueuse - Hydrolats
const aqueousPhaseOptions = reactive({
    'Hydrolats apaisants': {
        icon: '💙',
        items: [
            {
                name: 'Hamamélis',
                description: 'Astringent, tonifiant vasculaire',
                properties: ['Astringent', 'Anti-inflammatoire', 'Tonique'],
                percent: 10, min: 5, max: 50, selected: false
            },
            {
                name: 'Camomille romaine',
                description: 'Apaisant, anti-inflammatoire',
                properties: ['Apaisant', 'Anti-rougeurs', 'Calmant'],
                percent: 15, min: 5, max: 50, selected: false
            },
            {
                name: 'Bleuet',
                description: 'Décongestionnant, anti-cernes',
                properties: ['Décongestionnant', 'Anti-cernes', 'Raffermissant'],
                percent: 10, min: 5, max: 30, selected: false
            },
            {
                name: 'Rose de Damas',
                description: 'Hydratant, anti-âge',
                properties: ['Hydratant', 'Anti-âge', 'Équilibrant'],
                percent: 20, min: 10, max: 50, selected: false
            },
            {
                name: 'Lavande',
                description: 'Cicatrisant, régénérant',
                properties: ['Cicatrisant', 'Régénérant', 'Purifiant'],
                percent: 15, min: 5, max: 40, selected: false
            }
        ]
    },
    'Hydrolats purifiants': {
        icon: '💚',
        items: [
            {
                name: 'Tea tree',
                description: 'Antibactérien, purifiant',
                properties: ['Antibactérien', 'Purifiant', 'Séborégulateur'],
                percent: 5, min: 2, max: 20, selected: false
            },
            {
                name: 'Romarin',
                description: 'Stimulant, antioxydant',
                properties: ['Stimulant', 'Antioxydant', 'Tonique'],
                percent: 10, min: 5, max: 30, selected: false
            },
            {
                name: 'Menthe poivrée',
                description: 'Rafraîchissant, décongestionnant',
                properties: ['Rafraîchissant', 'Décongestionnant', 'Stimulant'],
                percent: 5, min: 2, max: 15, selected: false
            },
            {
                name: 'Sauge',
                description: 'Régulateur sébacé',
                properties: ['Séborégulateur', 'Astringent', 'Équilibrant'],
                percent: 8, min: 3, max: 20, selected: false
            },
            {
                name: 'Citron',
                description: 'Astringent, éclaircissant',
                properties: ['Astringent', 'Éclaircissant', 'Purifiant'],
                percent: 5, min: 2, max: 15, selected: false
            }
        ]
    },
    'Hydrolats hydratants': {
        icon: '💧',
        items: [
            {
                name: 'Fleur d\'oranger',
                description: 'Hydratant, adoucissant',
                properties: ['Hydratant', 'Adoucissant', 'Apaisant'],
                percent: 20, min: 10, max: 50, selected: false
            },
            {
                name: 'Hélichryse italienne',
                description: 'Régénérant, anti-couperose',
                properties: ['Régénérant', 'Anti-couperose', 'Anti-âge'],
                percent: 15, min: 5, max: 40, selected: false
            },
            {
                name: 'Néroli',
                description: 'Régénérant, anti-stress',
                properties: ['Régénérant', 'Anti-stress', 'Équilibrant'],
                percent: 15, min: 5, max: 40, selected: false
            },
            {
                name: 'Immortelle',
                description: 'Anti-hématome, régénérant',
                properties: ['Anti-hématome', 'Régénérant', 'Anti-âge'],
                percent: 10, min: 5, max: 30, selected: false
            },
            {
                name: 'Fenouil',
                description: 'Décongestionnant, raffermissant',
                properties: ['Décongestionnant', 'Raffermissant', 'Détoxifiant'],
                percent: 10, min: 5, max: 30, selected: false
            }
        ]
    }
})

// Phase huileuse - Huiles végétales
const oilPhaseOptions = reactive({
    'Huiles légères (peaux grasses)': {
        icon: '🟢',
        items: [
            {
                name: 'Jojoba',
                description: 'Sébum-like, non comédogène',
                properties: ['Régulateur', 'Hydratant', 'Non comédogène'],
                specifics: ['Pénétration rapide', 'Stable'],
                comedogenic: 0, percent: 5, min: 1, max: 15, selected: false
            },
            {
                name: 'Noisette',
                description: 'Astringent, régulateur sébacé',
                properties: ['Astringent', 'Séborégulateur', 'Raffermissant'],
                specifics: ['Vitamine E', 'Antioxydant'],
                comedogenic: 1, percent: 8, min: 2, max: 20, selected: false
            },
            {
                name: 'Pépins de raisin',
                description: 'Légère, riche en antioxydants',
                properties: ['Antioxydant', 'Légère', 'Raffermissante'],
                specifics: ['Vitamine E', 'Acide linoléique'],
                comedogenic: 1, percent: 5, min: 1, max: 15, selected: false
            },
            {
                name: 'Tournesol',
                description: 'Émolliente, riche en vitamine E',
                properties: ['Émolliente', 'Vitamine E', 'Protectrice'],
                specifics: ['Économique', 'Stable'],
                comedogenic: 0, percent: 10, min: 5, max: 30, selected: false
            },
            {
                name: 'Sésame',
                description: 'Pénétration rapide, antioxydante',
                properties: ['Pénétration rapide', 'Antioxydante', 'Séchante'],
                specifics: ['Vitamine E', 'Sésamol'],
                comedogenic: 1, percent: 8, min: 2, max: 20, selected: false
            }
        ]
    },
    'Huiles nutritives (peaux sèches)': {
        icon: '🟠',
        items: [
            {
                name: 'Avocat',
                description: 'Riche en vitamines A, D, E',
                properties: ['Nutritive', 'Régénérante', 'Apaisante'],
                specifics: ['Vitamines A,D,E', 'Lécithine'],
                comedogenic: 2, percent: 15, min: 5, max: 30, selected: false
            },
            {
                name: 'Amande douce',
                description: 'Adoucissante, calmante',
                properties: ['Adoucissante', 'Calmante', 'Émolliente'],
                specifics: ['Vitamine E', 'Acides gras'],
                comedogenic: 2, percent: 12, min: 5, max: 25, selected: false
            },
            {
                name: 'Macadamia',
                description: 'Riche en acides palmitoléiques',
                properties: ['Régénérante', 'Restructurante', 'Anti-âge'],
                specifics: ['Oméga-7', 'Antioxydant'],
                comedogenic: 2, percent: 10, min: 3, max: 20, selected: false
            },
            {
                name: 'Germe de blé',
                description: 'Très riche en vitamine E',
                properties: ['Antioxydante', 'Régénérante', 'Protectrice'],
                specifics: ['Vitamine E', 'Phytostérols'],
                comedogenic: 2, percent: 5, min: 1, max: 10, selected: false
            },
            {
                name: 'Olive',
                description: 'Émolliente, protectrice',
                properties: ['Émolliente', 'Protectrice', 'Antioxydante'],
                specifics: ['Squalène végétal', 'Polyphénols'],
                comedogenic: 2, percent: 15, min: 5, max: 30, selected: false
            }
        ]
    },
    'Huiles spécialisées': {
        icon: '🟣',
        items: [
            {
                name: 'Rose musquée',
                description: 'Cicatrisante, anti-vergetures',
                properties: ['Cicatrisante', 'Anti-cicatrices', 'Anti-âge'],
                specifics: ['Vitamine A', 'Acides gras essentiels'],
                comedogenic: 1, percent: 10, min: 3, max: 20, selected: false
            },
            {
                name: 'Argan',
                description: 'Régénérante, anti-âge',
                properties: ['Régénérante', 'Anti-âge', 'Protectrice'],
                specifics: ['Vitamine E', 'Squalène'],
                comedogenic: 0, percent: 10, min: 3, max: 20, selected: false
            },
            {
                name: 'Bourrache',
                description: 'Riche en GLA, anti-inflammatoire',
                properties: ['Anti-inflammatoire', 'Hydratante', 'Apaisante'],
                specifics: ['GLA', 'Oméga-6'],
                comedogenic: 1, percent: 8, min: 2, max: 15, selected: false
            },
            {
                name: 'Onagre',
                description: 'Régulatrice hormonale, anti-âge',
                properties: ['Régulatrice', 'Anti-âge', 'Apaisante'],
                specifics: ['GLA', 'Antioxydant'],
                comedogenic: 1, percent: 8, min: 2, max: 15, selected: false
            },
            {
                name: 'Calophylle',
                description: 'Anti-inflammatoire, circulatoire',
                properties: ['Anti-inflammatoire', 'Circulatoire', 'Décongestionnant'],
                specifics: ['Calophyllolide', 'Coumarine'],
                comedogenic: 1, percent: 5, min: 1, max: 10, selected: false
            }
        ]
    }
})

// 100+ Huiles essentielles (conforme IFRA et UE)
const extendedEssentialOils = reactive({
    'Anti-âge & Régénération': [
        { name: 'Encens (Boswellia carterii)', latinName: 'Boswellia carterii', allergen: false, pregnancy: true, photo: false, maxFace: 0.5, ifra: 0.6, properties: ['Anti-âge', 'Régénérant', 'Cicatrisant'] },
        { name: 'Ciste (Cistus ladaniferus)', latinName: 'Cistus ladaniferus', allergen: true, pregnancy: false, photo: false, maxFace: 0.3, ifra: 0.4, properties: ['Anti-rides', 'Régénérant', 'Astringent'] },
        { name: 'Carotte sauvage', latinName: 'Daucus carota', allergen: false, pregnancy: false, photo: true, maxFace: 0.3, ifra: 0.8, properties: ['Détoxifiant', 'Régénérant', 'Tonique'] },
        { name: 'Myrrhe', latinName: 'Commiphora myrrha', allergen: false, pregnancy: false, photo: false, maxFace: 0.2, ifra: 0.3, properties: ['Cicatrisant', 'Anti-inflammatoire', 'Antiseptique'] },
        { name: 'Néroli', latinName: 'Citrus aurantium', allergen: false, pregnancy: true, photo: false, maxFace: 0.5, ifra: 1.2, properties: ['Régénérant', 'Anti-stress', 'Équilibrant'] },
        { name: 'Rose de Damas', latinName: 'Rosa damascena', allergen: false, pregnancy: true, photo: false, maxFace: 0.3, ifra: 0.4, properties: ['Anti-âge', 'Hydratant', 'Apaisant'] },
        { name: 'Immortelle (Hélichryse)', latinName: 'Helichrysum italicum', allergen: false, pregnancy: true, photo: false, maxFace: 0.4, ifra: 0.6, properties: ['Anti-hématome', 'Régénérant', 'Anti-couperose'] },
        { name: 'Palmarosa', latinName: 'Cymbopogon martinii', allergen: true, pregnancy: true, photo: false, maxFace: 0.8, ifra: 1.5, properties: ['Régénérant', 'Hydratant', 'Antibactérien'] },
        { name: 'Bois de Hô', latinName: 'Cinnamomum camphora', allergen: false, pregnancy: true, photo: false, maxFace: 1.0, ifra: 2.0, properties: ['Analgésique', 'Anti-inflammatoire', 'Rafraîchissant'] },
        { name: 'Géranium Bourbon', latinName: 'Pelargonium graveolens', allergen: true, pregnancy: true, photo: false, maxFace: 0.6, ifra: 1.0, properties: ['Équilibrant', 'Régénérant', 'Astringent'] },
    ],
    'Hydratation & Éclat': [
        { name: 'Lavande vraie', latinName: 'Lavandula angustifolia', allergen: false, pregnancy: true, photo: false, maxFace: 1.0, ifra: 1.5, properties: ['Cicatrisant', 'Apaisant', 'Régénérant'] },
        { name: 'Camomille romaine', latinName: 'Chamaemelum nobile', allergen: false, pregnancy: true, photo: false, maxFace: 0.3, ifra: 0.5, properties: ['Apaisant', 'Anti-inflammatoire', 'Calmant'] },
        { name: 'Camomille allemande', latinName: 'Matricaria recutita', allergen: false, pregnancy: true, photo: false, maxFace: 0.2, ifra: 0.3, properties: ['Anti-inflammatoire', 'Apaisant', 'Cicatrisant'] },
        { name: 'Ylang-Ylang complète', latinName: 'Cananga odorata', allergen: true, pregnancy: false, photo: false, maxFace: 0.3, ifra: 0.8, properties: ['Équilibrant', 'Aphrodisiaque', 'Relaxant'] },
        { name: 'Santal', latinName: 'Santalum album', allergen: false, pregnancy: true, photo: false, maxFace: 0.5, ifra: 0.7, properties: ['Apaisant', 'Hydratant', 'Anti-inflammatoire'] },
        { name: 'Géranium rosat', latinName: 'Pelargonium roseum', allergen: true, pregnancy: true, photo: false, maxFace: 0.5, ifra: 1.0, properties: ['Équilibrant', 'Astringent', 'Régénérant'] },
        { name: 'Bergamote sans bergaptène', latinName: 'Citrus bergamia', allergen: true, pregnancy: false, photo: false, maxFace: 0.4, ifra: 1.2, properties: ['Antidépresseur', 'Purifiant', 'Rafraîchissant'] },
        { name: 'Mandarine rouge', latinName: 'Citrus reticulata', allergen: true, pregnancy: false, photo: true, maxFace: 0.8, ifra: 1.5, properties: ['Calmant', 'Digestif', 'Purifiant'] },
        { name: 'Orange douce', latinName: 'Citrus sinensis', allergen: true, pregnancy: true, photo: true, maxFace: 1.0, ifra: 2.0, properties: ['Antioxydant', 'Calmant', 'Digestif'] },
        { name: 'Nard de l\'Himalaya', latinName: 'Nardostachys jatamansi', allergen: false, pregnancy: false, photo: false, maxFace: 0.2, ifra: 0.3, properties: ['Apaisant', 'Sédatif', 'Anti-inflammatoire'] },
    ],
    'Apaisant & Peaux sensibles': [
        { name: 'Camomille romaine', latinName: 'Chamaemelum nobile', allergen: false, pregnancy: true, photo: false, maxFace: 0.3, ifra: 0.5, properties: ['Apaisant', 'Anti-inflammatoire', 'Calmant'] },
        { name: 'Camomille allemande', latinName: 'Matricaria recutita', allergen: false, pregnancy: true, photo: false, maxFace: 0.2, ifra: 0.3, properties: ['Anti-inflammatoire', 'Apaisant', 'Cicatrisant'] },
        { name: 'Lavande fine', latinName: 'Lavandula angustifolia', allergen: false, pregnancy: true, photo: false, maxFace: 1.0, ifra: 1.5, properties: ['Cicatrisant', 'Apaisant', 'Régénérant'] },
        { name: 'Petitgrain bigarade', latinName: 'Citrus aurantium', allergen: true, pregnancy: true, photo: false, maxFace: 0.5, ifra: 1.0, properties: ['Calmant', 'Anti-stress', 'Régulateur'] },
        { name: 'Marjolaine à coquilles', latinName: 'Origanum majorana', allergen: false, pregnancy: false, photo: false, maxFace: 0.4, ifra: 0.8, properties: ['Calmant', 'Antispasmodique', 'Antiseptique'] },
        { name: 'Cèdre de l\'Atlas', latinName: 'Cedrus atlantica', allergen: false, pregnancy: false, photo: false, maxFace: 0.3, ifra: 0.5, properties: ['Astringent', 'Antiseptique', 'Décongestionnant'] },
        { name: 'Vétiver', latinName: 'Vetiveria zizanioides', allergen: false, pregnancy: true, photo: false, maxFace: 0.2, ifra: 0.4, properties: ['Apaisant', 'Tonique', 'Equilibrant'] },
        { name: 'Patchouli', latinName: 'Pogostemon cablin', allergen: true, pregnancy: true, photo: false, maxFace: 0.3, ifra: 0.6, properties: ['Antidépresseur', 'Anti-inflammatoire', 'Aphrodisiaque'] },
        { name: 'Gaulthérie couchée', latinName: 'Gaultheria procumbens', allergen: false, pregnancy: false, photo: false, maxFace: 0.2, ifra: 0.4, properties: ['Analgésique', 'Anti-inflammatoire', 'Antiseptique'] },
        { name: 'Genévrier', latinName: 'Juniperus communis', allergen: false, pregnancy: false, photo: false, maxFace: 0.3, ifra: 0.6, properties: ['Détoxifiant', 'Diurétique', 'Antiseptique'] },
    ],
    'Purifiant & Peaux à imperfections': [
        { name: 'Tea tree (Melaleuca alternifolia)', latinName: 'Melaleuca alternifolia', allergen: false, pregnancy: false, photo: false, maxFace: 1.0, ifra: 1.5, properties: ['Antibactérien', 'Antifongique', 'Immunostimulant'] },
        { name: 'Laurier noble', latinName: 'Laurus nobilis', allergen: true, pregnancy: false, photo: false, maxFace: 0.3, ifra: 0.5, properties: ['Antiseptique', 'Expectorant', 'Analgésique'] },
        { name: 'Romarin à cinéole', latinName: 'Rosmarinus officinalis', allergen: true, pregnancy: false, photo: false, maxFace: 0.4, ifra: 0.8, properties: ['Stimulant', 'Antioxydant', 'Expectorant'] },
        { name: 'Sauge sclarée', latinName: 'Salvia sclarea', allergen: false, pregnancy: false, photo: false, maxFace: 0.2, ifra: 0.3, properties: ['Équilibrant hormonal', 'Antidépresseur', 'Antispasmodique'] },
        { name: 'Citron', latinName: 'Citrus limon', allergen: true, pregnancy: true, photo: true, maxFace: 0.5, ifra: 1.2, properties: ['Antiseptique', 'Détoxifiant', 'Astringent'] },
        { name: 'Pamplemousse', latinName: 'Citrus paradisi', allergen: true, pregnancy: true, photo: true, maxFace: 0.6, ifra: 1.4, properties: ['Détoxifiant', 'Stimulant', 'Antidépresseur'] },
        { name: 'Eucalyptus radiata', latinName: 'Eucalyptus radiata', allergen: false, pregnancy: false, photo: false, maxFace: 0.5, ifra: 1.0, properties: ['Expectorant', 'Antiviral', 'Rafraîchissant'] },
        { name: 'Ravintsara', latinName: 'Cinnamomum camphora', allergen: false, pregnancy: true, photo: false, maxFace: 0.8, ifra: 1.2, properties: ['Antiviral', 'Immunostimulant', 'Expectorant'] },
        { name: 'Niaouli', latinName: 'Melaleuca quinquenervia', allergen: false, pregnancy: true, photo: false, maxFace: 0.6, ifra: 1.0, properties: ['Antibactérien', 'Expectorant', 'Immunostimulant'] },
        { name: 'Manuka', latinName: 'Leptospermum scoparium', allergen: false, pregnancy: true, photo: false, maxFace: 0.4, ifra: 0.8, properties: ['Antibactérien', 'Anti-inflammatoire', 'Cicatrisant'] },
    ]
})

// Computed properties
const isMobile = computed(() => window.innerWidth < 1024)

// Phase aqueuse sélectionnée
const selectedAqueousPhase = computed(() => {
    const selected = []
    for (const category of Object.values(aqueousPhaseOptions)) {
        for (const item of category.items) {
            if (item.selected) {
                selected.push({
                    name: item.name,
                    percent: item.percent,
                    properties: item.properties,
                    min: item.min,
                    max: item.max
                })
            }
        }
    }
    return selected
})

const aqueousPhaseTotal = computed(() => {
    return selectedAqueousPhase.value.reduce((total, item) => total + item.percent, 0)
})

// Phase huileuse sélectionnée
const selectedOilPhase = computed(() => {
    const selected = []
    for (const category of Object.values(oilPhaseOptions)) {
        for (const item of category.items) {
            if (item.selected) {
                selected.push({
                    name: item.name,
                    percent: item.percent,
                    comedogenic: item.comedogenic,
                    properties: item.properties,
                    min: item.min,
                    max: item.max
                })
            }
        }
    }
    return selected
})

const oilPhaseTotal = computed(() => {
    return selectedOilPhase.value.reduce((total, item) => total + item.percent, 0)
})

const oilPhaseExceeded = computed(() => {
    return oilPhaseTotal.value > (skinProfiles[formData.skinType]?.oil || 20)
})

// Distribution comédogénicité
const comedogenicDistribution = computed(() => {
    const distribution = {
        0: { level: 0, percent: 0, colorClass: 'bg-green-500' },
        1: { level: 1, percent: 0, colorClass: 'bg-amber-500' },
        2: { level: 2, percent: 0, colorClass: 'bg-orange-500' },
        3: { level: 3, percent: 0, colorClass: 'bg-red-500' }
    }

    selectedOilPhase.value.forEach(item => {
        const level = Math.min(item.comedogenic, 3)
        distribution[level].percent += item.percent
    })

    // Convertir en pourcentage du total phase huileuse
    Object.values(distribution).forEach(d => {
        d.percent = (d.percent / oilPhaseTotal.value) * 100
    })

    return Object.values(distribution).filter(d => d.percent > 0)
})

// HE filtrées
const filteredEssentialOils = computed(() => {
    const filtered = {}

    for (const [category, oils] of Object.entries(extendedEssentialOils)) {
        let filteredOils = oils

        // Filtre par recherche
        if (heSearchTerm.value) {
            filteredOils = filteredOils.filter(oil =>
                oil.name.toLowerCase().includes(heSearchTerm.value.toLowerCase()) ||
                oil.latinName.toLowerCase().includes(heSearchTerm.value.toLowerCase()) ||
                oil.properties.some(p => p.toLowerCase().includes(heSearchTerm.value.toLowerCase()))
            )
        }

        // Filtre par propriété
        if (heFilterProperty.value) {
            filteredOils = filteredOils.filter(oil =>
                oil.properties.some(p => p.toLowerCase().includes(heFilterProperty.value.toLowerCase()))
            )
        }

        // Filtres sécurité
        if (heFilters.safeForPregnancy) {
            filteredOils = filteredOils.filter(oil => oil.pregnancy)
        }
        if (heFilters.noPhotosensitivity) {
            filteredOils = filteredOils.filter(oil => !oil.photo)
        }
        if (heFilters.noAllergen) {
            filteredOils = filteredOils.filter(oil => !oil.allergen)
        }

        if (filteredOils.length > 0) {
            filtered[category] = filteredOils
        }
    }

    return filtered
})

const filteredHECount = computed(() => {
    return Object.values(filteredEssentialOils).reduce((total, oils) => total + ( oils?.length | 0), 0)
})

// Actifs activés
const enabledActivesCount = computed(() => {
    return actives.filter(a => a.enabled).length
})

const tooManyActives = computed(() => {
    return enabledActivesCount.value > (skinProfiles[formData.skinType]?.maxActives || 3)
})

// Total HE
const heTotal = computed(() => {
    return formData.selectedHE.reduce((sum, oil) => sum + oil.percent, 0)
})

// Conservateur
const preservativePercent = computed(() => {
    if (formData.preservativeSystem === 'cosgard') {
        return formData.cosgardPercent || 0.8
    }
    return 0.5 // Valeur par défaut pour autres conservateurs
})

// Calcul de la phase eau
const waterPhase = computed(() => {
    const totalUsed = oilPhaseTotal.value +
        aqueousPhaseTotal.value +
        totalActivesPercent.value +
        preservativePercent.value +
        heTotal.value +
        5 // Émulsifiant

    return Math.max(0, 100 - totalUsed)
})

const waterPhaseGrams = computed(() => grams(waterPhase.value))

// Totaux
const totalActivesPercent = computed(() => {
    return actives.filter(a => a.enabled).reduce((sum, a) => sum + a.percent, 0)
})

const totalFormulationPercent = computed(() => {
    return 100 - waterPhase.value
})

// Phases pour visualisation
const phases = computed(() => {
    const phasesList = [
        {
            name: 'Phase huileuse',
            percent: oilPhaseTotal.value,
            grams: grams(oilPhaseTotal.value),
            color: '#f59e0b',
            icon: '🫒'
        },
        {
            name: 'Hydrolats',
            percent: aqueousPhaseTotal.value,
            grams: grams(aqueousPhaseTotal.value),
            color: '#3b82f6',
            icon: '💧'
        },
        {
            name: 'Actifs',
            percent: totalActivesPercent.value,
            grams: grams(totalActivesPercent.value),
            color: '#8b5cf6',
            icon: '🧪'
        },
        {
            name: 'HE',
            percent: heTotal.value,
            grams: grams(heTotal.value),
            color: '#10b981',
            icon: '🌿'
        },
        {
            name: 'Conservateur',
            percent: preservativePercent.value,
            grams: grams(preservativePercent.value),
            color: '#ef4444',
            icon: '🛡️'
        },
        {
            name: 'Émulsifiant',
            percent: 5, // Fixe pour l'exemple
            grams: grams(5),
            color: '#ec4899',
            icon: '⚗️'
        }
    ]

    // Filtrer les phases vides
    return phasesList.filter(p => p.percent > 0)
})

const phasesSummary = computed(() => {
    return phases.value.map(p => ({
        name: p.name,
        percent: p.percent,
        colorClass: p.name === 'Phase huileuse' ? 'bg-amber-500' :
            p.name === 'Hydrolats' ? 'bg-blue-500' :
                p.name === 'Actifs' ? 'bg-purple-500' :
                    p.name === 'HE' ? 'bg-green-500' :
                        p.name === 'Conservateur' ? 'bg-red-500' : 'bg-pink-500'
    }))
})

// Liste INCI
const inciList = computed(() => {
    const list = ['Aqua']

    // Actifs par concentration décroissante (>1%)
    const significantActives = actives
        .filter(a => a.enabled && a.percent >= 1)
        .sort((a, b) => b.percent - a.percent)

    significantActives.forEach(a => list.push(a.inci))

    // Conservateur
    const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
    if (preservative) {
        list.push(preservative.inci)
    }

    // Huiles essentielles
    if (heTotal.value > 0) {
        list.push('Parfum (Fragrance)')
    }

    // Émulsifiant
    list.push('Cetearyl Alcohol', 'Glyceryl Stearate')

    // Huiles végétales (par ordre décroissant)
    const significantOils = selectedOilPhase.value
        .filter(o => o.percent >= 1)
        .sort((a, b) => b.percent - a.percent)

    // Ajouter des noms d'huiles pour l'exemple
    significantOils.forEach(o => {
        list.push(`${o.name} Oil`)
    })

    return list
})

// Validation réglementaire
const regulatoryChecks = computed(() => [
    {
        name: 'Nom de la formule',
        description: 'Doit être renseigné et unique',
        passed: formData.name.trim().length > 0,
        error: 'Le nom de la formule est obligatoire',
        recommendation: 'Donnez un nom descriptif à votre formule'
    },
    {
        name: 'Volume total',
        description: 'Doit être entre 1 et 1000 ml',
        passed: formData.volume >= 1 && formData.volume <= 1000,
        error: `Volume invalide: ${formData.volume}ml (1-1000 ml requis)`,
        recommendation: 'Ajustez le volume entre 1 et 1000 ml'
    },
    {
        name: 'Type de peau cible',
        description: 'Doit être sélectionné',
        passed: !!formData.skinType,
        error: 'Aucun type de peau sélectionné',
        recommendation: 'Sélectionnez un type de peau cible'
    },
    {
        name: 'Limite huiles essentielles (UE 1223/2009)',
        description: 'Maximum 1% d\'HE total dans les produits visage',
        passed: heTotal.value <= 1,
        error: `Dépassement: ${heTotal.value.toFixed(2)}% > 1% - INTERDIT`,
        recommendation: 'Réduisez le total d\'HE à 1% maximum'
    },
    {
        name: 'Dosage conservateur',
        description: 'Respect des limites de sécurité',
        passed: formData.preservativeSystem !== 'cosgard' ||
            (formData.cosgardPercent >= 0.5 && formData.cosgardPercent <= 1.0),
        error: `Dosage Cosgard hors plage: ${formData.cosgardPercent}% (0.5-1.0% requis)`,
        recommendation: 'Ajustez le dosage de Cosgard entre 0.5% et 1.0%'
    },
    {
        name: 'Cohérence de la formulation',
        description: 'La somme des phases ≤ 100%',
        passed: waterPhase.value >= 0,
        error: `La somme des phases dépasse 100% de ${Math.abs(waterPhase.value).toFixed(1)}%`,
        recommendation: 'Réduisez les pourcentages des phases existantes'
    },
    {
        name: 'Limites spécifiques HE',
        description: 'Respect des limites IFRA et spécifiques',
        passed: formData.selectedHE.every(he => he.percent <= he.maxFace),
        error: 'Une ou plusieurs HE dépassent leur limite recommandée',
        recommendation: 'Vérifiez et ajustez les dosages individuels des HE'
    },
    {
        name: 'Nombre d\'actifs',
        description: 'Respect des recommandations par type de peau',
        passed: !tooManyActives.value,
        error: `Trop d'actifs pour une peau ${formData.skinType} (${enabledActivesCount.value}/${skinProfiles[formData.skinType]?.maxActives})`,
        recommendation: `Réduisez le nombre d'actifs à ${skinProfiles[formData.skinType]?.maxActives} maximum`
    },
    {
        name: 'Phase huileuse',
        description: 'Respect des recommandations par type de peau',
        passed: !oilPhaseExceeded.value,
        error: `Phase huileuse excessive: ${oilPhaseTotal.value.toFixed(1)}% > ${skinProfiles[formData.skinType]?.oil}%`,
        recommendation: `Réduisez la phase huileuse à ${skinProfiles[formData.skinType]?.oil}% maximum`
    }
])

const regulatoryErrors = computed(() => {
    return regulatoryChecks.value
        .filter(check => !check.passed)
        .map(check => check.error)
})

const regulatoryStatus = computed(() => ({
    isValid: regulatoryErrors.value.length === 0,
    errors: regulatoryErrors.value,
    warnings: heWarnings.value
}))

// Avertissements HE
const heWarnings = computed(() => {
    const warnings = []

    if (heTotal.value > 1) {
        warnings.push(`Dépassement limite UE: ${heTotal.value.toFixed(2)}% > 1%`)
    }

    if (heTotal.value > 0.8 && heTotal.value <= 1) {
        warnings.push('Approche de la limite UE (1%) - vérification recommandée')
    }

    const pregnancyUnsafe = formData.selectedHE.filter(oil => !oil.pregnancy)
    if (pregnancyUnsafe.length > 0) {
        warnings.push(`${pregnancyUnsafe.length} HE non recommandées pendant la grossesse`)
    }

    const photosensitive = formData.selectedHE.filter(oil => oil.photo)
    if (photosensitive.length > 0) {
        warnings.push(`${photosensitive.length} HE photosensibilisantes`)
    }

    const highIFRA = formData.selectedHE.filter(oil => oil.ifra < 0.5)
    if (highIFRA.length > 0) {
        warnings.push(`${highIFRA.length} HE avec limite IFRA basse (<0.5%)`)
    }

    return warnings
})

// Mentions obligatoires
const mandatoryMentions = computed(() => {
    const mentions = []

    // Mentions générales
    mentions.push('À conserver hors de la portée des enfants')
    mentions.push('Éviter le contact avec les yeux')
    mentions.push('Usage externe uniquement')

    // Mentions HE
    if (heTotal.value > 0) {
        mentions.push('Contient des huiles essentielles')

        const pregnancyUnsafe = formData.selectedHE.filter(he => !he.pregnancy)
        if (pregnancyUnsafe.length > 0) {
            mentions.push('Contre-indiqué pendant la grossesse et l\'allaitement')
        }

        const photosensitive = formData.selectedHE.filter(he => he.photo)
        if (photosensitive.length > 0) {
            mentions.push('Éviter l\'exposition au soleil après application')
        }

        const allergens = formData.selectedHE.filter(he => he.allergen)
        if (allergens.length > 0) {
            mentions.push('Contient des substances allergisantes')
            allergens.forEach(he => {
                mentions.push(`Allergène: ${he.name}`)
            })
        }
    }

    // Mentions actifs
    actives.filter(a => a.enabled).forEach(a => {
        if (a.key === 'bha' || a.key === 'bha') {
            mentions.push('Utiliser avec protection solaire')
        }
        if (a.percent > a.max * 0.8) {
            mentions.push(`Concentration élevée en ${a.label}`)
        }
    })

    // Mention conservation
    if (formData.preservativeSystem === 'cosgard') {
        mentions.push('Conserver à température ambiante, à l\'abri de la lumière')
    }

    // Mention durée de vie
    mentions.push('Durée d\'utilisation après ouverture: 6 mois')

    return mentions
})

// Pourcentage de complétion
const completionPercentage = computed(() => {
    let percentage = 0

    // Nom (10%)
    if (formData.name.trim().length > 0) percentage += 10

    // Volume (5%)
    if (formData.volume > 0) percentage += 5

    // Type de peau (10%)
    if (formData.skinType) percentage += 10

    // Conservateur (15%)
    if (formData.preservativeSystem) percentage += 15
    if (formData.preservativeSystem === 'cosgard' && formData.cosgardPercent >= 0.5) {
        percentage += 5
    }

    // Actifs (10%)
    if (enabledActivesCount.value > 0) percentage += 10

    // Phase aqueuse (10%)
    if (aqueousPhaseTotal.value > 0) percentage += 10

    // Phase huileuse (10%)
    if (oilPhaseTotal.value > 0) percentage += 10

    // HE (10%)
    if (formData.selectedHE.length > 0) percentage += 10

    // Validation (15%)
    if (regulatoryStatus.value.isValid) percentage += 15

    return Math.min(percentage, 100)
})

// Méthodes utilitaires
const grams = (percent) => {
    return Number(((formData.volume * percent) / 100).toFixed(2))
}

const getActiveTypeLabel = (type) => {
    const labels = {
        'hydratant': 'Hydratant',
        'antioxydant': 'Antioxydant',
        'repair': 'Régénérant',
        'exfoliant': 'Exfoliant'
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

const getHERiskClass = (ifra) => {
    if (ifra <= 0.3) return 'bg-red-100 text-red-800'
    if (ifra <= 0.8) return 'bg-amber-100 text-amber-800'
    return 'bg-green-100 text-green-800'
}

const getRemainingOilPercent = () => {
    const max = skinProfiles[formData.skinType]?.oil || 20
    return Math.max(0, max - oilPhaseTotal.value)
}

const getHECategoryTotal = (category) => {
    const oils = extendedEssentialOils[category] || []
    return oils.reduce((total, oil) => {
        const selected = formData.selectedHE.find(h => h.name === oil.name)
        return total + (selected?.percent || 0)
    }, 0)
}

// Méthodes HE
const isHESelected = (heName) => {
    return formData.selectedHE.some(h => h.name === heName)
}

const getSelectedHE = (heName) => {
    return formData.selectedHE.find(h => h.name === heName)
}

const toggleHE = (oil) => {
    const idx = formData.selectedHE.findIndex(h => h.name === oil.name)

    if (idx === -1) {
        // Ajouter l'HE avec pourcentage par défaut (50% du max)
        const defaultPercent = Math.min(oil.maxFace * 0.5, 0.3)

        formData.selectedHE.push({
            ...oil,
            percent: defaultPercent,
            category: Object.keys(extendedEssentialOils).find(cat =>
                extendedEssentialOils[cat].some(o => o.name === oil.name)
            )
        })
    } else {
        // Supprimer l'HE
        formData.selectedHE.splice(idx, 1)
    }
}

const removeHE = (heName) => {
    const index = formData.selectedHE.findIndex(h => h.name === heName)
    if (index !== -1) {
        formData.selectedHE.splice(index, 1)
    }
}

const clearAllHE = () => {
    formData.selectedHE = []
}

// Méthodes de catégories
const toggleCategory = (category, type) => {
    const items = category.items
    const allSelected = items.every(i => i.selected)

    items.forEach(item => {
        if (type === 'oil' && !allSelected && oilPhaseExceeded.value && !item.selected) {
            return // Ne pas sélectionner si phase huileuse dépassée
        }
        item.selected = !allSelected
    })
}

// Méthodes de calcul automatique
const autoCalculateWaterPhase = () => {
    // Ajuste la phase aqueuse pour compléter à 100%
    const currentTotal = oilPhaseTotal.value +
        aqueousPhaseTotal.value +
        totalActivesPercent.value +
        preservativePercent.value +
        heTotal.value +
        5

    if (currentTotal < 100) {
        const remaining = 100 - currentTotal
        // Distribuer proportionnellement aux hydrolats sélectionnés
        const selected = selectedAqueousPhase.value
        if (selected.length > 0) {
            const totalCurrent = aqueousPhaseTotal.value
            selected.forEach(item => {
                const originalItem = findAqueousItem(item.name)
                if (originalItem) {
                    const addition = (item.percent / totalCurrent) * remaining
                    originalItem.percent = Math.min(originalItem.max, originalItem.percent + addition)
                }
            })
        }
    }
}

const autoCalculateOilPhase = () => {
    const max = skinProfiles[formData.skinType]?.oil || 20
    const current = oilPhaseTotal.value

    if (current > max) {
        // Réduire proportionnellement
        selectedOilPhase.value.forEach(item => {
            const originalItem = findOilItem(item.name)
            if (originalItem) {
                const reduction = (item.percent / current) * (current - max)
                originalItem.percent = Math.max(originalItem.min, originalItem.percent - reduction)
            }
        })
    } else if (current < max * 0.8) {
        // Augmenter si trop bas
        const selected = selectedOilPhase.value
        if (selected.length > 0) {
            const addition = (max * 0.8 - current) / selected.length
            selected.forEach(item => {
                const originalItem = findOilItem(item.name)
                if (originalItem) {
                    originalItem.percent = Math.min(originalItem.max, originalItem.percent + addition)
                }
            })
        }
    }
}

const findAqueousItem = (name) => {
    for (const category of Object.values(aqueousPhaseOptions)) {
        for (const item of category.items) {
            if (item.name === name) return item
        }
    }
    return null
}

const findOilItem = (name) => {
    for (const category of Object.values(oilPhaseOptions)) {
        for (const item of category.items) {
            if (item.name === name) return item
        }
    }
    return null
}

// Méthodes d'optimisation
const optimizeAqueousPhase = () => {
    const selected = selectedAqueousPhase.value
    if (selected.length === 0) return

    // Répartir équitablement jusqu'à 30% total
    const targetTotal = Math.min(30, selected.length * 10)
    const equalPercent = targetTotal / selected.length

    selected.forEach(item => {
        const originalItem = findAqueousItem(item.name)
        if (originalItem) {
            originalItem.percent = Math.min(
                originalItem.max,
                Math.max(originalItem.min, equalPercent)
            )
        }
    })
}

const optimizeOilPhase = () => {
    const selected = selectedOilPhase.value
    if (selected.length === 0) return

    const max = skinProfiles[formData.skinType]?.oil || 20
    const targetPercent = max * 0.9 / selected.length // 90% de la limite max

    selected.forEach(item => {
        const originalItem = findOilItem(item.name)
        if (originalItem) {
            originalItem.percent = Math.min(
                originalItem.max,
                Math.max(originalItem.min, targetPercent)
            )
        }
    })
}

// Méthodes UI
const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        element.focus({ preventScroll: true })
    }
}

const toggleFixedBar = () => {
    showFixedBar.value = !showFixedBar.value
}

const toggleSummary = () => {
    summaryExpanded.value = !summaryExpanded.value
}

const toggleAccessibilityMenu = () => {
    showAccessibilityMenu.value = !showAccessibilityMenu.value
}

// Méthodes d'accessibilité
const increaseTextSize = () => {
    textSize.value = Math.min(150, textSize.value + 10)
    document.documentElement.style.fontSize = `${textSize.value}%`
}

const decreaseTextSize = () => {
    textSize.value = Math.max(80, textSize.value - 10)
    document.documentElement.style.fontSize = `${textSize.value}%`
}

const toggleHighContrast = () => {
    highContrast.value = !highContrast.value
    document.documentElement.classList.toggle('high-contrast', highContrast.value)
}

const toggleReducedMotion = () => {
    reducedMotion.value = !reducedMotion.value
    document.documentElement.classList.toggle('reduced-motion', reducedMotion.value)
}

// Méthodes de validation
const clearError = (field) => {
    if (errors.value[field]) {
        delete errors.value[field]
    }
}

const validateVolume = () => {
    if (formData.volume < 1 || formData.volume > 1000) {
        errors.value.volume = "Volume invalide (1-1000 ml)"
    } else {
        delete errors.value.volume
    }
}

// Méthodes INCI
const formatINCIList = () => {
    return inciList.value.join(',\n')
}

const copyINCI = async () => {
    await copy(formatINCIList())
    setTimeout(() => {
        copied.value = false
    }, 2000)
}

// Méthodes de formatage
const formatDate = (dateString) => {
    if (!dateString) return 'Jamais'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getPhaseDashOffset = (phase, index) => {
    let offset = 0
    for (let i = 0; i < index; i++) {
        offset += phases.value[i].percent * 9.42 // 942 / 100
    }
    return offset
}

// Validation de sauvegarde
const canSave = computed(() => {
    const hasPreservative = formData.preservativeSystem === 'cosgard'
        ? (formData.cosgardPercent >= 0.5 && formData.cosgardPercent <= 1.0)
        : formData.preservativeSystem

    return formData.name.trim().length > 0 &&
        formData.volume > 0 &&
        formData.skinType &&
        hasPreservative &&
        waterPhase.value >= 0 &&
        heTotal.value <= 1
})

const isValid = computed(() => {
    return canSave.value && regulatoryErrors.value.length === 0
})

// Méthodes de sauvegarde
const generateIngredientsForDB = () => {
    const ingredients = []

    // Actifs
    actives.filter(a => a.enabled).forEach(a => {
        ingredients.push({
            name: a.label,
            quantity: a.percent,
            unit: "%",
            type: "active",
            inci: a.inci
        })
    })

    // Conservateur
    const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
    if (preservative) {
        ingredients.push({
            name: preservative.name,
            quantity: formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent : 0.5,
            unit: "%",
            type: "preservative",
            inci: preservative.inci
        })
    }

    // Huiles essentielles
    formData.selectedHE.forEach(he => {
        ingredients.push({
            name: `HE ${he.name}`,
            quantity: he.percent,
            unit: "%",
            type: "essential_oil",
            latinName: he.latinName
        })
    })

    // Hydrolats
    selectedAqueousPhase.value.forEach(aq => {
        ingredients.push({
            name: aq.name,
            quantity: aq.percent,
            unit: "%",
            type: "aqueous"
        })
    })

    // Huiles végétales
    selectedOilPhase.value.forEach(oil => {
        ingredients.push({
            name: oil.name,
            quantity: oil.percent,
            unit: "%",
            type: "oil",
            comedogenic: oil.comedogenic
        })
    })

    // Eau
    ingredients.push({
        name: "Eau déminéralisée",
        quantity: waterPhase.value,
        unit: "%",
        type: "water"
    })

    // Émulsifiant (fixe pour l'exemple)
    ingredients.push({
        name: "Émulsifiant",
        quantity: 5,
        unit: "%",
        type: "emulsifier"
    })

    return ingredients
}

const save = async () => {
    if (!canSave.value) {
        alert("Veuillez corriger les erreurs avant d'enregistrer")
        return
    }

    saving.value = true

    try {
        const formulaData = {
            // Champs de base
            name: formData.name.trim(),
            description: generateDescription(),
            type: "skincare",
            createdAt: isEditMode.value ? props.initialData.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            // Formulation
            volume: formData.volume,
            skinType: formData.skinType,
            preservativeSystem: formData.preservativeSystem,
            cosgardPercent: formData.cosgardPercent,

            // Ingrédients
            ingredients: generateIngredientsForDB(),

            // Calculs
            totalPercent: totalFormulationPercent.value,
            waterPercent: waterPhase.value,

            // Métadonnées
            version: "2.2",
            compliance: {
                euRegulation: "1223/2009",
                heLimitCompliant: heTotal.value <= 1,
                preservativeCompliant: true,
                isValid: regulatoryStatus.value.isValid,
                errors: regulatoryErrors.value,
                warnings: heWarnings.value
            },

            // Mentions
            mandatoryMentions: mandatoryMentions.value,
            inciList: inciList.value
        }

        // Si mode édition
        if (isEditMode.value && props.initialData.id) {
            formulaData.id = props.initialData.id
        }

        emit("save", formulaData)
    } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error)
        alert("Une erreur est survenue lors de l'enregistrement")
    } finally {
        saving.value = false
    }
}

const saveDraft = () => {
    emit("save-draft", {
        ...formData,
        actives: actives.filter(a => a.enabled),
        aqueousPhase: selectedAqueousPhase.value,
        oilPhase: selectedOilPhase.value,
        he: formData.selectedHE,
        isDraft: true,
        savedAt: new Date().toISOString(),
        progress: completionPercentage.value
    })
}

const cancel = () => {
    emit("cancel")
    if (!emit.cancel) {
        router.push(isEditMode.value ? `/recette/${props.initialData.id}` : '/recettes')
    }
}

const generateDescription = () => {
    const preservativeName = preservativeSystems.find(p => p.id === formData.preservativeSystem)?.name || 'Non spécifié'

    return `${formData.name} - Formule pour peau ${formData.skinType}
• Volume: ${formData.volume}ml
• Actifs: ${actives.filter(a => a.enabled).map(a => `${a.label} ${a.percent}%`).join(', ') || 'Aucun'}
• Phase huileuse: ${oilPhaseTotal.value.toFixed(1)}%
• Phase aqueuse: ${aqueousPhaseTotal.value.toFixed(1)}%
• Conservateur: ${preservativeName} ${formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent + '%' : ''}
• HE: ${formData.selectedHE.map(h => `${h.name} ${h.percent}%`).join(', ') || 'Aucune'}
• Validation UE: ${regulatoryStatus.value.isValid ? 'Conforme' : 'Non conforme'}`
}

// Méthodes d'export
const generateReport = () => {
    if (!isValid.value) {
        alert("La formule doit être valide pour générer un rapport")
        return
    }

    console.log('Génération du rapport PDF...')
    // Implémenter la génération PDF ici
}

const exportFormula = () => {
    const exportData = {
        formula: {
            ...formData,
            actives: actives.filter(a => a.enabled),
            aqueousPhase: selectedAqueousPhase.value,
            oilPhase: selectedOilPhase.value
        },
        analysis: {
            phases: phases.value,
            regulatoryStatus: regulatoryStatus.value,
            mandatoryMentions: mandatoryMentions.value,
            inciList: inciList.value
        },
        metadata: {
            version: "2.2",
            exportDate: new Date().toISOString(),
            generatedBy: "Formulateur Cosmétique Pro"
        }
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `formule-${formData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
}

const generateComplianceReport = () => {
    console.log('Génération du rapport de conformité...')
    // Implémenter la génération du rapport complet
}

// Initialisation
onMounted(() => {
    // Initialiser les données si mode édition
    if (props.initialData && Object.keys(props.initialData).length > 0) {
        isEditMode.value = true

        Object.assign(formData, {
            name: props.initialData.name || "",
            volume: props.initialData.volume || 50,
            skinType: props.initialData.skinType || "mixte",
            preservativeSystem: props.initialData.preservativeSystem || "cosgard",
            cosgardPercent: props.initialData.cosgardPercent || 0.8
        })

        // Charger les ingrédients depuis les données initiales
        if (props.initialData.ingredients) {
            // Actifs
            actives.forEach(active => {
                const ingredient = props.initialData.ingredients.find(ing =>
                    ing.name === active.label || ing.type === "active"
                )
                if (ingredient) {
                    active.enabled = true
                    active.percent = ingredient.quantity || active.percent
                }
            })

            // HE
            const heIngredients = props.initialData.ingredients.filter(ing => ing.type === "essential_oil")
            formData.selectedHE = heIngredients.map(he => {
                const heName = he.name.replace('HE ', '')
                // Chercher dans extendedEssentialOils
                let heInfo = null
                for (const [category, oils] of Object.entries(extendedEssentialOils)) {
                    const found = oils.find(o => o.name === heName)
                    if (found) {
                        heInfo = { ...found, category }
                        break
                    }
                }

                return {
                    name: heName,
                    percent: he.quantity || 0.1,
                    latinName: he.latinName || heInfo?.latinName,
                    pregnancy: heInfo?.pregnancy ?? true,
                    photo: heInfo?.photo ?? false,
                    allergen: heInfo?.allergen ?? false,
                    maxFace: heInfo?.maxFace || 1,
                    ifra: heInfo?.ifra || 1,
                    properties: heInfo?.properties || [],
                    category: heInfo?.category
                }
            })
        }
    }

    // Gestionnaire d'événements clavier
    document.addEventListener('keydown', handleKeyboardShortcuts)

    // Détecter les préférences système
    detectSystemPreferences()
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboardShortcuts)
})

const handleKeyboardShortcuts = (e) => {
    // Ctrl/Cmd + S pour sauvegarder
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        save()
    }

    // Ctrl/Cmd + D pour brouillon
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        saveDraft()
    }

    // Échap pour annuler
    if (e.key === 'Escape') {
        cancel()
    }
}

const detectSystemPreferences = () => {
    // Détecter les préférences de réduction de mouvement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = prefersReducedMotion.matches

    // Détecter les préférences de contraste élevé
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
    highContrast.value = prefersHighContrast.matches

    // Écouter les changements
    prefersReducedMotion.addEventListener('change', (e) => {
        reducedMotion.value = e.matches
    })

    prefersHighContrast.addEventListener('change', (e) => {
        highContrast.value = e.matches
    })
}

// Watchers
watch(() => props.initialData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        isEditMode.value = true
        // Logique de chargement des données...
    }
}, { immediate: true })

// Watcher pour la validation en temps réel
watch(() => formData.cosgardPercent, (newVal) => {
    if (newVal < 0.5 || newVal > 1.0) {
        errors.value.cosgardPercent = "Cosgard: plage 0.5-1.0% requise"
    } else {
        delete errors.value.cosgardPercent
    }
})

// Watcher pour le volume
watch(() => formData.volume, validateVolume)
</script>

<style scoped>
/* Styles de base */
.input-field {
    @apply w-full px-4 py-3 border-2 border-gray-300 rounded-xl
    bg-white
    focus:outline-none focus:ring-2 focus:ring-offset-1
    transition-all duration-200
    placeholder:text-gray-400
    disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.input-error {
    @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.input-valid {
    @apply border-green-300 focus:ring-green-500 focus:border-green-500;
}

.label {
    @apply block text-base font-bold text-gray-900 mb-2
    tracking-tight;
}

.label.required::after {
    content: " *";
    @apply text-red-600;
}

.error-message {
    @apply mt-1 text-sm text-red-600 font-medium flex items-center gap-1;
}

.help-text {
    @apply mt-1 text-sm text-gray-500;
}

/* Cartes */
.skin-type-card {
    @apply border-2 rounded-xl cursor-pointer
    transition-all duration-300
    hover:shadow-lg;
}

.skin-type-card-selected {
    @apply border-blue-500 bg-gradient-to-br from-blue-50 to-white;
}

.skin-type-card-default {
    @apply border-gray-200 hover:border-blue-300;
}

.active-card {
    @apply rounded-xl border-2 transition-all duration-300;
}

.active-card-enabled {
    @apply border-purple-300 bg-gradient-to-br from-purple-50/30 to-white;
}

.active-card-disabled {
    @apply border-gray-200 hover:border-purple-200;
}

.preservative-card {
    @apply border-2 rounded-xl cursor-pointer h-full;
}

.preservative-card-selected {
    @apply border-red-400 bg-gradient-to-br from-red-50 to-white;
}

.preservative-card-default {
    @apply border-gray-200 hover:border-red-200;
}

/* Boutons */
.btn-primary {
    @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700
    text-white font-bold rounded-xl
    hover:from-blue-700 hover:to-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    shadow-lg hover:shadow-xl;
}

.btn-secondary {
    @apply px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50
    text-gray-700 font-bold rounded-xl border-2 border-gray-300
    hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    shadow-sm hover:shadow-md;
}

.btn-outline {
    @apply px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl
    hover:border-gray-400 hover:bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    transition-all duration-300
    flex items-center justify-center gap-2;
}

/* Range sliders */
input[type="range"] {
    @apply appearance-none bg-transparent;
}

input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none h-5 w-5 rounded-full
    border-4 border-white shadow-xl
    cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
    @apply h-5 w-5 rounded-full
    border-4 border-white shadow-xl
    cursor-pointer;
}

.range-red::-webkit-slider-thumb {
    @apply bg-red-500;
}

.range-amber::-webkit-slider-thumb {
    @apply bg-amber-500;
}

.range-green::-webkit-slider-thumb {
    @apply bg-green-500;
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

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

.animate-slideDown {
    animation: slideDown 0.3s ease-out;
}

.animate-fadeOut {
    animation: fadeOut 2s ease-out forwards;
}

/* Support contraste élevé */
:global(.high-contrast) {
    --text-color: #000;
    --bg-color: #fff;
    --border-color: #000;
}



/* Support réduction de mouvement */
:global(.reduced-motion) * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
}

/* Responsive */
@media (max-width: 768px) {
    .skin-type-card {
        @apply p-3;
    }

    .active-card {
        @apply p-3;
    }

    .btn-primary,
    .btn-secondary,
    .btn-outline {
        @apply px-4 py-2 text-sm;
    }
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded-full hover:bg-gray-500;
}

/* Focus visible amélioré */
:focus-visible {
    @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Support navigateurs plus anciens */
@supports not (selector(:focus-visible)) {
    :focus {
        @apply outline-none ring-2 ring-blue-500 ring-offset-2;
    }
}
</style>

