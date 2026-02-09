<template>
    <section id="compliance"
             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 section-card">
        <div class="flex items-start gap-4 mb-8">
            <div class="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">✅</span>
            </div>
            <div class="flex-1">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyse et conformité</h2>
                <p class="text-gray-600">Validation complète selon le Règlement UE 1223/2009</p>
            </div>
        </div>

        <!-- Résumé de conformité -->
        <ComplianceSummary
            :is-valid="isValid"
            :regulatory-errors="regulatoryErrors"
            :validation-checks="validationChecks"
        />

        <!-- Critères de validation détaillés -->
        <ValidationChecks
            :validation-checks="validationChecks"
        />

        <!-- Liste INCI -->
        <INCIList
            :inci-list="inciList"
            :copied="copied"
            @copy-inci="$emit('copy-inci')"
        />

        <!-- Avertissements et mentions obligatoires -->
        <div class="space-y-8">
            <!-- Avertissements -->
            <WarningsList
                v-if="warnings.length > 0"
                :warnings="warnings"
            />

            <!-- Mentions obligatoires -->
            <MandatoryMentions
                v-if="mandatoryMentions.length > 0"
                :mandatory-mentions="mandatoryMentions"
                :show-all-mentions="showAllMentions"
                @toggle-mentions="$emit('toggle-mentions')"
            />

            <!-- Rapport de sécurité -->
            <SafetyReport
                :risk-level="riskLevel"
                :risk-description="riskDescription"
                :safety-measures="safetyMeasures"
                @generate-safety-report="$emit('generate-safety-report')"
            />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import ComplianceSummary from './section/ComplianceSummary.vue'
import ValidationChecks from './section/ValidationChecks.vue'
import INCIList from './section/INCIList.vue'
import WarningsList from './section/WarningsList.vue'
import MandatoryMentions from './section/MandatoryMentions.vue'
import SafetyReport from './section/SafetyReport.vue'

const props = defineProps({
    formula: {
        type: Object,
        required: true
    },
    validationChecks: {
        type: Array,
        default: () => []
    },
    isValid: {
        type: Boolean,
        default: false
    },
    regulatoryErrors: {
        type: Array,
        default: () => []
    },
    warnings: {
        type: Array,
        default: () => []
    },
    mandatoryMentions: {
        type: Array,
        default: () => []
    },
    inciList: {
        type: String,
        default: ''
    },
    riskLevel: {
        type: String,
        default: 'Faible'
    },
    riskDescription: {
        type: String,
        default: ''
    },
    safetyMeasures: {
        type: Array,
        default: () => []
    },
    copied: {
        type: Boolean,
        default: false
    },
    showAllMentions: {
        type: Boolean,
        default: false
    }
})

defineEmits(['copy-inci', 'toggle-mentions', 'generate-safety-report'])
</script>

<style scoped>
.section-card {
    scroll-margin-top: 100px;
}

.status-card {
    @apply rounded-xl p-8 border-2 transition-all duration-300;
}

.status-valid-card {
    @apply bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200;
}

.status-invalid-card {
    @apply bg-gradient-to-br from-red-50 to-orange-50 border-red-200;
}

.status-icon {
    @apply w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg;
}

.status-valid-icon {
    @apply bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-700;
}

.status-invalid-icon {
    @apply bg-gradient-to-br from-red-100 to-orange-100 text-red-700;
}

.validation-item {
    @apply rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-md;
}

.validation-icon {
    @apply w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0;
}
</style>

