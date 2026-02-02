import { computed, ref } from 'vue'
import { messages } from '../utils/i18n'

const DEFAULT_LANG = 'en'

const useI18n = () => {
    const locale = ref(DEFAULT_LANG)

    const t = (key, vars = {}) => {
        const dict = messages[locale.value] || messages[DEFAULT_LANG]
        let value = dict[key] || key
        Object.entries(vars).forEach(([k, v]) => {
            value = value.replace(new RegExp(`\{${k}\}`, 'g'), v)
        })
        return value
    }

    const languageOptions = computed(() => [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Francais' }
    ])

    return {
        locale,
        t,
        languageOptions
    }
}

export default useI18n
