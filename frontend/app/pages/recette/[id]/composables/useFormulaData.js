export function useFormulaData() {
    // Données de référence pour les actifs
    const activeReferences = {
        'Acide hyaluronique': {
            min: 0.1,
            max: 2,
            recommendation: '0.1-2%',
            description: 'Humectant puissant, retient jusqu\'à 1000x son poids en eau'
        },
        'Vitamine E': {
            min: 0.1,
            max: 1,
            recommendation: '0.1-1%',
            description: 'Antioxydant liposoluble, protège des radicaux libres'
        },
        'Acide salicylique': {
            min: 0.5,
            max: 2,
            recommendation: '0.5-2%',
            description: 'BHA liposoluble, pénètre dans les pores pour un nettoyage en profondeur'
        },
        'Panthénol (B5)': {
            min: 0.5,
            max: 5,
            recommendation: '0.5-5%',
            description: 'Provitamine B5, favorise la régénération et la réparation cutanée'
        },
        'Niacinamide': {
            min: 2,
            max: 10,
            recommendation: '2-10%',
            description: 'Améliore la barrière cutanée, réduit les rougeurs et les pores'
        },
        'Vitamine C': {
            min: 5,
            max: 20,
            recommendation: '5-20%',
            description: 'Antioxydant puissant, stimule la synthèse de collagène'
        }
    }

    // Données de référence pour les HE
    const HEReferences = {
        'Encens (Boswellia carterii)': {
            max: 0.5,
            pregnancy: true,
            photo: false,
            allergen: false,
            latin: 'Boswellia carterii',
            properties: ['Anti-âge', 'Régénérant', 'Cicatrisant']
        },
        'Carotte sauvage': {
            max: 0.3,
            pregnancy: true,
            photo: true,
            allergen: false,
            latin: 'Daucus carota',
            properties: ['Détoxifiant', 'Régénérant', 'Tonique']
        },
        'Immortelle (Hélichryse)': {
            max: 0.4,
            pregnancy: true,
            photo: false,
            allergen: false,
            latin: 'Helichrysum italicum',
            properties: ['Anti-hématome', 'Régénérant', 'Anti-couperose']
        },
        'Orange douce': {
            max: 1.0,
            pregnancy: true,
            photo: true,
            allergen: true,
            latin: 'Citrus sinensis',
            properties: ['Antioxydant', 'Calmant', 'Digestif']
        },
        'Lavande vraie': {
            max: 1.0,
            pregnancy: true,
            photo: false,
            allergen: false,
            latin: 'Lavandula angustifolia',
            properties: ['Cicatrisant', 'Apaisant', 'Régénérant']
        },
        'Tea tree': {
            max: 1.0,
            pregnancy: false,
            photo: false,
            allergen: false,
            latin: 'Melaleuca alternifolia',
            properties: ['Antibactérien', 'Antifongique', 'Immunostimulant']
        },
        'Romarin à cinéole': {
            max: 0.4,
            pregnancy: false,
            photo: false,
            allergen: true,
            latin: 'Rosmarinus officinalis',
            properties: ['Stimulant', 'Antioxydant', 'Expectorant']
        }
    }

    // Types de peau avec descriptions et conseils
    const skinTypes = {
        'seche': {
            description: 'Peau déshydratée, besoin en nutrition élevé',
            tips: [
                'Privilégiez les huiles riches (avocat, amande douce)',
                'Utilisez des actifs hydratants (acide hyaluronique, B5)',
                'Évitez les textures trop légères',
                'Incorporez des émollients nourrissants',
                'Protégez la barrière cutanée avec des céramides'
            ]
        },
        'grasse': {
            description: 'Sécrétion sébacée importante, pores dilatés',
            tips: [
                'Optez pour des huiles légères (jojoba, noisette)',
                'Utilisez des actifs séborégulateurs (acide salicylique, niacinamide)',
                'Privilégiez les textures fluides et non comédogènes',
                'Évitez les formules trop riches',
                'Incorporez des ingrédients matifiants'
            ]
        },
        'sensible': {
            description: 'Réactivité cutanée élevée, tolérance limitée',
            tips: [
                'Choisissez des ingrédients apaisants (camomille, calendula)',
                'Limitez le nombre d\'actifs à maximum 2-3',
                'Évitez les parfums, alcools et ingrédients irritants',
                'Testez toujours la formule sur une petite zone avant usage',
                'Privilégiez les textures simples et minimalistes'
            ]
        },
        'mixte': {
            description: 'Combinaison de zones sèches et grasses',
            tips: [
                'Équilibrez hydratation et légèreté',
                'Ciblez les zones avec des actifs spécifiques',
                'Utilisez des textures adaptées aux deux types (crèmes-gels)',
                'Évitez les formules trop lourdes sur la zone T',
                'Appliquez différemment selon les zones du visage'
            ]
        },
        'mature': {
            description: 'Besoins anti-âge et restructuration',
            tips: [
                'Intégrez des actifs anti-âge (vitamines C et E, rétinol)',
                'Utilisez des huiles régénérantes (rose musquée, argan)',
                'Privilégiez les textures nourrissantes et onctueuses',
                'Incorporez des antioxydants et des peptides',
                'Protégez avec des filtres UV si usage diurne'
            ]
        }
    }

    return {
        activeReferences,
        HEReferences,
        skinTypes
    }
}