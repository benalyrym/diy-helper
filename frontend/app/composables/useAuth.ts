import { useRuntimeConfig, useState, useRouter } from "nuxt/app"

interface LoginResponse {
    token: string
}

export function useAuth() {
    const token = useState<string | null>("jwt", () => null)
    const config = useRuntimeConfig()
    const router = useRouter()

    // 🔁 Restore token côté client au refresh
    if (process.client && !token.value) {
        const storedToken = sessionStorage.getItem("jwt")
        if (storedToken) {
            token.value = storedToken
        }
    }

    // 🔑 Vérifier si l'utilisateur est authentifié
    const isAuthenticated = computed(() => !!token.value)

    // 🔑 Login avec redirection
    const login = async (email: string, pass: string, redirectTo?: string) => {
        try {
            const res = await $fetch<LoginResponse>("/login", {
                baseURL: config.public.apiBase,
                method: "POST" as const,
                body: { email, password: pass },
            })

            token.value = res.token

            if (process.client) {
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
            throw error
        }
    }

    // 📝 Signup
    const signup = async (email: string, pass: string) => {
        return $fetch("/api/signup", {
            baseURL: config.public.apiBase,
            method: "POST" as const,
            body: { email, password: pass },
        })
    }

    // 🔒 Fetch authentifié
    const authFetch = async <T>(url: string, opts: any = {}) => {
        return $fetch<T>(url, {
            baseURL: config.public.apiBase,
            headers: {
                ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
                ...(opts.headers || {}),
            },
            ...opts,
        })
    }

    // 🔑 Logout
    const logout = () => {
        token.value = null
        if (process.client) {
            sessionStorage.removeItem("jwt")
            router.push("auth/login")
        }
    }

    return {
        token,
        isAuthenticated,
        login,
        signup,
        authFetch,
        logout
    }
}