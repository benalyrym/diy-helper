// composables/useRecipeType.js
import { ref, computed } from 'vue'

export default function useRecipeType(recipeType) {
    // Icônes par type
    const typeIcons = {
        'face_cream': '🧴',
        'serum': '💧',
        'face_mask': '🧖',
        'cleanser': '🚿',
        'toner': '🌊',
        'eye_cream': '👁️',
        'sunscreen': '☀️',
        'shampoo': '🧼',
        'conditioner': '💆',
        'hair_mask': '🧖‍♀️',
        'hair_oil': '💧',
        'hair_serum': '✨',
        'scalp_treatment': '🧠',
        'body_lotion': '🦵',
        'body_butter': '🧈',
        'body_scrub': '✨',
        'shower_gel': '🚿',
        'hand_cream': '🤲',
        'laundry_detergent': '👕',
        'dish_soap': '🍽️',
        'all_purpose_cleaner': '🧹',
        'fabric_softener': '👚',
        'custom': '✨'
    }

    // Descriptions par type
    const typeDescriptions = {
        'face_cream': 'Crème hydratante ou traitante pour le visage',
        'serum': 'Sérum concentré pour cibles spécifiques',
        'shampoo': 'Shampoing nettoyant pour cheveux',
        'body_lotion': 'Lait hydratant pour le corps',
        'hand_cream': 'Crème hydratante pour les mains',
        'custom': 'Formulation personnalisée'
    }

    // Suggestions par type
    const typeSuggestionsData = {
        'face_cream': {
            quickActions: [
                { label: 'Ajouter Acide Hyaluronique', icon: '💧', action: 'addActive', params: ['Acide Hyaluronique'] },
                { label: 'Phase huileuse légère', icon: '🫧', action: 'setOilPhase', params: [15] },
                { label: 'Hydrolat de rose', icon: '🌹', action: 'addAqueous', params: ['Hydrolat de rose'] }
            ],
            defaultVolume: 50,
            defaultSkinType: 'mixte',
            recommendedActives: ['Acide Hyaluronique', 'Niacinamide', 'Vitamine C'],
            recommendedOils: ['Huile de jojoba', 'Huile de pépin de raisin'],
            maxActives: 3
        },
        'serum': {
            quickActions: [
                { label: 'Sérum concentré', icon: '🧪', action: 'setVolume', params: [30] },
                { label: 'Augmenter actifs', icon: '📈', action: 'increaseActives' },
                { label: 'Phase huileuse minimale', icon: '🫧', action: 'setOilPhase', params: [10] }
            ],
            defaultVolume: 30,
            defaultSkinType: 'tous',
            recommendedActives: ['Vitamine C', 'Acide Hyaluronique', 'Rétinol'],
            recommendedOils: ['Huile de rose musquée', 'Huile d\'argan'],
            maxActives: 5
        },
        'shampoo': {
            quickActions: [
                { label: 'Volume shampoing', icon: '🧴', action: 'setVolume', params: [250] },
                { label: 'Huile capillaire', icon: '💧', action: 'addOil', params: ['Huile d\'argan'] },
                { label: 'Sans HE irritantes', icon: '⚠️', action: 'filterIrritatingHE' }
            ],
            defaultVolume: 250,
            defaultSkinType: 'cheveux_normaux',
            recommendedActives: ['Bétaïne de coco', 'Panax ginseng'],
            recommendedOils: ['Huile d\'argan', 'Huile de coco'],
            maxActives: 2
        },
        'body_lotion': {
            quickActions: [
                { label: 'Volume corporel', icon: '🦵', action: 'setVolume', params: [200] },
                { label: 'Phase huileuse riche', icon: '🫧', action: 'setOilPhase', params: [25] },
                { label: 'Beurre de karité', icon: '🧈', action: 'addOil', params: ['Beurre de karité'] }
            ],
            defaultVolume: 200,
            defaultSkinType: 'normale',
            recommendedActives: ['Aloe vera', 'Vitamine E'],
            recommendedOils: ['Beurre de karité', 'Huile d\'amande douce'],
            maxActives: 2
        }
    }

    // Filtrer les sections selon le type
    const filteredSections = computed(() => {
        const baseSections = [
            { id: 'basic-info', name: 'Informations' },
            { id: 'actives', name: 'Actifs' },
            { id: 'aqueous-phase', name: 'Hydrosols' },
            { id: 'oil-phase', name: 'Huiles' },
            { id: 'preservatives', name: 'Conservation' },
            { id: 'essential-oils', name: 'HE' },
            { id: 'analysis', name: 'Analyse' },
            { id: 'actions', name: 'Finalisation' }
        ]

        if (!recipeType) return baseSections

        // Pour les produits ménagers, simplifier
        if (recipeType.mainCategory === 'household') {
            return baseSections.filter(section =>
                !['actives', 'oil-phase', 'essential-oils'].includes(section.id)
            )
        }

        return baseSections
    })

    // Filtrer les options de phase aqueuse selon le type
    const filteredAqueousPhaseOptions = computed(() => {
        const allOptions = {
            hydrosols: { name: 'Hydrolats', items: [] },
            water: { name: 'Eaux', items: [] },
            others: { name: 'Autres', items: [] }
        }

        // Pour shampoing : privilégier les infusions
        if (recipeType?.subtype === 'shampoo') {
            return {
                hydrosols: {
                    name: 'Infusions',
                    items: [
                        { name: 'Infusion de camomille', percent: 0, min: 0, max: 100, selected: false },
                        { name: 'Infusion de romarin', percent: 0, min: 0, max: 100, selected: false },
                        { name: 'Infusion de ortie', percent: 0, min: 0, max: 100, selected: false }
                    ]
                },
                water: {
                    name: 'Eaux',
                    items: [
                        { name: 'Eau déminéralisée', percent: 0, min: 0, max: 100, selected: false }
                    ]
                }
            }
        }

        return allOptions
    })

    // Filtrer les options de phase huileuse
    const filteredOilPhaseOptions = computed(() => {
        const allOptions = {
            butters: { name: 'Beurres', items: [] },
            lightOils: { name: 'Huiles légères', items: [] },
            mediumOils: { name: 'Huiles moyennes', items: [] },
            richOils: { name: 'Huiles riches', items: [] }
        }

        // Pour crème visage : huiles légères
        if (recipeType?.subtype === 'face_cream') {
            return {
                lightOils: {
                    name: 'Huiles légères (recommandées)',
                    items: [
                        { name: 'Huile de jojoba', percent: 0, min: 1, max: 20, comedogenic: 2, selected: false },
                        { name: 'Huile de pépin de raisin', percent: 0, min: 1, max: 15, comedogenic: 1, selected: false },
                        { name: 'Huile de tournesol', percent: 0, min: 1, max: 15, comedogenic: 0, selected: false }
                    ]
                }
            }
        }

        // Pour shampoing : huiles capillaires
        if (recipeType?.subtype === 'shampoo') {
            return {
                hairOils: {
                    name: 'Huiles capillaires',
                    items: [
                        { name: 'Huile d\'argan', percent: 0, min: 0.5, max: 5, comedogenic: 0, selected: false },
                        { name: 'Huile de coco', percent: 0, min: 0.5, max: 3, comedogenic: 4, selected: false },
                        { name: 'Huile de ricin', percent: 0, min: 0.5, max: 2, comedogenic: 1, selected: false }
                    ]
                }
            }
        }

        return allOptions
    })

    // Filtrer les systèmes de conservation
    const filteredPreservativeSystems = computed(() => {
        const allSystems = [
            { id: 'cosgard', name: 'Cosgard', inci: 'Benzoic Acid, Dehydroacetic Acid', description: 'Pour phase aqueuse' },
            { id: 'geogard', name: 'Geogard 221', inci: 'Benzyl Alcohol, Salicylic Acid', description: 'Système doux' },
            { id: 'leucidal', name: 'Leucidal', inci: 'Lactobacillus Ferment', description: 'Conservateur naturel' }
        ]

        // Pour produits ménagers : conservateurs différents
        if (recipeType?.mainCategory === 'household') {
            return [
                { id: 'benzalkonium', name: 'Benzalkonium Chloride', inci: 'Benzalkonium Chloride', description: 'Pour produits ménagers' },
                { id: 'chloroxylenol', name: 'Chloroxylenol', inci: 'Chloroxylenol', description: 'Désinfectant' }
            ]
        }

        return allSystems
    })

    // Méthodes
    const getTypeIcon = () => {
        if (!recipeType) return '🧪'
        return typeIcons[recipeType.subtype] || '🧪'
    }

    const getFormulationDescription = () => {
        if (!recipeType) return 'Formulation cosmétique'
        if (recipeType.subtype === 'custom') return 'Produit personnalisé'
        return typeDescriptions[recipeType.subtype] || recipeType.productName
    }

    const typeSuggestions = computed(() => {
        if (!recipeType) return null
        return typeSuggestionsData[recipeType.subtype] || null
    })

    const applyQuickSuggestion = (suggestion) => {
        switch (suggestion.action) {
            case 'addActive':
                // Implémentation pour ajouter un actif
                break
            case 'setOilPhase':
                // Implémentation pour définir la phase huileuse
                break
            case 'setVolume':
                // Implémentation pour définir le volume
                break
            // ... autres actions
        }
    }

    return {
        getTypeIcon,
        getFormulationDescription,
        typeSuggestions,
        applyQuickSuggestion,
        filteredSections,
        filteredAqueousPhaseOptions,
        filteredOilPhaseOptions,
        filteredPreservativeSystems
    }
}