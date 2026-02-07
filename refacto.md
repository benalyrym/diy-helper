# diy-helper

# Tâche

Refactoriser `ConditionerForm.vue` pour qu’il suive les mêmes patterns que `FaceCreamForm.vue` (architecture, style, conventions),
tout en gardant le même comportement.

## Contexte

- Langage / framework : <ex: TypeScript + vue + nuxt>
- Version / contraintes : <ex: Node 20, pas de dépendances nouvelles>
- Conventions à suivre : <ex: hooks, DI, services, naming, error handling>
- Style : <ex: ESLint + Prettier, code lisible, fonctions courtes>
- Objectif principal : aligner `ConditionerForm.vue` avec le style de `FaceCreamForm.vue`

## Contraintes

- Ne pas modifier l’API publique (signatures, exports) sauf nécessité (expliquer).
- Ne pas changer le comportement métier (sauf bug clairement identifié).
- Respecter les conventions du projet.

## Fichier référence (déjà bien)

```<lang>
<template>
  <div :class="containerClasses">
    <!-- Navigation d'accessibilité -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-3 rounded-lg z-50">
      Passer au contenu principal
    </a>

    <div class=" mx-auto space-y-8" role="application" aria-label="Formulaire de formulation cosmétique">
      <!-- En-tête -->
      <HeaderSection
          :completion-percentage="completionPercentage"
          :regulatory-status="regulatoryStatus"
          :sections="sections"
          @scroll-to-section="scrollToSection"
          @toggle-accessibility="toggleAccessibilityMenu"
      />

      <!-- Menu d'accessibilité -->
      <AccessibilityMenu
          v-if="showAccessibilityMenu"
          :high-contrast="highContrast"
          :reduced-motion="reducedMotion"
          @close="toggleAccessibilityMenu"
          @increase-text-size="increaseTextSize"
          @decrease-text-size="decreaseTextSize"
          @toggle-high-contrast="toggleHighContrast"
          @toggle-reduced-motion="toggleReducedMotion"
      />

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar avec résumé -->
        <FormulaSummary
            :form-data="formData"
            :regulatory-errors="regulatoryErrors"
            :phases-summary="phasesSummary"
            :is-valid="isValid"
            :summary-expanded="summaryExpanded"
            :is-mobile="isMobile"
            @toggle-summary="toggleSummary"
            @generate-report="generateReport"
            @export-formula="exportFormula"
        />

        <!-- Contenu principal du formulaire -->
        <main id="main-content" class="lg:w-3/4 space-y-8" role="main">
          <!-- Section 1: Informations de base -->
          <BasicInfoSection
              :form-data="formData"
              :errors="errors"
              :selected-skin-profile="selectedSkinProfile"
              @update:form-data="updateFormData"
              @clear-error="clearError"
              @validate-volume="validateVolume"
          />

          <!-- Section 2: Actifs cosmétiques -->
          <ActivesSection
              :actives="filteredActives"
              :form-data="formData"
              :skin-profiles="skinProfiles"
              :enabled-actives-count="enabledActivesCount"
              :too-many-actives="tooManyActives"
              :active-search="activeSearch"
              :active-type-filter="activeTypeFilter"
              @update-active="updateActive"
              @update-search="updateSearch"
              @update-type-filter="updateTypeFilter"
          />

          <!-- Section 3: Phase aqueuse -->
          <AqueousPhaseSection
              :aqueous-phase-options="aqueousPhaseOptions"
              :selected-aqueous-phase="selectedAqueousPhase"
              :aqueous-phase-total="aqueousPhaseTotal"
              @update-aqueous-phase="updateAqueousPhase"
              @toggle-category="toggleCategory"
              @auto-calculate="autoCalculateWaterPhase"
              @optimize="optimizeAqueousPhase"
          />

          <!-- Section 4: Phase huileuse -->
          <OilPhaseSection
              :oil-phase-options="oilPhaseOptions"
              :selected-oil-phase="selectedOilPhase"
              :oil-phase-total="oilPhaseTotal"
              :form-data="formData"
              :skin-profiles="skinProfiles"
              :oil-phase-exceeded="oilPhaseExceeded"
              :comedogenic-distribution="comedogenicDistribution"
              @update-oil-phase="updateOilPhase"
              @toggle-category="toggleCategory"
              @auto-calculate="autoCalculateOilPhase"
              @optimize="optimizeOilPhase"
          />

          <!-- Section 5: Système de conservation -->
          <PreservativesSection
              :form-data="formData"
              :preservative-systems="preservativeSystems"
              :errors="errors"
              @update:form-data="updateFormData"
              @clear-error="clearError"
          />

          <!-- Section 6: Huiles essentielles -->
          <EssentialOilsSection
              :form-data="formData"
              :extended-essential-oils="filteredEssentialOils"
              :he-total="heTotal"
              :he-warnings="heWarnings"
              :he-search-term="heSearchTerm"
              :he-filter-property="heFilterProperty"
              :he-filters="heFilters"
              :filtered-he-count="filteredHECount"
              @update:form-data="updateFormData"
              @update-search="updateHESearch"
              @update-property-filter="updateHEPropertyFilter"
              @update-filters="updateHEFilters"
              @toggle-he="toggleHE"
              @remove-he="removeHE"
              @clear-all-he="clearAllHE"
          />

          <!-- Section 7: Analyse et validation -->
          <AnalysisSection
              :phases="phases"
              :total-formulation-percent="totalFormulationPercent"
              :water-phase="waterPhase"
              :water-phase-grams="waterPhaseGrams"
              :inci-list="inciList"
              :regulatory-checks="regulatoryChecks"
              :regulatory-status="regulatoryStatus"
              :mandatory-mentions="mandatoryMentions"
              :show-all-mentions="showAllMentions"
              :copied="copied"
              @toggle-mentions="toggleMentions"
              @copy-inci="copyINCI"
              @generate-compliance-report="generateComplianceReport"
          />

          <!-- Section 8: Finalisation -->
          <ActionsSection
              :is-valid="isValid"
              :is-edit-mode="isEditMode"
              :saving="saving"
              :form-data="formData"
              @save="save"
              @save-draft="saveDraft"
              @cancel="cancel"
          />
        </main>
      </div>

      <!-- Barre d'actions fixe -->
      <FixedActionBar
          :show-fixed-bar="showFixedBar"
          :is-valid="isValid"
          :saving="saving"
          :is-edit-mode="isEditMode"
          :regulatory-errors="regulatoryErrors"
          :completion-percentage="completionPercentage"
          @save="save"
          @save-draft="saveDraft"
          @toggle-fixed-bar="toggleFixedBar"
      />

      <!-- Espace pour la barre fixe -->
      <div class="h-20"></div>

      <!-- Footer -->
      <Footer :current-date="currentDate" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'

// Composables
import useFormulaData from '../composables/useFormulaData'
import useRegulatoryValidation from '../composables/useRegulatoryValidation'
import useCalculations from '../composables/useCalculations'
import useFilters from '../composables/useFilters'
import useAccessibility from '../composables/useAccessibility'
import useIngredients from '../composables/useIngredients'

// Composants
import HeaderSection from '../ui/HeaderSection.vue'
import AccessibilityMenu from '../ui/AccessibilityMenu.vue'
import FormulaSummary from '../ui/FormulaSummary.vue'
import FixedActionBar from '../ui/FixedActionBar.vue'
import Footer from '../ui/Footer.vue'
import BasicInfoSection from '../ui/sections/BasicInfoSection.vue'
import ActivesSection from '../ui/sections/ActivesSection.vue'
import AqueousPhaseSection from '../ui/sections/AqueousPhaseSection.vue'
import OilPhaseSection from '../ui/sections/OilPhaseSection.vue'
import PreservativesSection from '../ui/sections/PreservativesSection.vue'
import EssentialOilsSection from '../ui/sections/EssentialOilsSection.vue'
import AnalysisSection from '../ui/sections/AnalysisSection.vue'
import ActionsSection from '../ui/sections/ActionsSection.vue'

const router = useRouter()
const { copy, copied } = useClipboard()

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

// Événements
const emit = defineEmits(['save', 'cancel', 'save-draft'])

// États UI
const showAccessibilityMenu = ref(false)
const summaryExpanded = ref(false)
const showFixedBar = ref(true)
const saving = ref(false)
const isEditMode = ref(false)
const errors = ref({})
const showAllMentions = ref(false)

// Données
const {
  formData,
  actives,
  preservativeSystems,
  aqueousPhaseOptions,
  oilPhaseOptions,
  extendedEssentialOils,
  skinProfiles,
  updateFormData,
  updateActive,
  updateAqueousPhase,
  updateOilPhase
} = useFormulaData(props.initialData)

// Calculs
const {
  grams,
  aqueousPhaseTotal,
  selectedAqueousPhase,
  oilPhaseTotal,
  selectedOilPhase,
  oilPhaseExceeded,
  waterPhase,
  waterPhaseGrams,
  totalFormulationPercent,
  phases,
  phasesSummary,
  enabledActivesCount,
  tooManyActives,
  heTotal,
  preservativePercent,
  totalActivesPercent,
  comedogenicDistribution,
  completionPercentage,
  selectedSkinProfile
} = useCalculations(formData, actives, aqueousPhaseOptions, oilPhaseOptions, skinProfiles)

// Validation réglementaire
const {
  regulatoryChecks,
  regulatoryErrors,
  regulatoryStatus,
  heWarnings,
  mandatoryMentions,
  validateVolume,
  clearError,
  isValid
} = useRegulatoryValidation(formData, actives, aqueousPhaseTotal, oilPhaseTotal, heTotal, waterPhase, skinProfiles)

// Filtres
const {
  activeSearch,
  activeTypeFilter,
  heSearchTerm,
  heFilterProperty,
  heFilters,
  filteredActives,
  filteredEssentialOils,
  filteredHECount,
  updateSearch,
  updateTypeFilter,
  updateHESearch,
  updateHEPropertyFilter,
  updateHEFilters
} = useFilters(actives, extendedEssentialOils)

// Accessibilité
const {
  highContrast,
  reducedMotion,
  textSize,
  containerClasses,
  increaseTextSize,
  decreaseTextSize,
  toggleHighContrast,
  toggleReducedMotion
} = useAccessibility()

// Ingrédients
const { inciList } = useIngredients(formData, actives, preservativeSystems, heTotal, selectedOilPhase)

// Sections pour navigation
const sections = [
  { id: 'basic-info', name: 'Informations' },
  { id: 'actives', name: 'Actifs' },
  { id: 'aqueous-phase', name: 'Hydrosols' },
  { id: 'oil-phase', name: 'Huiles' },
  { id: 'preservatives', name: 'Conservation' },
  { id: 'essential-oils', name: 'HE' },
  { id: 'analysis', name: 'Analyse' },
  { id: 'actions', name: 'Finalisation' }
]

const currentDate = ref(new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

const isMobile = computed(() => window.innerWidth < 1024)

// Méthodes
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    element.focus({ preventScroll: true })
  }
}

const toggleSummary = () => {
  summaryExpanded.value = !summaryExpanded.value
}

const toggleAccessibilityMenu = () => {
  showAccessibilityMenu.value = !showAccessibilityMenu.value
}

const toggleFixedBar = () => {
  showFixedBar.value = !showFixedBar.value
}

const toggleMentions = () => {
  showAllMentions.value = !showAllMentions.value
}

// Méthodes de catégories
const toggleCategory = (category, type) => {
  const items = category.items
  const allSelected = items.every(i => i.selected)

  items.forEach(item => {
    if (type === 'oil' && !allSelected && oilPhaseExceeded.value && !item.selected) {
      return
    }
    item.selected = !allSelected
  })
}

// Méthodes de calcul automatique
const autoCalculateWaterPhase = () => {
  const currentTotal = oilPhaseTotal.value +
      aqueousPhaseTotal.value +
      totalActivesPercent.value +
      preservativePercent.value +
      heTotal.value +
      5

  if (currentTotal < 100) {
    const remaining = 100 - currentTotal
    const selected = selectedAqueousPhase.value
    if (selected.length > 0) {
      const totalCurrent = aqueousPhaseTotal.value
      selected.forEach(item => {
        const originalItem = findAqueousItem(item.name)
        if (originalItem) {
          const addition = (item.percent / totalCurrent) * remaining
          originalItem.percent = Math.min(originalItem.max, originalItem.percent + addition)
        }
      })
    }
  }
}

const autoCalculateOilPhase = () => {
  const max = skinProfiles[formData.skinType]?.oil || 20
  const current = oilPhaseTotal.value

  if (current > max) {
    selectedOilPhase.value.forEach(item => {
      const originalItem = findOilItem(item.name)
      if (originalItem) {
        const reduction = (item.percent / current) * (current - max)
        originalItem.percent = Math.max(originalItem.min, originalItem.percent - reduction)
      }
    })
  } else if (current < max * 0.8) {
    const selected = selectedOilPhase.value
    if (selected.length > 0) {
      const addition = (max * 0.8 - current) / selected.length
      selected.forEach(item => {
        const originalItem = findOilItem(item.name)
        if (originalItem) {
          originalItem.percent = Math.min(originalItem.max, originalItem.percent + addition)
        }
      })
    }
  }
}

const optimizeAqueousPhase = () => {
  const selected = selectedAqueousPhase.value
  if (selected.length === 0) return

  const targetTotal = Math.min(30, selected.length * 10)
  const equalPercent = targetTotal / selected.length

  selected.forEach(item => {
    const originalItem = findAqueousItem(item.name)
    if (originalItem) {
      originalItem.percent = Math.min(
          originalItem.max,
          Math.max(originalItem.min, equalPercent)
      )
    }
  })
}

const optimizeOilPhase = () => {
  const selected = selectedOilPhase.value
  if (selected.length === 0) return

  const max = skinProfiles[formData.skinType]?.oil || 20
  const targetPercent = max * 0.9 / selected.length

  selected.forEach(item => {
    const originalItem = findOilItem(item.name)
    if (originalItem) {
      originalItem.percent = Math.min(
          originalItem.max,
          Math.max(originalItem.min, targetPercent)
      )
    }
  })
}

// Méthodes helpers
const findAqueousItem = (name) => {
  for (const category of Object.values(aqueousPhaseOptions)) {
    for (const item of category.items) {
      if (item.name === name) return item
    }
  }
  return null
}

const findOilItem = (name) => {
  for (const category of Object.values(oilPhaseOptions)) {
    for (const item of category.items) {
      if (item.name === name) return item
    }
  }
  return null
}

// Méthodes HE
const toggleHE = (oil) => {
  const idx = formData.selectedHE.findIndex(h => h.name === oil.name)

  if (idx === -1) {
    const defaultPercent = Math.min(oil.maxFace * 0.5, 0.3)
    formData.selectedHE.push({
      ...oil,
      percent: defaultPercent
    })
  } else {
    formData.selectedHE.splice(idx, 1)
  }
}

const removeHE = (heName) => {
  const index = formData.selectedHE.findIndex(h => h.name === heName)
  if (index !== -1) {
    formData.selectedHE.splice(index, 1)
  }
}

const clearAllHE = () => {
  formData.selectedHE = []
}

// Méthodes INCI
const copyINCI = async () => {
  const inciText = inciList.value.join(',\n')
  await copy(inciText)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// Méthodes de sauvegarde
const save = async () => {
  if (!isValid.value) {
    alert("Veuillez corriger les erreurs avant d'enregistrer")
    return
  }

  saving.value = true
  try {
    const formulaData = generateFormulaData()
    emit('save', formulaData)
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert('Une erreur est survenue lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

const saveDraft = () => {
  emit('save-draft', {
    ...formData,
    actives: actives.filter(a => a.enabled),
    aqueousPhase: selectedAqueousPhase.value,
    oilPhase: selectedOilPhase.value,
    he: formData.selectedHE,
    isDraft: true,
    savedAt: new Date().toISOString(),
    progress: completionPercentage.value
  })
}

const cancel = () => {
  emit('cancel')
  if (!emit.cancel) {
    router.push(isEditMode.value ? `/recette/${props.initialData.id}` : '/recettes')
  }
}

const generateFormulaData = () => {
  return {
    name: formData.name.trim(),
    description: generateDescription(),
    type: 'skincare',
    createdAt: isEditMode.value ? props.initialData.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    volume: formData.volume,
    skinType: formData.skinType,
    preservativeSystem: formData.preservativeSystem,
    cosgardPercent: formData.cosgardPercent,
    ingredients: generateIngredientsForDB(),
    totalPercent: totalFormulationPercent.value,
    waterPercent: waterPhase.value,
    version: '2.2',
    compliance: {
      euRegulation: '1223/2009',
      heLimitCompliant: heTotal.value <= 1,
      preservativeCompliant: true,
      isValid: regulatoryStatus.value.isValid,
      errors: regulatoryErrors.value,
      warnings: heWarnings.value
    },
    mandatoryMentions: mandatoryMentions.value,
    inciList: inciList.value
  }
}

const generateIngredientsForDB = () => {
  const ingredients = []

  // Actifs
  actives.filter(a => a.enabled).forEach(a => {
    ingredients.push({
      name: a.label,
      quantity: a.percent,
      unit: '%',
      type: 'active',
      inci: a.inci
    })
  })

  // Conservateur
  const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
  if (preservative) {
    ingredients.push({
      name: preservative.name,
      quantity: formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent : 0.5,
      unit: '%',
      type: 'preservative',
      inci: preservative.inci
    })
  }

  // Huiles essentielles
  formData.selectedHE.forEach(he => {
    ingredients.push({
      name: `HE ${he.name}`,
      quantity: he.percent,
      unit: '%',
      type: 'essential_oil',
      latinName: he.latinName
    })
  })

  // Hydrolats
  selectedAqueousPhase.value.forEach(aq => {
    ingredients.push({
      name: aq.name,
      quantity: aq.percent,
      unit: '%',
      type: 'aqueous'
    })
  })

  // Huiles végétales
  selectedOilPhase.value.forEach(oil => {
    ingredients.push({
      name: oil.name,
      quantity: oil.percent,
      unit: '%',
      type: 'oil',
      comedogenic: oil.comedogenic
    })
  })

  // Eau
  ingredients.push({
    name: 'Eau déminéralisée',
    quantity: waterPhase.value,
    unit: '%',
    type: 'water'
  })

  // Émulsifiant
  ingredients.push({
    name: 'Émulsifiant',
    quantity: 5,
    unit: '%',
    type: 'emulsifier'
  })

  return ingredients
}

const generateDescription = () => {
  const preservativeName = preservativeSystems.find(p => p.id === formData.preservativeSystem)?.name || 'Non spécifié'

  return `${formData.name} - Formule pour peau ${formData.skinType}
• Volume: ${formData.volume}ml
• Actifs: ${actives.filter(a => a.enabled).map(a => `${a.label} ${a.percent}%`).join(', ') || 'Aucun'}
• Phase huileuse: ${oilPhaseTotal.value.toFixed(1)}%
• Phase aqueuse: ${aqueousPhaseTotal.value.toFixed(1)}%
• Conservateur: ${preservativeName} ${formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent + '%' : ''}
• HE: ${formData.selectedHE.map(h => `${h.name} ${h.percent}%`).join(', ') || 'Aucune'}
• Validation UE: ${regulatoryStatus.value.isValid ? 'Conforme' : 'Non conforme'}`
}

const generateReport = () => {
  if (!isValid.value) {
    alert('La formule doit être valide pour générer un rapport')
    return
  }
  console.log('Génération du rapport PDF...')
}

const exportFormula = () => {
  const exportData = {
    formula: {
      ...formData,
      actives: actives.filter(a => a.enabled),
      aqueousPhase: selectedAqueousPhase.value,
      oilPhase: selectedOilPhase.value
    },
    analysis: {
      phases: phases.value,
      regulatoryStatus: regulatoryStatus.value,
      mandatoryMentions: mandatoryMentions.value,
      inciList: inciList.value
    },
    metadata: {
      version: '2.2',
      exportDate: new Date().toISOString(),
      generatedBy: 'Formulateur Cosmétique Pro'
    }
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

  const exportFileDefaultName = `formule-${formData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const generateComplianceReport = () => {
  console.log('Génération du rapport de conformité...')
}

// Hooks de cycle de vie
onMounted(() => {
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    isEditMode.value = true
  }

  document.addEventListener('keydown', handleKeyboardShortcuts)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})

// Raccourcis clavier
const handleKeyboardShortcuts = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault()
    saveDraft()
  }

  if (e.key === 'Escape') {
    cancel()
  }
}

// Watchers
watch(() => formData.cosgardPercent, (newVal) => {
  if (newVal < 0.5 || newVal > 1.0) {
    errors.value.cosgardPercent = 'Cosgard: plage 0.5-1.0% requise'
  } else {
    delete errors.value.cosgardPercent
  }
})

watch(() => formData.volume, validateVolume)
</script>

<style scoped>
/* Styles de base */
.input-field {
  @apply w-full px-4 py-3 border-2 border-gray-300 rounded-xl
  bg-white
  focus:outline-none focus:ring-2 focus:ring-offset-1
  transition-all duration-200
  placeholder:text-gray-400
  disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.input-error {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.input-valid {
  @apply border-green-300 focus:ring-green-500 focus:border-green-500;
}

.label {
  @apply block text-base font-bold text-gray-900 mb-2
  tracking-tight;
}

.label.required::after {
  content: " *";
  @apply text-red-600;
}

.error-message {
  @apply mt-1 text-sm text-red-600 font-medium flex items-center gap-1;
}

.help-text {
  @apply mt-1 text-sm text-gray-500;
}

/* Cartes */
.skin-type-card {
  @apply border-2 rounded-xl cursor-pointer
  transition-all duration-300
  hover:shadow-lg;
}

.skin-type-card-selected {
  @apply border-blue-500 bg-gradient-to-br from-blue-50 to-white;
}

.skin-type-card-default {
  @apply border-gray-200 hover:border-blue-300;
}

.active-card {
  @apply rounded-xl border-2 transition-all duration-300;
}

.active-card-enabled {
  @apply border-purple-300 bg-gradient-to-br from-purple-50/30 to-white;
}

.active-card-disabled {
  @apply border-gray-200 hover:border-purple-200;
}

.preservative-card {
  @apply border-2 rounded-xl cursor-pointer h-full;
}

.preservative-card-selected {
  @apply border-red-400 bg-gradient-to-br from-red-50 to-white;
}

.preservative-card-default {
  @apply border-gray-200 hover:border-red-200;
}

/* Boutons */
.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700
  text-white font-bold rounded-xl
  hover:from-blue-700 hover:to-blue-800
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
  flex items-center justify-center gap-2
  shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50
  text-gray-700 font-bold rounded-xl border-2 border-gray-300
  hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
  flex items-center justify-center gap-2
  shadow-sm hover:shadow-md;
}

.btn-outline {
  @apply px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl
  hover:border-gray-400 hover:bg-gray-50
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
  transition-all duration-300
  flex items-center justify-center gap-2;
}

/* Range sliders */
input[type="range"] {
  @apply appearance-none bg-transparent;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none h-5 w-5 rounded-full
  border-4 border-white shadow-xl
  cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply h-5 w-5 rounded-full
  border-4 border-white shadow-xl
  cursor-pointer;
}

.range-red::-webkit-slider-thumb {
  @apply bg-red-500;
}

.range-amber::-webkit-slider-thumb {
  @apply bg-amber-500;
}

.range-green::-webkit-slider-thumb {
  @apply bg-green-500;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

.animate-fadeOut {
  animation: fadeOut 2s ease-out forwards;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full hover:bg-gray-500;
}

/* Focus visible amélioré */
:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Support navigateurs plus anciens */
@supports not (selector(:focus-visible)) {
  :focus {
    @apply outline-none ring-2 ring-blue-500 ring-offset-2;
  }
}
</style>
```
