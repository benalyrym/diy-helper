import { reactive, computed, ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useClipboard } from '@vueuse/core'
import { essentialOilsCatalog } from "../components/data/essentialOilsCatalog"

export function useRecipeForm({ props, emit }) {
    const router = useRouter()
    const { copy, copied } = useClipboard()

    // Props pour les données initiales

    // Événements

    // Réactivité
    const formData = reactive({
        name: "",
        volume: 50,
        skinType: "mixte",
        selectedHE: [],
        formulaType: "creme",
        spf: 0,
        preservativeSystem: "phenoxyethanol"
    })

    const activeSearch = ref("")
    const activeTypeFilter = ref("")
    const activeTypeOptions = [
        { value: "", labelKey: "activeType.all" },
        { value: "hydrating", labelKey: "activeType.hydrating" },
        { value: "antioxidant", labelKey: "activeType.antioxidant" },
        { value: "repair", labelKey: "activeType.repair" },
        { value: "exfoliant", labelKey: "activeType.exfoliant" },
        { value: "brightening", labelKey: "activeType.brightening" },
        { value: "antiage", labelKey: "activeType.antiage" }
    ]
    const formulaTypeOptions = [
        { value: 'creme', labelKey: 'formulaType.creme' },
        { value: 'serum', labelKey: 'formulaType.serum' },
        { value: 'gel', labelKey: 'formulaType.gel' },
        { value: 'baume', labelKey: 'formulaType.baume' },
        { value: 'huile', labelKey: 'formulaType.huile' }
    ]
    const heSearch = ref("")
    const hePropertyFilter = ref("")
    const heFilters = ref({
        safeForPregnancy: false,
        noPhotosensitivity: false,
        noAllergen: false
    })


    // Profils de peau enrichis
    const skinProfiles = {
        seche: {
            oil: 25,
            maxActives: 3,
            description: "Peau déshydratée, besoin en nutrition élevé",
            recommendations: ["Actifs hydratants", "Émollients riches"]
        },
        grasse: {
            oil: 15,
            maxActives: 2,
            description: "Sécrétion sébacée importante, pores dilatés",
            recommendations: ["Actifs séborégulateurs", "Textures légères"]
        },
        sensible: {
            oil: 20,
            maxActives: 2,
            description: "Réactivité cutanée élevée, tolérance limitée",
            recommendations: ["Actifs apaisants", "Formules minimalistes"]
        },
        mixte: {
            oil: 18,
            maxActives: 3,
            description: "Combinaison de zones sèches et grasses",
            recommendations: ["Équilibre hydratation", "Actifs régulateurs"]
        },
        mature: {
            oil: 22,
            maxActives: 3,
            description: "Besoins anti-âge et restructuration",
            recommendations: ["Actifs anti-âge", "Stimulateurs collagène"]
        }
    }

    const skinProfilesOptions = computed(() => {
        return Object.entries(skinProfiles).map(([key, value]) => ({
            value: key,
            label: key,
            icon: key === 'seche' ? '🏜️' : key === 'grasse' ? '💦' : key === 'sensible' ? '🌡️' : key === 'mixte' ? '⚖️' : '👵',
            iconLabel: key === 'seche' ? 'Icône peau sèche' : key === 'grasse' ? 'Icône peau grasse' : key === 'sensible' ? 'Icône peau sensible' : key === 'mixte' ? 'Icône peau mixte' : 'Icône peau mature',
            oil: value.oil,
            maxActives: value.maxActives
        }))
    })

    // Actifs cosmétiques enrichis
    const actives = reactive([
        {
            key: 'ha',
            label: 'Acide hyaluronique',
            min: 0.1,
            max: 2,
            percent: 0.5,
            enabled: false,
            inci: 'Sodium Hyaluronate',
            type: 'hydrating',
            description: "Humectant, retient l'eau en surface",
            stability: 'pH 5.5-7.0',
            compatibility: ['B5', 'Niacinamide']
        },
        {
            key: 'b5',
            label: 'Panthenol (B5)',
            min: 0.5,
            max: 5,
            percent: 2,
            enabled: false,
            inci: 'Panthenol',
            type: 'repair',
            description: 'Provitamine B5, soutien barriere cutanee',
            stability: 'stable',
            compatibility: ['HA', 'Niacinamide']
        },
        {
            key: 'niacinamide',
            label: 'Niacinamide',
            min: 2,
            max: 10,
            percent: 5,
            enabled: false,
            inci: 'Niacinamide',
            type: 'brightening',
            description: 'Uniformise le teint, aide sur les pores',
            stability: 'pH 5-7',
            compatibility: ['HA', 'B5']
        },
        {
            key: 'ceramides',
            label: 'Ceramides',
            min: 0.1,
            max: 1,
            percent: 0.3,
            enabled: false,
            inci: 'Ceramide NP',
            type: 'repair',
            description: 'Renforce la barriere, limite la perte en eau',
            stability: 'stable',
            compatibility: ['Cholesterol', 'Acides gras']
        },
        {
            key: 'vitc',
            label: 'Vitamine C (stable)',
            min: 5,
            max: 15,
            percent: 10,
            enabled: false,
            inci: 'Ascorbyl Glucoside',
            type: 'antioxidant',
            description: 'Antioxydant, eclat du teint',
            stability: 'pH 5-7',
            compatibility: ['Vitamine E', 'Ferulic Acid']
        },
        {
            key: 'vit-e',
            label: 'Vitamine E',
            min: 0.1,
            max: 1,
            percent: 0.3,
            enabled: false,
            inci: 'Tocopherol',
            type: 'antioxidant',
            description: 'Antioxydant liposoluble, protege des radicaux libres',
            stability: 'sensible a l oxidation',
            compatibility: ['Vitamine C', 'Ferulic Acid']
        },
        {
            key: 'aha',
            label: 'AHA (Acide lactique)',
            min: 2,
            max: 8,
            percent: 4,
            enabled: false,
            inci: 'Lactic Acid',
            type: 'exfoliant',
            description: 'Exfoliation douce, aide au grain de peau',
            stability: 'pH 3.0-4.0',
            compatibility: ['Niacinamide'],
            restrictions: 'Peut sensibiliser au soleil'
        },
        {
            key: 'bha',
            label: 'Acide salicylique',
            min: 0.5,
            max: 2,
            percent: 1,
            enabled: false,
            inci: 'Salicylic Acid',
            type: 'exfoliant',
            description: 'BHA liposoluble, cible les pores',
            stability: 'pH 3.0-4.0',
            compatibility: ['Niacinamide'],
            restrictions: 'Eviter avec retinol'
        },
        {
            key: 'peptide',
            label: 'Peptides',
            min: 0.5,
            max: 3,
            percent: 1.5,
            enabled: false,
            inci: 'Palmitoyl Tripeptide-1',
            type: 'antiage',
            description: 'Soutien fermete et elasticite',
            stability: 'stable',
            compatibility: ['HA', 'Ceramides']
        }
    ])
    const filteredActives = computed(() => {
        const searchTerm = activeSearch.value.trim().toLowerCase()
        return actives.filter(active => {
            const matchesSearch = !searchTerm ||
                active.label.toLowerCase().includes(searchTerm) ||
                active.inci.toLowerCase().includes(searchTerm)
            const matchesType = !activeTypeFilter.value || active.type === activeTypeFilter.value
            return matchesSearch && matchesType
        })
    })



    // Systèmes de conservation selon UE
    const preservativeSystems = [
        {
            id: 'phenoxyethanol',
            name: 'Phenoxyethanol + EHG',
            max: 1,
            icon: 'PX',
            description: 'Systeme large spectre, usage polyvalent',
            recommendation: '0.8-1% en phase finale'
        },
        {
            id: 'cosgard',
            name: 'Cosgard (Geogard 221)',
            max: 1,
            icon: 'CG',
            description: 'Conservateur large spectre accepte en bio',
            recommendation: '0.6-1% a froid'
        },
        {
            id: 'sorbate-benzoate',
            name: 'Sorbate / Benzoate',
            max: 1,
            icon: 'SB',
            description: 'Efficace en milieu acide, pH < 5.5',
            recommendation: '0.5-1% avec chelateur'
        },
        {
            id: 'leucidal',
            name: 'Leucidal (ferment radis)',
            max: null,
            icon: 'LF',
            description: 'Option douce, necessite formulation propre',
            recommendation: '2-4% selon fournisseur'
        }
    ]


    // Huiles essentielles (100+)
    const essentialOils = essentialOilsCatalog

    const saving = ref(false)
    const errors = ref({})
    const isEditMode = ref(false)
    const currentDate = ref(new Date().toLocaleDateString('fr-FR'))

    // Sections pour navigation
    const sections = [
        { id: 'basic-info', name: 'Informations' },
        { id: 'actives', name: 'Actifs' },
        { id: 'essential-oils', name: 'HE' },
        { id: 'analysis', name: 'Analyse' },
        { id: 'actions', name: 'Actions' }
    ]

    // Calculs
    const grams = (percent) => Number(((formData.volume * percent) / 100).toFixed(2))

    // Actifs activés
    const enabledActivesCount = computed(() =>
        actives.filter(a => a.enabled).length
    )

    // Total HE
    const heTotal = computed(() =>
        formData.selectedHE.reduce((sum, oil) => sum + oil.percent, 0)
    )

    // Phases calculees
    const emulsifierPercent = ref(5)
    const oilPhase = computed(() => skinProfiles[formData.skinType]?.oil || 20)
    const oilPhaseGrams = computed(() => grams(oilPhase.value))
    const waterPhase = computed(() =>
        Math.max(0, 100 - oilPhase.value - totalPercent.value - emulsifierPercent.value)
    )
    const waterPhaseGrams = computed(() => grams(waterPhase.value))

    // Total actifs + HE
    const totalPercent = computed(() => {
        const activesSum = actives.filter(a => a.enabled).reduce((s, a) => s + a.percent, 0)
        return activesSum + heTotal.value
    })

    // Phase data for visualization
    const phases = computed(() => [
        {
            name: 'Phase huileuse',
            percent: oilPhase.value,
            grams: oilPhaseGrams.value,
            color: '#F2B84B',
            icon: 'OIL',
            description: 'Emollients et huiles'
        },
        {
            name: 'Phase aqueuse',
            percent: waterPhase.value,
            grams: waterPhaseGrams.value,
            color: '#4F9DD7',
            icon: 'H2O',
            description: 'Eau et hydrolats'
        },
        {
            name: 'Actifs',
            percent: totalPercent.value,
            grams: grams(totalPercent.value),
            color: '#2F9E71',
            icon: 'ACT',
            description: 'Actifs fonctionnels'
        },
        {
            name: 'Emulsifiant',
            percent: emulsifierPercent.value,
            grams: grams(emulsifierPercent.value),
            color: '#7F7FD5',
            icon: 'EM',
            description: 'Stabilisateur'
        }
    ])

    // Liste INCI
    const inciList = computed(() => {
        const list = ['Aqua']

        // Actifs par concentration décroissante (>1%)
        const significantActives = actives
            .filter(a => a.enabled && a.percent >= 1)
            .sort((a, b) => b.percent - a.percent)

        significantActives.forEach(a => list.push(a.inci))

        // Huiles essentielles
        if (heTotal.value > 0) {
            list.push('Parfum (Fragrance)')
        }

        // Émulsifiant
        list.push('Cetearyl Alcohol', 'Glyceryl Stearate')

        // Conservateur selon choix
        if (formData.preservativeSystem === 'phenoxyethanol') {
            list.push('Phenoxyethanol')
        }

        return list
    })

    // Validation réglementaire avancée
    const regulatoryChecks = computed(() => [
        {
            name: 'Limite huiles essentielles (UE 1223/2009)',
            description: 'Maximum 1% d\'HE total dans les produits visage',
            passed: heTotal.value <= 1,
            error: `Dépassement: ${heTotal.value.toFixed(2)}% > 1%`
        },
        {
            name: 'Plages d\'utilisation des actifs',
            description: 'Respect des plages recommandées',
            passed: actives.every(a => !a.enabled || (a.percent >= a.min && a.percent <= a.max)),
            error: 'Un ou plusieurs actifs hors plage recommandée'
        },
        {
            name: 'Somme des phases ≤ 100%',
            description: 'Cohérence de la formulation',
            passed: waterPhase.value >= 0,
            error: 'La somme des phases dépasse 100%'
        },
        {
            name: 'Conservateur conforme',
            description: 'Système de conservation adapté',
            passed: formData.preservativeSystem !== null,
            error: 'Sélectionnez un système de conservation'
        },
        {
            name: 'Mentions allergènes',
            description: 'Huiles essentielles allergènes déclarées',
            passed: !formData.selectedHE.some(he => he.allergen) || heTotal.value <= 0.01,
            error: 'HE allergènes nécessitent mention obligatoire'
        }
    ])

    const regulatoryErrors = computed(() =>
        regulatoryChecks.value.filter(check => !check.passed).map(check => check.error)
    )

    const regulatoryStatus = computed(() => ({
        isValid: regulatoryErrors.value.length === 0,
        errors: regulatoryErrors.value,
        warnings: heWarnings.value
    }))

    // Mentions obligatoires selon UE
    const mandatoryMentions = computed(() => {
        const mentions = []

        // Mentions SPF
        if (formData.spf > 0) {
            mentions.push(`SPF ${formData.spf}`)
            if (formData.spf >= 50) {
                mentions.push('SPF 50+')
            }
        }

        // Mentions HE
        if (heTotal.value > 0) {
            mentions.push('Contient des huiles essentielles')

            // Mentions spécifiques
            if (formData.selectedHE.some(he => !he.pregnancy)) {
                mentions.push('Déconseillé pendant la grossesse')
            }
            if (formData.selectedHE.some(he => he.photo)) {
                mentions.push('Éviter l\'exposition au soleil après application')
            }
        }

        // Mentions actifs
        actives.filter(a => a.enabled).forEach(a => {
            if (a.key === 'bha') {
                mentions.push('Utiliser avec protection solaire')
            }
        })

        return mentions
    })

    // Avertissements HE
    const heWarnings = computed(() => {
        const warnings = []

        if (heTotal.value > 1) {
            warnings.push(`Dépassement limite UE: ${heTotal.value.toFixed(2)}% > 1%`)
        }

        formData.selectedHE.forEach(oil => {
            if (!oil.pregnancy) {
                warnings.push(`${oil.name}: contre-indiqué pendant la grossesse`)
            }
            if (oil.photo) {
                warnings.push(`${oil.name}: photosensibilisante - protection solaire requise`)
            }
            if (oil.allergen) {
                warnings.push(`${oil.name}: potentiel allergène - mention obligatoire`)
            }
        })

        return warnings
    })

    // Pourcentage de complétion
    const completionPercentage = computed(() => {
        let percentage = 0

        // Nom (20%)
        if (formData.name.trim().length > 0) percentage += 20

        // Volume (10%)
        if (formData.volume > 0) percentage += 10

        // Type de peau (10%)
        if (formData.skinType) percentage += 10

        // Actifs (20%)
        if (enabledActivesCount.value > 0) percentage += 20

        // Phases cohérentes (20%)
        if (waterPhase.value >= 0) percentage += 20

        // Validation (20%)
        if (regulatoryStatus.value.isValid) percentage += 20

        return Math.min(percentage, 100)
    })

    // Trop d'actifs
    const tooManyActives = computed(() =>
        enabledActivesCount.value > (skinProfiles[formData.skinType]?.maxActives || 3)
    )

    // HE par catégorie
    const gramsByHECategory = computed(() => {
        const result = {}
        for (const [cat, oils] of Object.entries(essentialOils)) {
            const selectedOils = oils.filter(oil => formData.selectedHE.find(h => h.name === oil.name))
            const catPercent = selectedOils.reduce((sum, o) => {
                const he = formData.selectedHE.find(h => h.name === o.name)
                return sum + (he?.percent || 0)
            }, 0)
            result[cat] = { percent: catPercent, grams: grams(catPercent) }
        }
        return result
    })

    // Méthodes
    const toggleHE = (oil) => {
        const idx = formData.selectedHE.findIndex(h => h.name === oil.name)
        if (idx === -1) {
            if (heTotal.value + (oil.maxFace || 0.2) <= 1) {
                formData.selectedHE.push({
                    ...oil,
                    percent: oil.maxFace || 0.2,
                    category: Object.keys(essentialOils).find(cat =>
                        essentialOils[cat].some(o => o.name === oil.name)
                    )
                })
            }
        } else {
            formData.selectedHE.splice(idx, 1)
        }
    }

    const getActiveRangeClass = (active) => {
        const percent = active.percent
        const range = (active.max - active.min) / 3
        if (percent < active.min + range) return 'range-low'
        if (percent > active.max - range) return 'range-high'
        return 'range-optimal'
    }

    const getWarningClass = (warning) => {
        if (warning.includes('Dépassement')) return 'border-red-500 bg-red-50'
        if (warning.includes('grossesse')) return 'border-amber-500 bg-amber-50'
        if (warning.includes('photosens')) return 'border-orange-500 bg-orange-50'
        return 'border-yellow-500 bg-yellow-50'
    }

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            element.focus({ preventScroll: true })
        }
    }

    const copyINCI = async () => {
        await copy(inciList.value.join(', '))
        // Afficher un message de confirmation temporaire
    }

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

    const generateReport = () => {
        // Générer un PDF avec toutes les informations
        console.log('Génération du rapport PDF...')
    }

    const exportFormula = () => {
        // Exporter au format JSON ou Excel
        const exportData = {
            ...formData,
            actives: actives.filter(a => a.enabled),
            phases: phases.value,
            regulatoryStatus: regulatoryStatus.value,
            inci: inciList.value
        }

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

        const exportFileDefaultName = `formule-${formData.name.replace(/\s+/g, '-')}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    // Validation
    const isValid = computed(() => {
        return formData.name.trim().length > 0 &&
            formData.volume > 0 &&
            formData.skinType &&
            regulatoryStatus.value.isValid
    })

    const validateForm = () => {
        errors.value = {}

        if (!formData.name.trim()) {
            errors.value.name = "Le nom est requis"
            return false
        }

        if (formData.name.length > 100) {
            errors.value.name = "Maximum 100 caractères"
            return false
        }

        if (formData.volume <= 0 || formData.volume > 1000) {
            errors.value.volume = "Volume invalide (1-1000 ml)"
            return false
        }

        if (!formData.skinType) {
            errors.value.skinType = "Sélectionnez un type de peau"
            return false
        }

        return true
    }

    // Écouteurs
    watch(() => props.initialData, (newData) => {
        if (newData && Object.keys(newData).length > 0) {
            isEditMode.value = true
            const sourceData = newData.skincareData
                ? { ...newData, ...newData.skincareData }
                : newData

            // Remplir le formulaire
            Object.assign(formData, {
                name: sourceData.name || "",
                volume: sourceData.volume || 50,
                skinType: sourceData.skinType || "mixte",
                selectedHE: sourceData.selectedHE || [],
                formulaType: sourceData.formulaType || "creme",
                spf: sourceData.spf || 0,
                preservativeSystem: sourceData.preservativeSystem || "phenoxyethanol"
            })

            // Actifs
            actives.forEach(active => {
                active.enabled = false
                if (sourceData.actives) {
                    const savedActive = sourceData.actives.find(a => a.key === active.key)
                    if (savedActive) {
                        active.enabled = true
                        active.percent = savedActive.percent
                    }
                }
            })
        }
    }, { immediate: true })

    // Sauvegarde
    const save = async () => {
        if (!validateForm()) return

        saving.value = true

        // Préparer les données
        const formulaData = {
            // Champs de base
            name: formData.name.trim(),
            description: generateDescription(),
            type: "skincare",
            createdAt: isEditMode.value ? props.initialData.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            // Formulation
            volume: formData.volume,
            skinType: formData.skinType,
            formulaType: formData.formulaType,
            spf: formData.spf,
            preservativeSystem: formData.preservativeSystem,

            // Ingrédients
            ingredients: generateIngredients(),
            actives: actives.filter(a => a.enabled).map(a => ({
                key: a.key,
                label: a.label,
                percent: a.percent,
                inci: a.inci
            })),
            selectedHE: formData.selectedHE.map(he => ({
                name: he.name,
                percent: he.percent,
                category: he.category,
                warnings: [
                    ...(!he.pregnancy ? ["grossesse"] : []),
                    ...(he.photo ? ["photosensibilisant"] : []),
                    ...(he.allergen ? ["allergène"] : [])
                ]
            })),

            // Calculs
            phases: phases.value,
            regulatoryStatus: regulatoryStatus.value,
            inciList: inciList.value,
            mandatoryMentions: mandatoryMentions.value,

            // Métadonnées
            version: "2.0",
            compliance: {
                euRegulation: "1223/2009",
                ifra: formData.selectedHE.every(he => he.percent <= (he.ifra || 1)),
                spf: formData.spf > 0 ? "norme ISO 24444" : null
            }
        }

        emit("save", formulaData)
        saving.value = false
    }

    const saveDraft = () => {
        emit("save-draft", {
            ...formData,
            actives: actives.filter(a => a.enabled),
            isDraft: true,
            savedAt: new Date().toISOString()
        })
    }

    const cancel = () => {
        emit("cancel")
        if (!emit.cancel) {
            router.push(isEditMode.value ? `/formule/${props.initialData.id}` : '/formules')
        }
    }

    const generateDescription = () => {
        return `${formData.name} - Formule pour peau ${formData.skinType}
    • Volume: ${formData.volume}ml
    • Actifs: ${actives.filter(a => a.enabled).map(a => `${a.label} ${a.percent}%`).join(', ')}
    • HE: ${formData.selectedHE.map(h => `${h.name} ${h.percent}%`).join(', ') || 'Aucune'}
    • Validation UE: ${regulatoryStatus.value.isValid ? 'Conforme' : 'Non conforme'}
    • INCI: ${inciList.value.slice(0, 3).join(', ')}...`
    }

    const generateIngredients = () => {
        const ingredients = []

        // Actifs
        actives.filter(a => a.enabled).forEach(a => {
            ingredients.push({
                name: a.label,
                quantity: a.percent,
                unit: "%",
                type: "active",
                inci: a.inci,
                function: a.type
            })
        })

        // Huiles essentielles
        formData.selectedHE.forEach(he => {
            ingredients.push({
                name: `HE ${he.name}`,
                quantity: he.percent,
                unit: "%",
                type: "essential_oil",
                category: he.category,
                warnings: [
                    ...(!he.pregnancy ? ["grossesse"] : []),
                    ...(he.photo ? ["photosensibilisant"] : []),
                    ...(he.allergen ? ["allergène"] : [])
                ]
            })
        })

        return ingredients
    }

    // Initialisation
    onMounted(() => {
        // Focus sur le premier champ
        const firstInput = document.querySelector('input')
        if (firstInput) {
            firstInput.focus()
        }

        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                save()
            }
        })
    })

    return {
        router,
        copy,
        copied,
        formData,
        skinProfiles,
        skinProfilesOptions,
        actives,
        filteredActives,
        activeSearch,
        activeTypeFilter,
        activeTypeOptions,
        formulaTypeOptions,
        heSearch,
        hePropertyFilter,
        heFilters,
        preservativeSystems,
        essentialOils,
        saving,
        errors,
        isEditMode,
        currentDate,
        sections,
        grams,
        enabledActivesCount,
        heTotal,
        emulsifierPercent,
        oilPhase,
        oilPhaseGrams,
        waterPhase,
        waterPhaseGrams,
        totalPercent,
        phases,
        inciList,
        regulatoryChecks,
        regulatoryErrors,
        regulatoryStatus,
        mandatoryMentions,
        heWarnings,
        completionPercentage,
        tooManyActives,
        gramsByHECategory,
        toggleHE,
        getActiveRangeClass,
        getWarningClass,
        scrollToSection,
        copyINCI,
        formatDate,
        generateReport,
        exportFormula,
        isValid,
        validateForm,
        save,
        saveDraft,
        cancel,
        generateDescription,
        generateIngredients
    }
}
