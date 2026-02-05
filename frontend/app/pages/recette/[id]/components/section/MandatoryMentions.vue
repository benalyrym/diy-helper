<template>
    <div>
        <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
            <span class="text-purple-600">📝</span>
            <span>Mentions obligatoires pour l'étiquetage</span>
        </h3>

        <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(mention, idx) in (showAllMentions ? mandatoryMentions : mandatoryMentions.slice(0, 6))"
                     :key="idx"
                     class="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-purple-100">
                    <span class="text-purple-500 mt-1">•</span>
                    <span class="text-sm text-gray-800">{{ mention }}</span>
                </div>
            </div>

            <div v-if="mandatoryMentions.length > 6" class="mt-6 text-center">
                <button @click="$emit('toggle-mentions')"
                        class="px-6 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg hover:from-purple-100 hover:to-violet-100 transition-all duration-300 border border-purple-200 font-medium">
                    {{ showAllMentions ? 'Voir moins' : `Voir les ${mandatoryMentions.length - 6} mentions supplémentaires` }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    mandatoryMentions: {
        type: Array,
        default: () => []
    },
    showAllMentions: {
        type: Boolean,
        default: false
    }
})

defineEmits(['toggle-mentions'])
</script>