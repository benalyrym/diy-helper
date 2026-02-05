export default {
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
            },
            {
                name: 'Pépins de raisin',
                description: 'Légère, riche en antioxydants',
                properties: ['Antioxydant', 'Légère', 'Raffermissante'],
                specifics: ['Vitamine E', 'Acide linoléique'],
                comedogenic: 1, percent: 5, min: 1, max: 15, selected: false
            },
            {
                name: 'Tournesol',
                description: 'Émolliente, riche en vitamine E',
                properties: ['Émolliente', 'Vitamine E', 'Protectrice'],
                specifics: ['Économique', 'Stable'],
                comedogenic: 0, percent: 10, min: 5, max: 30, selected: false
            },
            {
                name: 'Sésame',
                description: 'Pénétration rapide, antioxydante',
                properties: ['Pénétration rapide', 'Antioxydante', 'Séchante'],
                specifics: ['Vitamine E', 'Sésamol'],
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
            },
            {
                name: 'Macadamia',
                description: 'Riche en acides palmitoléiques',
                properties: ['Régénérante', 'Restructurante', 'Anti-âge'],
                specifics: ['Oméga-7', 'Antioxydant'],
                comedogenic: 2, percent: 10, min: 3, max: 20, selected: false
            },
            {
                name: 'Germe de blé',
                description: 'Très riche en vitamine E',
                properties: ['Antioxydante', 'Régénérante', 'Protectrice'],
                specifics: ['Vitamine E', 'Phytostérols'],
                comedogenic: 2, percent: 5, min: 1, max: 10, selected: false
            },
            {
                name: 'Olive',
                description: 'Émolliente, protectrice',
                properties: ['Émolliente', 'Protectrice', 'Antioxydante'],
                specifics: ['Squalène végétal', 'Polyphénols'],
                comedogenic: 2, percent: 15, min: 5, max: 30, selected: false
            }
        ]
    },
    'Huiles spécialisées': {
        icon: '🟣',
        items: [
            {
                name: 'Rose musquée',
                description: 'Cicatrisante, anti-vergetures',
                properties: ['Cicatrisante', 'Anti-cicatrices', 'Anti-âge'],
                specifics: ['Vitamine A', 'Acides gras essentiels'],
                comedogenic: 1, percent: 10, min: 3, max: 20, selected: false
            },
            {
                name: 'Argan',
                description: 'Régénérante, anti-âge',
                properties: ['Régénérante', 'Anti-âge', 'Protectrice'],
                specifics: ['Vitamine E', 'Squalène'],
                comedogenic: 0, percent: 10, min: 3, max: 20, selected: false
            },
            {
                name: 'Bourrache',
                description: 'Riche en GLA, anti-inflammatoire',
                properties: ['Anti-inflammatoire', 'Hydratante', 'Apaisante'],
                specifics: ['GLA', 'Oméga-6'],
                comedogenic: 1, percent: 8, min: 2, max: 15, selected: false
            },
            {
                name: 'Onagre',
                description: 'Régulatrice hormonale, anti-âge',
                properties: ['Régulatrice', 'Anti-âge', 'Apaisante'],
                specifics: ['GLA', 'Antioxydant'],
                comedogenic: 1, percent: 8, min: 2, max: 15, selected: false
            },
            {
                name: 'Calophylle',
                description: 'Anti-inflammatoire, circulatoire',
                properties: ['Anti-inflammatoire', 'Circulatoire', 'Décongestionnant'],
                specifics: ['Calophyllolide', 'Coumarine'],
                comedogenic: 1, percent: 5, min: 1, max: 10, selected: false
            }
        ]
    }
}