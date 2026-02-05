export const validateVolume = (volume) => {
    if (volume < 1 || volume > 1000) {
        return 'Volume invalide (1-1000 ml)'
    }
    return null
}

export const validateCosgardPercent = (percent) => {
    if (percent < 0.5 || percent > 1.0) {
        return 'Cosgard: plage 0.5-1.0% requise'
    }
    return null
}

export const validateName = (name) => {
    if (!name.trim()) {
        return 'Le nom de la formule est obligatoire'
    }
    if (name.length > 100) {
        return 'Le nom ne doit pas dépasser 100 caractères'
    }
    return null
}