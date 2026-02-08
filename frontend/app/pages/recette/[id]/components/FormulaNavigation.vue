<template>
    <div class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div class=" mx-auto px-4 py-3">
            <div class="flex items-center justify-between gap-4">
                <!-- Navigation -->
                <div class="flex items-center gap-3">
                    <NuxtLink
                        to="/recettes"
                        class="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                        aria-label="Retour à la liste des formules"
                    >
                        <span class="text-xl transition-transform group-hover:-translate-x-1">←</span>
                        <span class="hidden sm:inline font-medium">Formules</span>
                    </NuxtLink>

                    <div class="h-6 w-px bg-gray-300"></div>

                    <!-- Actions rapides -->
                    <div class="flex items-center gap-2">
                    <NuxtLink
                        :to="editLink"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                        aria-label="Modifier cette formule"
                    >
                            <span>✏️</span>
                            <span class="hidden sm:inline">Modifier</span>
                        </NuxtLink>

                        <button
                            @click="$emit('generate-pdf')"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                            aria-label="Générer un PDF de cette formule"
                        >
                            <span>📄</span>
                            <span class="hidden sm:inline">PDF</span>
                        </button>

                        <button
                            @click="$emit('toggle-print')"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                            aria-label="Mode impression"
                        >
                            <span>🖨️</span>
                            <span class="hidden sm:inline">Imprimer</span>
                        </button>
                    </div>
                </div>

                <!-- Titre -->
                <div class="flex-1 min-w-0">
                    <h1 class="text-lg font-bold text-gray-900 truncate text-center sm:text-left">
                        {{ formula.name }}
                    </h1>
                    <p class="text-xs text-gray-500 text-center sm:text-left truncate">
                        ID: {{ formula.id }} • {{ formatDateShort(formula.updatedAt) }}
                    </p>
                </div>

                <!-- Indicateur de statut -->
                <div class="flex-shrink-0">
                    <div :class="[
                        'px-4 py-2 rounded-full text-sm font-bold shadow-sm',
                        isFormulaValid
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                            : 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                    ]">
                        <span class="hidden sm:inline">{{ isFormulaValid ? '✅ Conforme UE' : '⚠️ Non conforme' }}</span>
                        <span class="sm:hidden">{{ isFormulaValid ? '✅' : '⚠️' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    formula: {
        type: Object,
        required: true
    },
    isFormulaValid: {
        type: Boolean,
        default: false
    }
})

defineEmits(['generate-pdf', 'toggle-print'])

const editLink = computed(() => {
    const id = props.formula?.id
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

const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
}
</script>
