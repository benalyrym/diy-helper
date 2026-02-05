export function useFormulaDisplay(formula, loading, error, route, router) {

    const api = useApi()
    const loadFormula = async () => {
        try {
            loading.value = true
            error.value = ''
            const id = route.params.id

            // Use api instead of $api
            const data = await api.getRecipe(id)

            // No need for response.ok check with $fetch
            // $fetch throws on error automatically

            // Transformer les données de l'API
            formula.value = transformApiData(data)

            // Si c'est une recette simple
            if (formula.value.isSimpleRecipe) {
                console.warn('Recette simple détectée - données incomplètes')
            }

        } catch (err) {
            console.error('Erreur de chargement:', err)

            // Get status from error
            const status = err?.response?.status || err?.statusCode

            if (status === 401) {
                error.value = 'Non autorisé (token manquant/expiré)'
                // Optional: redirect to login
                router.push('/login')
            } else if (status === 404) {
                error.value = 'Formule non trouvée'
            } else {
                error.value = err?.message || 'Impossible de charger la formule.'
            }

            console.error('Erreur de chargement:', error.value)
        } finally {
            loading.value = false
        }
    }

    const transformApiData = (apiData) => {
        // Vérifier si c'est une recette avec des données incomplètes
        const hasNullQuantities = apiData.ingredients?.some(ing => ing.quantity === null)

        // Transformer les ingrédients
        const transformedIngredients = apiData.ingredients?.map(ing => {
            // Déterminer le type d'ingrédient
            const type = determineIngredientType(ing.name)

            // Si quantité est null, essayer d'extraire de la description
            let quantity = ing.quantity
            if (quantity === null && apiData.description) {
                quantity = extractQuantityFromDescription(apiData.description, ing.name)
            }

            // Valeurs par défaut si toujours null
            if (quantity === null) {
                quantity = getDefaultQuantity(type)
            }

            return {
                name: ing.name,
                quantity: quantity,
                type: type
            }
        }) || []

        // Extraire les informations de la description
        const {volume, skinType} = extractInfoFromDescription(apiData.description)

        return {
            id: apiData.id,
            name: apiData.name,
            description: apiData.description,
            volume: volume || 50, // Par défaut 50ml
            skinType: skinType || 'mixte', // Par défaut
            type: apiData.type || 'skincare',
            createdAt: apiData.createdAt,
            updatedAt: apiData.updatedAt,
            ingredients: transformedIngredients,
            compliance: {
                version: '2.2',
                euRegulation: '1223/2009',
                heLimitCompliant: checkHECompliance(transformedIngredients),
                preservativeCompliant: checkPreservativeCompliance(transformedIngredients),
                isValid: true // À vérifier plus tard
            },
            // Flag pour indiquer si c'est une recette simple
            isSimpleRecipe: hasNullQuantities,
            // Conserver les données originales
            originalData: apiData
        }
    }

    const determineIngredientType = (name) => {
        const lowerName = name.toLowerCase()

        if (lowerName.includes('he ') || lowerName.includes('huile essentielle')) {
            return 'essential_oil'
        }
        if (lowerName.includes('vitamine') || lowerName.includes('acide') || lowerName.includes('panthénol') || lowerName.includes('niacinamide')) {
            return 'active'
        }
        if (lowerName.includes('cosgard') || lowerName.includes('conservateur')) {
            return 'preservative'
        }
        if (lowerName.includes('eau') || lowerName.includes('hydrolat') || lowerName.includes('hamamélis')) {
            return 'water'
        }
        if (lowerName.includes('huile') || lowerName.includes('jojoba') || lowerName.includes('amande')) {
            return 'oil'
        }
        if (lowerName.includes('émulsifiant')) {
            return 'emulsifier'
        }
        return 'other'
    }

    const extractQuantityFromDescription = (description, ingredientName) => {
        const lines = description.split('\n')

        for (const line of lines) {
            if (line.includes(ingredientName)) {
                // Chercher un pourcentage dans la ligne
                const percentMatch = line.match(/(\d+\.?\d*)%/i)
                if (percentMatch) {
                    return parseFloat(percentMatch[1])
                }
            }
        }

        return null
    }

    const getDefaultQuantity = (type) => {
        switch (type) {
            case 'active':
                return 1.0
            case 'essential_oil':
                return 0.3
            case 'preservative':
                return 0.8
            case 'oil':
                return 5.0
            case 'water':
                return 70.0
            case 'emulsifier':
                return 5.0
            default:
                return 1.0
        }
    }

    const extractInfoFromDescription = (description) => {
        const result = {volume: 50, skinType: 'mixte'}

        if (!description) return result

        // Extraire le volume
        const volumeMatch = description.match(/(\d+)ml/i)
        if (volumeMatch) {
            result.volume = parseInt(volumeMatch[1])
        }

        // Extraire le type de peau
        const skinTypes = ['seche', 'grasse', 'sensible', 'mixte', 'mature']
        for (const skinType of skinTypes) {
            if (description.toLowerCase().includes(`peau ${skinType}`)) {
                result.skinType = skinType
                break
            }
        }

        return result
    }

    const checkHECompliance = (ingredients) => {
        const heIngredients = ingredients.filter(ing => ing.type === 'essential_oil')
        const totalHE = heIngredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0)
        return totalHE <= 1
    }

    const checkPreservativeCompliance = (ingredients) => {
        return ingredients.some(ing => ing.type === 'preservative')
    }

    const retryLoad = async () => {
        loading.value = true
        error.value = ''
        await loadFormula()
    }

    return {
        loadFormula,
        retryLoad
    }
}
