<template>
    <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                <span class="text-blue-600">🧾</span>
                <span>Liste INCI (International Nomenclature of Cosmetic Ingredients)</span>
            </h3>
            <button
                @click="$emit('copy-inci')"
                class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                :class="{ 'bg-green-600': copied }"
                aria-label="Copier la liste INCI"
            >
                <span>{{ copied ? '✅' : '📋' }}</span>
                <span>{{ copied ? 'Copié !' : 'Copier INCI' }}</span>
            </button>
        </div>

        <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100 overflow-hidden">
            <div class="p-6 bg-white/50 border-b border-blue-100">
                <div class="flex items-center justify-between text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                        <span>📝</span>
                        <span>Conforme à l'Annexe I du Règlement UE 1223/2009</span>
                    </div>
                    <span>{{ getIngredientCount() }} ingrédients</span>
                </div>
            </div>

            <div class="relative">
                <pre class="text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto p-6 min-h-[200px] max-h-[400px] overflow-y-auto"
                     id="inci-list"
                     aria-label="Liste INCI des ingrédients">
{{ formatINCIList() }}</pre>
            </div>
        </div>

        <p class="text-sm text-gray-500 mt-3">
            L'ordre INCI suit la concentration décroissante (>1%) conformément aux exigences du Règlement UE 1223/2009.
            Les ingrédients à moins de 1% peuvent être listés dans n'importe quel ordre après les ingrédients à plus de 1%.
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    inciList: {
        type: String,
        default: ''
    },
    copied: {
        type: Boolean,
        default: false
    }
})

defineEmits(['copy-inci'])

const getIngredientCount = () => {
    if (!props.inciList) return 0
    return props.inciList.split(', ').length
}

const formatINCIList = () => {
    if (!props.inciList) return ''

    const list = props.inciList.split(', ')
    const formatted = list.map((item, index) => {
        const prefix = index === 0 ? '' : '  '
        return `${prefix}${item}${index < list.length - 1 ? ',' : ''}`
    }).join('\n')

    return formatted
}
</script>