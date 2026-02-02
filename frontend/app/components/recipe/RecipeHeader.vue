<template>
    <header class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span class="bg-blue-100 p-3 rounded-xl" aria-hidden="true">ðŸ§´</span>
                    <span>Skincare Formulator Pro</span>
                </h1>
                <p class="text-gray-600 mt-2">
                    Formulation cosmÃ©tique conforme au RÃ¨glement UE 1223/2009 â€“
                    <a
                        href="https://eur-lex.europa.eu/eli/reg/2009/1223/oj"
                        target="_blank"
                        class="text-blue-600 hover:text-blue-800 underline ml-1"
                        aria-label="Consulter le RÃ¨glement UE 1223/2009 (nouvelle fenÃªtre)"
                    >
                        Consulter la rÃ©glementation
                    </a>
                </p>
            </div>

            <!-- Indicateur de conformitÃ© -->
            <div class="flex flex-col items-end gap-3">
                <div
                    :class="[
                        'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                        regulatoryStatus.isValid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                    ]"
                    role="status"
                    aria-live="polite"
                >
                    <span v-if="regulatoryStatus.isValid">âœ… Conforme UE</span>
                    <span v-else>⚠️ Non conforme</span>
                </div>

                <!-- Navigation rapide -->
                <nav aria-label="Navigation rapide des sections" class="hidden md:flex gap-2">
                    <a
                        v-for="section in sections"
                        :key="section.id"
                        :href="`#${section.id}`"
                        class="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        @click.prevent="scrollToSection(section.id)"
                    >
                        {{ section.name }}
                    </a>
                </nav>
            </div>
        </div>

        <!-- Barre de progression -->
        <div class="mt-6">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progression du formulaire</span>
                <span>{{ completionPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    class="h-2.5 rounded-full bg-blue-600 transition-all duration-500 ease-out"
                    :style="{ width: `${completionPercentage}%` }"
                    role="progressbar"
                    :aria-valuenow="completionPercentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    regulatoryStatus: {
        type: Object,
        required: true
    },
    sections: {
        type: Array,
        required: true
    },
    completionPercentage: {
        type: Number,
        required: true
    },
    scrollToSection: {
        type: Function,
        required: true
    }
})
</script>
