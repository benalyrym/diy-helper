// interfaces/controllers/SkincareController.ts
import { CreateSkincareFormula } from "../../domain/usecases/CreateSkincareFormula"
import { RecipeRepositorySQLite } from "../../infra/repositories/RecipeRepositorySQLite"

export class SkincareController {
    private createFormulaUseCase: CreateSkincareFormula

    constructor() {
        const repo = new RecipeRepositorySQLite()
        this.createFormulaUseCase = new CreateSkincareFormula(repo)
    }

    async create(req: any, res: any) {
        try {
            const {
                name,
                description,
                volume,
                skinType,
                actives = [],
                selectedHE = [],
                ownerId
            } = req.body

            // Validation basique
            if (!ownerId) {
                return res.status(400).json({ error: "Owner ID required" })
            }

            const formulaData = {
                name,
                description,
                volume,
                skinType,
                actives,
                selectedHE,
                ownerId
            }

            const formula = await this.createFormulaUseCase.execute(formulaData)

            res.status(201).json({
                success: true,
                data: formula,
                message: "Formule skincare créée avec succès"
            })

        } catch (error: any) {
            console.error("Erreur création formule:", error)
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
    }

    async update(req: any, res: any) {
        try {
            const { id } = req.params
            const formulaData = req.body

            const repo = new RecipeRepositorySQLite()
            await repo.update(id, formulaData)

            res.json({
                success: true,
                message: "Formule mise à jour avec succès"
            })

        } catch (error: any) {
            console.error("Erreur mise à jour formule:", error)
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
    }
}