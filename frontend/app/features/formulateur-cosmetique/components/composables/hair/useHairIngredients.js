// composables/useHairIngredients.js
import { computed } from 'vue'

export default function useHairIngredients(formData, hairActives, preservativeSystems, fragranceTotal, selectedOilPhase, selectedConditioningAgents) {
    const inciList = computed(() => {
        const ingredients = []
        const data = formData.value || {}

        // Actifs capillaires
        const activeList = hairActives.value || hairActives || []
        activeList
            .filter(a => a?.enabled)
            .forEach(a => {
                ingredients.push(`${a.label || ''} (${a.inci || 'INCI inconnu'})`)
            })

        // Agents conditionnants
        const agents = selectedConditioningAgents.value || selectedConditioningAgents || []
        agents.forEach(agent => {
            ingredients.push(`${agent.name || ''} (${agent.inci || 'INCI inconnu'})`)
        })

        // Conservateur
        const preservative = preservativeSystems?.find(p => p.id === data.preservativeSystem)
        if (preservative) {
            ingredients.push(`${preservative.name} (${preservative.inci})`)
        }

        // Fragrances
        const fragrances = data.selectedFragrances || []
        fragrances.forEach(frag => {
            ingredients.push(`Fragrance ${frag.name || ''}`)
        })

        // Huiles capillaires
        const oils = selectedOilPhase.value || selectedOilPhase || []
        oils.forEach(oil => {
            ingredients.push(`Huile de ${oil.name || ''}`)
        })

        // Eau
        ingredients.push('Aqua (Water)')

        // Épaississant
        ingredients.push('Hydroxyethylcellulose')

        // Acidifiant
        ingredients.push('Citric Acid')

        // Émulsifiant si nécessaire (pour certaines formulations)
        ingredients.push('Behentrimonium Methosulfate')

        return ingredients
    })

    return {
        inciList
    }
}