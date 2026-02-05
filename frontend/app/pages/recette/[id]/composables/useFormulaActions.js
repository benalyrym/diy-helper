import { useClipboard } from '@vueuse/core'
import { useRouter } from 'vue-router'

export function useFormulaActions(formula, inciList, isFormulaValid, printMode) {
    const router = useRouter()
    const { copy, copied } = useClipboard()

    // Formatage de dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue'
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDateShort = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR')
    }

    const formatTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    // Actions
    const generatePDF = () => {
        console.log('Génération du PDF de la formule...')
        alert('Génération PDF - Cette fonctionnalité sera disponible prochainement')
    }

    const togglePrintMode = () => {
        printMode.value = !printMode.value
        if (printMode.value) {
            document.body.classList.add('print-mode')
            window.print()
            setTimeout(() => {
                document.body.classList.remove('print-mode')
                printMode.value = false
            }, 1000)
        }
    }

    const copyFormula = async () => {
        try {
            const text = `Formule: ${formula.value.name}

Description: ${formula.value.description || 'Non renseignée'}

Volume: ${formula.value.volume} ml
Type de peau: ${formula.value.skinType}
Statut UE: ${isFormulaValid.value ? 'Conforme' : 'Non conforme'}

Ingrédients:
${formula.value.ingredients.map((i) => `• ${i.name}: ${i.quantity}%`).join('\n')}

---
Généré avec Formulateur Cosmétique Pro - ${new Date().toLocaleDateString('fr-FR')}`

            await copy(text)

            // Feedback visuel
            const button = event?.target
            if (button) {
                const originalText = button.textContent
                button.textContent = '✅ Copié !'
                setTimeout(() => {
                    button.textContent = originalText
                }, 2000)
            }
        } catch (err) {
            console.error('Erreur lors de la copie:', err)
            alert('Erreur lors de la copie de la formule')
        }
    }

    const exportFormula = () => {
        if (!formula.value) return

        const exportData = {
            ...formula.value,
            analysis: {
                isValid: isFormulaValid.value,
                inciList: inciList.value
            },
            exportDate: new Date().toISOString(),
            exportFormat: 'skincare-formulator-json-v2'
        }

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const fileName = `formule-${formula.value.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`

        const link = document.createElement('a')
        link.setAttribute('href', dataUri)
        link.setAttribute('download', fileName)
        link.click()
    }

    const shareFormula = () => {
        if (navigator.share) {
            navigator.share({
                title: formula.value.name,
                text: `Découvrez ma formule cosmétique "${formula.value.name}" - ${formula.value.volume} ml pour peau ${formula.value.skinType}`,
                url: window.location.href
            })
        } else {
            copyFormula()
        }
    }

    const generateSafetyReport = () => {
        console.log('Génération du rapport de sécurité...')
        alert('Génération du rapport de sécurité - Cette fonctionnalité sera disponible prochainement')
    }

    const copyINCI = async () => {
        try {
            const inciText = inciList.value
            await copy(inciText)
            setTimeout(() => {
                copied.value = false
            }, 2000)
        } catch (err) {
            console.error('Erreur lors de la copie:', err)
            alert('Erreur lors de la copie de la liste INCI')
        }
    }

    // Raccourcis clavier
    const handleKeyboardShortcuts = (e) => {
        // Ctrl/Cmd + P pour imprimer
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault()
            togglePrintMode()
        }

        // Échap pour retour
        if (e.key === 'Escape') {
            router.push('/recettes')
        }

        // Navigation par flèches
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            const sections = [
                { id: 'description' },
                { id: 'ingredients' },
                { id: 'compliance' }
            ]
            const currentIndex = sections.findIndex(s => s.id === activeSection)
            let nextIndex = currentIndex

            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                nextIndex = currentIndex + 1
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                nextIndex = currentIndex - 1
            }

            if (nextIndex !== currentIndex) {
                scrollToSection(sections[nextIndex].id)
            }
        }
    }

    return {
        generatePDF,
        togglePrintMode,
        copyFormula,
        exportFormula,
        shareFormula,
        generateSafetyReport,
        copyINCI,
        copied,
        formatDate,
        formatDateShort,
        formatTime,
        handleKeyboardShortcuts
    }
}