export const actives = [
    {
        key: 'ha',
        label: 'Acide hyaluronique',
        min: 0.1,
        max: 2,
        percent: 0.5,
        enabled: false,
        inci: 'Sodium Hyaluronate',
        type: 'hydratant',
        description: 'Humectant puissant, retient jusqu\'à 1000x son poids en eau',
        stability: 'pH 5.5-7.0',
        compatibility: ['B5', 'Niacinamide'],
        restrictions: 'Éviter avec des fortes concentrations d\'acides'
    },
    {
        key: 'b5',
        label: 'Panthénol (B5)',
        min: 0.5,
        max: 5,
        percent: 2,
        enabled: false,
        inci: 'Panthenol',
        type: 'repair',
        description: 'Provitamine B5, favorise la régénération cutanée',
        stability: 'stable',
        compatibility: ['HA', 'Niacinamide'],
        restrictions: 'Aucune connue'
    },
    {
        key: 'e',
        label: 'Vitamine E',
        min: 0.1,
        max: 1,
        percent: 0.3,
        enabled: false,
        inci: 'Tocopherol',
        type: 'antioxydant',
        description: 'Antioxydant liposoluble, protège des radicaux libres',
        stability: 'sensible à l\'oxydation',
        compatibility: ['Vitamine C', 'Ferulic Acid'],
        restrictions: 'Protéger de la lumière'
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
        description: 'BHA liposoluble, pénètre dans les pores',
        stability: 'pH 3.0-4.0',
        compatibility: ['AHA', 'Niacinamide'],
        restrictions: 'Ne pas combiner avec rétinol, éviter sur peau sensible'
    }
]

export const aqueousPhaseOptions = {
    'Hydrolats apaisants': {
        icon: '💙',
        items: [
            {
                name: 'Hamamélis',
                description: 'Astringent, tonifiant vasculaire',
                properties: ['Astringent', 'Anti-inflammatoire', 'Tonique'],
                percent: 10, min: 5, max: 50, selected: false
            },
            {
                name: 'Camomille romaine',
                description: 'Apaisant, anti-inflammatoire',
                properties: ['Apaisant', 'Anti-rougeurs', 'Calmant'],
                percent: 15, min: 5, max: 50, selected: false
            }
        ]
    },
    'Hydrolats purifiants': {
        icon: '💚',
        items: [
            {
                name: 'Tea tree',
                description: 'Antibactérien, purifiant',
                properties: ['Antibactérien', 'Purifiant', 'Séborégulateur'],
                percent: 5, min: 2, max: 20, selected: false
            },
            {
                name: 'Romarin',
                description: 'Stimulant, antioxydant',
                properties: ['Stimulant', 'Antioxydant', 'Tonique'],
                percent: 10, min: 5, max: 30, selected: false
            }
        ]
    }
}

export const oilPhaseOptions = {
    'Huiles légères (peaux grasses)': {
        icon: '🟢',
        items: [
            {
                name: 'Jojoba',
                description: 'Sébum-like, non comédogène',
                properties: ['Régulateur', 'Hydratant', 'Non comédogène'],
                specifics: ['Pénétration rapide', 'Stable'],
                comedogenic: 0, percent: 5, min: 1, max: 15, selected: false
            },
            {
                name: 'Noisette',
                description: 'Astringent, régulateur sébacé',
                properties: ['Astringent', 'Séborégulateur', 'Raffermissant'],
                specifics: ['Vitamine E', 'Antioxydant'],
                comedogenic: 1, percent: 8, min: 2, max: 20, selected: false
            }
        ]
    },
    'Huiles nutritives (peaux sèches)': {
        icon: '🟠',
        items: [
            {
                name: 'Avocat',
                description: 'Riche en vitamines A, D, E',
                properties: ['Nutritive', 'Régénérante', 'Apaisante'],
                specifics: ['Vitamines A,D,E', 'Lécithine'],
                comedogenic: 2, percent: 15, min: 5, max: 30, selected: false
            },
            {
                name: 'Amande douce',
                description: 'Adoucissante, calmante',
                properties: ['Adoucissante', 'Calmante', 'Émolliente'],
                specifics: ['Vitamine E', 'Acides gras'],
                comedogenic: 2, percent: 12, min: 5, max: 25, selected: false
            }
        ]
    }
}

export const extendedEssentialOils = {
    'Anti-âge & Régénération': [
        {
            name: 'Encens (Boswellia carterii)',
            latinName: 'Boswellia carterii',
            allergen: false,
            pregnancy: true,
            photo: false,
            maxFace: 0.5,
            ifra: 0.6,
            properties: ['Anti-âge', 'Régénérant', 'Cicatrisant']
        },
        {
            name: 'Ciste (Cistus ladaniferus)',
            latinName: 'Cistus ladaniferus',
            allergen: true,
            pregnancy: false,
            photo: false,
            maxFace: 0.3,
            ifra: 0.4,
            properties: ['Anti-rides', 'Régénérant', 'Astringent']
        }
    ],
    'Hydratation & Éclat': [
        {
            name: 'Lavande vraie',
            latinName: 'Lavandula angustifolia',
            allergen: false,
            pregnancy: true,
            photo: false,
            maxFace: 1.0,
            ifra: 1.5,
            properties: ['Cicatrisant', 'Apaisant', 'Régénérant']
        },
        {
            name: 'Camomille romaine',
            latinName: 'Chamaemelum nobile',
            allergen: false,
            pregnancy: true,
            photo: false,
            maxFace: 0.3,
            ifra: 0.5,
            properties: ['Apaisant', 'Anti-inflammatoire', 'Calmant']
        }
    ]
}