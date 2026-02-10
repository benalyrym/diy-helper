// data/hairProfiles.js
const hairProfiles = {
    fins: {
        name: 'Fins',
        label: 'Fins',
        icon: '🌀',
        description: 'Cheveux délicats, manque de volume et de corps',
        oil: 10,
        maxActives: 3,
        texture: 'Très légère',
        recommendedActives: 3,
        recommendedTypes: ['volume', 'strength', 'moisture'],
        tips: [
            "Utilisez des protéines légères (riz, soie)",
            "Évitez les huiles lourdes qui alourdissent",
            "Privilégiez les actifs volumateurs",
            "Concentration max: 2-3% par actif"
        ]
    },
    normaux: {
        name: 'Normaux',
        label: 'Normaux',
        icon: '💫',
        description: 'Cheveux souples, brillants, sans problème majeur',
        oil: 15,
        maxActives: 4,
        texture: 'Équilibrée',
        recommendedActives: 4,
        recommendedTypes: ['moisture', 'shine', 'repair', 'oil'],
        tips: [
            "Maintenez l'équilibre hydrique",
            "Mélangez protéines et humectants",
            "Utilisez des huiles légères à moyennes",
            "Concentration max: 3-5% par actif"
        ]
    },
    secs: {
        name: 'Secs',
        label: 'Secs',
        icon: '🏜️',
        description: 'Cheveux déshydratés, manque de souplesse et brillance',
        oil: 20,
        maxActives: 4,
        texture: 'Riche',
        recommendedActives: 4,
        recommendedTypes: ['moisture', 'humectant', 'oil', 'repair'],
        tips: [
            "Priorité aux humectants (glycérine, panthénol)",
            "Incorporez des huiles nourrissantes",
            "Ajoutez des céramides pour réparer la barrière",
            "Concentration max: 5-8% par actif"
        ]
    },
    abimes: {
        name: 'Abîmés',
        label: 'Abîmés',
        icon: '⚡',
        description: 'Cheveux cassants, fourchus, besoin de réparation intense',
        oil: 25,
        maxActives: 5,
        texture: 'Très riche',
        recommendedActives: 5,
        recommendedTypes: ['repair', 'strength', 'oil', 'humectant', 'moisture'],
        tips: [
            "Utilisez des protéines réparatrices (kératine)",
            "Intégrez des céramides et beurres riches",
            "Combinez réparation et hydratation",
            "Concentration max: 3-5% par actif réparateur"
        ]
    },
    boucles: {
        name: 'Bouclés',
        label: 'Bouclés',
        icon: '🌊',
        description: 'Cheveux bouclés ou frisés, besoin de définition et hydratation',
        oil: 18,
        maxActives: 4,
        texture: 'Crémeuse',
        recommendedActives: 4,
        recommendedTypes: ['moisture', 'humectant', 'oil', 'shine'],
        tips: [
            "Humectants essentiels (glycérine, aloe vera)",
            "Huiles pénétrantes (coco, jojoba)",
            "Actifs définisseurs de boucles",
            "Évitez les silicones lourds",
            "Concentration max: 5-10% d'humectants"
        ]
    }
}

export default hairProfiles