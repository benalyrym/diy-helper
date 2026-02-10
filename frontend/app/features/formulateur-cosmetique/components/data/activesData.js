export default [
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