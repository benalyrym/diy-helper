import { onMounted, onUnmounted, ref, watch } from 'vue'

const useAccessibility = () => {
    const showMenu = ref(false)
    const textSize = ref(100)
    const highContrast = ref(false)
    const reducedMotion = ref(false)

    const toggleMenu = () => {
        showMenu.value = !showMenu.value
    }

    const increaseTextSize = () => {
        textSize.value = Math.min(150, textSize.value + 10)
    }

    const decreaseTextSize = () => {
        textSize.value = Math.max(80, textSize.value - 10)
    }

    const toggleHighContrast = () => {
        highContrast.value = !highContrast.value
    }

    const toggleReducedMotion = () => {
        reducedMotion.value = !reducedMotion.value
    }

    const applyAccessibility = () => {
        document.documentElement.style.fontSize = `${textSize.value}%`
        document.documentElement.classList.toggle('high-contrast', highContrast.value)
        document.documentElement.classList.toggle('reduced-motion', reducedMotion.value)
    }

    watch([textSize, highContrast, reducedMotion], applyAccessibility, { immediate: true })

    let prefersReducedMotion = null
    let prefersHighContrast = null
    const onReducedChange = (event) => {
        reducedMotion.value = event.matches
    }
    const onContrastChange = (event) => {
        highContrast.value = event.matches
    }

    onMounted(() => {
        prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
        reducedMotion.value = prefersReducedMotion.matches

        prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
        highContrast.value = prefersHighContrast.matches

        prefersReducedMotion.addEventListener('change', onReducedChange)
        prefersHighContrast.addEventListener('change', onContrastChange)
    })

    onUnmounted(() => {
        if (prefersReducedMotion) {
            prefersReducedMotion.removeEventListener('change', onReducedChange)
        }
        if (prefersHighContrast) {
            prefersHighContrast.removeEventListener('change', onContrastChange)
        }
    })

    return {
        showMenu,
        textSize,
        highContrast,
        reducedMotion,
        toggleMenu,
        increaseTextSize,
        decreaseTextSize,
        toggleHighContrast,
        toggleReducedMotion
    }
}

export default useAccessibility
