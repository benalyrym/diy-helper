<template>
  <div class="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 ">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- Navigation et actions -->
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Retour -->
          <NuxtLink
            to="/recettes"
            class="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
            aria-label="Retour à la liste des formules"
          >
            <span class="text-xl transition-transform group-hover:-translate-x-1">←</span>
            <span class="font-medium">Formules</span>
          </NuxtLink>

          <div class="h-6 w-px bg-gray-300 hidden sm:block"></div>

          <!-- Actions rapides -->
          <div class="flex items-center gap-2 flex-wrap">
            <NuxtLink
              v-if="editLink"
              :to="editLink"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Modifier cette formule"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="hidden sm:inline">Modifier</span>
            </NuxtLink>

            <button
              v-if="showGeneratePDF"
              @click="$emit('generate-pdf')"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Générer un PDF de cette formule"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="hidden sm:inline">PDF</span>
            </button>

            <button
              v-if="showPrint"
              @click="$emit('toggle-print')"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Mode impression"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span class="hidden sm:inline">Imprimer</span>
            </button>
          </div>
        </div>

        <!-- Titre et informations -->
        <div class="flex-1 min-w-0 sm:text-center px-4">
          <h1 class="text-lg font-bold text-gray-900 truncate">
            {{ formula?.name || 'Sans nom' }}
          </h1>
          <div class="flex items-center justify-center gap-3 text-xs text-gray-500 mt-1">
            <span>ID: {{ formula?.id || 'N/A' }}</span>
            <span>•</span>
            <span>{{ formatDate(formula?.updatedAt) }}</span>
          </div>
        </div>

        <!-- Indicateur de statut -->
        <div class="flex-shrink-0">
          <div :class="[
            'px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-colors',
            isFormulaValid
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
          ]">
            <span class="hidden sm:inline">{{ isFormulaValid ? '✅ Conforme UE' : '⚠️ Non conforme' }}</span>
            <span class="sm:hidden">{{ isFormulaValid ? '✅' : '⚠️' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { IRecipe } from "../../../domain/models/Recipe"

type Formula = IRecipe & {
  recipeType?: {
    subtype?: string
    type?: string
  }
}

const props = withDefaults(
  defineProps<{
    formula?: Formula
    isFormulaValid?: boolean
    showGeneratePDF?: boolean
    showPrint?: boolean
  }>(),
  {
    formula: () => ({} as Formula),
    isFormulaValid: false,
    showGeneratePDF: true,
    showPrint: true
  }
)

defineEmits<{
  (event: "generate-pdf"): void
  (event: "toggle-print"): void
}>()

const editLink = computed(() => {
  const id = props.formula?.id
  if (!id) return null

  const rawType = props.formula?.type ||
    props.formula?.subtype ||
    props.formula?.recipeType?.subtype ||
    props.formula?.recipeType?.type ||
    ''

  const params = new URLSearchParams()
  if (rawType) {
    params.set('type', String(rawType))
  }
  if (props.formula?.category) {
    params.set('category', String(props.formula.category))
  }

  const suffix = params.toString()
  return suffix ? `/recette/${id}/edit?${suffix}` : `/recette/${id}/edit`
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  } catch {
    return '—'
  }
}
</script>


