<template>
    <div>
        <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
            <span class="text-amber-600">⚠️</span>
            <span>Avertissements et recommandations</span>
        </h3>

        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
            <div class="space-y-4">
                <div v-for="(warning, idx) in warnings"
                     :key="idx"
                     class="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-amber-100">
                    <span class="text-amber-500 text-xl mt-1">⚠️</span>
                    <div>
                        <p class="font-medium text-amber-800">{{ warning }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    warnings: {
        type: Array,
        default: () => []
    }
})
</script>

