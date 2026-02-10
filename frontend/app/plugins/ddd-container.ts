import { createContainer } from "../di/container"

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const apiError = useState<string | null>("apiError", () => null)
    const authToken = useState<string | null>("jwt", () => null)
    const router = useRouter()
    const persistAuth = config.public.persistAuth !== false

    const handleUnauthorized = async () => {
        authToken.value = null
        if (process.client && persistAuth) {
            sessionStorage.removeItem("jwt")
        }
        if (process.client) {
            await router.push("/auth/login")
        }
    }

    const container = createContainer({
        baseURL: config.public.apiBase,
        fetcher: $fetch,
        onUnauthorized: handleUnauthorized,
        onForbidden: () => {
            apiError.value = "Acces refuse"
        }
    })

    nuxtApp.provide("container", container)
})
