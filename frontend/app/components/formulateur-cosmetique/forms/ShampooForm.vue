<template>
  <div :class="containerClasses">
    <!-- Navigation d'accessibilité -->
    <a href="#main-content"
       class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-3 rounded-lg z-50">
      Passer au contenu principal
    </a>

    <div class="mx-auto space-y-8" role="application" aria-label="Formulation de shampoing">
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
            :phases-summary="formulationSummary"
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
          <ShampooBasicInfoSection
              :form-data="formData"
              :errors="errors"
              :hair-profiles-options="hairProfilesOptions"
              :selected-hair-profile="selectedHairProfile"
              :clear-error="clearError"
              :validate-volume="validateVolume"
          />

          <!-- Section 2: Tensioactifs (Base lavante) -->
          <ShampooSurfactantsSection
              :surfactants="surfactants"
              :form-data="formData"
              :total-surfactants="totalSurfactants"
              :surfactant-ratio="surfactantRatio"
              :surfactant-warnings="surfactantWarnings"
              :grams="grams"
              :optimize-surfactants="optimizeSurfactants"
          />

          <!-- Section 3: Actifs capillaires -->
          <ShampooActivesSection
              :filtered-actives="filteredActives"
              :form-data="formData"
              :hair-profiles="hairProfiles"
              :enabled-actives-count="enabledActivesCount"
              :too-many-actives="tooManyActives"
              :active-search="activeSearch"
              :active-type-filter="activeTypeFilter"
              :update-active-search="updateActiveSearch"
              :update-active-type-filter="updateActiveTypeFilter"
              :grams="grams"
          />

          <!-- Section 4: Agents conditionneurs -->
          <ShampooConditioningAgentsSection
              :conditioning-agents="conditioningAgents"
              :form-data="formData"
              :selected-conditioning-agents="selectedConditioningAgents"
              :total-conditioning-percent="totalConditioningPercent"
              :grams="grams"
          />

          <!-- Section 5: Ajusteurs de pH et viscosité -->
          <ShampooTexturizersSection
              :form-data="formData"
              :thickeners="thickeners"
              :ph-adjusters="phAdjusters"
              :target-ph="targetPh"
              :ph-warnings="phWarnings"
              :viscosity-target="viscosityTarget"
          />

          <!-- Section 6: Système de conservation -->
          <ShampooPreservativesSection
              :form-data="formData"
              :preservative-systems="preservativeSystems"
              :preservative-warnings="preservativeWarnings"
              :check-preservative-compatibility="checkPreservativeCompatibility"
          />

          <!-- Section 7: Parfums et huiles essentielles -->
          <ShampooFragranceSection
              :form-data="formData"
              :fragrance-options="fragranceOptions"
              :fragrance-notes="fragranceNotes"
              :hair-essential-oils="hairEssentialOils"
              :fragrance-warnings="fragranceWarnings"
              :toggle-essential-oil="toggleEssentialOil"
              :check-fragrance-allergens="checkFragranceAllergens"
          />

          <!-- Section 8: Analyse et validation INCI -->
          <ShampooAnalysisSection
              :phases="phases"
              :total-formulation-percent="totalFormulationPercent"
              :water-phase="waterPhase"
              :water-phase-grams="waterPhaseGrams"
              :get-phase-dash-offset="getPhaseDashOffset"
              :format-inci-list="formatINCIList"
              :copy-inci="copyINCI"
              :copied="copied"
              :inci-list="inciList"
              :inci-with-cas="inciWithCas"
              :regulatory-status="regulatoryStatus"
              :regulatory-errors="regulatoryErrors"
              :regulatory-checks="regulatoryChecks"
              :allergens-list="allergensList"
              :generate-compliance-report="generateComplianceReport"
          />

          <!-- Section 9: Finalisation -->
          <ShampooActionsSection
              :is-valid="isValid"
              :saving="saving"
              :is-edit-mode="isEditMode"
              :initial-data="props.initialData"
              :save-draft="saveDraft"
              :save="save"
              :cancel="cancel"
              :format-date="formatDate"
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
      <Footer :current-date="currentDate"/>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {useClipboard} from '@vueuse/core'

// Composables
import useShampooFormData from '../composables/hair/useShampooFormData'
import useShampooFilters from '../composables/hair/useShampooFilters'
import useShampooCalculations from '../composables/hair/useShampooCalculations'
import useShampooRegulatoryValidation from '../composables/hair/useShampooRegulatoryValidation'
import useShampooIngredients from '../composables/hair/useShampooIngredients'
import useShampooAccessibility from '../composables/hair/useShampooAccessibility'
import useShampooINCI from '../composables/hair/useShampooINCI'

// Composants
import HeaderSection from '../ui/HeaderSection.vue'
import AccessibilityMenu from '../ui/AccessibilityMenu.vue'
import FormulaSummary from '../ui/FormulaSummary.vue'
import FixedActionBar from '../ui/FixedActionBar.vue'
import Footer from '../ui/Footer.vue'
import ShampooBasicInfoSection from '../ui/sections/shampoo/BasicInfoSection.vue'
import ShampooSurfactantsSection from '../ui/sections/shampoo/SurfactantsSection.vue'
import ShampooActivesSection from '../ui/sections/shampoo/ActivesSection.vue'
import ShampooConditioningAgentsSection from '../ui/sections/shampoo/ConditioningAgentsSection.vue'
import ShampooTexturizersSection from '../ui/sections/shampoo/TexturizersSection.vue'
import ShampooPreservativesSection from '../ui/sections/shampoo/PreservativesSection.vue'
import ShampooFragranceSection from '../ui/sections/shampoo/FragranceSection.vue'
import ShampooAnalysisSection from '../ui/sections/shampoo/AnalysisSection.vue'
import ShampooActionsSection from '../ui/sections/shampoo/ActionsSection.vue'

const router = useRouter()
const {copy, copied} = useClipboard()

// Props pour les données initiales
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

// Événements
const emit = defineEmits(['save', 'cancel', 'save-draft'])

// États UI
const saving = ref(false)
const errors = ref({})
const isEditMode = ref(false)
const showFixedBar = ref(true)
const summaryExpanded = ref(false)
const showAccessibilityMenu = ref(false)

// Données
const {
  formData,
  hairProfiles,
  hairProfilesOptions,
  selectedHairProfile,
  surfactants,
  actives,
  conditioningAgents,
  thickeners,
  phAdjusters,
  preservativeSystems,
  fragranceOptions,
  fragranceNotes,
  hairEssentialOils,
  targetPh,
  viscosityTarget,
  applyInitialData
} = useShampooFormData()

// Filtres
const {
  activeSearch,
  activeTypeFilter,
  filteredActives
} = useShampooFilters(actives)

const updateActiveSearch = (value) => {
  activeSearch.value = value
}

const updateActiveTypeFilter = (value) => {
  activeTypeFilter.value = value
}

// Calculs
const {
  grams,
  totalSurfactants,
  surfactantRatio,
  surfactantWarnings,
  selectedConditioningAgents,
  totalConditioningPercent,
  enabledActivesCount,
  tooManyActives,
  preservativePercent,
  thickenerPercent,
  totalActivesPercent,
  heTotal,
  waterPhase,
  waterPhaseGrams,
  totalFormulationPercent,
  phases,
  formulationSummary,
  phWarnings,
  preservativeWarnings,
  fragranceWarnings
} = useShampooCalculations({
  formData,
  surfactants,
  actives,
  conditioningAgents,
  hairProfiles,
  targetPh,
  viscosityTarget
})

// Validation réglementaire
const {
  regulatoryChecks,
  regulatoryErrors,
  regulatoryStatus,
  validateVolume,
  clearError,
  checkPreservativeCompatibility,
  checkFragranceAllergens
} = useShampooRegulatoryValidation(
    {
      formData,
      waterPhase,
      totalSurfactants,
      surfactantRatio,
      totalConditioningPercent,
      hairProfiles,
      heTotal,
      targetPh
    },
    errors
)

// Ingrédients et INCI
const {
  inciList,
  inciWithCas,
  allergensList
} = useShampooINCI({
  formData,
  surfactants,
  actives,
  thickeners,
  phAdjusters,
  preservativeSystems,
  selectedConditioningAgents
})

// Accessibilité
const {
  highContrast,
  reducedMotion,
  containerClasses,
  increaseTextSize,
  decreaseTextSize,
  toggleHighContrast,
  toggleReducedMotion,
  detectSystemPreferences
} = useShampooAccessibility()

const currentDate = ref(new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

// Sections pour navigation
const sections = [
  {id: 'basic-info', name: 'Informations'},
  {id: 'surfactants', name: 'Base lavante'},
  {id: 'actives', name: 'Actifs'},
  {id: 'conditioning-agents', name: 'Conditionneurs'},
  {id: 'texturizers', name: 'Texturisants'},
  {id: 'preservatives', name: 'Conservation'},
  {id: 'fragrance', name: 'Parfum'},
  {id: 'analysis', name: 'Analyse INCI'},
  {id: 'actions', name: 'Finalisation'}
]

const isMobile = computed(() => window.innerWidth < 1024)

// Pourcentage de complétion
const completionPercentage = computed(() => {
  let percentage = 0

  // Vérification sécurisée
  if (formData?.value?.name && formData.value.name.trim().length > 0) percentage += 10
  if (formData?.value?.volume >= 100) percentage += 5
  if (formData?.value?.hairType) percentage += 10

  if (formData?.value?.preservativeSystem) percentage += 15
  if (formData?.value?.preservativeSystem === 'cosgard' && (formData?.value?.cosgardPercent || 0) >= 0.5) {
    percentage += 5
  }

  if (enabledActivesCount.value > 0) percentage += 10
  if (selectedConditioningAgents?.value?.length > 0) percentage += 10
  if (formData?.value?.thickener) percentage += 5
  if (regulatoryStatus?.value?.isValid) percentage += 15

  return Math.min(percentage, 100)
})

// Méthodes UI
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start'})
    element.focus({preventScroll: true})
  }
}

const toggleFixedBar = () => {
  showFixedBar.value = !showFixedBar.value
}

const toggleSummary = () => {
  summaryExpanded.value = !summaryExpanded.value
}

const toggleAccessibilityMenu = () => {
  showAccessibilityMenu.value = !showAccessibilityMenu.value
}

// Optimisation des tensioactifs
const optimizeSurfactants = () => {
  const total = totalSurfactants.value

  if (total < 10) {
    // Augmenter pour atteindre 15%
    const multiplier = 15 / total
    surfactants.value.forEach(s => {
      if (s.selected) {
        s.percent = Math.min(s.max, s.percent * multiplier)
      }
    })
  } else if (total > 30) {
    // Réduire pour atteindre 25%
    const multiplier = 25 / total
    surfactants.value.forEach(s => {
      if (s.selected) {
        s.percent = Math.max(s.min, s.percent * multiplier)
      }
    })
  }
}

// Méthodes INCI
const formatINCIList = () => {
  return inciList.value.join(',\n')
}

const copyINCI = async () => {
  await copy(formatINCIList())
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// Méthodes de formatage
const formatDate = (dateString) => {
  if (!dateString) return 'Jamais'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPhaseDashOffset = (phase, index) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += phases.value[i].percent * 9.42
  }
  return offset
}

// Validation de sauvegarde
const canSave = computed(() => {
  const hasPreservative = formData.preservativeSystem === 'cosgard'
      ? (formData.cosgardPercent >= 0.5 && formData.cosgardPercent <= 1.0)
      : formData.preservativeSystem

  const surfactantsOk = totalSurfactants.value >= 8 && totalSurfactants.value <= 35
  const phOk = targetPh.value >= 4.0 && targetPh.value <= 6.0

  return formData?.name?.trim()?.length > 0 &&
      formData.volume >= 50 &&
      formData.hairType &&
      hasPreservative &&
      surfactantsOk &&
      phOk &&
      waterPhase.value >= 0
})

const isValid = computed(() => {
  // Autorise le clic dès que les conditions de base sont réunies; le blocage détaillé reste géré par regulatoryStatus
  const regulatoryOk = regulatoryStatus.value?.isValid ?? true
  return canSave.value && regulatoryOk
})

// Méthodes de sauvegarde
const generateIngredientsForDB = () => {
  const ingredients = []

  // Tensioactifs (par ordre INCI)
  surfactants.value.filter(s => s.selected).forEach(s => {
    ingredients.push({
      name: s.inci,
      quantity: s.percent,
      unit: "%",
      type: "surfactant",
      function: s.function,
      cas: s.cas
    })
  })

  // Actifs
  actives.value.filter(a => a.enabled).forEach(a => {
    ingredients.push({
      name: a.inci,
      quantity: a.percent,
      unit: "%",
      type: "active",
      cas: a.cas,
      function: a.function
    })
  })

  // Agents conditionneurs
  selectedConditioningAgents.value.forEach(agent => {
    ingredients.push({
      name: agent.inci,
      quantity: agent.percent,
      unit: "%",
      type: "conditioning_agent",
      cas: agent.cas
    })
  })

  // Épaississant
  const thickenerObj = thickeners.value.find(t => t.name === formData.thickener)
  if (thickenerObj) {
    ingredients.push({
      name: thickenerObj.inci,
      quantity: formData.thickenerPercent,
      unit: "%",
      type: "thickener",
      cas: thickenerObj.cas
    })
  }

  // Ajusteur de pH
  const phAdjuster = phAdjusters.value.find(p => p.name === formData.phAdjuster)
  if (phAdjuster) {
    ingredients.push({
      name: phAdjuster.inci,
      quantity: formData.phAdjusterPercent,
      unit: "%",
      type: "ph_adjuster",
      cas: phAdjuster.cas
    })
  }

  // Conservateur
  const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
  if (preservative) {
    ingredients.push({
      name: preservative.inci,
      quantity: formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent : preservative.defaultPercent,
      unit: "%",
      type: "preservative",
      cas: preservative.cas
    })
  }

  // Huiles essentielles
  formData.selectedEssentialOils.forEach(he => {
    ingredients.push({
      name: he.inci || `Parfum (${he.name})`,
      quantity: typeof he.percent === 'number' ? he.percent : 0.5,
      unit: "%",
      type: "fragrance",
      allergens: he.allergens || []
    })
  })

  // Eau (toujours en dernier)
  ingredients.push({
    name: "Aqua (Water)",
    quantity: waterPhase.value,
    unit: "%",
    type: "solvent"
  })

  return ingredients
}

const save = async () => {
  if (!isValid.value) {
    const details = regulatoryErrors.value.length
        ? `\n\nErreurs:\n- ${regulatoryErrors.value.join('\n- ')}`
        : ''
    alert(`Veuillez corriger les erreurs réglementaires avant d'enregistrer${details}`)
    return
  }

  saving.value = true

  try {
    const ingredients = generateIngredientsForDB()

    // Tri INCI (ordre décroissant de concentration)
    ingredients.sort((a, b) => b.quantity - a.quantity)

    const formulaData = {
      id: isEditMode.value ? props.initialData.id : `shampoo-${Date.now()}`,
      name: formData.name.trim(),
      description: generateDescription(),
      type: "hair_shampoo",
      createdAt: isEditMode.value ? props.initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Formulation
      volume: formData.volume,
      hairType: formData.hairType,
      targetPh: targetPh.value,

      // Base lavante
      surfactants: surfactants.value.filter(s => s.selected).map(s => ({
        id: s.id,
        percent: s.percent
      })),
      totalSurfactants: totalSurfactants.value,

      // Actifs
      actives: actives.value.filter(a => a.enabled).map(a => ({
        id: a.id,
        percent: a.percent
      })),

      // Agents conditionneurs
      conditioningAgents: selectedConditioningAgents.value.map(a => ({
        id: a.id,
        percent: a.percent
      })),

      // Texturisants
      thickener: formData.thickener,
      thickenerPercent: formData.thickenerPercent,
      phAdjuster: formData.phAdjuster,
      phAdjusterPercent: formData.phAdjusterPercent,

      // Conservation
      preservativeSystem: formData.preservativeSystem,
      cosgardPercent: formData.cosgardPercent,

      // Parfum
      fragranceType: formData.fragranceType,
      fragranceIntensity: formData.fragranceIntensity,
      fragranceNote: formData.fragranceNote,
      selectedEssentialOils: formData.selectedEssentialOils,

      // Ingrédients complets
      ingredients: ingredients,

      // Calculs
      totalPercent: totalFormulationPercent.value,
      waterPercent: waterPhase.value,

      // Métadonnées INCI
      inciList: inciList.value,
      inciWithCas: inciWithCas.value,
      allergensList: allergensList.value,

      // Conformité
      compliance: {
        euRegulation: "1223/2009",
        preservativeCompliant: true,
        phAppropriate: targetPh.value >= 4.0 && targetPh.value <= 6.0,
        surfactantLevelAppropriate: totalSurfactants.value >= 8 && totalSurfactants.value <= 35,
        isValid: regulatoryStatus.value.isValid,
        errors: regulatoryErrors.value,
        warnings: [...surfactantWarnings.value, ...phWarnings.value, ...preservativeWarnings.value]
      },

      // Version
      version: "2.2"
    }

    emit("save", formulaData)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error)
    alert("Une erreur est survenue lors de l'enregistrement")
  } finally {
    saving.value = false
  }
}

const saveDraft = () => {
  emit("save-draft", {
    ...formData,
    surfactants: surfactants.value.filter(s => s.selected),
    actives: actives.value.filter(a => a.enabled),
    conditioningAgents: selectedConditioningAgents.value,
    isDraft: true,
    savedAt: new Date().toISOString(),
    progress: completionPercentage.value
  })
}

const cancel = () => {
  emit("cancel")
  if (!emit.cancel) {
    router.push(isEditMode.value ? `/recette/${props.initialData.id}` : '/recettes')
  }
}

const generateDescription = () => {
  const preservativeName = preservativeSystems.find(p => p.id === formData.preservativeSystem)?.name || 'Non spécifié'
  const surfactantsList = surfactants.value.filter(s => s.selected).map(s => `${s.name} ${s.percent}%`).join(', ')

  return `${formData.name} - Shampoing pour cheveux ${formData.hairType}
- Volume: ${formData.volume}ml
- pH cible: ${targetPh.value}
- Base lavante (${totalSurfactants.value.toFixed(1)}%): ${surfactantsList || 'Aucune'}
- Actifs: ${actives.filter(a => a.enabled).map(a => `${a.name} ${a.percent}%`).join(', ') || 'Aucun'}
- Agents conditionneurs: ${selectedConditioningAgents.value.map(a => `${a.name} ${a.percent}%`).join(', ') || 'Aucun'}
- Épaississant: ${formData.thickener || 'Aucun'} ${formData.thickenerPercent || 0}%
- Conservateur: ${preservativeName}
- Validation UE: ${regulatoryStatus.value.isValid ? 'Conforme' : 'Non conforme'}`
}

// Méthodes d'export
const generateReport = () => {
  if (!isValid.value) {
    alert("La formule doit être valide pour générer un rapport")
    return
  }

  console.log('Génération du rapport PDF...')
}

const exportFormula = () => {
  const exportData = {
    formula: {
      ...formData,
      surfactants: surfactants.value.filter(s => s.selected),
      actives: actives.value.filter(a => a.enabled),
      conditioningAgents: selectedConditioningAgents.value
    },
    analysis: {
      phases: phases.value,
      regulatoryStatus: regulatoryStatus.value,
      inciList: inciList.value,
      inciWithCas: inciWithCas.value,
      allergensList: allergensList.value
    },
    metadata: {
      version: "2.2",
      exportDate: new Date().toISOString(),
      generatedBy: "Formulateur Shampoing Pro"
    }
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

  const exportFileDefaultName = `shampoing-${formData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const generateComplianceReport = () => {
  console.log('Génération du rapport de conformité...')
}

// Initialisation
onMounted(() => {
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    isEditMode.value = true
    applyInitialData(props.initialData)
  }

  document.addEventListener('keydown', handleKeyboardShortcuts)
  detectSystemPreferences()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})

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
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    isEditMode.value = true
    applyInitialData(newData)
  }
}, {immediate: true})

watch(() => formData.cosgardPercent, (newVal) => {
  if (newVal < 0.5 || newVal > 1.0) {
    errors.value.cosgardPercent = "Cosgard: plage 0.5-1.0% requise"
  } else {
    delete errors.value.cosgardPercent
  }
})

watch(() => formData.volume, validateVolume)
watch(totalSurfactants, (newVal) => {
  if (newVal < 8) {
    errors.value.surfactants = "Base lavante insuffisante (min 8%)"
  } else if (newVal > 35) {
    errors.value.surfactants = "Base lavante trop concentrée (max 35%)"
  } else {
    delete errors.value.surfactants
  }
})
</script>

<style scoped>
/* Styles spécifiques aux Shampoings */
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
  @apply border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500;
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

/* Cartes spécifiques */
.surfactant-card {
  @apply border-2 rounded-xl transition-all duration-300;
}

.surfactant-card-selected {
  @apply border-blue-500 bg-gradient-to-br from-blue-50 to-white;
}

.surfactant-card-default {
  @apply border-gray-200 hover:border-blue-300;
}

.ph-indicator {
  @apply w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500;
}

/* Boutons */
.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700
  text-white font-bold rounded-xl
  hover:from-blue-700 hover:to-indigo-800
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

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

/* Support contraste élevé */
:global(.high-contrast) {
  --text-color: #000;
  --bg-color: #fff;
  --border-color: #000;
}

/* Support réduction de mouvement */
:global(.reduced-motion) * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
}

/* Responsive */
@media (max-width: 768px) {
  .surfactant-card {
    @apply p-3;
  }

  .btn-primary,
  .btn-secondary {
    @apply px-4 py-2 text-sm;
  }
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
</style>
