// Formateurs de dates
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'Date inconnue'

    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }

    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { ...defaultOptions, ...options })
}

export const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
}

export const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export const formatRelativeTime = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'à l\'instant'
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`

    return formatDateShort(dateString)
}