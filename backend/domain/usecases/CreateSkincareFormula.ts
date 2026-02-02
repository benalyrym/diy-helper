// domain/usecases/CreateSkincareFormula.ts
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"
import { Recipe } from "../models/Recipe"

export class CreateSkincareFormula {
    constructor(private recipeRepo: RecipeRepositorySQLite) {}

    async execute(data: any) {
        // Validation
        this.validateSkincareData(data)

        // Préparation des ingrédients
        const ingredients = this.prepareIngredients(data)

        const skincareData = {
            formulaType: data.formulaType,
            spf: data.spf,
            preservativeSystem: data.preservativeSystem,
            actives: data.actives || [],
            selectedHE: data.selectedHE || [],
            phases: data.phases,
            regulatoryStatus: data.regulatoryStatus,
            inciList: data.inciList,
            mandatoryMentions: data.mandatoryMentions,
            compliance: data.compliance,
            version: data.version
        }

        // Création de la recette
        const recipe = new Recipe(
            data.name,
            data.description || this.generateDescription(data),
            ingredients,
            data.ownerId,
            'skincare',
            data.volume,
            data.skinType,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            skincareData
        )

        // Sauvegarde
        return this.recipeRepo.save(recipe)
    }

    private validateSkincareData(data: any) {
        if (!data.name?.trim()) {
            throw new Error("Le nom de la formule est requis")
        }

        if (!data.volume || data.volume <= 0) {
            throw new Error("Le volume doit être positif")
        }

        if (!data.skinType) {
            throw new Error("Le type de peau est requis")
        }

        // Vérification HE
        const heTotal = (data.selectedHE || []).reduce((sum: number, he: any) =>
            sum + (he.percent || 0), 0
        )

        if (heTotal > 1) {
            throw new Error(`Limite HE dépassée: ${heTotal.toFixed(2)}% > 1% (UE 1223/2009)`)
        }
    }

    private prepareIngredients(data: any): any[] {
        const ingredients = []

        // Actifs
        if (data.actives) {
            data.actives.forEach((active: any) => {
                if (active.enabled && active.percent > 0) {
                    ingredients.push({
                        name: active.label,
                        quantity: active.percent,
                        unit: '%'
                    })
                }
            })
        }

        // Huiles essentielles
        if (data.selectedHE) {
            data.selectedHE.forEach((he: any) => {
                ingredients.push({
                    name: `HE ${he.name}`,
                    quantity: he.percent,
                    unit: '%'
                })
            })
        }

        // Phases de base
        if (Array.isArray(data.phases)) {
            const phaseMap = data.phases.reduce((acc: any, phase: any) => {
                acc[phase.name] = phase
                return acc
            }, {})
            const oilPhase = Object.values(phaseMap).find((p: any) =>
                typeof p?.name === 'string' && p.name.toLowerCase().includes('huile')
            )
            const waterPhase = Object.values(phaseMap).find((p: any) =>
                typeof p?.name === 'string' && p.name.toLowerCase().includes('aqueuse')
            )
            const emulsifierPhase = Object.values(phaseMap).find((p: any) =>
                typeof p?.name === 'string' && p.name.toLowerCase().includes('emuls')
            )

            if (oilPhase) {
                ingredients.push({
                    name: oilPhase.name,
                    quantity: oilPhase.percent,
                    unit: '%'
                })
            }

            if (waterPhase) {
                ingredients.push({
                    name: waterPhase.name,
                    quantity: waterPhase.percent,
                    unit: '%'
                })
            }

            if (emulsifierPhase) {
                ingredients.push({
                    name: emulsifierPhase.name,
                    quantity: emulsifierPhase.percent,
                    unit: '%'
                })
            }
        } else {
            if (data.phases?.oil) {
                ingredients.push({
                    name: 'Phase huileuse',
                    quantity: data.phases.oil,
                    unit: '%'
                })
            }

            if (data.phases?.water) {
                ingredients.push({
                    name: 'Phase aqueuse',
                    quantity: data.phases.water,
                    unit: '%'
                })
            }
        }

        return ingredients
    }

    private generateDescription(data: any): string {
        const activesList = (data.actives || [])
            .filter((a: any) => a.enabled)
            .map((a: any) => `${a.label} ${a.percent}%`)
            .join(', ')

        const heList = (data.selectedHE || [])
            .map((h: any) => `${h.name} ${h.percent}%`)
            .join(', ')

        return `Formule skincare pour peau ${data.skinType}
Volume: ${data.volume}ml
Actifs: ${activesList || 'Aucun'}
HE: ${heList || 'Aucune'}
Créée le ${new Date().toLocaleDateString('fr-FR')}`
    }
}
