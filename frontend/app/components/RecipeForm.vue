<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
        <div class="max-w-7xl mx-auto space-y-8">
            <!-- Header avec navigation et informations -->
            <header class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span class="bg-blue-100 p-3 rounded-xl" aria-hidden="true">🧴</span>
                            <span>Skincare Formulator Pro</span>
                        </h1>
                        <p class="text-gray-600 mt-2">
                            Formulation cosmétique conforme au Règlement UE 1223/2009 –
                            <a href="https://eur-lex.europa.eu/eli/reg/2009/1223/oj"
                               target="_blank"
                               class="text-blue-600 hover:text-blue-800 underline ml-1"
                               aria-label="Consulter le Règlement UE 1223/2009 (nouvelle fenêtre)">
                                Consulter la réglementation
                            </a>
                        </p>
                    </div>

                    <!-- Indicateur de conformité -->
                    <div class="flex flex-col items-end gap-3">
                        <div :class="[
                            'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                            regulatoryStatus.isValid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                        ]" role="status" aria-live="polite">
                            <span v-if="regulatoryStatus.isValid">✅ Conforme UE</span>
                            <span v-else>⚠️ Non conforme</span>
                        </div>

                        <!-- Navigation rapide -->
                        <nav aria-label="Navigation rapide des sections" class="hidden md:flex gap-2">
                            <a v-for="section in sections"
                               :key="section.id"
                               :href="`#${section.id}`"
                               class="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                               @click.prevent="scrollToSection(section.id)">
                                {{ section.name }}
                            </a>
                        </nav>
                    </div>
                </div>

                <!-- Barre de progression -->
                <div class="mt-6">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progression du formulaire</span>
                        <span>{{ completionPercentage }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="h-2.5 rounded-full bg-blue-600 transition-all duration-500 ease-out"
                             :style="{ width: `${completionPercentage}%` }"
                             role="progressbar"
                             :aria-valuenow="completionPercentage"
                             aria-valuemin="0"
                             aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </header>

            <!-- Contenu principal avec sidebar -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar avec résumé -->
                <aside class="lg:w-1/4">
                    <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                        <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
                            <span class="text-blue-600">📋</span>
                            Résumé de la formule
                        </h2>

                        <dl class="space-y-4">
                            <div>
                                <dt class="text-sm text-gray-500">Nom</dt>
                                <dd class="font-medium truncate" :class="{ 'text-red-500': !formData.name }">
                                    {{ formData.name || 'Non renseigné' }}
                                </dd>
                            </div>

                            <div>
                                <dt class="text-sm text-gray-500">Volume total</dt>
                                <dd class="font-medium">{{ formData.volume }} ml</dd>
                            </div>

                            <div>
                                <dt class="text-sm text-gray-500">Profil peau</dt>
                                <dd class="font-medium capitalize">{{ formData.skinType || 'Non sélectionné' }}</dd>
                            </div>

                            <div v-if="regulatoryErrors.length > 0" class="bg-red-50 p-4 rounded-lg border border-red-200">
                                <dt class="text-sm text-red-700 font-semibold mb-2">⚠️ Alertes réglementaires</dt>
                                <dd class="text-sm text-red-600">
                                    <ul class="list-disc pl-4 space-y-1">
                                        <li v-for="error in regulatoryErrors.slice(0, 2)" :key="error">{{ error }}</li>
                                        <li v-if="regulatoryErrors.length > 2">... et {{ regulatoryErrors.length - 2 }} autres</li>
                                    </ul>
                                </dd>
                            </div>
                        </dl>

                        <!-- Quick actions -->
                        <div class="mt-6 pt-6 border-t">
                            <button
                                @click="generateReport"
                                class="w-full mb-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                :disabled="!isValid"
                                :aria-disabled="!isValid">
                                <span>📄 Générer PDF</span>
                            </button>
                            <button
                                @click="exportFormula"
                                class="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                <span>📤 Exporter formule</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Formulaire principal -->
                <main class="lg:w-3/4 space-y-8">
                    <!-- Section 1: Informations de base -->
                    <section id="basic-info" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-3 bg-blue-100 rounded-xl" aria-hidden="true">
                                <span class="text-xl">📝</span>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Informations de base</h2>
                                <p class="text-gray-600">Définissez les caractéristiques principales de votre formule</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Nom de la formule -->
                            <div>
                                <label for="formula-name" class="label required">
                                    Nom de la formule
                                </label>
                                <input
                                    id="formula-name"
                                    v-model="formData.name"
                                    type="text"
                                    placeholder="Ex: Crème hydratante réparatrice"
                                    class="input-field"
                                    :class="{ 'input-error': errors.name }"
                                    required
                                    aria-required="true"
                                    aria-describedby="name-help"
                                />
                                <p v-if="errors.name" id="name-error" class="error-message">
                                    {{ errors.name }}
                                </p>
                                <p id="name-help" class="help-text">
                                    Nom descriptif pour identifier votre formule (max. 100 caractères)
                                </p>
                            </div>

                            <!-- Volume -->
                            <div>
                                <label for="formula-volume" class="label required">
                                    Volume total
                                </label>
                                <div class="relative">
                                    <input
                                        id="formula-volume"
                                        v-model.number="formData.volume"
                                        type="number"
                                        min="1"
                                        max="1000"
                                        step="1"
                                        class="input-field pr-12"
                                        :class="{ 'input-error': errors.volume }"
                                        required
                                        aria-required="true"
                                        aria-describedby="volume-help"
                                    />
                                    <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        ml
                                    </span>
                                </div>
                                <p v-if="errors.volume" id="volume-error" class="error-message">
                                    {{ errors.volume }}
                                </p>
                                <p id="volume-help" class="help-text">
                                    Volume final du produit fini (1-1000 ml)
                                </p>
                            </div>

                            <!-- Type de peau -->
                            <div class="lg:col-span-2">
                                <fieldset class="space-y-4">
                                    <legend class="label required">
                                        Type de peau cible
                                    </legend>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label
                                            v-for="profile in skinProfilesOptions"
                                            :key="profile.value"
                                            :class="[
                                                'skin-type-card',
                                                formData.skinType === profile.value
                                                    ? 'skin-type-card-selected'
                                                    : 'skin-type-card-default'
                                            ]"
                                        >
                                            <input
                                                type="radio"
                                                v-model="formData.skinType"
                                                :value="profile.value"
                                                class="sr-only"
                                                required
                                            />
                                            <div class="flex flex-col items-center text-center p-4">
                                                <span class="text-2xl mb-2" :aria-label="profile.iconLabel">{{ profile.icon }}</span>
                                                <span class="font-medium capitalize">{{ profile.label }}</span>
                                                <span class="text-sm text-gray-500 mt-1">
                                                    Phase huileuse: {{ profile.oil }}%
                                                </span>
                                                <span class="text-xs text-gray-400 mt-2">
                                                    Max {{ profile.maxActives }} actifs
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </section>

                    <!-- Section 2: Actifs cosmétiques -->
                    <section id="actives" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-3 bg-purple-100 rounded-xl" aria-hidden="true">
                                <span class="text-xl">🧪</span>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Actifs cosmétiques</h2>
                                <p class="text-gray-600">Sélectionnez et dosez vos actifs selon les recommandations</p>
                            </div>
                            <div class="ml-auto text-sm text-gray-500">
                                {{ enabledActivesCount }} / {{ skinProfiles[formData.skinType]?.maxActives || 3 }} actifs
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div v-for="active in actives" :key="active.key" class="active-card">
                                <div class="flex items-start gap-4">
                                    <div class="flex items-center h-6">
                                        <input
                                            :id="`active-${active.key}`"
                                            type="checkbox"
                                            v-model="active.enabled"
                                            :disabled="!active.enabled && enabledActivesCount >= skinProfiles[formData.skinType]?.maxActives"
                                            class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            :aria-describedby="`active-description-${active.key}`"
                                        />
                                    </div>

                                    <div class="flex-1">
                                        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <label :for="`active-${active.key}`" class="font-medium text-gray-900 sm:w-64">
                                                {{ active.label }}
                                            </label>

                                            <!-- Dosage avec slider -->
                                            <div v-if="active.enabled" class="flex-1 space-y-2">
                                                <div class="flex justify-between">
                                                    <span class="text-sm text-gray-600">Dosage</span>
                                                    <span class="text-sm font-medium">
                                                        {{ active.percent }}%
                                                    </span>
                                                </div>

                                                <div class="flex items-center gap-4">
                                                    <input
                                                        :id="`active-range-${active.key}`"
                                                        type="range"
                                                        v-model.number="active.percent"
                                                        :min="active.min"
                                                        :max="active.max"
                                                        step="0.1"
                                                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                        :class="getActiveRangeClass(active)"
                                                        :aria-valuetext="`${active.percent} pourcent`"
                                                    />

                                                    <input
                                                        type="number"
                                                        v-model.number="active.percent"
                                                        :min="active.min"
                                                        :max="active.max"
                                                        step="0.1"
                                                        class="w-24 input-field text-center"
                                                        :class="{ 'input-error': active.percent < active.min || active.percent > active.max }"
                                                    />

                                                    <span class="text-sm text-gray-500 min-w-16 text-right">
                                                        {{ grams(active.percent) }} g
                                                    </span>
                                                </div>

                                                <!-- Plage recommandée -->
                                                <div class="flex justify-between text-xs text-gray-500">
                                                    <span>Min: {{ active.min }}%</span>
                                                    <span>Plage recommandée</span>
                                                    <span>Max: {{ active.max }}%</span>
                                                </div>
                                            </div>

                                            <!-- Info inactive -->
                                            <div v-else class="text-sm text-gray-500">
                                                Plage: {{ active.min }}-{{ active.max }}%
                                            </div>
                                        </div>

                                        <!-- Description et INCI -->
                                        <p :id="`active-description-${active.key}`" class="text-sm text-gray-600 mt-2">
                                            {{ active.description }}
                                            <span class="block text-xs text-gray-500 mt-1">
                                                INCI: {{ active.inci }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Avertissement limites -->
                        <div v-if="tooManyActives" class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg" role="alert">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <span class="text-amber-500 text-xl">⚠️</span>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-amber-800">
                                        Trop d'actifs combinés
                                    </h3>
                                    <div class="mt-2 text-sm text-amber-700">
                                        <p>
                                            Pour une peau {{ formData.skinType }}, il est recommandé de ne pas dépasser
                                            {{ skinProfiles[formData.skinType]?.maxActives }} actifs.
                                            La synergie entre trop d'actifs peut réduire leur efficacité.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 3: Huiles essentielles -->
                    <section id="essential-oils" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-3 bg-green-100 rounded-xl" aria-hidden="true">
                                <span class="text-xl">🌿</span>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Huiles essentielles</h2>
                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                    <p class="text-gray-600">Conformité Règlement UE 1223/2009 – Limite totale : 1%</p>
                                    <span class="text-sm px-3 py-1 rounded-full"
                                          :class="heTotal > 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                                        {{ heTotal.toFixed(2) }}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Indicateur de limite -->
                        <div class="mb-8 p-4 bg-gray-50 rounded-lg">
                            <div class="flex justify-between text-sm text-gray-700 mb-2">
                                <span>Utilisation totale des HE</span>
                                <span>{{ heTotal.toFixed(2) }}% / 1%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    class="h-3 rounded-full transition-all duration-500"
                                    :class="heTotal > 1 ? 'bg-red-500' : heTotal > 0.8 ? 'bg-amber-500' : 'bg-green-500'"
                                    :style="{ width: `${Math.min(heTotal * 100, 100)}%` }"
                                    role="meter"
                                    :aria-valuenow="heTotal"
                                    aria-valuemin="0"
                                    aria-valuemax="1"
                                    :aria-valuetext="`${heTotal} pourcent d'huiles essentielles`">
                                </div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Sécuritaire</span>
                                <span>Limite UE</span>
                            </div>
                        </div>

                        <!-- Catégories d'HE -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div v-for="(oils, category) in essentialOils"
                                 :key="category"
                                 class="border rounded-xl p-5 hover:border-blue-300 transition-colors">
                                <h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <span class="text-green-600">•</span>
                                    {{ category }}
                                </h3>

                                <ul class="space-y-3" role="list">
                                    <li v-for="oil in oils"
                                        :key="oil.name"
                                        class="oil-item">
                                        <div class="flex items-center gap-3">
                                            <input
                                                :id="`he-${oil.name}`"
                                                type="checkbox"
                                                :checked="formData.selectedHE.find(h => h.name === oil.name)"
                                                @change="toggleHE(oil)"
                                                class="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                :disabled="heTotal >= 1 && !formData.selectedHE.find(h => h.name === oil.name)"
                                            />

                                            <div class="flex-1">
                                                <label :for="`he-${oil.name}`" class="font-medium cursor-pointer">
                                                    {{ oil.name }}
                                                </label>

                                                <!-- Badges d'avertissement -->
                                                <div class="flex flex-wrap gap-1 mt-1">
                                                    <span v-if="!oil.pregnancy"
                                                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                          title="Contre-indiqué pendant la grossesse">
                                                        👶 Grossesse ❌
                                                    </span>
                                                    <span v-if="oil.photo"
                                                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                                          title="Peut provoquer des réactions cutanées au soleil">
                                                        ☀️ Photosensible
                                                    </span>
                                                    <span v-if="oil.allergen"
                                                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                                                          title="Potentiel allergène - mention obligatoire">
                                                        ⚠️ Allergène
                                                    </span>
                                                    <span v-if="oil.ifra"
                                                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                          title="Limite IFRA">
                                                        📊 IFRA: {{ oil.ifra }}%
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- Contrôle de dosage si sélectionné -->
                                            <div v-if="formData.selectedHE.find(h => h.name === oil.name)"
                                                 class="flex items-center gap-2">
                                                <div class="relative">
                                                    <input
                                                        type="number"
                                                        v-model.number="formData.selectedHE.find(h => h.name === oil.name).percent"
                                                        :min="0"
                                                        :max="oil.maxFace"
                                                        step="0.1"
                                                        class="w-20 input-field text-center"
                                                        :class="{ 'input-error': formData.selectedHE.find(h => h.name === oil.name).percent > oil.maxFace }"
                                                        aria-label="Pourcentage"
                                                    />
                                                    <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                        %
                                                    </span>
                                                </div>
                                                <span class="text-sm text-gray-500 w-16 text-right">
                                                    {{ grams(formData.selectedHE.find(h => h.name === oil.name).percent) }} g
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Info de dosage max -->
                                        <div v-if="formData.selectedHE.find(h => h.name === oil.name)"
                                             class="text-xs text-gray-500 mt-2 ml-8">
                                            Maximum recommandé pour le visage: {{ oil.maxFace }}%
                                        </div>
                                    </li>
                                </ul>

                                <!-- Total de la catégorie -->
                                <div v-if="gramsByHECategory[category]"
                                     class="mt-4 pt-4 border-t">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Total {{ category }} :</span>
                                        <span class="font-medium">
                                            {{ gramsByHECategory[category].percent.toFixed(2) }}%
                                            <span class="text-gray-500 ml-2">
                                                ({{ gramsByHECategory[category].grams }} g)
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Avertissements HE -->
                        <div v-if="heWarnings.length > 0" class="mt-8 space-y-3">
                            <div v-for="(warning, index) in heWarnings"
                                 :key="index"
                                 class="p-4 rounded-lg border-l-4"
                                 :class="getWarningClass(warning)">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <span v-if="warning.includes('Dépassement')" class="text-xl">🚨</span>
                                        <span v-else-if="warning.includes('grossesse')" class="text-xl">👶</span>
                                        <span v-else-if="warning.includes('photosens')" class="text-xl">☀️</span>
                                        <span v-else class="text-xl">⚠️</span>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium">
                                            {{ warning }}
                                        </p>
                                        <p v-if="warning.includes('Dépassement')" class="text-xs mt-1">
                                            Le Règlement UE 1223/2009 impose une limite maximale de 1% d'huiles essentielles
                                            dans les produits cosmétiques destinés au visage.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 4: Analyse et validation -->
                    <section id="analysis" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-3 bg-indigo-100 rounded-xl" aria-hidden="true">
                                <span class="text-xl">📊</span>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Analyse technique</h2>
                                <p class="text-gray-600">Répartition des phases et validation réglementaire</p>
                            </div>
                        </div>

                        <!-- Phases avec visualisation -->
                        <div class="mb-8">
                            <h3 class="font-semibold text-lg mb-4">Répartition des phases</h3>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div v-for="phase in phases"
                                     :key="phase.name"
                                     class="phase-card"
                                     :style="{ '--phase-color': phase.color }">
                                    <div class="phase-card-header">
                                        <span class="phase-icon">{{ phase.icon }}</span>
                                        <span class="phase-name">{{ phase.name }}</span>
                                    </div>
                                    <div class="phase-values">
                                        <span class="phase-percent">{{ phase.percent }}%</span>
                                        <span class="phase-grams">{{ phase.grams }} g</span>
                                    </div>
                                    <div class="phase-bar">
                                        <div class="phase-bar-fill"
                                             :style="{ width: `${phase.percent}%` }"></div>
                                    </div>
                                    <div class="phase-details">
                                        <span class="text-xs text-gray-500">{{ phase.description }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Liste INCI -->
                        <div class="mb-8">
                            <h3 class="font-semibold text-lg mb-4 flex items-center justify-between">
                                <span>🧾 Liste INCI</span>
                                <button
                                    @click="copyINCI"
                                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                    <span>📋 Copier</span>
                                </button>
                            </h3>
                            <div class="bg-gray-50 p-4 rounded-lg border">
                                <p class="text-sm font-mono leading-relaxed" id="inci-list">
                                    {{ inciList.join(', ') }}
                                </p>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">
                                L'ordre INCI suit la concentration décroissante (>1%) conformément au Règlement UE.
                            </p>
                        </div>

                        <!-- Validation UE détaillée -->
                        <div class="border rounded-xl overflow-hidden">
                            <div class="bg-gray-50 px-6 py-4 border-b">
                                <h3 class="font-semibold text-lg flex items-center gap-2">
                                    <span>✅</span>
                                    Validation réglementaire UE
                                </h3>
                            </div>
                            <div class="p-6">
                                <div class="space-y-4">
                                    <div v-for="check in regulatoryChecks"
                                         :key="check.name"
                                         class="flex items-start gap-3">
                                        <span :class="[
                                            'flex-shrink-0 mt-1',
                                            check.passed ? 'text-green-500' : 'text-red-500'
                                        ]">
                                            {{ check.passed ? '✓' : '✗' }}
                                        </span>
                                        <div class="flex-1">
                                            <p class="font-medium">{{ check.name }}</p>
                                            <p class="text-sm text-gray-600">{{ check.description }}</p>
                                            <p v-if="!check.passed" class="text-sm text-red-600 mt-1">
                                                {{ check.error }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Mentions obligatoires -->
                                <div v-if="mandatoryMentions.length > 0" class="mt-6 pt-6 border-t">
                                    <h4 class="font-semibold text-gray-900 mb-3">📝 Mentions obligatoires</h4>
                                    <ul class="space-y-2">
                                        <li v-for="mention in mandatoryMentions"
                                            :key="mention"
                                            class="flex items-start gap-2 text-sm">
                                            <span class="text-amber-500 mt-1">•</span>
                                            <span>{{ mention }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Section 5: Actions finales -->
                    <section id="actions" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900 mb-2">Finaliser la formule</h2>
                                <p class="text-gray-600">
                                    Enregistrez votre formule ou générez des documents réglementaires
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-3">
                                <!-- Validation préalable -->
                                <div v-if="!isValid" class="mb-4 sm:mb-0">
                                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p class="text-sm text-red-700 font-medium">
                                            Veuillez corriger les erreurs avant d'enregistrer
                                        </p>
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <button
                                        @click="saveDraft"
                                        class="btn-secondary"
                                        :disabled="saving">
                                        <span v-if="saving">⏳</span>
                                        <span>💾 Sauvegarder brouillon</span>
                                    </button>

                                    <button
                                        @click="save"
                                        :disabled="!isValid || saving"
                                        class="btn-primary"
                                        :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
                                        :aria-disabled="!isValid || saving">
                                        <template v-if="saving">
                                            <span class="animate-spin mr-2">⏳</span>
                                            Enregistrement...
                                        </template>
                                        <template v-else>
                                            <span>✅</span>
                                            {{ isEditMode ? 'Mettre à jour' : 'Enregistrer la formule' }}
                                        </template>
                                    </button>

                                    <button
                                        @click="cancel"
                                        type="button"
                                        class="btn-outline">
                                        <span>↩️</span>
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Informations d'enregistrement -->
                        <div v-if="isEditMode" class="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div class="flex items-center gap-2 text-sm text-blue-700">
                                <span>📅</span>
                                <span>
                                    Dernière modification: {{ formatDate(props.initialData.updatedAt) }}
                                </span>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <!-- Footer -->
            <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="text-center text-sm text-gray-500">
                    <p>
                        Cet outil fournit des recommandations techniques basées sur le Règlement UE 1223/2009.
                        Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable de la Conformité.
                    </p>
                    <p class="mt-2">
                        Version 2.0 • Dernière mise à jour: {{ currentDate }}
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted } from "vue"
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

// Réactivité
const formData = reactive({
    name: "",
    volume: 50,
    skinType: "mixte",
    selectedHE: [],
    formulaType: "creme",
    spf: 0,
    preservativeSystem: "phenoxyethanol"
})

// Profils de peau enrichis
const skinProfiles = {
    seche: {
        oil: 25,
        maxActives: 3,
        description: "Peau déshydratée, besoin en nutrition élevé",
        recommendations: ["Actifs hydratants", "Émollients riches"]
    },
    grasse: {
        oil: 15,
        maxActives: 2,
        description: "Sécrétion sébacée importante, pores dilatés",
        recommendations: ["Actifs séborégulateurs", "Textures légères"]
    },
    sensible: {
        oil: 20,
        maxActives: 2,
        description: "Réactivité cutanée élevée, tolérance limitée",
        recommendations: ["Actifs apaisants", "Formules minimalistes"]
    },
    mixte: {
        oil: 18,
        maxActives: 3,
        description: "Combinaison de zones sèches et grasses",
        recommendations: ["Équilibre hydratation", "Actifs régulateurs"]
    },
    mature: {
        oil: 22,
        maxActives: 3,
        description: "Besoins anti-âge et restructuration",
        recommendations: ["Actifs anti-âge", "Stimulateurs collagène"]
    }
}

const skinProfilesOptions = computed(() => {
    return Object.entries(skinProfiles).map(([key, value]) => ({
        value: key,
        label: key,
        icon: key === 'seche' ? '🏜️' : key === 'grasse' ? '💦' : key === 'sensible' ? '🌡️' : key === 'mixte' ? '⚖️' : '👵',
        iconLabel: key === 'seche' ? 'Icône peau sèche' : key === 'grasse' ? 'Icône peau grasse' : key === 'sensible' ? 'Icône peau sensible' : key === 'mixte' ? 'Icône peau mixte' : 'Icône peau mature',
        oil: value.oil,
        maxActives: value.maxActives
    }))
})

// Actifs cosmétiques enrichis
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
        compatibility: ['B5', 'Niacinamide']
    },
    {
        key: 'b5',
        label: 'Panthénol (B5)',
        min: 0.5,
        max: 5,
        percent: 2,
        enabled: false,
        inci: 'Panthenol',
        type: 'réparateur',
        description: 'Provitamine B5, favorise la régénération cutanée',
        stability: 'stable',
        compatibility: ['HA', 'Niacinamide']
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
        compatibility: ['Vitamine C', 'Ferulic Acid']
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
        restrictions: 'Ne pas combiner avec rétinol'
    }
])

// Systèmes de conservation selon UE
const preservativeSystems = [
    { id: 'phenoxyethanol', name: 'Phénoxyéthanol (max 1%)', max: 1 },
    { id: 'paraben-free', name: 'Système sans parabènes', max: null },
    { id: 'organic', name: 'Conservateurs naturels', max: null }
]

// Huiles essentielles avec données IFRA et restrictions
const essentialOils = {
    'Anti-âge': [
        {
            name: 'Encens (Boswellia)',
            allergen: false,
            pregnancy: true,
            photo: false,
            maxFace: 0.5,
            ifra: 0.6,
            restrictions: ['Non irritant à dose correcte'],
            benefits: ['Antirides', 'Raffermissant']
        },
        {
            name: 'Ciste (Cistus)',
            allergen: true,
            pregnancy: false,
            photo: false,
            maxFace: 0.3,
            ifra: 0.4,
            restrictions: ['Allergène majeur'],
            benefits: ['Cicatrisant', 'Antibactérien']
        }
    ],
    'Hydratation & Éclat': [
        {
            name: 'Lavande vraie',
            allergen: false,
            pregnancy: true,
            photo: false,
            maxFace: 1,
            ifra: 1.2,
            restrictions: [],
            benefits: ['Apaisante', 'Équilibrante']
        }
    ]
}

// États
const saving = ref(false)
const errors = ref({})
const isEditMode = ref(false)
const currentDate = ref(new Date().toLocaleDateString('fr-FR'))

// Sections pour navigation
const sections = [
    { id: 'basic-info', name: 'Informations' },
    { id: 'actives', name: 'Actifs' },
    { id: 'essential-oils', name: 'HE' },
    { id: 'analysis', name: 'Analyse' },
    { id: 'actions', name: 'Actions' }
]

// Calculs
const grams = (percent) => Number(((formData.volume * percent) / 100).toFixed(2))

// Actifs activés
const enabledActivesCount = computed(() =>
    actives.filter(a => a.enabled).length
)

// Total HE
const heTotal = computed(() =>
    formData.selectedHE.reduce((sum, oil) => sum + oil.percent, 0)
)

// Phases calculées
const oilPhase = computed(() => skinProfiles[formData.skinType]?.oil || 20)
const oilPhaseGrams = computed(() => grams(oilPhase.value))
const waterPhase = computed(() => Math.max(0, 100 - oilPhase.value - totalPercent.value))
const waterPhaseGrams = computed(() => grams(waterPhase.value))

// Total actifs + HE
const totalPercent = computed(() => {
    const activesSum = actives.filter(a => a.enabled).reduce((s, a) => s + a.percent, 0)
    return activesSum + heTotal.value
})

// Phase data for visualization
const phases = computed(() => [
    {
        name: 'Huileuse',
        percent: oilPhase.value,
        grams: oilPhaseGrams.value,
        color: '#FBBF24',
        icon: '🟡',
        description: 'Émollients, huiles'
    },
    {
        name: 'Aqueuse',
        percent: waterPhase.value,
        grams: waterPhaseGrams.value,
        color: '#60A5FA',
        icon: '🔵',
        description: 'Eau, hydrosols'
    },
    {
        name: 'Actifs',
        percent: totalPercent.value,
        grams: grams(totalPercent.value),
        color: '#34D399',
        icon: '🟢',
        description: 'Actifs fonctionnels'
    },
    {
        name: 'Émulsifiant',
        percent: 5,
        grams: grams(5),
        color: '#A78BFA',
        icon: '🟣',
        description: 'Stabilisateur'
    }
])

// Liste INCI
const inciList = computed(() => {
    const list = ['Aqua']

    // Actifs par concentration décroissante (>1%)
    const significantActives = actives
        .filter(a => a.enabled && a.percent >= 1)
        .sort((a, b) => b.percent - a.percent)

    significantActives.forEach(a => list.push(a.inci))

    // Huiles essentielles
    if (heTotal.value > 0) {
        list.push('Parfum (Fragrance)')
    }

    // Émulsifiant
    list.push('Cetearyl Alcohol', 'Glyceryl Stearate')

    // Conservateur selon choix
    if (formData.preservativeSystem === 'phenoxyethanol') {
        list.push('Phenoxyethanol')
    }

    return list
})

// Validation réglementaire avancée
const regulatoryChecks = computed(() => [
    {
        name: 'Limite huiles essentielles (UE 1223/2009)',
        description: 'Maximum 1% d\'HE total dans les produits visage',
        passed: heTotal.value <= 1,
        error: `Dépassement: ${heTotal.value.toFixed(2)}% > 1%`
    },
    {
        name: 'Plages d\'utilisation des actifs',
        description: 'Respect des plages recommandées',
        passed: actives.every(a => !a.enabled || (a.percent >= a.min && a.percent <= a.max)),
        error: 'Un ou plusieurs actifs hors plage recommandée'
    },
    {
        name: 'Somme des phases ≤ 100%',
        description: 'Cohérence de la formulation',
        passed: waterPhase.value >= 0,
        error: 'La somme des phases dépasse 100%'
    },
    {
        name: 'Conservateur conforme',
        description: 'Système de conservation adapté',
        passed: formData.preservativeSystem !== null,
        error: 'Sélectionnez un système de conservation'
    },
    {
        name: 'Mentions allergènes',
        description: 'Huiles essentielles allergènes déclarées',
        passed: !formData.selectedHE.some(he => he.allergen) || heTotal.value <= 0.01,
        error: 'HE allergènes nécessitent mention obligatoire'
    }
])

const regulatoryErrors = computed(() =>
    regulatoryChecks.value.filter(check => !check.passed).map(check => check.error)
)

const regulatoryStatus = computed(() => ({
    isValid: regulatoryErrors.value.length === 0,
    errors: regulatoryErrors.value,
    warnings: heWarnings.value
}))

// Mentions obligatoires selon UE
const mandatoryMentions = computed(() => {
    const mentions = []

    // Mentions SPF
    if (formData.spf > 0) {
        mentions.push(`SPF ${formData.spf}`)
        if (formData.spf >= 50) {
            mentions.push('SPF 50+')
        }
    }

    // Mentions HE
    if (heTotal.value > 0) {
        mentions.push('Contient des huiles essentielles')

        // Mentions spécifiques
        if (formData.selectedHE.some(he => !he.pregnancy)) {
            mentions.push('Déconseillé pendant la grossesse')
        }
        if (formData.selectedHE.some(he => he.photo)) {
            mentions.push('Éviter l\'exposition au soleil après application')
        }
    }

    // Mentions actifs
    actives.filter(a => a.enabled).forEach(a => {
        if (a.key === 'bha') {
            mentions.push('Utiliser avec protection solaire')
        }
    })

    return mentions
})

// Avertissements HE
const heWarnings = computed(() => {
    const warnings = []

    if (heTotal.value > 1) {
        warnings.push(`Dépassement limite UE: ${heTotal.value.toFixed(2)}% > 1%`)
    }

    formData.selectedHE.forEach(oil => {
        if (!oil.pregnancy) {
            warnings.push(`${oil.name}: contre-indiqué pendant la grossesse`)
        }
        if (oil.photo) {
            warnings.push(`${oil.name}: photosensibilisante - protection solaire requise`)
        }
        if (oil.allergen) {
            warnings.push(`${oil.name}: potentiel allergène - mention obligatoire`)
        }
    })

    return warnings
})

// Pourcentage de complétion
const completionPercentage = computed(() => {
    let percentage = 0

    // Nom (20%)
    if (formData.name.trim().length > 0) percentage += 20

    // Volume (10%)
    if (formData.volume > 0) percentage += 10

    // Type de peau (10%)
    if (formData.skinType) percentage += 10

    // Actifs (20%)
    if (enabledActivesCount.value > 0) percentage += 20

    // Phases cohérentes (20%)
    if (waterPhase.value >= 0) percentage += 20

    // Validation (20%)
    if (regulatoryStatus.value.isValid) percentage += 20

    return Math.min(percentage, 100)
})

// Trop d'actifs
const tooManyActives = computed(() =>
    enabledActivesCount.value > (skinProfiles[formData.skinType]?.maxActives || 3)
)

// HE par catégorie
const gramsByHECategory = computed(() => {
    const result = {}
    for (const [cat, oils] of Object.entries(essentialOils)) {
        const selectedOils = oils.filter(oil => formData.selectedHE.find(h => h.name === oil.name))
        const catPercent = selectedOils.reduce((sum, o) => {
            const he = formData.selectedHE.find(h => h.name === o.name)
            return sum + (he?.percent || 0)
        }, 0)
        result[cat] = { percent: catPercent, grams: grams(catPercent) }
    }
    return result
})

// Méthodes
const toggleHE = (oil) => {
    const idx = formData.selectedHE.findIndex(h => h.name === oil.name)
    if (idx === -1) {
        if (heTotal.value + (oil.maxFace || 0.2) <= 1) {
            formData.selectedHE.push({
                ...oil,
                percent: oil.maxFace || 0.2,
                category: Object.keys(essentialOils).find(cat =>
                    essentialOils[cat].some(o => o.name === oil.name)
                )
            })
        }
    } else {
        formData.selectedHE.splice(idx, 1)
    }
}

const getActiveRangeClass = (active) => {
    const percent = active.percent
    const range = (active.max - active.min) / 3
    if (percent < active.min + range) return 'range-low'
    if (percent > active.max - range) return 'range-high'
    return 'range-optimal'
}

const getWarningClass = (warning) => {
    if (warning.includes('Dépassement')) return 'border-red-500 bg-red-50'
    if (warning.includes('grossesse')) return 'border-amber-500 bg-amber-50'
    if (warning.includes('photosens')) return 'border-orange-500 bg-orange-50'
    return 'border-yellow-500 bg-yellow-50'
}

const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        element.focus({ preventScroll: true })
    }
}

const copyINCI = async () => {
    await copy(inciList.value.join(', '))
    // Afficher un message de confirmation temporaire
}

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

const generateReport = () => {
    // Générer un PDF avec toutes les informations
    console.log('Génération du rapport PDF...')
}

const exportFormula = () => {
    // Exporter au format JSON ou Excel
    const exportData = {
        ...formData,
        actives: actives.filter(a => a.enabled),
        phases: phases.value,
        regulatoryStatus: regulatoryStatus.value,
        inci: inciList.value
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `formule-${formData.name.replace(/\s+/g, '-')}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
}

// Validation
const isValid = computed(() => {
    return formData.name.trim().length > 0 &&
        formData.volume > 0 &&
        formData.skinType &&
        regulatoryStatus.value.isValid
})

const validateForm = () => {
    errors.value = {}

    if (!formData.name.trim()) {
        errors.value.name = "Le nom est requis"
        return false
    }

    if (formData.name.length > 100) {
        errors.value.name = "Maximum 100 caractères"
        return false
    }

    if (formData.volume <= 0 || formData.volume > 1000) {
        errors.value.volume = "Volume invalide (1-1000 ml)"
        return false
    }

    if (!formData.skinType) {
        errors.value.skinType = "Sélectionnez un type de peau"
        return false
    }

    return true
}

// Écouteurs
watch(() => props.initialData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        isEditMode.value = true

        // Remplir le formulaire
        Object.assign(formData, {
            name: newData.name || "",
            volume: newData.volume || 50,
            skinType: newData.skinType || "mixte",
            selectedHE: newData.selectedHE || [],
            formulaType: newData.formulaType || "creme",
            spf: newData.spf || 0,
            preservativeSystem: newData.preservativeSystem || "phenoxyethanol"
        })

        // Actifs
        actives.forEach(active => {
            active.enabled = false
            if (newData.actives) {
                const savedActive = newData.actives.find(a => a.key === active.key)
                if (savedActive) {
                    active.enabled = true
                    active.percent = savedActive.percent
                }
            }
        })
    }
}, { immediate: true })

// Sauvegarde
const save = async () => {
    if (!validateForm()) return

    saving.value = true

    // Préparer les données
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
        formulaType: formData.formulaType,
        spf: formData.spf,
        preservativeSystem: formData.preservativeSystem,

        // Ingrédients
        ingredients: generateIngredients(),
        actives: actives.filter(a => a.enabled).map(a => ({
            key: a.key,
            label: a.label,
            percent: a.percent,
            inci: a.inci
        })),
        selectedHE: formData.selectedHE.map(he => ({
            name: he.name,
            percent: he.percent,
            category: he.category,
            warnings: [
                ...(!he.pregnancy ? ["grossesse"] : []),
                ...(he.photo ? ["photosensibilisant"] : []),
                ...(he.allergen ? ["allergène"] : [])
            ]
        })),

        // Calculs
        phases: phases.value,
        regulatoryStatus: regulatoryStatus.value,
        inciList: inciList.value,
        mandatoryMentions: mandatoryMentions.value,

        // Métadonnées
        version: "2.0",
        compliance: {
            euRegulation: "1223/2009",
            ifra: formData.selectedHE.every(he => he.percent <= (he.ifra || 1)),
            spf: formData.spf > 0 ? "norme ISO 24444" : null
        }
    }

    emit("save", formulaData)
    saving.value = false
}

const saveDraft = () => {
    emit("save-draft", {
        ...formData,
        actives: actives.filter(a => a.enabled),
        isDraft: true,
        savedAt: new Date().toISOString()
    })
}

const cancel = () => {
    emit("cancel")
    if (!emit.cancel) {
        router.push(isEditMode.value ? `/formule/${props.initialData.id}` : '/formules')
    }
}

const generateDescription = () => {
    return `${formData.name} - Formule pour peau ${formData.skinType}
• Volume: ${formData.volume}ml
• Actifs: ${actives.filter(a => a.enabled).map(a => `${a.label} ${a.percent}%`).join(', ')}
• HE: ${formData.selectedHE.map(h => `${h.name} ${h.percent}%`).join(', ') || 'Aucune'}
• Validation UE: ${regulatoryStatus.value.isValid ? 'Conforme' : 'Non conforme'}
• INCI: ${inciList.value.slice(0, 3).join(', ')}...`
}

const generateIngredients = () => {
    const ingredients = []

    // Actifs
    actives.filter(a => a.enabled).forEach(a => {
        ingredients.push({
            name: a.label,
            quantity: a.percent,
            unit: "%",
            type: "active",
            inci: a.inci,
            function: a.type
        })
    })

    // Huiles essentielles
    formData.selectedHE.forEach(he => {
        ingredients.push({
            name: `HE ${he.name}`,
            quantity: he.percent,
            unit: "%",
            type: "essential_oil",
            category: he.category,
            warnings: [
                ...(!he.pregnancy ? ["grossesse"] : []),
                ...(he.photo ? ["photosensibilisant"] : []),
                ...(he.allergen ? ["allergène"] : [])
            ]
        })
    })

    return ingredients
}

// Initialisation
onMounted(() => {
    // Focus sur le premier champ
    const firstInput = document.querySelector('input')
    if (firstInput) {
        firstInput.focus()
    }

    // Navigation clavier
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            save()
        }
    })
})
</script>

<style scoped>
/* Styles améliorés pour accessibilité et design */
.input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200
    placeholder-gray-400
    disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.input-error {
    @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.label {
    @apply block text-sm font-semibold text-gray-700 mb-2
    tracking-wide;
}

.label.required::after {
    content: " *";
    @apply text-red-500;
}

.error-message {
    @apply mt-1 text-sm text-red-600;
}

.help-text {
    @apply mt-1 text-sm text-gray-500;
}

.skin-type-card {
    @apply border-2 rounded-xl p-4 cursor-pointer
    transition-all duration-300
    hover:shadow-md;
}

.skin-type-card-selected {
    @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
}

.skin-type-card-default {
    @apply border-gray-200 hover:border-blue-300;
}

.active-card {
    @apply bg-gray-50 rounded-xl p-4 border border-gray-200
    hover:bg-white hover:border-gray-300
    transition-all duration-300;
}

.oil-item {
    @apply py-3 border-b border-gray-100 last:border-b-0;
}

.phase-card {
    @apply bg-white border border-gray-200 rounded-xl p-4
    hover:shadow-md transition-all duration-300;
}

.phase-card-header {
    @apply flex items-center gap-2 mb-3;
}

.phase-icon {
    @apply text-xl;
}

.phase-name {
    @apply font-semibold text-gray-900;
}

.phase-values {
    @apply flex justify-between items-baseline mb-2;
}

.phase-percent {
    @apply text-2xl font-bold;
}

.phase-grams {
    @apply text-sm text-gray-500;
}

.phase-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2;
}

.phase-bar-fill {
    @apply h-full rounded-full transition-all duration-500;
    background-color: var(--phase-color);
}

.phase-details {
    @apply text-xs text-gray-500;
}

.btn-primary {
    @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700
    text-white font-semibold rounded-lg
    hover:from-blue-700 hover:to-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2;
}

.btn-secondary {
    @apply px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg
    hover:bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2;
}

.btn-outline {
    @apply px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg
    hover:border-gray-400 hover:bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    transition-all duration-200
    flex items-center justify-center gap-2;
}

/* Range slider styling */
input[type="range"] {
    @apply appearance-none;
}

input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none h-5 w-5 rounded-full bg-blue-600
    cursor-pointer border-2 border-white shadow-lg;
}

input[type="range"]::-moz-range-thumb {
    @apply h-5 w-5 rounded-full bg-blue-600
    cursor-pointer border-2 border-white shadow-lg;
}

.range-low::-webkit-slider-thumb {
    @apply bg-amber-500;
}

.range-high::-webkit-slider-thumb {
    @apply bg-red-500;
}

.range-optimal::-webkit-slider-thumb {
    @apply bg-green-500;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

section {
    animation: fadeIn 0.5s ease-out;
}

/* Responsive design */
@media (max-width: 768px) {
    .skin-type-card {
        @apply p-3;
    }

    .active-card {
        @apply p-3;
    }

    .phase-card {
        @apply p-3;
    }

    .btn-primary,
    .btn-secondary,
    .btn-outline {
        @apply px-4 py-2 text-sm;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .input-field {
        @apply border-2;
    }

    .skin-type-card-selected {
        @apply border-4;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>