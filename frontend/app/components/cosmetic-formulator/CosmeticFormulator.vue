<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
        <div class="max-w-7xl mx-auto space-y-8">
            <div class="flex justify-end">
                <button
                    type="button"
                    class="text-sm text-blue-600 hover:text-blue-800"
                    @click="accessibility.toggleMenu"
                >
                    {{ t('accessibility') }}
                </button>
            </div>

            <AccessibilityMenu />

            <header class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span class="bg-blue-100 p-3 rounded-xl" aria-hidden="true">&#129524;</span>
                            <span>{{ t('headerTitle') }}</span>
                        </h1>
                        <p class="text-gray-600 mt-2">
                            {{ t('headerSubtitle') }}
                            <a
                                href="https://eur-lex.europa.eu/eli/reg/2009/1223/oj"
                                target="_blank"
                                class="text-blue-600 hover:text-blue-800 underline ml-1"
                                :aria-label="t('headerLink')"
                            >
                                {{ t('headerLink') }}
                            </a>
                        </p>
                    </div>

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
                            <span v-if="regulatoryStatus.isValid">&#10003; {{ t('complianceOk') }}</span>
                            <span v-else>&#9888; {{ t('complianceNo') }}</span>
                        </div>

                        <nav :aria-label="t('quickNavLabel')" class="hidden md:flex gap-2">
                            <a v-for="section in navSections"
                               :key="section.id"
                               :href="`#${section.id}`"
                               class="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                               @click.prevent="scrollToSection(section.id)">
                                {{ section.name }}
                            </a>
                        </nav>
                    </div>
                </div>

                <div class="mt-6">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{{ t('progressLabel') }}</span>
                        <span>{{ completionPercentage }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="h-2.5 rounded-full bg-blue-600 transition-all duration-500 ease-out"
                             :style="{ width: `${completionPercentage}%` }"
                             role="progressbar"
                             :aria-valuenow="completionPercentage"
                             aria-valuemin="0"
                             aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </header>

            <div class="flex flex-col lg:flex-row gap-8">
                <aside class="lg:w-1/4">
                    <FormulaSummary />
                </aside>

                <main class="lg:w-3/4 space-y-8">
                    <BasicInfoSection />
                    <ActivesSection />
                    <AqueousPhaseSection />
                    <OilPhaseSection />
                    <PreservativesSection />
                    <EssentialOilsSection />
                    <AnalysisSection />
                    <ActionsSection />
                </main>
            </div>

            <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="text-center text-sm text-gray-500">
                    <p>
                        {{ t('footerNotice') }}
                    </p>
                    <p class="mt-2">
                        {{ t('footerVersion', { date: currentDate }) }}
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { computed, provide } from 'vue'
import AccessibilityMenu from './components/AccessibilityMenu.vue'
import FormulaSummary from './components/FormulaSummary.vue'
import BasicInfoSection from './components/BasicInfoSection.vue'
import ActivesSection from './components/ActivesSection.vue'
import AqueousPhaseSection from './components/AqueousPhaseSection.vue'
import OilPhaseSection from './components/OilPhaseSection.vue'
import PreservativesSection from './components/PreservativesSection.vue'
import EssentialOilsSection from './components/EssentialOilsSection.vue'
import AnalysisSection from './components/AnalysisSection.vue'
import ActionsSection from './components/ActionsSection.vue'
import useFormData from './composables/useFormData'
import useAccessibility from './composables/useAccessibility'
import useI18n from './composables/useI18n'
import { FORM_CONTEXT_KEY, ACCESSIBILITY_CONTEXT_KEY } from './utils/constants'

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(["save", "cancel", "save-draft"])

const form = useFormData({ props, emit })
const accessibility = useAccessibility()
const i18n = useI18n()
const { t, locale } = i18n

provide(FORM_CONTEXT_KEY, form)
provide(ACCESSIBILITY_CONTEXT_KEY, accessibility)
provide('i18n', i18n)

const navSections = computed(() => ([
    { id: 'basic-info', name: t('basicInfoTitle') },
    { id: 'actives', name: t('activesTitle') },
    { id: 'aqueous-phase', name: t('aqueousTitle') },
    { id: 'oil-phase', name: t('oilTitle') },
    { id: 'preservatives', name: t('preservativeTitle') },
    { id: 'essential-oils', name: t('essentialTitle') },
    { id: 'analysis', name: t('analysisTitle') },
    { id: 'actions', name: t('actionsTitle') }
]))

const currentDate = computed(() => {
    const formatLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US'
    return new Date().toLocaleDateString(formatLocale)
})

const {
    regulatoryStatus,
    completionPercentage,
    scrollToSection,
    enabledActivesCount,
    heTotal,
    oilPhase,
    waterPhase,
    inciList,
    skinProfiles,
    formData
} = form
</script>

<style>
/* Styles am?lior?s pour accessibilit? et design */
.input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200
    placeholder-gray-400
    disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.input-error {
    @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.label {
    @apply block text-sm font-semibold text-gray-700 mb-2
    tracking-wide;
}

.label.required::after {
    content: " *";
    @apply text-red-500;
}

.error-message {
    @apply mt-1 text-sm text-red-600;
}

.help-text {
    @apply mt-1 text-sm text-gray-500;
}

.skin-type-card {
    @apply border-2 rounded-xl p-4 cursor-pointer
    transition-all duration-300
    hover:shadow-md;
}

.skin-type-card-selected {
    @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
}

.skin-type-card-default {
    @apply border-gray-200 hover:border-blue-300;
}

.active-card {
    @apply bg-gray-50 rounded-xl p-4 border border-gray-200
    hover:bg-white hover:border-gray-300
    transition-all duration-300;
}

.preservative-card {
    @apply border-2 rounded-xl cursor-pointer h-full transition-all duration-300;
}

.preservative-card-selected {
    @apply border-red-400 bg-gradient-to-br from-red-50 to-white;
}

.preservative-card-default {
    @apply border-gray-200 hover:border-red-200;
}

.oil-item {
    @apply py-3 border-b border-gray-100 last:border-b-0;
}

.phase-card {
    @apply bg-white border border-gray-200 rounded-xl p-4
    hover:shadow-md transition-all duration-300;
}

.phase-card-header {
    @apply flex items-center gap-2 mb-3;
}

.phase-icon {
    @apply text-xl;
}

.phase-name {
    @apply font-semibold text-gray-900;
}

.phase-values {
    @apply flex justify-between items-baseline mb-2;
}

.phase-percent {
    @apply text-2xl font-bold;
}

.phase-grams {
    @apply text-sm text-gray-500;
}

.phase-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2;
}

.phase-bar-fill {
    @apply h-full rounded-full transition-all duration-500;
    background-color: var(--phase-color);
}

.phase-details {
    @apply text-xs text-gray-500;
}

.btn-primary {
    @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700
    text-white font-semibold rounded-lg
    hover:from-blue-700 hover:to-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2;
}

.btn-secondary {
    @apply px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg
    hover:bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2;
}

.btn-outline {
    @apply px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg
    hover:border-gray-400 hover:bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    transition-all duration-200
    flex items-center justify-center gap-2;
}

/* Range slider styling */
input[type="range"] {
    @apply appearance-none;
}

input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none h-5 w-5 rounded-full bg-blue-600
    cursor-pointer border-2 border-white shadow-lg;
}

input[type="range"]::-moz-range-thumb {
    @apply h-5 w-5 rounded-full bg-blue-600
    cursor-pointer border-2 border-white shadow-lg;
}

.range-low::-webkit-slider-thumb {
    @apply bg-amber-500;
}

.range-high::-webkit-slider-thumb {
    @apply bg-red-500;
}

.range-optimal::-webkit-slider-thumb {
    @apply bg-green-500;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

section {
    animation: fadeIn 0.5s ease-out;
}

/* Responsive design */
@media (max-width: 768px) {
    .skin-type-card {
        @apply p-3;
    }

    .active-card {
        @apply p-3;
    }

    .phase-card {
        @apply p-3;
    }

    .btn-primary,
    .btn-secondary,
    .btn-outline {
        @apply px-4 py-2 text-sm;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .input-field {
        @apply border-2;
    }

    .skin-type-card-selected {
        @apply border-4;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>

