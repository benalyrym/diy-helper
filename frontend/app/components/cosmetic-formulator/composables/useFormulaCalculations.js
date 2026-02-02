const useFormulaCalculations = (form) => {
    return {
        grams: form.grams,
        phases: form.phases,
        heTotal: form.heTotal,
        oilPhase: form.oilPhase,
        oilPhaseGrams: form.oilPhaseGrams,
        waterPhase: form.waterPhase,
        waterPhaseGrams: form.waterPhaseGrams,
        totalPercent: form.totalPercent,
        gramsByHECategory: form.gramsByHECategory
    }
}

export default useFormulaCalculations
