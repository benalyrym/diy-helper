<template>
  <section id="actions" class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
      <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
        <span class="text-gray-600 text-xl">🎯</span>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Finalisation</h2>
    </div>

    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <!-- Informations de sauvegarde -->
      <div class="text-sm text-gray-500">
        <div v-if="isEditMode && initialData?.updatedAt">
          Dernière modification: {{ formatDate(initialData.updatedAt) }}
        </div>
        <div v-else>
          Nouvelle formule - non enregistrée
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
            @click="saveDraft"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            :disabled="saving"
        >
          <span>💾</span>
          Brouillon
        </button>

        <button
            @click="save"
            class="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isValid || saving"
        >
          <span v-if="saving" class="animate-spin">⏳</span>
          <span v-else>✅</span>
          {{ isEditMode ? 'Mettre à jour' : 'Enregistrer' }}
        </button>

        <button
            @click="cancel"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Message d'erreur si non valide -->
    <div v-if="!isValid" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <span class="text-red-600 text-xl">❌</span>
        <div>
          <h3 class="font-semibold text-red-800">Formule non conforme</h3>
          <p class="text-sm text-red-600">
            {{ regulatoryErrors?.length }} erreur(s) à corriger avant enregistrement
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  isValid: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  saveDraft: {
    type: Function,
    default: () => {}
  },
  save: {
    type: Function,
    default: async () => {}
  },
  cancel: {
    type: Function,
    default: () => {}
  },
  formatDate: {
    type: Function,
    default: () => ''
  }
})

defineEmits(['save', 'save-draft', 'cancel'])
</script>