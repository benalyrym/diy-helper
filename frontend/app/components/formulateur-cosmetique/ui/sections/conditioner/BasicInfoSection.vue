<template>
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
</template>

<script setup>
defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  hairProfilesOptions: { type: Array, required: true },
  selectedHairProfile: { type: Object, default: null },
  clearError: { type: Function, required: true },
  validateVolume: { type: Function, required: true }
})
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


/* Range sliders */
input[type="range"] {
  @apply appearance-none bg-transparent;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none h-5 w-5 rounded-full
  border-4 border-white shadow-xl
  cursor-pointer;
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
.hair-type-card {
  @apply border-2 rounded-xl cursor-pointer
  transition-all duration-300
  hover:shadow-lg;
}

</style>