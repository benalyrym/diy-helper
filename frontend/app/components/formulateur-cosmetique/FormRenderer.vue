<!-- components/formulateur-cosmetique/FormRenderer.vue -->
<template>
  <div>
    <!-- Formulaire dynamique selon le type -->
    <component
        :is="currentFormComponent"
        v-if="currentFormComponent && recipeType"
        :recipe-type="recipeType"
        :initial-data="initialData"
        @save="handleSave"
        @cancel="handleCancel"
    />

    <!-- Message si pas de type -->
    <div v-else class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Type de recette non sélectionné</h3>
      <p class="text-gray-600">Veuillez sélectionner un type de recette pour continuer</p>
      <NuxtLink
          to="/recettes"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Choisir un type
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{
  recipeType: any
  initialData?: any
}>()

const emit = defineEmits<{
  save: [data: any]
  cancel: []
}>()

const formComponents: Record<string, any> = {
  // Soins de la peau
  'face_cream': defineAsyncComponent(() =>
      import('./forms/FaceCreamForm.vue')
  ),
  'conditioner': defineAsyncComponent(() =>
      import('./forms/ConditionerForm.vue')
  ),
 /*   'face_serum': defineAsyncComponent(() =>
      import('./forms/SerumForm.vue')
  ),
  'face_mask': defineAsyncComponent(() =>
      import('./forms/FaceMaskForm.vue')
  ),
  'face_toner': defineAsyncComponent(() =>
      import('./forms/TonerForm.vue')
  ),
  'face_cleanser': defineAsyncComponent(() =>
      import('./forms/CleanserForm.vue')
  ),

  // Soins capillaires
  'shampoo': defineAsyncComponent(() =>
      import('./forms/ShampooForm.vue')
  ),
  'hair_mask': defineAsyncComponent(() =>
      import('./forms/HairMaskForm.vue')
  ),
  'hair_serum': defineAsyncComponent(() =>
      import('./forms/HairSerumForm.vue')
  ),

  // Soins du corps
  'body_lotion': defineAsyncComponent(() =>
      import('./forms/BodyLotionForm.vue')
  ),
  'body_butter': defineAsyncComponent(() =>
      import('./forms/BodyButterForm.vue')
  ),
  'body_scrub': defineAsyncComponent(() =>
      import('./forms/BodyScrubForm.vue')
  ),

  // Cosm?tiques
  'lip_balm': defineAsyncComponent(() =>
      import('./forms/LipBalmForm.vue')
  ),

  // Produits m?nagers
  'household_cleaner': defineAsyncComponent(() =>
      import('./forms/HouseholdCleanerForm.vue')
  ),
  'laundry_detergent': defineAsyncComponent(() =>
      import('./forms/LaundryDetergentForm.vue')
  ),

  // Personnalis?
  'custom': defineAsyncComponent(() =>
      import('./forms/CustomForm.vue')
  ),*/
}

// Import dynamique des formulaires sp?cifiques
const currentFormComponent = computed(() => {
  if (!props.recipeType?.subtype) return null
  return formComponents[props.recipeType.subtype] || formComponents['custom']
})

const handleSave = (data: any) => {
  emit('save', data)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

