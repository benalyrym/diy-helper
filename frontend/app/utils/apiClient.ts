import { useRuntimeConfig, useState } from "nuxt/app"
import { createApiClient } from "../shared/infrastructure/http/apiClient"

export { createApiClient }

export const useApiClient = () => {
    const config = useRuntimeConfig()
    const apiError = useState<string | null>("apiError", () => null)

    const client = createApiClient({
        baseURL: config.public.apiBase,
        fetcher: $fetch,
        onForbidden: () => {
            apiError.value = "Acces refuse"
        }
    })

    const clearApiError = () => {
        apiError.value = null
    }

    return {
        request: client.request,
        apiError,
        clearApiError
    }
}
