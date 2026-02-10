import { useRuntimeConfig, useState } from "nuxt/app"

type ApiRequestOptions = {
    method?: string
    headers?: Record<string, string>
    body?: any
    timeout?: number
    retry?: number
    retryDelayMs?: number
    onUnauthorized?: () => Promise<void> | void
    onForbidden?: () => void
}

type ApiClientConfig = {
    baseURL: string
    fetcher: typeof $fetch
    onUnauthorized?: () => Promise<void> | void
    onForbidden?: () => void
}

const RETRY_STATUS = new Set([408, 429, 500, 502, 503, 504])
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "OPTIONS"])
const DEFAULT_TIMEOUT = 10000

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const createApiClient = (config: ApiClientConfig) => {
    const request = async <T>(url: string, options: ApiRequestOptions = {}) => {
        const method = (options.method || "GET").toUpperCase()
        const canRetry = IDEMPOTENT_METHODS.has(method)
        const maxRetries = Math.max(0, options.retry ?? 0)
        const retryDelayMs = Math.max(0, options.retryDelayMs ?? 200)
        const timeout = options.timeout ?? DEFAULT_TIMEOUT
        let attempt = 0

        while (true) {
            try {
                return await config.fetcher<T>(url, {
                    baseURL: config.baseURL,
                    method,
                    headers: options.headers,
                    body: options.body,
                    timeout
                })
            } catch (error: any) {
                const status = error?.response?.status
                const onUnauthorized = options.onUnauthorized || config.onUnauthorized
                const onForbidden = options.onForbidden || config.onForbidden

                if (status === 401 && onUnauthorized) {
                    await onUnauthorized()
                }
                if (status === 403 && onForbidden) {
                    onForbidden()
                }

                if (!canRetry || attempt >= maxRetries || !RETRY_STATUS.has(status || 0)) {
                    throw error
                }

                attempt += 1
                await sleep(retryDelayMs * attempt)
            }
        }
    }

    return { request }
}

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
