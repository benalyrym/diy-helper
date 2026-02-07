<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-8">
    <!-- Navigation d'accessibilité -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white p-3 rounded-lg z-50">
      Passer au contenu principal
    </a>

    <div class=" mx-auto space-y-8" role="application" aria-label="Formulation d'après-shampoing">
      <!-- En-tête -->
      <header class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-100">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <!-- Titre principal -->
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-2">
              <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg" role="img" aria-label="Icone après-shampoing">
                <span class="text-2xl text-white">💆‍♀️</span>
              </div>
              <div>
                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
                  Formulateur Après-Shampoing Pro
                </h1>
                <p class="text-gray-600 mt-2 max-w-2xl">
                  Outil de formulation capillaire conforme au Règlement UE 1223/2009
                  <a href="https://eur-lex.europa.eu/eli/reg/2009/1223/oj"
                     target="_blank"
                     rel="noopener noreferrer"
                     class="text-indigo-600 hover:text-indigo-800 underline ml-1 font-medium"
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
                   class="text-xs px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                <span class="text-lg font-bold text-indigo-600">{{ completionPercentage }}%</span>
                <span class="text-xs text-gray-500">complété</span>
              </div>
            </div>
            <button @click="toggleAccessibilityMenu"
                    class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-3 py-1"
                    aria-label="Options d'accessibilité">
              <span>♿</span>
              <span>Accessibilité</span>
            </button>
          </div>

          <div class="relative">
            <div class="w-full h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
              <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 transition-all duration-1000 ease-out shadow-md"
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
                                     completionPercentage >= mark.percent ? 'bg-white border-indigo-600 shadow-md' : 'bg-gray-300 border-gray-300'
                                 ]"
                   :title="`${mark.percent}% - ${mark.label}`">
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Menu d'accessibilité -->
      <div v-if="showAccessibilityMenu"
           class="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-indigo-200 animate-slideDown">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span class="text-indigo-600">♿</span>
            Options d'accessibilité
          </h2>
          <button @click="toggleAccessibilityMenu"
                  class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                  aria-label="Fermer les options d'accessibilité">
            <span class="text-2xl">×</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button @click="increaseTextSize"
                  class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Augmenter la taille du texte">
            <span class="text-2xl mb-2">🔍</span>
            <span class="font-medium">Agrandir le texte</span>
            <span class="text-sm text-gray-500">A+</span>
          </button>

          <button @click="decreaseTextSize"
                  class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Réduire la taille du texte">
            <span class="text-2xl mb-2">🔎</span>
            <span class="font-medium">Réduire le texte</span>
            <span class="text-sm text-gray-500">A-</span>
          </button>

          <button @click="toggleHighContrast"
                  class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Activer le contraste élevé">
            <span class="text-2xl mb-2">⚫</span>
            <span class="font-medium">Contraste élevé</span>
            <span class="text-sm text-gray-500">{{ highContrast ? 'ON' : 'OFF' }}</span>
          </button>

          <button @click="toggleReducedMotion"
                  class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <span class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">📋</span>
                <span>Résumé</span>
              </h2>
              <button @click="toggleSummary"
                      class="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
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
                    <span class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">Obligatoire</span>
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
                    <div class="p-3 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg">
                      <p class="text-lg font-bold text-indigo-700">{{ formData.volume }} ml</p>
                    </div>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500 block mb-1">Type de cheveux</span>
                    <div class="p-3 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg">
                      <p class="text-lg font-bold text-purple-700 capitalize">{{ formData.hairType || '—' }}</p>
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
                  <span class="text-emerald-600">⚖️</span>
                  Composition
                </h3>
                <div class="space-y-2">
                  <div v-for="component in formulationSummary" :key="component.name" class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">{{ component.name }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold">{{ component.percent }}%</span>
                      <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             :class="component.colorClass"
                             :style="{ width: `${component.percent}%` }">
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
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
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
              <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">📝</span>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Informations de base</h2>
                <p class="text-gray-600">Définissez les caractéristiques principales de votre après-shampoing</p>
                <div class="mt-2 text-sm text-indigo-600 font-medium">
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
                         placeholder="Ex: Après-shampoing réparateur cheveux colorés"
                         :class="['input-field pl-10', errors.name ? 'input-error' : 'input-valid']"
                         required
                         aria-required="true"
                         aria-describedby="name-help name-error"
                         @input="clearError('name')">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        💆‍♀️
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
                         min="100"
                         max="1000"
                         step="50"
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
                            @click="formData.volume = 250"
                            class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                      250ml
                    </button>
                    <button type="button"
                            @click="formData.volume = 500"
                            class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                      500ml
                    </button>
                    <button type="button"
                            @click="formData.volume = 750"
                            class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                      750ml
                    </button>
                  </div>
                </div>
                <p id="volume-help" class="help-text">
                  Volume final du produit. Recommandé: 250-750 ml pour usage familial
                </p>
              </div>

              <!-- Type de cheveux -->
              <div class="lg:col-span-2 space-y-4">
                <div class="flex items-center justify-between">
                  <legend class="label required">
                    Type de cheveux cible *
                  </legend>
                  <span class="text-sm text-gray-500">
                                        Sélectionnez un seul profil
                                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup" aria-label="Types de cheveux">
                  <label v-for="profile in hairProfilesOptions"
                         :key="profile.value"
                         :class="[
                                               'hair-type-card relative overflow-hidden',
                                               formData.hairType === profile.value
                                                   ? 'hair-type-card-selected ring-2 ring-offset-2'
                                                   : 'hair-type-card-default'
                                           ]"
                         :style="{ '--ring-color': profile.color }">
                    <input type="radio"
                           v-model="formData.hairType"
                           :value="profile.value"
                           class="sr-only"
                           required
                           :aria-labelledby="`hair-label-${profile.value}`"
                           :aria-describedby="`hair-desc-${profile.value}`">

                    <div class="p-4">
                      <div class="flex items-center gap-3 mb-3">
                        <span class="text-3xl" :aria-label="profile.iconLabel">{{ profile.icon }}</span>
                        <div>
                          <h3 :id="`hair-label-${profile.value}`" class="font-bold text-gray-900 capitalize">
                            {{ profile.label }}
                          </h3>
                          <p class="text-xs text-gray-500">Phase grasse: {{ profile.oil }}% max</p>
                        </div>
                      </div>

                      <p :id="`hair-desc-${profile.value}`" class="text-sm text-gray-600 mb-3">
                        {{ profile.description }}
                      </p>

                      <div class="space-y-2">
                        <div class="flex justify-between text-xs">
                          <span class="text-gray-500">Actifs max:</span>
                          <span class="font-semibold">{{ profile.maxActives }}</span>
                        </div>
                        <div class="flex justify-between text-xs">
                          <span class="text-gray-500">Viscosité:</span>
                          <span class="font-semibold">{{ profile.viscosity }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Indicateur de sélection -->
                    <div v-if="formData.hairType === profile.value"
                         class="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm">✓</span>
                    </div>
                  </label>
                </div>

                <!-- Description détaillée du type sélectionné -->
                <div v-if="selectedHairProfile"
                     class="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div class="flex items-start gap-3">
                    <span class="text-indigo-600 text-xl mt-1">💡</span>
                    <div>
                      <h4 class="font-semibold text-indigo-900 mb-2">Conseils pour cheveux {{ selectedHairProfile.label }}</h4>
                      <ul class="text-sm text-indigo-800 space-y-1">
                        <li v-for="(tip, index) in selectedHairProfile.tips" :key="index" class="flex items-start gap-2">
                          <span class="text-indigo-500">•</span>
                          <span>{{ tip }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 2: Actifs capillaires -->
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
                    <p class="text-gray-600">Infusions et hydrolats - Base de votre après-shampoing</p>
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

            <!-- Sélection des infusions -->
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

                <!-- Grille d'infusions -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="infusion in category.items"
                       :key="infusion.name"
                       :class="[
                                             'rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-1',
                                             infusion.selected
                                                 ? 'bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 shadow-md'
                                                 : 'bg-white border border-gray-200 hover:border-blue-200'
                                         ]">
                    <div class="flex items-start gap-3">
                      <!-- Checkbox -->
                      <div class="flex items-center h-6 pt-1">
                        <input :id="`aq-${infusion.name}`"
                               type="checkbox"
                               v-model="infusion.selected"
                               class="h-5 w-5 rounded border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      </div>

                      <!-- Contenu -->
                      <div class="flex-1">
                        <!-- En-tête -->
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <label :for="`aq-${infusion.name}`"
                                   class="font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                              {{ infusion.name }}
                            </label>
                            <p class="text-xs text-gray-500 mt-1">
                              {{ infusion.description }}
                            </p>
                          </div>

                          <!-- Indicateur de dosage -->
                          <div v-if="infusion.selected"
                               class="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                            {{ infusion.percent }}%
                          </div>
                        </div>

                        <!-- Dosage -->
                        <div v-if="infusion.selected" class="mt-4 space-y-3">
                          <div>
                            <label :for="`aq-percent-${infusion.name}`"
                                   class="block text-xs font-medium text-gray-700 mb-1">
                              Dosage (%)
                            </label>
                            <div class="flex items-center gap-2">
                              <div class="relative flex-1">
                                <input :id="`aq-percent-${infusion.name}`"
                                       type="number"
                                       v-model.number="infusion.percent"
                                       :min="infusion.min"
                                       :max="infusion.max"
                                       step="0.1"
                                       class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                                    %
                                                                </span>
                              </div>
                              <span class="text-xs text-gray-500 min-w-16 text-right">
                                                                {{ grams(infusion.percent) }} g
                                                            </span>
                            </div>
                          </div>

                          <!-- Slider pour dosage -->
                          <div class="space-y-1">
                            <div class="flex justify-between text-xs">
                              <span class="text-gray-500">Min: {{ infusion.min }}%</span>
                              <span class="text-blue-600 font-medium">Recommandé</span>
                              <span class="text-gray-500">Max: {{ infusion.max }}%</span>
                            </div>
                            <input type="range"
                                   v-model.number="infusion.percent"
                                   :min="infusion.min"
                                   :max="infusion.max"
                                   step="0.1"
                                   class="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg">
                          </div>
                        </div>

                        <!-- Propriétés -->
                        <div class="mt-3">
                          <div class="flex flex-wrap gap-1">
                                                        <span v-for="prop in infusion.properties"
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

          <!-- Section 4: Phase grasse -->
          <section id="oil-phase"
                   class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
            <div class="flex items-start gap-4 mb-8">
              <div class="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">🌿</span>
              </div>
              <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Phase grasse</h2>
                    <p class="text-gray-600">Huiles, beurres et cires - Nutrition et démêlage</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div :class="[
                                            'px-4 py-2 rounded-full border font-semibold',
                                            oilPhaseExceeded
                                                ? 'bg-gradient-to-r from-red-100 to-orange-100 border-red-300 text-red-700'
                                                : 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 text-amber-700'
                                        ]">
                                            <span class="text-sm">
                                                Total: {{ oilPhaseTotal.toFixed(1) }}% / {{ hairProfiles[formData.hairType]?.oil || 10 }}%
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

            <!-- Catégories d'huiles capillaires -->
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

                <!-- Grille d'huiles capillaires -->
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
                        <!-- En-tête avec poids moléculaire -->
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

                          <!-- Indicateur de pénétration -->
                          <div :class="[
                                                        'px-2 py-1 rounded-full text-xs font-bold',
                                                        oil.penetration === 'légère' ? 'bg-green-100 text-green-800' :
                                                        oil.penetration === 'moyenne' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'
                                                    ]"
                               :title="`Pénétration: ${oil.penetration}`">
                            {{ oil.penetration.charAt(0).toUpperCase() }}
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

            <!-- Résumé phase grasse -->
            <div v-if="selectedOilPhase.length > 0"
                 class="mt-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-300">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-xl text-gray-900 flex items-center gap-2">
                  <span class="text-amber-600">📊</span>
                  Répartition phase grasse
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
                      <span class="text-gray-600">{{ hairProfiles[formData.hairType]?.oil || 10 }}% (max)</span>
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
                                                            item.penetration === 'légère' ? 'bg-green-100 text-green-800' :
                                                            item.penetration === 'moyenne' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'
                                                        ]">
                                                            {{ item.penetration }}
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
                    <!-- Répartition par pénétration -->
                    <div class="bg-white rounded-xl p-4 border border-amber-200">
                      <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>📈</span>
                        Répartition par pénétration
                      </h4>
                      <div class="space-y-3">
                        <div v-for="pen in penetrationDistribution"
                             :key="pen.level"
                             class="space-y-1">
                          <div class="flex justify-between text-sm">
                            <span class="text-gray-700">{{ pen.level }}</span>
                            <span class="font-medium">{{ pen.percent }}%</span>
                          </div>
                          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-500"
                                 :class="pen.colorClass"
                                 :style="{ width: `${pen.percent}%` }">
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
                          Pour des cheveux <span class="font-bold capitalize">{{ formData.hairType }}</span>,
                          limitez la phase grasse à
                          <span class="font-bold text-amber-700">{{ hairProfiles[formData.hairType]?.oil || 10 }}%</span>.
                        </p>
                        <ul class="text-sm text-gray-600 space-y-1">
                          <li class="flex items-start gap-2">
                            <span class="text-green-500 mt-1">✓</span>
                            <span>Privilégiez les huiles légères pour cheveux fins</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <span class="text-amber-500 mt-1">✓</span>
                            <span>Évitez les mélanges trop gras pour cheveux gras</span>
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
                          La phase grasse dépasse de
                          <span class="font-bold">{{ (oilPhaseTotal - (hairProfiles[formData.hairType]?.oil || 10)).toFixed(1) }}%</span>
                          la limite recommandée pour des cheveux {{ formData.hairType }}.
                          Cela peut alourdir les cheveux et réduire l'efficacité.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Total -->
                  <div class="mt-6 pt-6 border-t border-amber-200">
                    <div class="flex justify-between items-center">
                      <div>
                        <span class="font-bold text-gray-900">Total phase grasse</span>
                        <p class="text-sm text-gray-500">Recommandé: {{ hairProfiles[formData.hairType]?.oil || 10 }}% max</p>
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

          <!-- Section 5: Agents démêlants et épaississants -->
          <section id="conditioning-agents"
                   class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
            <div class="flex items-start gap-4 mb-8">
              <div class="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">✨</span>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Agents démêlants & Épaississants</h2>
                <p class="text-gray-600">Sélectionnez les agents de soin et contrôle de la viscosité</p>
              </div>
            </div>

            <!-- Agents démêlants -->
            <div class="mb-8">
              <h3 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span class="text-emerald-600">💫</span>
                Agents démêlants
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="agent in conditioningAgents"
                     :key="agent.name"
                     :class="[
                                         'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1',
                                         agent.selected ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-md' : 'border-gray-200 hover:border-emerald-200'
                                     ]">
                  <div class="flex items-start gap-3">
                    <div class="flex items-center h-6 pt-1">
                      <input :id="`agent-${agent.name}`"
                             type="checkbox"
                             v-model="agent.selected"
                             class="h-5 w-5 rounded border-2 border-gray-300 checked:border-emerald-600 checked:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                    </div>
                    <div class="flex-1">
                      <label :for="`agent-${agent.name}`"
                             class="font-bold text-gray-900 cursor-pointer hover:text-emerald-600">
                        {{ agent.name }}
                      </label>
                      <p class="text-xs text-gray-500 mt-1 mb-2">{{ agent.description }}</p>

                      <div v-if="agent.selected" class="mt-3 space-y-2">
                        <label class="block text-xs font-medium text-gray-700">
                          Dosage (%)
                        </label>
                        <div class="flex items-center gap-2">
                          <input type="number"
                                 v-model.number="agent.percent"
                                 :min="agent.min"
                                 :max="agent.max"
                                 step="0.1"
                                 class="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                          <span class="text-xs text-gray-500">{{ grams(agent.percent) }} g</span>
                        </div>
                      </div>

                      <div class="mt-2">
                        <div class="flex flex-wrap gap-1">
                                                    <span v-for="prop in agent.properties"
                                                          :key="prop"
                                                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        {{ prop }}
                                                    </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Épaississants -->
            <div>
              <h3 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span class="text-blue-600">🌊</span>
                Épaississants naturels
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="thickener in thickeners"
                     :key="thickener.name"
                     :class="[
                                         'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1',
                                         formData.thickener === thickener.name ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-md' : 'border-gray-200 hover:border-blue-200'
                                     ]"
                     @click="formData.thickener = thickener.name">
                  <div class="flex items-start gap-3">
                    <div class="flex items-center h-6 pt-1">
                      <input :id="`thickener-${thickener.name}`"
                             type="radio"
                             v-model="formData.thickener"
                             :value="thickener.name"
                             class="h-5 w-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    </div>
                    <div class="flex-1">
                      <label :for="`thickener-${thickener.name}`"
                             class="font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                        {{ thickener.name }}
                      </label>
                      <p class="text-xs text-gray-500 mt-1 mb-2">{{ thickener.description }}</p>

                      <div class="mt-2">
                        <div class="flex flex-wrap gap-1">
                                                    <span v-for="prop in thickener.properties"
                                                          :key="prop"
                                                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                                                        {{ prop }}
                                                    </span>
                        </div>
                      </div>

                      <div v-if="formData.thickener === thickener.name" class="mt-3 space-y-2">
                        <label class="block text-xs font-medium text-gray-700">
                          Concentration (%)
                        </label>
                        <div class="flex items-center gap-2">
                          <input type="number"
                                 v-model.number="formData.thickenerPercent"
                                 :min="thickener.min"
                                 :max="thickener.max"
                                 step="0.1"
                                 class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <span class="text-xs text-gray-500">{{ grams(formData.thickenerPercent) }} g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Résumé des agents -->
            <div v-if="selectedConditioningAgents.length > 0 || formData.thickener"
                 class="mt-8 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-300">
              <h3 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span class="text-emerald-600">📊</span>
                Résumé des agents
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="selectedConditioningAgents.length > 0">
                  <h4 class="font-medium text-gray-900 mb-3">Agents démêlants sélectionnés</h4>
                  <div class="space-y-2">
                    <div v-for="agent in selectedConditioningAgents"
                         :key="agent.name"
                         class="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                      <span class="text-sm font-medium">{{ agent.name }}</span>
                      <span class="font-bold text-emerald-700">{{ agent.percent }}%</span>
                    </div>
                    <div class="pt-2 border-t border-emerald-200">
                      <div class="flex justify-between font-bold">
                        <span>Total démêlants</span>
                        <span class="text-emerald-700">{{ totalConditioningPercent.toFixed(1) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="formData.thickener">
                  <h4 class="font-medium text-gray-900 mb-3">Épaississant sélectionné</h4>
                  <div class="p-4 bg-white/80 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-bold">{{ formData.thickener }}</span>
                      <span class="text-blue-700 font-bold">{{ formData.thickenerPercent }}%</span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ grams(formData.thickenerPercent) }} g pour {{ formData.volume }}ml
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 6: Système de conservation -->
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

            <!-- Sélection du type -->
            <div class="space-y-6">
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

            <!-- Importance de la conservation -->
            <div class="mt-8 bg-gradient-to-br from-gray-50 to-red-50 rounded-xl p-6 border border-gray-300">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                  <span class="text-3xl text-red-600">⚠️</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 text-xl mb-3">Pourquoi la conservation est-elle cruciale pour les après-shampoings ?</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium text-gray-800 mb-2">Exigences réglementaires (UE 1223/2009)</h4>
                      <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start gap-2">
                          <span class="text-red-500 font-bold">§1</span>
                          <span>Tout produit capillaire contenant de l'eau doit être protégé contre la contamination microbienne</span>
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
                      <h4 class="font-medium text-gray-800 mb-2">Risques spécifiques aux après-shampoings</h4>
                      <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start gap-2">
                          <span class="text-red-500">•</span>
                          <span>Contact fréquent avec l'eau de la douche (contamination)</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-red-500">•</span>
                          <span>Présence de matière organique (actifs naturels)</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-red-500">•</span>
                          <span>pH souvent proche de la neutralité (favorable aux micro-organismes)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 7: Parfums et huiles essentielles -->
          <section id="fragrance"
                   class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
            <div class="flex items-start gap-4 mb-8">
              <div class="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">🌸</span>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Parfums & Huiles essentielles</h2>
                <p class="text-gray-600">Personnalisez la fragrance de votre après-shampoing</p>
              </div>
            </div>

            <!-- Options de parfum -->
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Type de parfum -->
                <div>
                  <label class="label required">Type de fragrance *</label>
                  <div class="space-y-2">
                    <label v-for="option in fragranceOptions"
                           :key="option.value"
                           class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:border-pink-300"
                           :class="formData.fragranceType === option.value ? 'border-pink-400 bg-pink-50' : 'border-gray-200'">
                      <input type="radio"
                             v-model="formData.fragranceType"
                             :value="option.value"
                             class="h-4 w-4 text-pink-600 focus:ring-pink-500">
                      <div>
                        <span class="font-medium">{{ option.label }}</span>
                        <p class="text-xs text-gray-500">{{ option.description }}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Intensité -->
                <div>
                  <label class="label">Intensité de la fragrance</label>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Très légère</span>
                      <span class="text-sm text-gray-600">Moyenne</span>
                      <span class="text-sm text-gray-600">Intense</span>
                    </div>
                    <input type="range"
                           v-model.number="formData.fragranceIntensity"
                           min="1"
                           max="3"
                           step="1"
                           class="w-full h-2 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white">
                    <div class="text-center">
                                            <span class="text-lg font-bold text-pink-600">
                                                {{ ['Légère', 'Moyenne', 'Intense'][formData.fragranceIntensity - 1] }}
                                            </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sélection d'huiles essentielles (si choisi) -->
              <div v-if="formData.fragranceType === 'essential_oils'" class="mt-6">
                <h3 class="font-bold text-xl text-gray-900 mb-4">Sélection des huiles essentielles</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="he in hairEssentialOils"
                       :key="he.name"
                       :class="[
                                             'rounded-lg p-4 border-2 transition-all duration-300',
                                             formData.selectedEssentialOils.some(eo => eo.name === he.name)
                                                 ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                                                 : 'border-gray-200 hover:border-green-300'
                                         ]">
                    <div class="flex items-start gap-3">
                      <input :id="`he-${he.name}`"
                             type="checkbox"
                             :checked="formData.selectedEssentialOils.some(eo => eo.name === he.name)"
                             @change="toggleEssentialOil(he)"
                             class="h-4 w-4 rounded border-2 border-gray-300 checked:border-green-600 checked:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1">
                      <div class="flex-1">
                        <label :for="`he-${he.name}`"
                               class="font-bold text-gray-900 cursor-pointer hover:text-green-600">
                          {{ he.name }}
                        </label>
                        <p class="text-xs text-gray-500 mt-1">{{ he.latinName }}</p>
                        <div class="mt-2 flex flex-wrap gap-1">
                                                    <span v-for="prop in he.properties"
                                                          :key="prop"
                                                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                                        {{ prop }}
                                                    </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Note de parfum -->
              <div v-if="formData.fragranceType === 'synthetic' || formData.fragranceType === 'essential_oils'"
                   class="mt-6">
                <label class="label">Note de parfum dominante</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label v-for="note in fragranceNotes"
                         :key="note.value"
                         class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-pink-300"
                         :class="formData.fragranceNote === note.value ? 'border-pink-400 bg-pink-50' : 'border-gray-200'">
                    <input type="radio"
                           v-model="formData.fragranceNote"
                           :value="note.value"
                           class="h-4 w-4 text-pink-600">
                    <div>
                      <span class="font-medium">{{ note.label }}</span>
                      <p class="text-xs text-gray-500">{{ note.examples }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 8: Analyse et validation -->
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
                          class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <span>📋</span>
                    Copier INCI
                  </button>
                </div>
              </div>

              <div class="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-5 border border-gray-300">
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

                <!-- Rapport de conformité -->
                <div class="mt-8">
                  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div>
                      <h4 class="font-bold text-gray-900">Rapport de conformité complet</h4>
                      <p class="text-sm text-gray-600">Générez un rapport PDF détaillé pour vos archives</p>
                    </div>
                    <button @click="generateComplianceReport"
                            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                      📄 Générer rapport PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 9: Finalisation -->
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
                 class="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div class="flex items-center gap-3">
                <span class="text-indigo-600 text-xl">📅</span>
                <div>
                  <p class="text-sm font-medium text-indigo-700">
                    Dernière modification
                  </p>
                  <p class="text-sm text-indigo-600">
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
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
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
            <span>© 2024 Formulateur Après-Shampoing Pro</span>
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
  volume: 500,
  hairType: "normaux",
  preservativeSystem: "cosgard",
  cosgardPercent: 0.8,
  thickener: "xanthane",
  thickenerPercent: 1.0,
  fragranceType: "synthetic",
  fragranceIntensity: 2,
  fragranceNote: "floral",
  selectedEssentialOils: []
})

// États UI
const saving = ref(false)
const errors = ref({})
const isEditMode = ref(false)
const showFixedBar = ref(true)
const summaryExpanded = ref(false)
const showAccessibilityMenu = ref(false)
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

// Sections pour navigation
const sections = [
  { id: 'basic-info', name: 'Informations' },
  { id: 'actives', name: 'Actifs' },
  { id: 'aqueous-phase', name: 'Infusions' },
  { id: 'oil-phase', name: 'Phase grasse' },
  { id: 'conditioning-agents', name: 'Démêlants' },
  { id: 'preservatives', name: 'Conservation' },
  { id: 'fragrance', name: 'Parfum' },
  { id: 'analysis', name: 'Analyse' },
  { id: 'actions', name: 'Finalisation' }
]

// Points de progression
const progressMarks = [
  { percent: 25, label: 'Informations de base' },
  { percent: 50, label: 'Phase aqueuse' },
  { percent: 75, label: 'Phase grasse' },
  { percent: 100, label: 'Validation' }
]

// Profils de cheveux
const hairProfiles = {
  fins: {
    oil: 5,
    maxActives: 3,
    viscosity: "Fluide",
    description: "Cheveux fins, manque de volume, alourdissement rapide",
    tips: [
      "Utilisez des huiles légères (jojoba, pépins de raisin)",
      "Évitez les formules trop riches et épaisses",
      "Privilégiez les actifs gainants légers",
      "Concentration en agents démêlants: 1-3%"
    ],
    color: "#8b5cf6"
  },
  normaux: {
    oil: 8,
    maxActives: 4,
    viscosity: "Moyenne",
    description: "Cheveux équilibrés, bonne tenue, brillance naturelle",
    tips: [
      "Équilibrez hydratation et nutrition",
      "Utilisez des huiles moyennement pénétrantes",
      "Agents démêlants: 2-4%",
      "Texture crème légère"
    ],
    color: "#10b981"
  },
  secs: {
    oil: 12,
    maxActives: 4,
    viscosity: "Riche",
    description: "Cheveux déshydratés, cassants, besoin en nutrition élevé",
    tips: [
      "Utilisez des huiles nourrissantes (avocat, amande douce)",
      "Intégrez des actifs réparateurs (kératine, protéines)",
      "Agents démêlants: 3-6%",
      "Texture riche et onctueuse"
    ],
    color: "#f59e0b"
  },
  gras: {
    oil: 3,
    maxActives: 2,
    viscosity: "Très fluide",
    description: "Cheveux à tendance grasse, racines luisantes",
    tips: [
      "Privilégiez les formules légères et astringentes",
      "Utilisez des huiles régulatrices (noisette, tea tree)",
      "Évitez les formules trop riches",
      "Agents démêlants: 1-2% maximum"
    ],
    color: "#3b82f6"
  },
  colorés: {
    oil: 6,
    maxActives: 3,
    viscosity: "Moyenne",
    description: "Cheveux traités, besoin en soin et protection de la couleur",
    tips: [
      "Utilisez des actifs protecteurs de couleur",
      "Évitez les sulfates et détergents agressifs",
      "pH légèrement acide (4.5-5.5)",
      "Intégrez des antioxydants"
    ],
    color: "#ec4899"
  }
}

// Options de profils cheveux pour l'UI
const hairProfilesOptions = computed(() => {
  return Object.entries(hairProfiles).map(([key, value]) => ({
    value: key,
    label: key,
    icon: key === 'fins' ? '💨' :
        key === 'normaux' ? '🌟' :
            key === 'secs' ? '🔥' :
                key === 'gras' ? '💦' : '🎨',
    iconLabel: key === 'fins' ? 'Icône cheveux fins' :
        key === 'normaux' ? 'Icône cheveux normaux' :
            key === 'secs' ? 'Icône cheveux secs' :
                key === 'gras' ? 'Icône cheveux gras' :
                    'Icône cheveux colorés',
    oil: value.oil,
    maxActives: value.maxActives,
    viscosity: value.viscosity,
    description: value.description,
    color: value.color,
    tips: value.tips
  }))
})

// Profil cheveux sélectionné
const selectedHairProfile = computed(() => {
  return hairProfilesOptions.value.find(p => p.value === formData.hairType)
})

// Actifs capillaires
const actives = reactive([
  {
    key: 'keratine',
    label: 'Kératine hydrolysée',
    min: 0.5,
    max: 3,
    percent: 1.5,
    enabled: false,
    inci: 'Hydrolyzed Keratin',
    type: 'reparateur',
    description: 'Reconstruit la structure capillaire, répare les pointes fourchues',
    stability: 'pH 4-7',
    compatibility: ['Protéines', 'B5'],
    restrictions: 'Ne pas chauffer au-dessus de 40°C'
  },
  {
    key: 'b5',
    label: 'Panthénol (B5)',
    min: 0.5,
    max: 5,
    percent: 2,
    enabled: false,
    inci: 'Panthenol',
    type: 'hydratant',
    description: 'Humectant, augmente l\'élasticité des cheveux',
    stability: 'stable',
    compatibility: ['Kératine', 'Bétaine'],
    restrictions: 'Aucune connue'
  },
  {
    key: 'betaine',
    label: 'Bétaïne',
    min: 1,
    max: 5,
    percent: 3,
    enabled: false,
    inci: 'Betaine',
    type: 'hydratant',
    description: 'Hydratant puissant, antistatique naturel',
    stability: 'stable',
    compatibility: ['B5', 'Glycérine'],
    restrictions: 'Aucune connue'
  },
  {
    key: 'silk_protein',
    label: 'Protéine de soie',
    min: 0.1,
    max: 2,
    percent: 0.5,
    enabled: false,
    inci: 'Hydrolyzed Silk Protein',
    type: 'gainant',
    description: 'Gainant naturel, apporte brillance et douceur',
    stability: 'pH 4-8',
    compatibility: ['Kératine', 'B5'],
    restrictions: 'Ne pas utiliser avec fortes concentrations d\'acides'
  },
  {
    key: 'argan_oil',
    label: 'Huile d\'argan',
    min: 0.5,
    max: 3,
    percent: 1,
    enabled: false,
    inci: 'Argania Spinosa Kernel Oil',
    type: 'nutritif',
    description: 'Nourrit en profondeur, protège les pointes',
    stability: 'sensible à l\'oxydation',
    compatibility: ['Vitamine E', 'Autres huiles'],
    restrictions: 'Protéger de la lumière'
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

// Systèmes de conservation
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
  }
]

// Phase aqueuse - Infusions capillaires
const aqueousPhaseOptions = reactive({
  'Infusions fortifiantes': {
    icon: '💪',
    items: [
      {
        name: 'Ortie',
        description: 'Fortifiante, anti-chute',
        properties: ['Fortifiant', 'Antioxydant', 'Astringent'],
        percent: 20, min: 10, max: 50, selected: false
      },
      {
        name: 'Romarin',
        description: 'Stimulant la pousse, anti-pelliculaire',
        properties: ['Stimulant', 'Antiseptique', 'Circulatoire'],
        percent: 15, min: 5, max: 40, selected: false
      },
      {
        name: 'Sauge',
        description: 'Régulateur sébacé, anti-graisse',
        properties: ['Régulateur', 'Astringent', 'Antifongique'],
        percent: 10, min: 5, max: 30, selected: false
      }
    ]
  },
  'Infusions apaisantes': {
    icon: '💆',
    items: [
      {
        name: 'Camomille',
        description: 'Apaisant, éclaircissant naturel',
        properties: ['Apaisant', 'Éclaircissant', 'Anti-inflammatoire'],
        percent: 15, min: 5, max: 40, selected: false
      },
      {
        name: 'Calendula',
        description: 'Cicatrisant, apaisant cuir chevelu',
        properties: ['Cicatrisant', 'Apaisant', 'Anti-rougeurs'],
        percent: 20, min: 10, max: 50, selected: false
      }
    ]
  },
  'Infusions hydratantes': {
    icon: '💧',
    items: [
      {
        name: 'Aloe vera',
        description: 'Hydratant intense, apaisant',
        properties: ['Hydratant', 'Apaisant', 'Régénérant'],
        percent: 25, min: 10, max: 60, selected: false
      },
      {
        name: 'Bambou',
        description: 'Riche en silicium, fortifiant',
        properties: ['Fortifiant', 'Hydratant', 'Élastifiant'],
        percent: 15, min: 5, max: 40, selected: false
      }
    ]
  }
})

// Phase grasse - Huiles capillaires
const oilPhaseOptions = reactive({
  'Huiles légères (pénétration rapide)': {
    icon: '⚡',
    items: [
      {
        name: 'Jojoba',
        description: 'Sébum-like, régulateur',
        properties: ['Régulateur', 'Non comédogène', 'Pénétrant'],
        specifics: ['Poids moléculaire léger'],
        penetration: 'légère', percent: 2, min: 0.5, max: 5, selected: false
      },
      {
        name: 'Pépins de raisin',
        description: 'Légère, antioxydante',
        properties: ['Antioxydant', 'Légère', 'Astringente'],
        specifics: ['Vitamine E naturelle'],
        penetration: 'légère', percent: 1.5, min: 0.5, max: 4, selected: false
      },
      {
        name: 'Noisette',
        description: 'Astringente, régulatrice sébacée',
        properties: ['Astringent', 'Régulateur', 'Raffermissant'],
        specifics: ['Acides gras essentiels'],
        penetration: 'légère', percent: 2, min: 0.5, max: 5, selected: false
      }
    ]
  },
  'Huiles nourrissantes': {
    icon: '🌰',
    items: [
      {
        name: 'Argan',
        description: 'Régénérante, protectrice',
        properties: ['Régénérant', 'Protecteur', 'Antioxydant'],
        specifics: ['Vitamine E', 'Squalène'],
        penetration: 'moyenne', percent: 3, min: 1, max: 6, selected: false
      },
      {
        name: 'Avocat',
        description: 'Nourrissante, réparatrice',
        properties: ['Nourrissant', 'Réparateur', 'Émollient'],
        specifics: ['Vitamines A,D,E'],
        penetration: 'moyenne', percent: 4, min: 1, max: 8, selected: false
      },
      {
        name: 'Macadamia',
        description: 'Riche en acide palmitoléique',
        properties: ['Nourrissant', 'Protecteur', 'Brillant'],
        specifics: ['Oméga-7'],
        penetration: 'moyenne', percent: 3, min: 1, max: 6, selected: false
      }
    ]
  },
  'Huiles gainantes': {
    icon: '✨',
    items: [
      {
        name: 'Brocoli',
        description: 'Gainant naturel, brillance',
        properties: ['Gainant', 'Brillant', 'Protecteur'],
        specifics: ['Acides gras insaturés'],
        penetration: 'faible', percent: 2, min: 0.5, max: 4, selected: false
      },
      {
        name: 'Camélia',
        description: 'Lissante, protectrice de la couleur',
        properties: ['Lissant', 'Protecteur', 'Brillant'],
        specifics: ['Oméga-9'],
        penetration: 'faible', percent: 3, min: 1, max: 6, selected: false
      }
    ]
  }
})

// Agents démêlants
const conditioningAgents = reactive([
  {
    name: 'BTMS',
    description: 'Conditionneur cationique, démêlant puissant',
    properties: ['Démêlant', 'Adoucissant', 'Antistatique'],
    percent: 3, min: 1, max: 6, selected: false
  },
  {
    name: 'Cetyl Alcohol',
    description: 'Épaississant, conditionneur léger',
    properties: ['Épaississant', 'Émollient', 'Stabilisateur'],
    percent: 2, min: 0.5, max: 4, selected: false
  },
  {
    name: 'Behentrimonium Methosulfate',
    description: 'Conditionneur doux, bonne compatibilité',
    properties: ['Conditionneur', 'Démêlant', 'Adoucissant'],
    percent: 2.5, min: 1, max: 5, selected: false
  }
])

// Épaississants naturels
const thickeners = [
  {
    name: 'xanthane',
    description: 'Gomme naturelle, texture gel fluide',
    properties: ['Naturel', 'pH stable', 'Facile à utiliser'],
    min: 0.3, max: 2
  },
  {
    name: 'guar',
    description: 'Gomme de guar, texture crémeuse',
    properties: ['Naturel', 'Économique', 'Bon épaississant'],
    min: 0.5, max: 3
  },
  {
    name: 'carbomer',
    description: 'Synthétique, texture gel transparent',
    properties: ['Haute performance', 'Texture gel', 'Stable'],
    min: 0.1, max: 1
  }
]

// Options de parfum
const fragranceOptions = [
  { value: 'synthetic', label: 'Parfum synthétique', description: 'Stable, large choix de notes' },
  { value: 'essential_oils', label: 'Huiles essentielles', description: '100% naturel, propriétés additionnelles' },
  { value: 'none', label: 'Sans parfum', description: 'Pour peaux sensibles ou allergies' }
]

// Notes de parfum
const fragranceNotes = [
  { value: 'floral', label: 'Florale', examples: 'Rose, Jasmin, Lavande' },
  { value: 'fruity', label: 'Fruitée', examples: 'Pêche, Fraise, Agrumes' },
  { value: 'woody', label: 'Boisée', examples: 'Santal, Cèdre, Patchouli' },
  { value: 'fresh', label: 'Fraîche', examples: 'Menthe, Citron, Herbes' }
]

// Huiles essentielles capillaires
const hairEssentialOils = [
  {
    name: 'Lavande',
    latinName: 'Lavandula angustifolia',
    properties: ['Apaisant', 'Antiseptique', 'Équilibrant']
  },
  {
    name: 'Romarin',
    latinName: 'Rosmarinus officinalis',
    properties: ['Stimulant', 'Antipelliculaire', 'Fortifiant']
  },
  {
    name: 'Ylang-Ylang',
    latinName: 'Cananga odorata',
    properties: ['Équilibrant', 'Aphrodisiaque', 'Antistress']
  },
  {
    name: 'Cèdre',
    latinName: 'Cedrus atlantica',
    properties: ['Astringent', 'Antiseptique', 'Tonifiant']
  },
  {
    name: 'Tea Tree',
    latinName: 'Melaleuca alternifolia',
    properties: ['Antibactérien', 'Antifongique', 'Purifiant']
  },
  {
    name: 'Citron',
    latinName: 'Citrus limon',
    properties: ['Astringent', 'Purifiant', 'Éclaircissant']
  }
]

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

// Phase grasse sélectionnée
const selectedOilPhase = computed(() => {
  const selected = []
  for (const category of Object.values(oilPhaseOptions)) {
    for (const item of category.items) {
      if (item.selected) {
        selected.push({
          name: item.name,
          percent: item.percent,
          penetration: item.penetration,
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
  return oilPhaseTotal.value > (hairProfiles[formData.hairType]?.oil || 10)
})

// Distribution par pénétration
const penetrationDistribution = computed(() => {
  const distribution = {
    'légère': { level: 'Légère', percent: 0, colorClass: 'bg-green-500' },
    'moyenne': { level: 'Moyenne', percent: 0, colorClass: 'bg-amber-500' },
    'faible': { level: 'Faible', percent: 0, colorClass: 'bg-blue-500' }
  }

  selectedOilPhase.value.forEach(item => {
    distribution[item.penetration].percent += item.percent
  })

  // Convertir en pourcentage du total phase grasse
  Object.values(distribution).forEach(d => {
    d.percent = (d.percent / oilPhaseTotal.value) * 100
  })

  return Object.values(distribution).filter(d => d.percent > 0)
})

// Agents démêlants sélectionnés
const selectedConditioningAgents = computed(() => {
  return conditioningAgents.filter(agent => agent.selected)
})

const totalConditioningPercent = computed(() => {
  return selectedConditioningAgents.value.reduce((total, agent) => total + agent.percent, 0)
})

// Actifs activés
const enabledActivesCount = computed(() => {
  return actives.filter(a => a.enabled).length
})

const tooManyActives = computed(() => {
  return enabledActivesCount.value > (hairProfiles[formData.hairType]?.maxActives || 4)
})

// Conservateur
const preservativePercent = computed(() => {
  if (formData.preservativeSystem === 'cosgard') {
    return formData.cosgardPercent || 0.8
  }
  return 0.5
})

// Épaississant
const thickenerPercent = computed(() => {
  return formData.thickenerPercent || 1.0
})

// Calcul de la phase eau
const waterPhase = computed(() => {
  const totalUsed = oilPhaseTotal.value +
      aqueousPhaseTotal.value +
      totalActivesPercent.value +
      preservativePercent.value +
      totalConditioningPercent.value +
      thickenerPercent.value +
      (formData.fragranceType === 'essential_oils' ? 0.5 : 0.3)

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
      name: 'Phase grasse',
      percent: oilPhaseTotal.value,
      grams: grams(oilPhaseTotal.value),
      color: '#f59e0b',
      icon: '🌿'
    },
    {
      name: 'Infusions',
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
      icon: '🧴'
    },
    {
      name: 'Agents démêlants',
      percent: totalConditioningPercent.value,
      grams: grams(totalConditioningPercent.value),
      color: '#10b981',
      icon: '✨'
    },
    {
      name: 'Conservateur',
      percent: preservativePercent.value,
      grams: grams(preservativePercent.value),
      color: '#ef4444',
      icon: '🛡️'
    },
    {
      name: 'Épaississant',
      percent: thickenerPercent.value,
      grams: grams(thickenerPercent.value),
      color: '#ec4899',
      icon: '🌊'
    }
  ]

  // Parfum
  if (formData.fragranceType !== 'none') {
    phasesList.push({
      name: 'Parfum',
      percent: formData.fragranceType === 'essential_oils' ? 0.5 : 0.3,
      grams: grams(formData.fragranceType === 'essential_oils' ? 0.5 : 0.3),
      color: '#f472b6',
      icon: '🌸'
    })
  }

  // Filtrer les phases vides
  return phasesList.filter(p => p.percent > 0)
})

const formulationSummary = computed(() => {
  return phases.value.map(p => ({
    name: p.name,
    percent: p.percent,
    colorClass: p.name === 'Phase grasse' ? 'bg-amber-500' :
        p.name === 'Infusions' ? 'bg-blue-500' :
            p.name === 'Actifs' ? 'bg-purple-500' :
                p.name === 'Agents démêlants' ? 'bg-green-500' :
                    p.name === 'Conservateur' ? 'bg-red-500' : 'bg-pink-500'
  }))
})

// Liste INCI
const inciList = computed(() => {
  const list = ['Aqua']

  // Épaississant
  const thickenerObj = thickeners.find(t => t.name === formData.thickener)
  if (thickenerObj) {
    list.push(formData.thickener === 'xanthane' ? 'Xanthan Gum' :
        formData.thickener === 'guar' ? 'Guar Gum' : 'Carbomer')
  }

  // Actifs par concentration décroissante
  const significantActives = actives
      .filter(a => a.enabled && a.percent >= 0.5)
      .sort((a, b) => b.percent - a.percent)

  significantActives.forEach(a => list.push(a.inci))

  // Agents démêlants
  selectedConditioningAgents.value.forEach(agent => {
    list.push(agent.name)
  })

  // Huiles végétales
  const significantOils = selectedOilPhase.value
      .filter(o => o.percent >= 0.5)
      .sort((a, b) => b.percent - a.percent)

  significantOils.forEach(o => {
    list.push(`${o.name} Oil`)
  })

  // Conservateur
  const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
  if (preservative) {
    list.push(preservative.inci)
  }

  // Parfum
  if (formData.fragranceType !== 'none') {
    list.push('Parfum (Fragrance)')
    if (formData.fragranceType === 'essential_oils') {
      formData.selectedEssentialOils.forEach(eo => {
        list.push(`${eo.name} Oil`)
      })
    }
  }

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
    description: 'Doit être entre 100 et 1000 ml',
    passed: formData.volume >= 100 && formData.volume <= 1000,
    error: `Volume invalide: ${formData.volume}ml (100-1000 ml requis)`,
    recommendation: 'Ajustez le volume entre 100 et 1000 ml'
  },
  {
    name: 'Type de cheveux cible',
    description: 'Doit être sélectionné',
    passed: !!formData.hairType,
    error: 'Aucun type de cheveux sélectionné',
    recommendation: 'Sélectionnez un type de cheveux cible'
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
    name: 'Phase grasse',
    description: 'Respect des recommandations par type de cheveux',
    passed: !oilPhaseExceeded.value,
    error: `Phase grasse excessive: ${oilPhaseTotal.value.toFixed(1)}% > ${hairProfiles[formData.hairType]?.oil}%`,
    recommendation: `Réduisez la phase grasse à ${hairProfiles[formData.hairType]?.oil}% maximum`
  },
  {
    name: 'Agents démêlants',
    description: 'Dosage approprié pour le type de cheveux',
    passed: totalConditioningPercent.value <= (hairProfiles[formData.hairType]?.oil || 10) * 0.8,
    error: `Trop d'agents démêlants: ${totalConditioningPercent.value.toFixed(1)}%`,
    recommendation: `Réduisez les agents démêlants à ${(hairProfiles[formData.hairType]?.oil || 10) * 0.8}% maximum`
  }
])

const regulatoryErrors = computed(() => {
  return regulatoryChecks.value
      .filter(check => !check.passed)
      .map(check => check.error)
})

const regulatoryStatus = computed(() => ({
  isValid: regulatoryErrors.value.length === 0,
  errors: regulatoryErrors.value
}))

// Pourcentage de complétion
const completionPercentage = computed(() => {
  let percentage = 0

  // Nom (10%)
  if (formData.name.trim().length > 0) percentage += 10

  // Volume (5%)
  if (formData.volume >= 100) percentage += 5

  // Type de cheveux (10%)
  if (formData.hairType) percentage += 10

  // Conservateur (15%)
  if (formData.preservativeSystem) percentage += 15
  if (formData.preservativeSystem === 'cosgard' && formData.cosgardPercent >= 0.5) {
    percentage += 5
  }

  // Actifs (10%)
  if (enabledActivesCount.value > 0) percentage += 10

  // Phase aqueuse (10%)
  if (aqueousPhaseTotal.value > 0) percentage += 10

  // Phase grasse (10%)
  if (oilPhaseTotal.value > 0) percentage += 10

  // Agents démêlants (10%)
  if (selectedConditioningAgents.value.length > 0) percentage += 10

  // Épaississant (5%)
  if (formData.thickener) percentage += 5

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
    'reparateur': 'Réparateur',
    'gainant': 'Gainant',
    'antistatique': 'Antistatique',
    'nutritif': 'Nutritif'
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
    'Régulateur': 'bg-blue-100 text-blue-800 border border-blue-200',
    'Antioxydant': 'bg-orange-100 text-orange-800 border border-orange-200',
    'Pénétrant': 'bg-green-100 text-green-800 border border-green-200',
    'Nourrissant': 'bg-amber-100 text-amber-800 border border-amber-200',
    'Gainant': 'bg-purple-100 text-purple-800 border border-purple-200',
    'Lissant': 'bg-pink-100 text-pink-800 border border-pink-200',
    'Protecteur': 'bg-red-100 text-red-800 border border-red-200',
    'default': 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  for (const [key, className] of Object.entries(classes)) {
    if (property.toLowerCase().includes(key.toLowerCase())) {
      return className
    }
  }

  return classes.default
}

const getRemainingOilPercent = () => {
  const max = hairProfiles[formData.hairType]?.oil || 10
  return Math.max(0, max - oilPhaseTotal.value)
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
  if (formData.volume < 100 || formData.volume > 1000) {
    errors.value.volume = "Volume invalide (100-1000 ml)"
  } else {
    delete errors.value.volume
  }
}

// Méthodes de catégories
const toggleCategory = (category, type) => {
  const items = category.items
  const allSelected = items.every(i => i.selected)

  items.forEach(item => {
    if (type === 'oil' && !allSelected && oilPhaseExceeded.value && !item.selected) {
      return // Ne pas sélectionner si phase grasse dépassée
    }
    item.selected = !allSelected
  })
}

// Méthodes de calcul automatique
const autoCalculateWaterPhase = () => {
  const currentTotal = oilPhaseTotal.value +
      aqueousPhaseTotal.value +
      totalActivesPercent.value +
      preservativePercent.value +
      totalConditioningPercent.value +
      thickenerPercent.value +
      (formData.fragranceType === 'essential_oils' ? 0.5 : 0.3)

  if (currentTotal < 100) {
    const remaining = 100 - currentTotal
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
  const max = hairProfiles[formData.hairType]?.oil || 10
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

  // Répartir équitablement jusqu'à 40% total
  const targetTotal = Math.min(40, selected.length * 15)
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

  const max = hairProfiles[formData.hairType]?.oil || 10
  const targetPercent = max * 0.9 / selected.length

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

// Méthodes huiles essentielles
const toggleEssentialOil = (he) => {
  const idx = formData.selectedEssentialOils.findIndex(eo => eo.name === he.name)
  if (idx === -1) {
    formData.selectedEssentialOils.push({ ...he })
  } else {
    formData.selectedEssentialOils.splice(idx, 1)
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
    offset += phases.value[i].percent * 9.42
  }
  return offset
}

// Validation de sauvegarde
const canSave = computed(() => {
  const hasPreservative = formData.preservativeSystem === 'cosgard'
      ? (formData.cosgardPercent >= 0.5 && formData.cosgardPercent <= 1.0)
      : formData.preservativeSystem

  return formData.name.trim().length > 0 &&
      formData.volume >= 100 &&
      formData.hairType &&
      hasPreservative &&
      formData.thickener &&
      waterPhase.value >= 0
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

  // Agents démêlants
  selectedConditioningAgents.value.forEach(agent => {
    ingredients.push({
      name: agent.name,
      quantity: agent.percent,
      unit: "%",
      type: "conditioning_agent"
    })
  })

  // Huiles essentielles
  formData.selectedEssentialOils.forEach(he => {
    ingredients.push({
      name: `HE ${he.name}`,
      quantity: 0.1,
      unit: "%",
      type: "essential_oil",
      latinName: he.latinName
    })
  })

  // Infusions
  selectedAqueousPhase.value.forEach(aq => {
    ingredients.push({
      name: aq.name,
      quantity: aq.percent,
      unit: "%",
      type: "infusion"
    })
  })

  // Huiles capillaires
  selectedOilPhase.value.forEach(oil => {
    ingredients.push({
      name: oil.name,
      quantity: oil.percent,
      unit: "%",
      type: "hair_oil",
      penetration: oil.penetration
    })
  })

  // Épaississant
  const thickenerObj = thickeners.find(t => t.name === formData.thickener)
  if (thickenerObj) {
    ingredients.push({
      name: formData.thickener,
      quantity: formData.thickenerPercent,
      unit: "%",
      type: "thickener"
    })
  }

  // Eau
  ingredients.push({
    name: "Eau déminéralisée",
    quantity: waterPhase.value,
    unit: "%",
    type: "water"
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
      name: formData.name.trim(),
      description: generateDescription(),
      type: "hair_conditioner",
      createdAt: isEditMode.value ? props.initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Formulation
      volume: formData.volume,
      hairType: formData.hairType,
      preservativeSystem: formData.preservativeSystem,
      cosgardPercent: formData.cosgardPercent,
      thickener: formData.thickener,
      thickenerPercent: formData.thickenerPercent,
      fragranceType: formData.fragranceType,
      fragranceIntensity: formData.fragranceIntensity,
      fragranceNote: formData.fragranceNote,

      // Ingrédients
      ingredients: generateIngredientsForDB(),

      // Calculs
      totalPercent: totalFormulationPercent.value,
      waterPercent: waterPhase.value,

      // Métadonnées
      version: "2.2",
      compliance: {
        euRegulation: "1223/2009",
        preservativeCompliant: true,
        isValid: regulatoryStatus.value.isValid,
        errors: regulatoryErrors.value
      },

      // Mentions
      inciList: inciList.value
    }

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
    conditioningAgents: selectedConditioningAgents.value,
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

  return `${formData.name} - Après-shampoing pour cheveux ${formData.hairType}
• Volume: ${formData.volume}ml
• Actifs: ${actives.filter(a => a.enabled).map(a => `${a.label} ${a.percent}%`).join(', ') || 'Aucun'}
• Phase grasse: ${oilPhaseTotal.value.toFixed(1)}%
• Phase aqueuse: ${aqueousPhaseTotal.value.toFixed(1)}%
• Agents démêlants: ${selectedConditioningAgents.value.map(a => `${a.name} ${a.percent}%`).join(', ') || 'Aucun'}
• Conservateur: ${preservativeName} ${formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent + '%' : ''}
• Épaississant: ${formData.thickener} ${formData.thickenerPercent}%
• Validation UE: ${regulatoryStatus.value.isValid ? 'Conforme' : 'Non conforme'}`
}

// Méthodes d'export
const generateReport = () => {
  if (!isValid.value) {
    alert("La formule doit être valide pour générer un rapport")
    return
  }

  console.log('Génération du rapport PDF...')
}

const exportFormula = () => {
  const exportData = {
    formula: {
      ...formData,
      actives: actives.filter(a => a.enabled),
      aqueousPhase: selectedAqueousPhase.value,
      oilPhase: selectedOilPhase.value,
      conditioningAgents: selectedConditioningAgents.value
    },
    analysis: {
      phases: phases.value,
      regulatoryStatus: regulatoryStatus.value,
      inciList: inciList.value
    },
    metadata: {
      version: "2.2",
      exportDate: new Date().toISOString(),
      generatedBy: "Formulateur Après-Shampoing Pro"
    }
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

  const exportFileDefaultName = `apres-shampoing-${formData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const generateComplianceReport = () => {
  console.log('Génération du rapport de conformité...')
}

// Initialisation
onMounted(() => {
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    isEditMode.value = true

    Object.assign(formData, {
      name: props.initialData.name || "",
      volume: props.initialData.volume || 500,
      hairType: props.initialData.hairType || "normaux",
      preservativeSystem: props.initialData.preservativeSystem || "cosgard",
      cosgardPercent: props.initialData.cosgardPercent || 0.8,
      thickener: props.initialData.thickener || "xanthane",
      thickenerPercent: props.initialData.thickenerPercent || 1.0
    })

    if (props.initialData.ingredients) {
      // Charger les ingrédients depuis les données initiales
      // ... (logique de chargement similaire au premier template)
    }
  }

  document.addEventListener('keydown', handleKeyboardShortcuts)
  detectSystemPreferences()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})

const handleKeyboardShortcuts = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault()
    saveDraft()
  }

  if (e.key === 'Escape') {
    cancel()
  }
}

const detectSystemPreferences = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = prefersReducedMotion.matches

  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
  highContrast.value = prefersHighContrast.matches

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
  }
}, { immediate: true })

watch(() => formData.cosgardPercent, (newVal) => {
  if (newVal < 0.5 || newVal > 1.0) {
    errors.value.cosgardPercent = "Cosgard: plage 0.5-1.0% requise"
  } else {
    delete errors.value.cosgardPercent
  }
})

watch(() => formData.volume, validateVolume)
</script>

<style scoped>
/* Styles spécifiques aux après-shampoings */

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
  @apply border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500;
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

/* Cartes spécifiques */
.hair-type-card {
  @apply border-2 rounded-xl cursor-pointer
  transition-all duration-300
  hover:shadow-lg;
}

.hair-type-card-selected {
  @apply border-indigo-500 bg-gradient-to-br from-indigo-50 to-white;
}

.hair-type-card-default {
  @apply border-gray-200 hover:border-indigo-300;
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
  @apply px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700
  text-white font-bold rounded-xl
  hover:from-indigo-700 hover:to-purple-800
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
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
  .hair-type-card {
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
  @apply outline-none ring-2 ring-indigo-500 ring-offset-2;
}

/* Support navigateurs plus anciens */
@supports not (selector(:focus-visible)) {
  :focus {
    @apply outline-none ring-2 ring-indigo-500 ring-offset-2;
  }
}
</style>