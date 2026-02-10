export default {
    "Hydrolats cuir chevelu apaisants": {
        icon: "🧘‍♀️",
        items: [
            {
                name: "Camomille romaine",
                inci: "Anthemis Nobilis Flower Water",
                description: "Apaisant, anti-inconfort, idéal cuir chevelu sensible",
                properties: ["Apaisant", "Anti-inflammatoire", "Calmant"],
                specifics: ["Cuir chevelu sensible", "Démangeaisons"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["sensible", "irritations"],
                phRange: "3.5–6.5",
                scent: "floral doux",
                notes: "Très bien en après-shampoing doux, rinçable ou leave-in léger.",
                percent: 15,
                min: 5,
                max: 40,
                selected: false
            },
            {
                name: "Bleuet",
                inci: "Centaurea Cyanus Flower Water",
                description: "Décongestionnant, apaisant, rafraîchissant",
                properties: ["Décongestionnant", "Apaisant", "Rafraîchissant"],
                specifics: ["Cuir chevelu échauffé"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["sensible"],
                phRange: "3.0–6.0",
                scent: "léger",
                notes: "Apporte une sensation fraîche, parfait en été.",
                percent: 10,
                min: 5,
                max: 30,
                selected: false
            },
            {
                name: "Lavande",
                inci: "Lavandula Angustifolia Flower Water",
                description: "Apaisant, purifiant doux, confort cuir chevelu",
                properties: ["Apaisant", "Purifiant", "Régénérant"],
                specifics: ["Cuir chevelu réactif", "Pellicules légères"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["irritations", "pellicules_legeres"],
                phRange: "3.5–6.5",
                scent: "aromatique",
                notes: "Évite d’en mettre trop si tu ajoutes aussi une fragrance.",
                percent: 10,
                min: 3,
                max: 35,
                selected: false
            },
            {
                name: "Fleur d'oranger",
                inci: "Citrus Aurantium Amara Flower Water",
                description: "Adoucissant, apaisant, agréable sur les longueurs",
                properties: ["Adoucissant", "Apaisant", "Hydratant"],
                specifics: ["Longueurs sèches", "Cheveux ternes"],
                hairTargets: ["longueurs"],
                concerns: ["secs", "ternes"],
                phRange: "3.0–6.0",
                scent: "floral",
                notes: "Très polyvalent, bon support de parfum naturel.",
                percent: 20,
                min: 10,
                max: 50,
                selected: false
            }
        ]
    },

    "Hydrolats purifiants (cuir chevelu gras)": {
        icon: "🧼",
        items: [
            {
                name: "Romarin",
                inci: "Rosmarinus Officinalis Leaf Water",
                description: "Tonique, antioxydant, aide cuir chevelu à tendance grasse",
                properties: ["Tonique", "Antioxydant", "Stimulant"],
                specifics: ["Racines grasses", "Manque de tonus"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["gras", "manque_volume"],
                phRange: "3.5–6.5",
                scent: "aromatique",
                notes: "Très bon en duo avec ortie (pousse).",
                percent: 10,
                min: 3,
                max: 30,
                selected: false
            },
            {
                name: "Sauge",
                inci: "Salvia Officinalis Leaf Water",
                description: "Régulateur sébum, astringent doux",
                properties: ["Séborégulateur", "Astringent", "Équilibrant"],
                specifics: ["Cuir chevelu gras"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["gras"],
                phRange: "3.5–6.5",
                scent: "herbacé",
                notes: "À éviter si cuir chevelu très sec/irrité.",
                percent: 8,
                min: 2,
                max: 20,
                selected: false
            },
            {
                name: "Menthe poivrée",
                inci: "Mentha Piperita Leaf Water",
                description: "Rafraîchissant, sensation de propreté",
                properties: ["Rafraîchissant", "Décongestionnant", "Stimulant"],
                specifics: ["Sensation fraîche"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["gras"],
                phRange: "3.5–6.5",
                scent: "mentholé",
                notes: "Dose modérée si le produit est leave-in (risque d’inconfort).",
                percent: 5,
                min: 1,
                max: 12,
                selected: false
            },
            {
                name: "Hamamélis",
                inci: "Hamamelis Virginiana Leaf Water",
                description: "Astringent, tonifiant, aide à resserrer le cuir chevelu gras",
                properties: ["Astringent", "Tonique", "Purifiant"],
                specifics: ["Cuir chevelu gras", "Pellicules grasses"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["gras", "pellicules_grasses"],
                phRange: "3.0–6.0",
                scent: "léger",
                notes: "Top en lotion cuir chevelu + après-shampoing léger.",
                percent: 8,
                min: 2,
                max: 25,
                selected: false
            }
        ]
    },

    "Hydrolats stimulation & pousse": {
        icon: "🌿",
        items: [
            {
                name: "Ortie",
                inci: "Urtica Dioica Leaf Water",
                description: "Tonique, traditionnellement utilisé pour la pousse",
                properties: ["Tonique", "Fortifiant", "Stimulant"],
                specifics: ["Pousse", "Cheveux fins"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["chute", "fins"],
                phRange: "3.5–6.5",
                scent: "vert",
                notes: "Parfait en phase aqueuse avec romarin.",
                percent: 10,
                min: 3,
                max: 30,
                selected: false
            },
            {
                name: "Cèdre (hydrolat)",
                inci: "Cedrus Atlantica Wood Water",
                description: "Tonique, aide à équilibrer, cuir chevelu fatigué",
                properties: ["Tonique", "Équilibrant", "Stimulant"],
                specifics: ["Chute saisonnière"],
                hairTargets: ["cuir_chevelu"],
                concerns: ["chute"],
                phRange: "3.5–6.5",
                scent: "boisé",
                notes: "Souvent apprécié en synergie avec ortie/romarin.",
                percent: 6,
                min: 2,
                max: 20,
                selected: false
            }
        ]
    },

    "Hydrolats hydratation & anti-frisottis": {
        icon: "💧",
        items: [
            {
                name: "Rose de Damas",
                inci: "Rosa Damascena Flower Water",
                description: "Hydratant, adoucissant, améliore le toucher des longueurs",
                properties: ["Hydratant", "Adoucissant", "Brillance"],
                specifics: ["Anti-frisottis", "Cheveux ternes"],
                hairTargets: ["longueurs"],
                concerns: ["secs", "frisottis", "ternes"],
                phRange: "3.0–6.0",
                scent: "floral",
                notes: "Très agréable en après-shampoing sensoriel.",
                percent: 15,
                min: 5,
                max: 40,
                selected: false
            },
            {
                name: "Néroli",
                inci: "Citrus Aurantium Amara Flower Water",
                description: "Régénérant doux, apporte souplesse et confort",
                properties: ["Régénérant", "Équilibrant", "Adoucissant"],
                specifics: ["Cheveux secs", "Cheveux abîmés"],
                hairTargets: ["longueurs"],
                concerns: ["secs", "abimes"],
                phRange: "3.0–6.0",
                scent: "floral",
                notes: "Très bon pour formules premium.",
                percent: 12,
                min: 3,
                max: 35,
                selected: false
            },
            {
                name: "Aloe vera (jus)",
                inci: "Aloe Barbadensis Leaf Juice",
                description: "Hydratant, filmogène léger (attention, pas un hydrolat)",
                properties: ["Hydratant", "Filmogène", "Apaisant"],
                specifics: ["Hydratation", "Définition boucles"],
                hairTargets: ["longueurs"],
                concerns: ["secs", "boucles", "frisottis"],
                phRange: "4.0–6.0",
                scent: "neutre",
                notes: "À classer ici comme 'aqueux fonctionnel' : super pour leave-in et boucles.",
                percent: 10,
                min: 3,
                max: 40,
                selected: false
            }
        ]
    }
}
