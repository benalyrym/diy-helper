<template>
    <div class="mb-10">
        <div :class="[
            'status-card rounded-xl p-8 border-2 transition-all duration-300',
            isValid ? 'status-valid-card' : 'status-invalid-card'
        ]">
            <div class="flex flex-col md:flex-row md:items-center gap-6">
                <!-- Icone -->
                <div class="flex-shrink-0">
                    <div :class="[
                        'status-icon w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg',
                        isValid ? 'status-valid-icon' : 'status-invalid-icon'
                    ]">
                        <span class="text-4xl">{{ isValid ? '✅' : '❌' }}</span>
                    </div>
                </div>

                <!-- Contenu -->
                <div class="flex-1">
                    <h3 class="text-2xl font-bold mb-3">
                        {{ isValid ? 'Formule conforme aux réglementations UE' : 'Formule non conforme - Attention requise' }}
                    </h3>
                    <p class="text-gray-700 mb-4">
                        {{ isValid
                        ? 'Cette formule respecte toutes les exigences du Règlement cosmétique européen 1223/2009 et est prête pour une évaluation finale par un Responsable de la Conformité.'
                        : 'Cette formule présente des non-conformités réglementaires nécessitant une correction avant toute utilisation ou commercialisation.'
                        }}
                    </p>

                    <div class="flex flex-wrap gap-3">
                        <div :class="[
                            'px-4 py-2 rounded-lg font-bold',
                            isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        ]">
                            {{ validationChecks.filter(c => c.passed).length }}/{{ validationChecks.length }} critères validés
                        </div>

                        <div v-if="!isValid" class="px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-800 rounded-lg font-bold">
                            {{ regulatoryErrors.length }} erreur{{ regulatoryErrors.length > 1 ? 's' : '' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isValid: {
        type: Boolean,
        default: false
    },
    regulatoryErrors: {
        type: Array,
        default: () => []
    },
    validationChecks: {
        type: Array,
        default: () => []
    }
})
</script>