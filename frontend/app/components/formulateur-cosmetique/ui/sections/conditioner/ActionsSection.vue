<template>
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
    <div v-if="isEditMode && initialData.updatedAt"
         class="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
      <div class="flex items-center gap-3">
        <span class="text-indigo-600 text-xl">📅</span>
        <div>
          <p class="text-sm font-medium text-indigo-700">
            Dernière modification
          </p>
          <p class="text-sm text-indigo-600">
            {{ formatDate(initialData.updatedAt) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  isValid: { type: Boolean, required: true },
  saving: { type: Boolean, required: true },
  isEditMode: { type: Boolean, required: true },
  initialData: { type: Object, default: () => ({}) },
  saveDraft: { type: Function, required: true },
  save: { type: Function, required: true },
  cancel: { type: Function, required: true },
  formatDate: { type: Function, required: true }
})
</script>
