<template>
    <div class="mb-10">
        <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
            <span class="text-emerald-600">📋</span>
            <span>Critères de validation détaillés</span>
        </h3>

        <div class="space-y-4">
            <div v-for="check in validationChecks"
                 :key="check.name"
                 :class="[
                     'validation-item rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-md',
                     check.passed
                         ? 'bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-emerald-200'
                         : 'bg-gradient-to-r from-red-50/50 to-orange-50/50 border-red-200'
                 ]">
                <div class="flex items-start gap-4">
                    <!-- Icone -->
                    <div class="flex-shrink-0">
                        <div :class="[
                            'validation-icon w-12 h-12 rounded-xl flex items-center justify-center',
                            check.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        ]">
                            <span class="text-xl font-bold">{{ check.passed ? '✓' : '✗' }}</span>
                        </div>
                    </div>

                    <!-- Contenu -->
                    <div class="flex-1">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                            <h4 class="font-bold text-lg text-gray-900">{{ check.name }}</h4>
                            <span :class="[
                                'px-3 py-1 rounded-full text-sm font-bold',
                                check.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            ]">
                                {{ check.passed ? 'Conforme' : 'Non conforme' }}
                            </span>
                        </div>

                        <p class="text-gray-600 mb-4">{{ check.description }}</p>

                        <div v-if="!check.passed"
                             class="bg-white rounded-lg p-4 border border-red-200">
                            <div class="flex items-start gap-2">
                                <span class="text-red-500 mt-1">⚠️</span>
                                <div>
                                    <p class="font-medium text-red-800 mb-2">{{ check.error }}</p>
                                    <p v-if="check.recommendation" class="text-sm text-gray-700">
                                        <span class="font-medium">Recommandation:</span> {{ check.recommendation }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    validationChecks: {
        type: Array,
        default: () => []
    }
})
</script>