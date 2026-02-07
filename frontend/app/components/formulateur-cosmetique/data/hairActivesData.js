const hairActivesData = [
    {
        id: 'keratin',
        label: 'Kératine hydrolysée',
        inci: 'Hydrolyzed Keratin',
        type: 'repair',
        benefit: 'Réparation intense',
        description: 'Protéine de kératine hydrolysée qui comble les fissures de la fibre capillaire et répare les dommages.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Protéines', 'Humectants', 'Conditionneurs'],
        restrictions: 'Ne pas utiliser avec des shampooings au pH élevé'
    },
    {
        id: 'panthenol',
        label: 'Panthénol (Provitamine B5)',
        inci: 'Panthenol',
        type: 'moisture',
        benefit: 'Hydratation profonde',
        description: 'Humectant puissant qui attire et retient l\'humidité dans le cheveu.',
        min: 0.5,
        max: 5.0,
        percent: 2.0,
        enabled: false,
        compatibility: ['Tous les types d\'actifs', 'Vitamines'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'glycerin',
        label: 'Glycérine végétale',
        inci: 'Glycerin',
        type: 'humectant',
        benefit: 'Hydratation',
        description: 'Humectant naturel qui prévient la déshydratation des cheveux.',
        min: 1.0,
        max: 10.0,
        percent: 3.0,
        enabled: false,
        compatibility: ['Actifs hydratants', 'Huiles légères'],
        restrictions: 'À éviter en climat très sec'
    },
    {
        id: 'silk_protein',
        label: 'Protéine de soie hydrolysée',
        inci: 'Hydrolyzed Silk Protein',
        type: 'repair',
        benefit: 'Brillance et douceur',
        description: 'Confère brillance, légèreté et douceur soyeuse aux cheveux.',
        min: 0.5,
        max: 3.0,
        percent: 1.5,
        enabled: false,
        compatibility: ['Kératine', 'Protéines légères'],
        restrictions: 'Ne pas surdoser (risque d\'alourdissement)'
    },
    {
        id: 'argan_oil',
        label: 'Huile d\'argan',
        inci: 'Argania Spinosa Kernel Oil',
        type: 'oil',
        benefit: 'Nutrition et brillance',
        description: 'Huile riche en vitamine E et acides gras essentiels, parfaite pour les pointes sèches.',
        min: 0.5,
        max: 5.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Toutes les huiles', 'Actifs hydratants'],
        restrictions: 'À utiliser avec modération sur cheveux fins'
    },
    {
        id: 'jojoba_oil',
        label: 'Huile de jojoba',
        inci: 'Simmondsia Chinensis Seed Oil',
        type: 'oil',
        benefit: 'Régulation sébum',
        description: 'Huile légère qui régule la production de sébum et hydrate sans alourdir.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Cheveux gras', 'Cuir chevelu sensible'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'niacinamide',
        label: 'Niacinamide (Vitamine B3)',
        inci: 'Niacinamide',
        type: 'scalp',
        benefit: 'Cuir chevelu sain',
        description: 'Améliore la microcirculation du cuir chevelu et renforce la barrière cutanée.',
        min: 0.5,
        max: 2.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Actifs du cuir chevelu', 'Conditionneurs'],
        restrictions: 'Éviter en cas d\'allergie à la vitamine B3'
    },
    {
        id: 'rice_protein',
        label: 'Protéine de riz hydrolysée',
        inci: 'Hydrolyzed Rice Protein',
        type: 'strength',
        benefit: 'Volume et résistance',
        description: 'Donne du volume aux cheveux fins tout en renforçant la fibre capillaire.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Protéines légères', 'Actifs volumateurs'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'aloe_vera',
        label: 'Extrait d\'Aloe Vera',
        inci: 'Aloe Barbadensis Leaf Juice',
        type: 'moisture',
        benefit: 'Apaisant et hydratant',
        description: 'Hydrate, apaise le cuir chevelu et réduit les démangeaisons.',
        min: 1.0,
        max: 10.0,
        percent: 5.0,
        enabled: false,
        compatibility: ['Tous les types d\'actifs'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'peptide',
        label: 'Peptides de cuivre',
        inci: 'Copper Tripeptide-1',
        type: 'repair',
        benefit: 'Stimulation croissance',
        description: 'Stimule la croissance des cheveux et renforce les follicules pileux.',
        min: 0.1,
        max: 1.0,
        percent: 0.5,
        enabled: false,
        compatibility: ['Actifs du cuir chevelu'],
        restrictions: 'Utiliser en faible concentration'
    },
    {
        id: 'coconut_oil',
        label: 'Huile de coco fractionnée',
        inci: 'Cocos Nucifera (Coconut) Oil',
        type: 'oil',
        benefit: 'Pénétration profonde',
        description: 'Huile légère qui pénètre profondément dans la fibre capillaire pour une hydratation longue durée.',
        min: 0.5,
        max: 5.0,
        percent: 2.0,
        enabled: false,
        compatibility: ['Protéines', 'Humectants'],
        restrictions: 'Peut solidifier à basse température'
    },
    {
        id: 'hyaluronic_acid',
        label: 'Acide hyaluronique',
        inci: 'Sodium Hyaluronate',
        type: 'humectant',
        benefit: 'Hydratation intense',
        description: 'Retient jusqu\'à 1000 fois son poids en eau pour une hydratation extrême.',
        min: 0.1,
        max: 2.0,
        percent: 0.5,
        enabled: false,
        compatibility: ['Tous les humectants'],
        restrictions: 'Utiliser en faible concentration'
    },
    {
        id: 'bamboo_extract',
        label: 'Extrait de bambou',
        inci: 'Bambusa Vulgaris Extract',
        type: 'strength',
        benefit: 'Renforcement',
        description: 'Riche en silice naturelle, renforce les cheveux et prévient la casse.',
        min: 1.0,
        max: 5.0,
        percent: 2.0,
        enabled: false,
        compatibility: ['Protéines', 'Vitamines'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'ceramide',
        label: 'Céramides végétales',
        inci: 'Ceramide NP',
        type: 'repair',
        benefit: 'Réparation barrière',
        description: 'Répare la barrière lipidique du cheveu, idéal pour cheveux chimiquement traités.',
        min: 0.1,
        max: 1.0,
        percent: 0.3,
        enabled: false,
        compatibility: ['Huiles', 'Actifs réparateurs'],
        restrictions: 'Coûteux, utiliser en faible concentration'
    },
    {
        id: 'tea_tree',
        label: 'Huile essentielle de Tea Tree',
        inci: 'Melaleuca Alternifolia Leaf Oil',
        type: 'scalp',
        benefit: 'Purifiant',
        description: 'Purifie le cuir chevelu, réduit les pellicules et les démangeaisons.',
        min: 0.05,
        max: 0.5,
        percent: 0.1,
        enabled: false,
        compatibility: ['Huiles légères', 'Actifs du cuir chevelu'],
        restrictions: 'Toujours diluer, ne pas utiliser pur'
    },
    {
        id: 'castor_oil',
        label: 'Huile de ricin',
        inci: 'Ricinus Communis (Castor) Seed Oil',
        type: 'oil',
        benefit: 'Croissance',
        description: 'Stimule la croissance des cheveux et épaissit la fibre capillaire.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Huiles lourdes', 'Actifs de croissance'],
        restrictions: 'Texture très épaisse, utiliser avec modération'
    },
    {
        id: 'vitamin_e',
        label: 'Vitamine E (Tocophérol)',
        inci: 'Tocopherol',
        type: 'antioxidant',
        benefit: 'Antioxydant',
        description: 'Protège les cheveux des dommages oxydatifs et des UV.',
        min: 0.1,
        max: 1.0,
        percent: 0.3,
        enabled: false,
        compatibility: ['Toutes les huiles', 'Actifs antioxydants'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'avocado_oil',
        label: 'Huile d\'avocat',
        inci: 'Persea Gratissima (Avocado) Oil',
        type: 'oil',
        benefit: 'Nutrition profonde',
        description: 'Huile riche en vitamines A, D et E, parfaite pour cheveux très secs.',
        min: 0.5,
        max: 5.0,
        percent: 1.5,
        enabled: false,
        compatibility: ['Huiles nourrissantes'],
        restrictions: 'Peut alourdir les cheveux fins'
    },
    {
        id: 'peppermint',
        label: 'Extrait de menthe poivrée',
        inci: 'Mentha Piperita (Peppermint) Extract',
        type: 'scalp',
        benefit: 'Stimulant circulation',
        description: 'Stimule la microcirculation du cuir chevelu, favorisant la croissance.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Huiles légères'],
        restrictions: 'Sensation de fraîcheur intense'
    },
    {
        id: 'shea_butter',
        label: 'Beurre de karité',
        inci: 'Butyrospermum Parkii (Shea) Butter',
        type: 'oil',
        benefit: 'Nutrition intense',
        description: 'Protège les cheveux des agressions extérieures et répare les pointes.',
        min: 0.5,
        max: 5.0,
        percent: 2.0,
        enabled: false,
        compatibility: ['Huiles riches', 'Actifs réparateurs'],
        restrictions: 'Texture très riche, adapter selon type de cheveux'
    },
    {
        id: 'caffeine',
        label: 'Caféine',
        inci: 'Caffeine',
        type: 'scalp',
        benefit: 'Stimulation follicules',
        description: 'Stimule la croissance des cheveux en prolongeant la phase anagène.',
        min: 0.1,
        max: 1.0,
        percent: 0.5,
        enabled: false,
        compatibility: ['Actifs du cuir chevelu'],
        restrictions: 'Utiliser en concentration précise'
    },
    {
        id: 'wheat_protein',
        label: 'Protéine de blé hydrolysée',
        inci: 'Hydrolyzed Wheat Protein',
        type: 'strength',
        benefit: 'Élasticité',
        description: 'Améliore l\'élasticité des cheveux et prévient la casse.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Protéines', 'Humectants'],
        restrictions: 'À éviter en cas d\'allergie au gluten'
    },
    {
        id: 'rosemary',
        label: 'Extrait de romarin',
        inci: 'Rosmarinus Officinalis (Rosemary) Extract',
        type: 'scalp',
        benefit: 'Antipelliculaire',
        description: 'Régule la production de sébum et réduit les pellicules.',
        min: 0.5,
        max: 3.0,
        percent: 1.0,
        enabled: false,
        compatibility: ['Huiles essentielles', 'Actifs du cuir chevelu'],
        restrictions: 'Aucune restriction particulière'
    },
    {
        id: 'mango_butter',
        label: 'Beurre de mangue',
        inci: 'Mangifera Indica (Mango) Seed Butter',
        type: 'oil',
        benefit: 'Finition anti-frisottis',
        description: 'Crée un film protecteur léger qui contrôle les frisottis.',
        min: 0.5,
        max: 4.0,
        percent: 1.5,
        enabled: false,
        compatibility: ['Conditionneurs', 'Actifs de finition'],
        restrictions: 'Texture légère, adapté aux cheveux bouclés'
    }
];
// Fonction pour initialiser les actifs
export const initializeActives = () => {
    return hairActivesData.map(active => ({
        ...active,
        percent: active.percent || 0,
        enabled: active.enabled || false
    }));
};

// Fonction de filtrage
export const filterActives = (actives, search = '', typeFilter = '') => {
    return actives.filter(active => {
        const matchesSearch = !search ||
            active.label.toLowerCase().includes(search.toLowerCase()) ||
            active.inci.toLowerCase().includes(search.toLowerCase()) ||
            active.description.toLowerCase().includes(search.toLowerCase());

        const matchesType = !typeFilter || active.type === typeFilter;

        return matchesSearch && matchesType;
    });
};


// Vérifiez que vous exportez bien la constante
export { hairActivesData };

// Export par défaut (optionnel mais recommandé)
export default hairActivesData;