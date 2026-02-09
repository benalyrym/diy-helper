<template>
  <div :class="containerClasses">
    <!-- Navigation d'accessibilité -->
    <a href="#main-content"
       class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-3 rounded-lg z-50">
      Passer au contenu principal
    </a>

    <div class="mx-auto space-y-8" role="application" aria-label="Formulation d'après-shampoing">
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
          <ConditionerBasicInfoSection
              :form-data="formData"
              :errors="errors"
              :hair-profiles-options="hairProfilesOptions"
              :selected-hair-profile="selectedHairProfile"
              :clear-error="clearError"
              :validate-volume="validateVolume"
          />

          <!-- Section 2: Actifs capillaires -->
          <ConditionerActivesSection
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

          <!-- Section 3: Phase aqueuse -->
          <ConditionerAqueousPhaseSection
              :aqueous-phase-options="aqueousPhaseOptions"
              :selected-aqueous-phase="selectedAqueousPhase"
              :aqueous-phase-total="aqueousPhaseTotal"
              :grams="grams"
              :auto-calculate-water-phase="autoCalculateWaterPhase"
              :optimize-aqueous-phase="optimizeAqueousPhase"
              :toggle-category="toggleCategory"
              :reduced-motion="reducedMotion"
          />

          <!-- Section 4: Phase grasse -->
          <ConditionerOilPhaseSection
              :oil-phase-options="oilPhaseOptions"
              :selected-oil-phase="selectedOilPhase"
              :oil-phase-total="oilPhaseTotal"
              :form-data="formData"
              :hair-profiles="hairProfiles"
              :oil-phase-exceeded="oilPhaseExceeded"
              :penetration-distribution="penetrationDistribution"
              :grams="grams"
              :toggle-category="toggleCategory"
              :auto-calculate-oil-phase="autoCalculateOilPhase"
              :optimize-oil-phase="optimizeOilPhase"
          />

          <!-- Section 5: Agents démêlants et épaississants -->
          <ConditionerConditioningAgentsSection
              :conditioning-agents="conditioningAgents"
              :thickeners="thickeners"
              :form-data="formData"
              :selected-conditioning-agents="selectedConditioningAgents"
              :total-conditioning-percent="totalConditioningPercent"
              :grams="grams"
          />

          <!-- Section 6: Système de conservation -->
          <ConditionerPreservativesSection
              :form-data="formData"
              :preservative-systems="preservativeSystems"
          />

          <!-- Section 7: Parfums et huiles essentielles -->
          <ConditionerEssentialOilSection
              :form-data="formData"
              :fragrance-options="fragranceOptions"
              :fragrance-notes="fragranceNotes"
              :hair-essential-oils="hairEssentialOils"
              :toggle-essential-oil="toggleEssentialOil"
          />

          <!-- Section 8: Analyse et validation -->
          <ConditionerAnalysisSection
              :phases="phases"
              :total-formulation-percent="totalFormulationPercent"
              :water-phase="waterPhase"
              :water-phase-grams="waterPhaseGrams"
              :get-phase-dash-offset="getPhaseDashOffset"
              :format-inci-list="formatINCIList"
              :copy-inci="copyINCI"
              :copied="copied"
              :inci-list="inciList"
              :regulatory-status="regulatoryStatus"
              :regulatory-errors="regulatoryErrors"
              :regulatory-checks="regulatoryChecks"
              :he-contraindications="heContraindications"
              :generate-compliance-report="generateComplianceReport"
          />

          <!-- Section 9: Finalisation -->
          <ConditionerActionsSection
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
import useConditionerFormData from '../composables/hair/useConditionerFormData'
import useConditionerFilters from '../composables/hair/useConditionerFilters'
import useConditionerCalculations from '../composables/hair/useConditionerCalculations'
import useConditionerRegulatoryValidation from '../composables/hair/useConditionerRegulatoryValidation'
import useConditionerIngredients from '../composables/hair/useConditionerIngredients'
import useConditionerAccessibility from '../composables/hair/useConditionerAccessibility'

// Composants
import HeaderSection from '../ui/HeaderSection.vue'
import AccessibilityMenu from '../ui/AccessibilityMenu.vue'
import FormulaSummary from '../ui/FormulaSummary.vue'
import FixedActionBar from '../ui/FixedActionBar.vue'
import Footer from '../ui/Footer.vue'
import ConditionerBasicInfoSection from '../ui/sections/conditioner/BasicInfoSection.vue'
import ConditionerActivesSection from '../ui/sections/conditioner/ActivesSection.vue'
import ConditionerAqueousPhaseSection from '../ui/sections/conditioner/AqueousPhaseSection.vue'
import ConditionerOilPhaseSection from '../ui/sections/conditioner/OilPhaseSection.vue'
import ConditionerConditioningAgentsSection from '../ui/sections/conditioner/ConditioningAgentsSection.vue'
import ConditionerPreservativesSection from '../ui/sections/conditioner/PreservativesSection.vue'
import ConditionerEssentialOilSection from '../ui/sections/conditioner/EssentialOilSection.vue'
import ConditionerAnalysisSection from '../ui/sections/conditioner/AnalysisSection.vue'
import ConditionerActionsSection from '../ui/sections/conditioner/ActionsSection.vue'

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
  actives,
  preservativeSystems,
  aqueousPhaseOptions,
  oilPhaseOptions,
  conditioningAgents,
  thickeners,
  fragranceOptions,
  fragranceNotes,
  hairEssentialOils,
  applyInitialData
} = useConditionerFormData()

// Filtres
const {
  activeSearch,
  activeTypeFilter,
  filteredActives
} = useConditionerFilters(actives)

const updateActiveSearch = (value) => {
  activeSearch.value = value
}

const updateActiveTypeFilter = (value) => {
  activeTypeFilter.value = value
}

// Calculs
const {
  grams,
  selectedAqueousPhase,
  aqueousPhaseTotal,
  selectedOilPhase,
  oilPhaseTotal,
  oilPhaseExceeded,
  penetrationDistribution,
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
  formulationSummary
} = useConditionerCalculations({
  formData,
  actives,
  aqueousPhaseOptions,
  oilPhaseOptions,
  conditioningAgents,
  hairProfiles
})

// Validation réglementaire
const {
  regulatoryChecks,
  regulatoryErrors,
  regulatoryStatus,
  heContraindications,
  validateVolume,
  clearError
} = useConditionerRegulatoryValidation(
    {
      formData,
      waterPhase,
      oilPhaseTotal,
      totalConditioningPercent,
      hairProfiles,
      heTotal
    },
    errors
)

// Ingrédients
const {inciList} = useConditionerIngredients({
  formData,
  actives,
  thickeners,
  preservativeSystems,
  selectedConditioningAgents,
  selectedOilPhase,
  selectedAqueousPhase
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
} = useConditionerAccessibility()

const currentDate = ref(new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

// Sections pour navigation
const sections = [
  {id: 'basic-info', name: 'Informations'},
  {id: 'actives', name: 'Actifs'},
  {id: 'aqueous-phase', name: 'Infusions'},
  {id: 'oil-phase', name: 'Phase grasse'},
  {id: 'conditioning-agents', name: 'Démêlants'},
  {id: 'preservatives', name: 'Conservation'},
  {id: 'fragrance', name: 'Parfum'},
  {id: 'analysis', name: 'Analyse'},
  {id: 'actions', name: 'Finalisation'}
]

const isMobile = computed(() => window.innerWidth < 1024)

// Pourcentage de complétion
const completionPercentage = computed(() => {
  let percentage = 0

  if (formData.name.trim().length > 0) percentage += 10
  if (formData.volume >= 100) percentage += 5
  if (formData.hairType) percentage += 10

  if (formData.preservativeSystem) percentage += 15
  if (formData.preservativeSystem === 'cosgard' && formData.cosgardPercent >= 0.5) {
    percentage += 5
  }

  if (enabledActivesCount.value > 0) percentage += 10
  if (aqueousPhaseTotal.value > 0) percentage += 10
  if (oilPhaseTotal.value > 0) percentage += 10
  if (selectedConditioningAgents.value.length > 0) percentage += 10
  if (formData.thickener) percentage += 5
  if (regulatoryStatus.value.isValid) percentage += 15

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

// Méthodes de catégories
const toggleCategory = (category, type) => {
  const items = category.items
  const allSelected = items.every(i => i.selected)

  items.forEach(item => {
    if (type === 'oil' && !allSelected && oilPhaseExceeded.value && !item.selected) {
      return // Ne pas sélectionner si phase grasse dépassée
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
      totalConditioningPercent.value +
      thickenerPercent.value +
      (formData.fragranceType === 'essential_oils' ? 0.5 : 0.3)

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
  const max = hairProfiles[formData.hairType]?.oil || 10
  const current = oilPhaseTotal.value

  if (current > max) {
    // Réduire proportionnellement
    selectedOilPhase.value.forEach(item => {
      const originalItem = findOilItem(item.name)
      if (originalItem) {
        const reduction = (item.percent / current) * (current - max)
        originalItem.percent = Math.max(originalItem.min, originalItem.percent - reduction)
      }
    })
  } else if (current < max * 0.8) {
    // Augmenter si trop bas
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

const normalizeName = (value) => {
  return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
}

const findAqueousItem = (name) => {
  const target = normalizeName(name)
  for (const category of Object.values(aqueousPhaseOptions)) {
    for (const item of category.items) {
      if (item.name === name || normalizeName(item.name) === target) return item
    }
  }
  return null
}

const findOilItem = (name) => {
  const target = normalizeName(name)
  for (const category of Object.values(oilPhaseOptions)) {
    for (const item of category.items) {
      if (item.name === name || normalizeName(item.name) === target) return item
    }
  }
  return null
}

const findActiveByIngredient = (ingredient) => {
  const target = normalizeName(ingredient.name)
  return actives.find(active => {
    if (active.label && normalizeName(active.label) === target) return true
    if (active.inci && normalizeName(active.inci) === target) return true
    if (active.key && normalizeName(active.key) === target) return true
    return false
  })
}

const resetSelections = () => {
  actives.forEach(active => {
    active.enabled = false
  })
  Object.values(aqueousPhaseOptions).forEach(category => {
    category.items.forEach(item => {
      item.selected = false
    })
  })
  Object.values(oilPhaseOptions).forEach(category => {
    category.items.forEach(item => {
      item.selected = false
    })
  })
  conditioningAgents.forEach(agent => {
    agent.selected = false
  })
  formData.selectedEssentialOils = []
}

const loadInitialIngredients = (initialData) => {
  if (!initialData?.ingredients || !Array.isArray(initialData.ingredients)) return

  resetSelections()

  initialData.ingredients.forEach(ingredient => {
    const type = String(ingredient.type || '').toLowerCase()
    const quantity = typeof ingredient.quantity === 'number' ? ingredient.quantity : null

    if (type === 'active') {
      const active = findActiveByIngredient(ingredient)
      if (active) {
        active.enabled = true
        if (quantity !== null) active.percent = quantity
        return
      }
    }

    if (type === 'infusion' || type === 'aqueous') {
      const item = findAqueousItem(ingredient.name)
      if (item) {
        item.selected = true
        if (quantity !== null) item.percent = quantity
        return
      }
    }

    if (type === 'hair_oil' || type === 'oil') {
      const item = findOilItem(ingredient.name)
      if (item) {
        item.selected = true
        if (quantity !== null) item.percent = quantity
        return
      }
    }

    if (type === 'conditioning_agent') {
      const agent = conditioningAgents.find(a => a.name === ingredient.name)
      if (agent) {
        agent.selected = true
        if (quantity !== null) agent.percent = quantity
        return
      }
    }

    if (type === 'essential_oil') {
      const heName = String(ingredient.name || '').replace(/^HE\s+/i, '').trim()
      const existing = hairEssentialOils.find(he => he.name === heName)
      if (existing) {
        formData.selectedEssentialOils.push({
          ...existing,
          percent: quantity ?? existing.percent ?? 0.1
        })
        return
      } else if (heName) {
        formData.selectedEssentialOils.push({
          name: heName,
          latinName: ingredient.latinName || '',
          percent: quantity ?? 0.1
        })
        return
      }
    }

    if (type === 'thickener') {
      if (ingredient.name) formData.thickener = ingredient.name
      if (quantity !== null) formData.thickenerPercent = quantity
      return
    }

    // Fallback: attempt to match by name when type is missing/unknown.
    const fallbackActive = findActiveByIngredient(ingredient)
    if (fallbackActive) {
      fallbackActive.enabled = true
      if (quantity !== null) fallbackActive.percent = quantity
      return
    }

    const fallbackAqueous = findAqueousItem(ingredient.name)
    if (fallbackAqueous) {
      fallbackAqueous.selected = true
      if (quantity !== null) fallbackAqueous.percent = quantity
      return
    }

    const fallbackOil = findOilItem(ingredient.name)
    if (fallbackOil) {
      fallbackOil.selected = true
      if (quantity !== null) fallbackOil.percent = quantity
    }
  })
}

// Méthodes d'optimisation
const optimizeAqueousPhase = () => {
  const selected = selectedAqueousPhase.value
  if (selected.length === 0) return

  // Répartir équitablement jusqu'à 40% total
  const targetTotal = Math.min(40, selected.length * 15)
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

  const max = hairProfiles[formData.hairType]?.oil || 10
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

// Méthodes huiles essentielles
const toggleEssentialOil = (he) => {
  const idx = formData.selectedEssentialOils.findIndex(eo => eo.name === he.name)
  if (idx === -1) {
    formData.selectedEssentialOils.push({...he})
  } else {
    formData.selectedEssentialOils.splice(idx, 1)
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

  return formData.name.trim().length > 0 &&
      formData.volume >= 100 &&
      formData.hairType &&
      hasPreservative &&
      waterPhase.value >= 0
})

const isValid = computed(() => {
  return canSave.value && regulatoryErrors.value.length === 0
})

// Méthodes de sauvegarde
const generateIngredientsForDB = () => {
  const ingredients = []

  // Actifs
  actives.filter(a => a.enabled).forEach(a => {
    ingredients.push({
      name: a.label,
      quantity: a.percent,
      unit: "%",
      type: "active",
      inci: a.inci
    })
  })

  // Conservateur
  const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
  if (preservative) {
    ingredients.push({
      name: preservative.name,
      quantity: formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent : 0.5,
      unit: "%",
      type: "preservative",
      inci: preservative.inci
    })
  }

  // Agents démêlants
  selectedConditioningAgents.value.forEach(agent => {
    ingredients.push({
      name: agent.name,
      quantity: agent.percent,
      unit: "%",
      type: "conditioning_agent"
    })
  })

  // Huiles essentielles
  formData.selectedEssentialOils.forEach(he => {
    ingredients.push({
      name: `HE ${he.name}`,
      quantity: typeof he.percent === 'number' ? he.percent : 0.1,
      unit: "%",
      type: "essential_oil",
      latinName: he.latinName
    })
  })

  // Infusions
  selectedAqueousPhase.value.forEach(aq => {
    ingredients.push({
      name: aq.name,
      quantity: aq.percent,
      unit: "%",
      type: "infusion"
    })
  })

  // Huiles capillaires
  selectedOilPhase.value.forEach(oil => {
    ingredients.push({
      name: oil.name,
      quantity: oil.percent,
      unit: "%",
      type: "hair_oil",
      penetration: oil.penetration
    })
  })

  // Épaississant
  const thickenerObj = thickeners.find(t => t.name === formData.thickener)
  if (thickenerObj) {
    ingredients.push({
      name: formData.thickener,
      quantity: formData.thickenerPercent,
      unit: "%",
      type: "thickener"
    })
  }

  // Eau
  ingredients.push({
    name: "Eau déminéralisée",
    quantity: waterPhase.value,
    unit: "%",
    type: "water"
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
    const formulaData = {
      name: formData.name.trim(),
      description: generateDescription(),
      type: "hair_conditioner",
      createdAt: isEditMode.value ? props.initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Formulation
      volume: formData.volume,
      hairType: formData.hairType,
      preservativeSystem: formData.preservativeSystem,
      cosgardPercent: formData.cosgardPercent,
      thickener: formData.thickener,
      thickenerPercent: formData.thickenerPercent,
      fragranceType: formData.fragranceType,
      fragranceIntensity: formData.fragranceIntensity,
      fragranceNote: formData.fragranceNote,

      // Ingrédients
      ingredients: generateIngredientsForDB(),

      // Calculs
      totalPercent: totalFormulationPercent.value,
      waterPercent: waterPhase.value,

      // Métadonnées
      version: "2.2",
      compliance: {
        euRegulation: "1223/2009",
        preservativeCompliant: true,
        isValid: regulatoryStatus.value.isValid,
        errors: regulatoryErrors.value
      },

      // Mentions
      inciList: inciList.value
    }

    if (isEditMode.value && props.initialData.id) {
      formulaData.id = props.initialData.id
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
    actives: actives.filter(a => a.enabled),
    aqueousPhase: selectedAqueousPhase.value,
    oilPhase: selectedOilPhase.value,
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

  return `${formData.name} - Après-shampoing pour cheveux ${formData.hairType}
- Volume: ${formData.volume}ml
- Actifs: ${actives.filter(a => a.enabled).map(a => `${a.label} ${a.percent}%`).join(', ') || 'Aucun'}
- Phase grasse: ${oilPhaseTotal.value.toFixed(1)}%
- Phase aqueuse: ${aqueousPhaseTotal.value.toFixed(1)}%
- Agents démêlants: ${selectedConditioningAgents.value.map(a => `${a.name} ${a.percent}%`).join(', ') || 'Aucun'}
- Conservateur: ${preservativeName} ${formData.preservativeSystem === 'cosgard' ? formData.cosgardPercent + '%' : ''}
- Épaississant: ${formData.thickener} ${formData.thickenerPercent}%
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
      actives: actives.filter(a => a.enabled),
      aqueousPhase: selectedAqueousPhase.value,
      oilPhase: selectedOilPhase.value,
      conditioningAgents: selectedConditioningAgents.value
    },
    analysis: {
      phases: phases.value,
      regulatoryStatus: regulatoryStatus.value,
      inciList: inciList.value
    },
    metadata: {
      version: "2.2",
      exportDate: new Date().toISOString(),
      generatedBy: "Formulateur Après-Shampoing Pro"
    }
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

  const exportFileDefaultName = `apres-shampoing-${formData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`

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
    loadInitialIngredients(props.initialData)

    if (props.initialData.ingredients) {
      // Charger les ingrédients depuis les données initiales
      // ... (logique de chargement similaire au premier template)
    }
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
    loadInitialIngredients(newData)
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
</script>

<style scoped>
/* Styles spécifiques aux après-shampoings */

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
.hair-type-card {
  @apply border-2 rounded-xl cursor-pointer
  transition-all duration-300
  hover:shadow-lg;
}

.hair-type-card-selected {
  @apply border-indigo-500 bg-gradient-to-br from-indigo-50 to-white;
}

.hair-type-card-default {
  @apply border-gray-200 hover:border-indigo-300;
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
  @apply px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700
  text-white font-bold rounded-xl
  hover:from-indigo-700 hover:to-purple-800
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
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
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
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
  .hair-type-card {
    @apply p-3;
  }

  .active-card {
    @apply p-3;
  }

  .btn-primary,
  .btn-secondary,
  .btn-outline {
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
  @apply outline-none ring-2 ring-indigo-500 ring-offset-2;
}

/* Support navigateurs plus anciens */
@supports not (selector(:focus-visible)) {
  :focus {
    @apply outline-none ring-2 ring-indigo-500 ring-offset-2;
  }
}
</style>