<template>
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
                           v-model="localFormData.name"
                           type="text"
                           maxlength="100"
                           placeholder="Ex: Crème hydratante réparatrice pour peaux sensibles"
                           :class="['input-field pl-10', errors.name ? 'input-error' : 'input-valid']"
                           required
                           aria-required="true"
                           aria-describedby="name-help name-error"
                           @input="$emit('clear-error', 'name')">
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
            {{ localFormData.name.length }}/100 caractères
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
                           v-model.number="localFormData.volume"
                           type="number"
                           min="1"
                           max="1000"
                           step="1"
                           :class="['input-field pr-12', errors.volume ? 'input-error' : 'input-valid']"
                           required
                           aria-required="true"
                           aria-describedby="volume-help volume-error"
                           @change="$emit('validate-volume')">
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
                                @click="updateVolume(30)"
                                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                            30ml
                        </button>
                        <button type="button"
                                @click="updateVolume(50)"
                                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                            50ml
                        </button>
                        <button type="button"
                                @click="updateVolume(100)"
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
                   localFormData.skinType === profile.value
                     ? 'skin-type-card-selected ring-2 ring-offset-2'
                     : 'skin-type-card-default'
                 ]"
                           :style="{ '--ring-color': profile.color }">
                        <input type="radio"
                               v-model="localFormData.skinType"
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
                        <div v-if="localFormData.skinType === profile.value"
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    selectedSkinProfile: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:form-data', 'clear-error', 'validate-volume'])

const localFormData = computed({
    get: () => props.formData,
    set: (value) => emit('update:form-data', value)
})

const skinProfilesOptions = computed(() => {
    return [
        {
            value: 'seche',
            label: 'Sèche',
            icon: '🏜️',
            iconLabel: 'Icône peau sèche',
            oil: 25,
            maxActives: 3,
            description: 'Peau déshydratée, besoin en nutrition élevé',
            color: '#f59e0b',
            tips: [
                "Privilégiez les huiles riches (avocat, amande douce)",
                "Utilisez des actifs hydratants (acide hyaluronique, B5)",
                "Évitez les textures trop légères",
                "Incorporez des émollients nourrissants"
            ]
        },
        {
            value: 'grasse',
            label: 'Grasse',
            icon: '💦',
            iconLabel: 'Icône peau grasse',
            oil: 15,
            maxActives: 2,
            description: 'Sécrétion sébacée importante, pores dilatés',
            color: '#10b981',
            tips: [
                "Optez pour des huiles légères (jojoba, noisette)",
                "Utilisez des actifs séborégulateurs (acide salicylique)",
                "Privilégiez les textures fluides",
                "Évitez les formules trop riches"
            ]
        },
        {
            value: 'sensible',
            label: 'Sensible',
            icon: '🌡️',
            iconLabel: 'Icône peau sensible',
            oil: 18,
            maxActives: 2,
            description: 'Réactivité cutanée élevée, tolérance limitée',
            color: '#ef4444',
            tips: [
                "Choisissez des ingrédients apaisants (camomille, calendula)",
                "Limitez le nombre d'actifs",
                "Évitez les parfums et alcools",
                "Testez toujours la formule sur une petite zone"
            ]
        },
        {
            value: 'mixte',
            label: 'Mixte',
            icon: '⚖️',
            iconLabel: 'Icône peau mixte',
            oil: 20,
            maxActives: 3,
            description: 'Combinaison de zones sèches et grasses',
            color: '#8b5cf6',
            tips: [
                "Équilibrez hydratation et légèreté",
                "Ciblez les zones avec des actifs spécifiques",
                "Utilisez des textures adaptées aux deux types",
                "Évitez les formules trop lourdes"
            ]
        },
        {
            value: 'mature',
            label: 'Mature',
            icon: '👵',
            iconLabel: 'Icône peau mature',
            oil: 22,
            maxActives: 3,
            description: 'Besoins anti-âge et restructuration',
            color: '#ec4899',
            tips: [
                "Intégrez des actifs anti-âge (vitamines C et E)",
                "Utilisez des huiles régénérantes (rose musquée, argan)",
                "Privilégiez les textures nourrissantes",
                "Incorporez des antioxydants"
            ]
        }
    ]
})

const updateVolume = (volume) => {
    localFormData.value.volume = volume
    emit('validate-volume')
}
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
.skin-type-card {
  @apply border-2 rounded-xl cursor-pointer
  transition-all duration-300
  hover:shadow-lg;
}

</style>