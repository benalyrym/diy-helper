import { useRuntimeConfig, useState, useRouter } from "nuxt/app"
import { useApiClient } from "../utils/apiClient"
import { createAuthApi } from "../services/api/auth"
import type { AuthCredentials, LoginResponse, SignupPayload } from "../types/auth"

export function useAuth() {
    const token = useState<string | null>("jwt", () => null)
    const authReady = useState<boolean>("authReady", () => false)
    const authError = useState<string | null>("authError", () => null)
    const config = useRuntimeConfig()
    const router = useRouter()
    const { request: apiRequest, apiError, clearApiError } = useApiClient()
    const authApi = createAuthApi(apiRequest)
    const persistAuth = config.public.persistAuth !== false

    // 🔁 Restore token côté client au refresh
    if (process.client && !token.value) {
        if (persistAuth) {
            const storedToken = sessionStorage.getItem("jwt")
            if (storedToken) {
                token.value = storedToken
            }
        }
        authReady.value = true
    } else if (process.client) {
        authReady.value = true
    }

    // 🔑 Vérifier si l'utilisateur est authentifié
    const isAuthenticated = computed(() => !!token.value)

    // 🔑 Login avec redirection
    const handleUnauthorized = async () => {
        token.value = null
        if (process.client) {
            sessionStorage.removeItem("jwt")
        }
        if (process.client) {
            await router.push("/auth/login")
        }
    }

    const login = async (email: string, pass: string, redirectTo?: string) => {
        try {
            const res = await authApi.login({ email, password: pass } as AuthCredentials)

            token.value = res.token
            authError.value = null
            clearApiError()

            if (process.client && persistAuth) {
                sessionStorage.setItem("jwt", res.token)
            }

            // Rediriger vers la page protégée ou la page demandée
            if (process.client) {
                await router.push(redirectTo || "/")
            }

            return res
        } catch (error) {
            token.value = null
            if (process.client) {
                sessionStorage.removeItem("jwt")
            }
            authError.value = "Identifiants incorrects"
            throw error
        }
    }

    // 📝 Signup
    const signup = async (data: {
        email: string
        password: string
        firstName?: string
        lastName?: string
        displayName?: string
    }) => {
        return authApi.signup(data as SignupPayload)
    }

    // 🔒 Fetch authentifié
    const authFetch = async <T>(url: string, opts: any = {}) => {
        try {
            return await apiRequest<T>(url, {
                headers: {
                    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
                    ...(opts.headers || {}),
                },
                ...opts,
                onUnauthorized: handleUnauthorized
            })
        } catch (error: any) {
            throw error
        }
    }

    // 🔑 Logout
    const logout = async () => {
        token.value = null
        authError.value = null
        clearApiError()
        if (process.client) {
            sessionStorage.removeItem("jwt")
            await router.push("/auth/login")
        }
    }

    return {
        token,
        isAuthenticated,
        authReady,
        authError,
        apiError,
        login,
        signup,
        authFetch,
        logout
    }
}
