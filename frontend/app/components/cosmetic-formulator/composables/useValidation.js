const useValidation = (form) => {
    return {
        errors: form.errors,
        isValid: form.isValid,
        regulatoryErrors: form.regulatoryErrors,
        regulatoryStatus: form.regulatoryStatus,
        mandatoryMentions: form.mandatoryMentions,
        regulatoryChecks: form.regulatoryChecks,
        heWarnings: form.heWarnings,
        tooManyActives: form.tooManyActives
    }
}

export default useValidation
