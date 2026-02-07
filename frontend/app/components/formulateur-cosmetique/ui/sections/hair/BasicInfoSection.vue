<template>
  <section
      id="hair-info"
      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn"
  >
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">💇‍♀️</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Informations capillaires</h2>
        <p class="text-gray-600">Définissez les caractéristiques principales de votre formule pour cheveux</p>
        <div class="mt-2 text-sm text-purple-600 font-medium">
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
        <label for="formula-name" class="label required">Nom de la formule *</label>
        <div class="relative">
          <input
              id="formula-name"
              v-model="localFormData.name"
              type="text"
              maxlength="100"
              placeholder="Ex: Après-shampoing nutritif réparateur"
              :class="['input-field pl-10', errors.name ? 'input-error' : 'input-valid']"
              required
              aria-required="true"
              aria-describedby="name-help name-error"
              @input="$emit('clear-error', 'name')"
          />
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✏️</span>
        </div>

        <div class="flex justify-between items-center">
          <p v-if="errors.name" id="name-error" class="error-message flex items-center gap-1">
            <span>❌</span>
            {{ errors.name }}
          </p>
          <span class="text-xs text-gray-400 ml-auto">{{ localFormData.name.length }}/100 caractères</span>
        </div>

        <p id="name-help" class="help-text">
          Donnez un nom descriptif à votre formule pour faciliter son identification
        </p>
      </div>

      <!-- Volume total -->
      <div class="space-y-2">
        <label for="formula-volume" class="label required">Volume total *</label>
        <div class="relative">
          <input
              id="formula-volume"
              v-model.number="localFormData.volume"
              type="number"
              min="1"
              max="1000"
              step="1"
              :class="['input-field pr-12', errors.volume ? 'input-error' : 'input-valid']"
              required
              aria-required="true"
              aria-describedby="volume-help volume-error"
              @change="$emit('validate-volume')"
          />
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">ml</span>
        </div>

        <div class="flex justify-between">
          <p v-if="errors.volume" id="volume-error" class="error-message flex items-center gap-1">
            <span>❌</span>
            {{ errors.volume }}
          </p>

          <div class="flex gap-2 ml-auto">
            <button
                type="button"
                @click="updateVolume(100)"
                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              100ml
            </button>
            <button
                type="button"
                @click="updateVolume(200)"
                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              200ml
            </button>
            <button
                type="button"
                @click="updateVolume(250)"
                class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              250ml
            </button>
          </div>
        </div>

        <p id="volume-help" class="help-text">
          Volume final du produit fini. Recommandé: 100–250 ml pour shampoing / après-shampoing
        </p>
      </div>

      <!-- Type de cheveux -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <legend class="label required">Type de cheveux cible *</legend>
          <span class="text-sm text-gray-500">Sélectionnez un seul profil</span>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            role="radiogroup"
            aria-label="Types de cheveux"
        >
          <label
              v-for="profile in hairProfilesOptions"
              :key="profile.value"
              :class="[
              'skin-type-card relative overflow-hidden',
              localFormData.hairType === profile.value
                ? 'skin-type-card-selected ring-2 ring-offset-2'
                : 'skin-type-card-default'
            ]"
              :style="{ '--ring-color': profile.color }"
          >
            <input
                type="radio"
                v-model="localFormData.hairType"
                :value="profile.value"
                class="sr-only"
                required
                :aria-labelledby="`hair-label-${profile.value}`"
                :aria-describedby="`hair-desc-${profile.value}`"
                @change="$emit('clear-error', 'hairType')"
            />

            <div class="p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl" :aria-label="profile.iconLabel">{{ profile.icon }}</span>
                <div>
                  <h3 :id="`hair-label-${profile.value}`" class="font-bold text-gray-900 capitalize">
                    {{ profile.label }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ profile.focusLabel }}: {{ profile.focus }}</p>
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
                  <span class="text-gray-500">Recommandations:</span>
                  <span class="font-semibold text-purple-600">Voir</span>
                </div>
              </div>
            </div>

            <div
                v-if="localFormData.hairType === profile.value"
                class="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm">✓</span>
            </div>
          </label>
        </div>

        <!-- Description détaillée du type sélectionné -->
        <div
            v-if="selectedHairProfile"
            class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl border border-purple-200"
        >
          <div class="flex items-start gap-3">
            <span class="text-purple-600 text-xl mt-1">💡</span>
            <div>
              <h4 class="font-semibold text-purple-900 mb-2">
                Conseils pour cheveux {{ selectedHairProfile.label }}
              </h4>
              <ul class="text-sm text-purple-800 space-y-1">
                <li
                    v-for="(tip, index) in selectedHairProfile.tips"
                    :key="index"
                    class="flex items-start gap-2"
                >
                  <span class="text-purple-500">•</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Erreur éventuelle -->
        <p v-if="errors.hairType" class="error-message flex items-center gap-1">
          <span>❌</span>
          {{ errors.hairType }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:form-data', 'clear-error', 'validate-volume'])

const localFormData = computed({
  get: () => props.formData,
  set: (value) => emit('update:form-data', value)
})

const hairProfilesOptions = computed(() => [
  {
    value: 'secs',
    label: 'Secs',
    icon: '🌾',
    iconLabel: 'Icône cheveux secs',
    focusLabel: 'Nutrition',
    focus: 'élevée',
    maxActives: 3,
    description: 'Manque de lipides, pointes ternes, besoin de nutrition et de souplesse',
    color: '#f59e0b',
    tips: [
      "Privilégiez des huiles/beurres (karité, argan, coco) en petite quantité",
      "Ajoutez des humectants (glycérine, panthénol) si la formule le permet",
      "Intégrez des agents conditionneurs (BTMS, polyquats) pour démêlage",
      "Évitez les tensioactifs trop décapants et ajustez le pH (≈ 4.5–5.5)"
    ]
  },
  {
    value: 'gras',
    label: 'Gras',
    icon: '💧',
    iconLabel: 'Icône cheveux gras',
    focusLabel: 'Régulation',
    focus: 'sébum',
    maxActives: 2,
    description: 'Racines grasses, besoin de légèreté et d’actifs purifiants doux',
    color: '#10b981',
    tips: [
      "Optez pour des textures légères (gel/fluide), limitez les huiles",
      "Choisissez des tensioactifs doux et dosez correctement la phase lavante",
      "Ajoutez des actifs purifiants doux (zinc PCA, niacinamide) si compatible",
      "Évitez les silicones/occlusifs lourds et les beurres en excès"
    ]
  },
  {
    value: 'boucles',
    label: 'Bouclés',
    icon: '🌀',
    iconLabel: 'Icône cheveux bouclés',
    focusLabel: 'Définition',
    focus: 'boucles',
    maxActives: 3,
    description: 'Boucles sujettes à la sécheresse, besoin de définition et anti-frisottis',
    color: '#8b5cf6',
    tips: [
      "Misez sur des agents filmogènes/conditionneurs pour anti-frisottis",
      "Combinez humectants + émollients pour garder l’hydratation",
      "Évitez les sulfates forts et privilégiez un nettoyage doux (co-wash possible)",
      "Ajoutez des actifs fortifiants (protéines hydrolysées) avec modération"
    ]
  },
  {
    value: 'fins',
    label: 'Fins',
    icon: '🪶',
    iconLabel: 'Icône cheveux fins',
    focusLabel: 'Volume',
    focus: 'légèreté',
    maxActives: 2,
    description: 'Manque de volume, s’alourdit vite : formules aériennes et peu occlusives',
    color: '#06b6d4',
    tips: [
      "Limitez huiles/beurres, choisissez des émollients légers",
      "Utilisez des polymères/conditionneurs légers (sans excès)",
      "Privilégiez sprays/leave-in légers plutôt que masques riches",
      "Évitez les agents trop gainants qui écrasent la fibre"
    ]
  },
  {
    value: 'abimes',
    label: 'Abîmés',
    icon: '🧩',
    iconLabel: 'Icône cheveux abîmés',
    focusLabel: 'Réparation',
    focus: 'fibre',
    maxActives: 3,
    description: 'Casse, porosité, traitements chimiques : besoin de renforcement et lissage',
    color: '#ef4444',
    tips: [
      "Ajoutez des protéines/aa hydrolysés (kératine, soie) à faible dose",
      "Renforcez le conditionnement pour réduire la casse et faciliter le démêlage",
      "Intégrez des lipides réparateurs (céramides/équivalents si dispo) + huiles",
      "Attention au surdosage en protéines (effet carton) : équilibre avec émollients"
    ]
  }
])

const selectedHairProfile = computed(() =>
    hairProfilesOptions.value.find((p) => p.value === localFormData.value.hairType) || null
)

const updateVolume = (volume) => {
  localFormData.value.volume = volume
  emit('validate-volume')
}
</script>
