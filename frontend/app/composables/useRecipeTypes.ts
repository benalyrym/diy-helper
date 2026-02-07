export const useRecipeTypes = () => {
    const mainCategories = [
        {
            id: 'skincare',
            name: 'Soin de la peau',
            icon: '🧴',
            color: '#3B82F6',
            description: 'Produits pour le visage et le corps',
            examples: ['Crèmes', 'Sérums', 'Gommages', 'Masques']
        },
        // ... autres catégories
    ]

    const subtypesByCategory = {
        skincare: [
            {
                id: 'face_cream',
                name: 'Crème visage',
                icon: '🧴',
                defaultIngredients: [
                    { name: 'Phase aqueuse (70-80%)', category: 'aqueuse' },
                    { name: 'Phase huileuse (20-30%)', category: 'huileuse' },
                    { name: 'Émulsifiant', category: 'émulsifiant' },
                    { name: 'Conservateur', category: 'conservateur' },
                    { name: 'Actifs spécifiques', category: 'actifs' }
                ],
                defaultInstructions: [
                    'Phase A (aqueuse) : Chauffer à 70°C',
                    'Phase B (huileuse) : Chauffer à 70°C',
                    'Mélanger phase B dans phase A sous agitation',
                    'Agiter jusqu\'à refroidissement à 40°C',
                    'Ajouter les actifs thermosensibles',
                    'Homogénéiser et conditionner'
                ],
                tips: [
                    'Utiliser des huiles adaptées au type de peau',
                    'Tester le pH final (idéalement 5.5)',
                    'Ajouter les conservateurs à bonne température'
                ]
            },
            {
                id: 'shampoo',
                name: 'Shampoing',
                icon: '🧼',
                defaultIngredients: [
                    { name: 'Base lavante (30-40%)', category: 'tensioactif' },
                    { name: 'Eau (50-60%)', category: 'aqueuse' },
                    { name: 'Épaississant', category: 'texturant' },
                    { name: 'Conditionneur', category: 'conditionneur' },
                    { name: 'Conservateur', category: 'conservateur' }
                ]
            },
        ],
    }

    const getSubtypeConfig = (subtypeId: string) => {
        for (const category in subtypesByCategory) {
            // @ts-ignore
            const subtype = subtypesByCategory[category].find(s => s.id === subtypeId)
            if (subtype) return subtype
        }
        return null
    }

    return {
        mainCategories,
        subtypesByCategory,
        getSubtypeConfig
    }
}