export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    // Récupérer la recette originale
    const recipe = await getRecipeById(id)

    // Créer une nouvelle formule basée sur la recette
    const newFormula = {
        ...recipe,
        type: 'skincare',
        ingredients: body.ingredients,
        compliance: body.compliance,
        convertedFrom: id,
        convertedAt: new Date().toISOString()
    }

    // Enregistrer la nouvelle formule
    const formulaId = await saveFormula(newFormula)

    return {
        success: true,
        formulaId,
        message: 'Recette convertie en formule avec succès'
    }
})