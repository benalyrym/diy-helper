import { computed } from 'vue'

export default function useIngredients(formData, actives, preservativeSystems, heTotal, selectedOilPhase) {
    const inciList = computed(() => {
        const list = ['Aqua']

        // Actifs par concentration décroissante (>1%)
        const significantActives = actives
            .filter(a => a.enabled && a.percent >= 1)
            .sort((a, b) => b.percent - a.percent)

        significantActives.forEach(a => list.push(a.inci))

        // Conservateur
        const preservative = preservativeSystems.find(p => p.id === formData.preservativeSystem)
        if (preservative) {
            list.push(preservative.inci)
        }

        // Huiles essentielles
        if (heTotal.value > 0) {
            list.push('Parfum (Fragrance)')
        }

        // Émulsifiant
        list.push('Cetearyl Alcohol', 'Glyceryl Stearate')

        // Huiles végétales (par ordre décroissant)
        const significantOils = selectedOilPhase.value
            .filter(o => o.percent >= 1)
            .sort((a, b) => b.percent - a.percent)

        // Ajouter des noms d'huiles pour l'exemple
        significantOils.forEach(o => {
            list.push(`${o.name} Oil`)
        })

        return list
    })

    return {
        inciList
    }
}