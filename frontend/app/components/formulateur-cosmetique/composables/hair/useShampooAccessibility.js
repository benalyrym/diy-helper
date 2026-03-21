import { ref, computed, onMounted } from 'vue'

export default function useShampooAccessibility() {
  const highContrast = ref(false)
  const reducedMotion = ref(false)
  const textSize = ref(100) // pourcentage de base

  // Classes de conteneur dynamiques
  const containerClasses = computed(() => {
    const classes = []

    if (highContrast.value) {
      classes.push('high-contrast')
    }

    if (reducedMotion.value) {
      classes.push('reduced-motion')
    }

    return classes.join(' ')
  })

  // Styles de texte dynamiques
  const textStyles = computed(() => {
    return {
      fontSize: `${textSize.value}%`
    }
  })

  // Méthodes d'accessibilité
  const increaseTextSize = () => {
    textSize.value = Math.min(textSize.value + 10, 150)
  }

  const decreaseTextSize = () => {
    textSize.value = Math.max(textSize.value - 10, 70)
  }

  const toggleHighContrast = () => {
    highContrast.value = !highContrast.value

    // Sauvegarder la préférence
    localStorage.setItem('highContrast', highContrast.value)
  }

  const toggleReducedMotion = () => {
    reducedMotion.value = !reducedMotion.value

    // Sauvegarder la préférence
    localStorage.setItem('reducedMotion', reducedMotion.value)
  }

  // Détecter les préférences système
  const detectSystemPreferences = () => {
    // Contraste élevé
    if (window.matchMedia) {
      const prefersHighContrast = window.matchMedia('(prefers-contrast: more)')
      if (prefersHighContrast.matches) {
        highContrast.value = true
      }

      // Mouvement réduit
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (prefersReducedMotion.matches) {
        reducedMotion.value = true
      }
    }

    // Charger les préférences sauvegardées
    const savedHighContrast = localStorage.getItem('highContrast')
    if (savedHighContrast !== null) {
      highContrast.value = savedHighContrast === 'true'
    }

    const savedReducedMotion = localStorage.getItem('reducedMotion')
    if (savedReducedMotion !== null) {
      reducedMotion.value = savedReducedMotion === 'true'
    }
  }

  // Raccourcis clavier accessibles
  const setupKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
      // Alt + H pour contraste élevé
      if (e.altKey && e.key === 'h') {
        e.preventDefault()
        toggleHighContrast()
      }

      // Alt + M pour mouvement réduit
      if (e.altKey && e.key === 'm') {
        e.preventDefault()
        toggleReducedMotion()
      }

      // Alt + + pour augmenter texte
      if (e.altKey && e.key === '+') {
        e.preventDefault()
        increaseTextSize()
      }

      // Alt + - pour diminuer texte
      if (e.altKey && e.key === '-') {
        e.preventDefault()
        decreaseTextSize()
      }
    })
  }

  return {
    highContrast,
    reducedMotion,
    textSize,
    containerClasses,
    textStyles,
    increaseTextSize,
    decreaseTextSize,
    toggleHighContrast,
    toggleReducedMotion,
    detectSystemPreferences,
    setupKeyboardShortcuts
  }
}