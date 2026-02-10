import { ref, computed, onMounted } from 'vue'

export default function useAccessibility() {
    const highContrast = ref(false)
    const reducedMotion = ref(false)
    const textSize = ref(100)

    const containerClasses = computed(() => {
        const classes = ['min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8']
        if (highContrast.value) {
            classes.push('high-contrast')
        }
        if (reducedMotion.value) {
            classes.push('reduced-motion')
        }
        return classes.join(' ')
    })

    const increaseTextSize = () => {
        textSize.value = Math.min(150, textSize.value + 10)
        document.documentElement.style.fontSize = `${textSize.value}%`
    }

    const decreaseTextSize = () => {
        textSize.value = Math.max(80, textSize.value - 10)
        document.documentElement.style.fontSize = `${textSize.value}%`
    }

    const toggleHighContrast = () => {
        highContrast.value = !highContrast.value
        document.documentElement.classList.toggle('high-contrast', highContrast.value)
    }

    const toggleReducedMotion = () => {
        reducedMotion.value = !reducedMotion.value
        document.documentElement.classList.toggle('reduced-motion', reducedMotion.value)
    }

    const detectSystemPreferences = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
        reducedMotion.value = prefersReducedMotion.matches

        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
        highContrast.value = prefersHighContrast.matches

        prefersReducedMotion.addEventListener('change', (e) => {
            reducedMotion.value = e.matches
        })

        prefersHighContrast.addEventListener('change', (e) => {
            highContrast.value = e.matches
        })
    }

    onMounted(() => {
        detectSystemPreferences()
    })

    return {
        highContrast,
        reducedMotion,
        textSize,
        containerClasses,
        increaseTextSize,
        decreaseTextSize,
        toggleHighContrast,
        toggleReducedMotion
    }
}