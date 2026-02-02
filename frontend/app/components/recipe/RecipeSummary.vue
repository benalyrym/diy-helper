<template>
    <aside class="lg:w-1/4">
        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
                <span class="text-blue-600">ðŸ“‹</span>
                RÃ©sumÃ© de la formule
            </h2>

            <dl class="space-y-4">
                <div>
                    <dt class="text-sm text-gray-500">Nom</dt>
                    <dd class="font-medium truncate" :class="{ 'text-red-500': !formData.name }">
                        {{ formData.name || 'Non renseignÃ©' }}
                    </dd>
                </div>

                <div>
                    <dt class="text-sm text-gray-500">Volume total</dt>
                    <dd class="font-medium">{{ formData.volume }} ml</dd>
                </div>

                <div>
                    <dt class="text-sm text-gray-500">Profil peau</dt>
                    <dd class="font-medium capitalize">{{ formData.skinType || 'Non sÃ©lectionnÃ©' }}</dd>
                </div>

                <div v-if="regulatoryErrors.length > 0" class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <dt class="text-sm text-red-700 font-semibold mb-2">âš ï¸ Alertes rÃ©glementaires</dt>
                    <dd class="text-sm text-red-600">
                        <ul class="list-disc pl-4 space-y-1">
                            <li v-for="error in regulatoryErrors.slice(0, 2)" :key="error">{{ error }}</li>
                            <li v-if="regulatoryErrors.length > 2">... et {{ regulatoryErrors.length - 2 }} autres</li>
                        </ul>
                    </dd>
                </div>
            </dl>

            <!-- Quick actions -->
            <div class="mt-6 pt-6 border-t">
                <button
                    @click="generateReport"
                    class="w-full mb-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    :disabled="!isValid"
                    :aria-disabled="!isValid"
                >
                    <span>ðŸ“„ GÃ©nÃ©rer PDF</span>
                </button>
                <button
                    @click="exportFormula"
                    class="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                    <span>ðŸ“¤ Exporter formule</span>
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
defineProps({
    formData: {
        type: Object,
        required: true
    },
    regulatoryErrors: {
        type: Array,
        required: true
    },
    generateReport: {
        type: Function,
        required: true
    },
    exportFormula: {
        type: Function,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
})
</script>
