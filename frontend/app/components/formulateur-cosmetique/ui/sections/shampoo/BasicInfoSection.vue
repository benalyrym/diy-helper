<template>
  <section id="basic-info" class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <span class="text-blue-600 text-xl">📋</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Informations shampoing</h2>
      <span v-if="!isComplete" class="ml-auto text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
        ⚠️ Incomplet
      </span>
      <span v-else class="ml-auto text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
        ✅ Complet
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Nom de la formule -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 required">
          Nom de la formule
        </label>
        <input
            v-model="formData.name"
            type="text"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            :class="{'border-red-300 bg-red-50': errors.name, 'border-gray-200': !errors.name}"
            placeholder="ex: Shampoing douceur à la lavande"
            @input="validateName"
        />
        <p v-if="errors.name" class="text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span> {{ errors.name }}
        </p>
        <p v-else class="text-sm text-gray-500">
          Donnez un nom unique à votre création
        </p>
      </div>

      <!-- Volume -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 required">
          Volume (ml)
        </label>
        <div class="relative">
          <input
              v-model.number="formData.volume"
              type="number"
              min="50"
              max="1000"
              step="50"
              class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{'border-red-300 bg-red-50': errors.volume, 'border-gray-200': !errors.volume}"
              @input="validateVolume"
          />
          <span class="absolute right-4 top-3 text-gray-400">ml</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">Min: 50ml</span>
          <span class="text-gray-500">Max: 1000ml</span>
        </div>
        <input
            type="range"
            v-model.number="formData.volume"
            min="50"
            max="1000"
            step="50"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-blue"
        />
      </div>
    </div>

    <!-- Type de cheveux -->
    <div class="space-y-3">
      <label class="block text-sm font-semibold text-gray-700 required">
        Type de cheveux
      </label>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
            v-for="profile in hairProfilesOptions"
            :key="profile.value"
            @click="selectHairType(profile.value)"
            class="p-4 border-2 rounded-xl transition-all duration-200 text-center"
            :class="formData.hairType === profile.value
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'"
        >
          <div class="text-2xl mb-1">
            {{ getHairTypeEmoji(profile.value) }}
          </div>
          <div class="font-medium text-sm">{{ profile.label }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ profile.description }}</div>
        </button>
      </div>
    </div>

    <!-- Description (optionnelle) -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700">
        Description / Notes
      </label>
      <textarea
          v-model="formData.description"
          rows="3"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Objectifs, particularités, inspiration..."
      ></textarea>
    </div>

    <!-- Résumé des spécifications -->
    <div v-if="selectedHairProfile" class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <h3 class="font-semibold text-blue-800 mb-2 flex items-center gap-2">
        <span>📊</span> Spécifications pour cheveux {{ selectedHairProfile.name }}
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="text-blue-600">Base lavante:</span>
          <span class="font-medium ml-1">{{ selectedHairProfile.surfactant_min }}-{{ selectedHairProfile.surfactant_max }}%</span>
        </div>
        <div>
          <span class="text-blue-600">Conditionneurs:</span>
          <span class="font-medium ml-1">{{ selectedHairProfile.conditioning_min }}-{{ selectedHairProfile.conditioning_max }}%</span>
        </div>
        <div>
          <span class="text-blue-600">pH idéal:</span>
          <span class="font-medium ml-1">{{ selectedHairProfile.ph_min }}-{{ selectedHairProfile.ph_max }}</span>
        </div>
        <div>
          <span class="text-blue-600">Ratio tensioactifs:</span>
          <span class="font-medium ml-1">{{ selectedHairProfile.surfactant_ratio }}% primaires</span>
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
  hairProfilesOptions: {
    type: Array,
    default: () => []
  },
  selectedHairProfile: {
    type: Object,
    default: null
  },
  clearError: {
    type: Function,
    default: () => {}
  },
  validateVolume: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['update:formData'])

const isComplete = computed(() => {
  return props.formData?.name?.trim()?.length > 0 &&
      props.formData?.volume >= 50 &&
      props.formData?.hairType
})

const validateName = () => {
  if (!props.formData.name?.trim()) {
    props.clearError('name')
  }
}

const selectHairType = (value) => {
  props.formData.hairType = value
  props.clearError('hairType')
}

const getHairTypeEmoji = (type) => {
  const emojis = {
    normal: '🟤',
    sec: '🏜️',
    gras: '💧',
    mixte: '⚖️',
    fragile: '🩹',
    enfant: '👶'
  }
  return emojis[type] || '💇'
}
</script>