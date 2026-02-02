export const skinProfiles = {
    seche: {
        oil: 25,
        maxActives: 3,
        description: "Peau déshydratée, besoin en nutrition élevé",
        tips: [
            "Privilégiez les huiles riches (avocat, amande douce)",
            "Utilisez des actifs hydratants (acide hyaluronique, B5)",
            "Évitez les textures trop légères",
            "Incorporez des émollients nourrissants"
        ]
    },
    grasse: {
        oil: 15,
        maxActives: 2,
        description: "Sécrétion sébacée importante, pores dilatés",
        tips: [
            "Optez pour des huiles légères (jojoba, noisette)",
            "Utilisez des actifs séborégulateurs (acide salicylique)",
            "Privilégiez les textures fluides",
            "Évitez les formules trop riches"
        ]
    },
    sensible: {
        oil: 18,
        maxActives: 2,
        description: "Réactivité cutanée élevée, tolérance limitée",
        tips: [
            "Choisissez des ingrédients apaisants (camomille, calendula)",
            "Limitez le nombre d'actifs",
            "Évitez les parfums et alcools",
            "Testez toujours la formule sur une petite zone"
        ]
    },
    mixte: {
        oil: 20,
        maxActives: 3,
        description: "Combinaison de zones sèches et grasses",
        tips: [
            "Équilibrez hydratation et légèreté",
            "Ciblez les zones avec des actifs spécifiques",
            "Utilisez des textures adaptées aux deux types",
            "Évitez les formules trop lourdes"
        ]
    },
    mature: {
        oil: 22,
        maxActives: 3,
        description: "Besoins anti-âge et restructuration",
        tips: [
            "Intégrez des actifs anti-âge (vitamines C et E)",
            "Utilisez des huiles régénérantes (rose musquée, argan)",
            "Privilégiez les textures nourrissantes",
            "Incorporez des antioxydants"
        ]
    }
}

export const preservativeSystems = [
    {
        id: 'cosgard',
        name: 'Cosgard',
        description: 'Benzyl Alcohol, Dehydroacetic Acid - Large spectre',
        icon: '🛡️',
        recommendation: '0.5-1.0%',
        features: [
            'Large spectre antibactérien',
            'pH stable 3-8',
            'Conforme UE 1223/2009',
            'Adapté aux émulsions'
        ]
    },
    {
        id: 'phenoxyethanol',
        name: 'Phénoxyéthanol',
        description: 'Conservateur synthétique standard',
        icon: '⚗️',
        recommendation: '0.5-1.0%',
        features: [
            'Efficacité prouvée',
            'Large spectre',
            'Stable à la chaleur',
            'Usage cosmétique établi'
        ]
    },
    {
        id: 'paraben-free',
        name: 'Système sans parabènes',
        description: 'Mélange de conservateurs naturels',
        icon: '🌿',
        recommendation: '0.5-1.5%',
        features: [
            'Sans parabènes',
            'Alternative naturelle',
            'Large spectre',
            'Conforme bio'
        ]
    }
]

export const progressMarks = [
    { percent: 25, label: 'Informations de base' },
    { percent: 50, label: 'Phase aqueuse' },
    { percent: 75, label: 'Phase huileuse' },
    { percent: 100, label: 'Validation' }
]