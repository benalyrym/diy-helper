<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <!-- Écran de chargement -->
        <LoadingScreen v-if="loading" />

        <!-- Écran d'erreur -->
        <ErrorScreen
            v-else-if="error"
            :error="error"
            @retry="retryLoad"
        />

        <!-- Contenu principal -->
        <div v-else-if="formula">
            <!-- Barre de navigation -->
            <FormulaNavigation
                :formula="formula"
                :is-valid="isFormulaValid"
                @generate-pdf="generatePDF"
                @toggle-print="togglePrintMode"
            />

            <div class=" mx-auto space-y-8 p-4 md:p-8">
                <!-- En-tête avec métadonnées -->
                <FormulaHeader
                    :formula="formula"
                    :actives="actives"
                    :essential-oils="essentialOils"
                    :he-total="heTotal"
                    :is-formula-valid="isFormulaValid"
                    :regulatory-errors="regulatoryErrors"
                />

                <!-- Navigation rapide -->
                <FormulaQuickNav
                    :sections="sections"
                    :active-section="activeSection"
                    @scroll-to-section="scrollToSection"
                />

                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Sidebar -->
                    <FormulaSidebar
                        :formula="formula"
                        :actives="actives"
                        :essential-oils="essentialOils"
                        :he-total="heTotal"
                        :is-valid="isFormulaValid"
                        :warnings="warnings"
                        :risk-level="riskLevel"
                        :validation-checks="validationChecks"
                        @copy-formula="copyFormula"
                        @export-formula="exportFormula"
                        @share-formula="shareFormula"
                    />

                    <!-- Contenu principal -->
                    <main class="lg:w-3/4 space-y-8">
                        <!-- Description -->
                        <FormulaDescription
                            :formula="formula"
                            :actives="actives"
                            :essential-oils="essentialOils"
                            :he-total="heTotal"
                        />

                        <!-- Composition détaillée -->
                        <IngredientsSection
                            :formula="formula"
                            :actives="actives"
                            :essential-oils="essentialOils"
                            :he-total="heTotal"
                            @copy-inci="copyINCI"
                        />

                        <!-- Analyse et conformité -->
                        <ComplianceAnalysis
                            :formula="formula"
                            :validation-checks="validationChecks"
                            :is-valid="isFormulaValid"
                            :regulatory-errors="regulatoryErrors"
                            :warnings="warnings"
                            :mandatory-mentions="mandatoryMentions"
                            :inci-list="inciList"
                            :risk-level="riskLevel"
                            :risk-description="riskDescription"
                            :safety-measures="safetyMeasures"
                            @generate-safety-report="generateSafetyReport"
                            @copy-inci="copyINCI"
                        />
                    </main>
                </div>

                <!-- Footer -->
                <FormulaFooter :formula="formula" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Composables
import { useFormulaDisplay } from './composables/useFormulaDisplay'
import { useFormulaCalculations } from './composables/useFormulaCalculations'
import { useRegulatoryAnalysis } from './composables/useRegulatoryAnalysis'
import { useFormulaActions } from './composables/useFormulaActions'
import { useFormulaData } from './composables/useFormulaData'

// Composants
import LoadingScreen from './components/LoadingScreen.vue'
import ErrorScreen from './components/ErrorScreen.vue'
import FormulaNavigation from './components/FormulaNavigation.vue'
import FormulaHeader from './components/FormulaHeader.vue'
import FormulaQuickNav from './components/FormulaQuickNav.vue'
import FormulaSidebar from './components/FormulaSidebar.vue'
import FormulaDescription from './components/FormulaDescription.vue'
import IngredientsSection from './components/IngredientsSection.vue'
import ComplianceAnalysis from './components/ComplianceAnalysis.vue'
import FormulaFooter from './components/FormulaFooter.vue'

const route = useRoute()
const router = useRouter()

// États de base
const formula = ref(null)
const loading = ref(true)
const error = ref('')
const activeSection = ref('description')
const printMode = ref(false)

// Sections pour navigation
const sections = [
    { id: 'description', name: 'Description', icon: '📝' },
    { id: 'ingredients', name: 'Composition', icon: '🧪' },
    { id: 'compliance', name: 'Conformité', icon: '✅' }
]

// Initialisation des données
const {
    activeReferences,
    HEReferences,
    skinTypes
} = useFormulaData()

// Utilisation des composables
const {
    loadFormula,
    retryLoad
} = useFormulaDisplay(formula, loading, error, route, router)

const {
    actives,
    essentialOils,
    heTotal,
    calculateGrams,
    calculateTotalGrams,
    isFormulaValid,
    getActiveTotalPercentage,
    getSkinTypeDescription,
    getPreservativeSystem,
    getSkinTypeTips
} = useFormulaCalculations(formula, activeReferences, skinTypes)

const {
    validationChecks,
    regulatoryErrors,
    warnings,
    mandatoryMentions,
    inciList,
    riskLevel,
    riskDescription,
    safetyMeasures,
    regulatoryStatus
} = useRegulatoryAnalysis(
    formula,
    heTotal,
    actives,
    essentialOils,
    activeReferences,
    HEReferences
)

const {
    generatePDF,
    togglePrintMode,
    copyFormula,
    exportFormula,
    shareFormula,
    generateSafetyReport,
    copyINCI,
    handleKeyboardShortcuts
} = useFormulaActions(formula, inciList, isFormulaValid, printMode)

// Méthodes de navigation
const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        activeSection.value = sectionId
    }
}

// Intersection Observer
let observer = null

const setupIntersectionObserver = () => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id
                    if (sectionId && sections.some(s => s.id === sectionId)) {
                        activeSection.value = sectionId
                    }
                }
            })
        },
        {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        }
    )

    // Observer les sections
    sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) observer.observe(element)
    })
}

// Initialisation
onMounted(async () => {
    await loadFormula()
    if (formula.value) {
        setupIntersectionObserver()
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
    document.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>

<style scoped>
/* Styles spécifiques pour le conteneur principal */
@media print {
    .no-print {
        display: none !important;
    }

    body {
        background: white !important;
    }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>