<template>
    <section id="ingredients"
             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 section-card">
        <div class="flex items-start gap-4 mb-8">
            <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">🧪</span>
            </div>
            <div class="flex-1">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Composition détaillée</h2>
                <p class="text-gray-600">Analyse complète des ingrédients et de leurs dosages</p>
            </div>
        </div>

        <!-- Actifs cosmétiques -->
        <ActivesList
            :actives="actives"
            :formula="formula"
            @copy-inci="$emit('copy-inci')"
        />

        <!-- Huiles essentielles -->
        <EssentialOilsList
            :essential-oils="essentialOils"
            :formula="formula"
            :he-total="heTotal"
        />

        <!-- Tableau récapitulatif -->
        <IngredientsTable
            :formula="formula"
            :actives="actives"
            :essential-oils="essentialOils"
        />
    </section>
</template>

<script setup>
import { ref } from 'vue'
import ActivesList from './section/ActivesList.vue'
import EssentialOilsList from './section/EssentialOilsList.vue'
import IngredientsTable from './section/IngredientsTable.vue'

const props = defineProps({
    formula: {
        type: Object,
        required: true
    },
    actives: {
        type: Array,
        default: () => []
    },
    essentialOils: {
        type: Array,
        default: () => []
    },
    heTotal: {
        type: Number,
        default: 0
    }
})

defineEmits(['copy-inci'])

// États pour les sections dépliables
const showAllActives = ref(false)
const showAllHE = ref(false)
</script>

<style scoped>
.section-card {
    scroll-margin-top: 100px;
}

.ingredient-card {
    @apply rounded-xl p-6 border-2 transition-all duration-300;
}

.ingredient-normal {
    @apply border-gray-200 bg-gradient-to-br from-white to-gray-50;
}

.ingredient-warning {
    @apply border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50;
}

.ingredient-danger {
    @apply border-red-300 bg-gradient-to-br from-red-50 to-orange-50;
}

.ingredient-low {
    @apply border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50;
}

.empty-state {
    @apply text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200;
}

.badge-info {
    @apply px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-sm font-bold rounded-full border border-blue-200;
}
</style>