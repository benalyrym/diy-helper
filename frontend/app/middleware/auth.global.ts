import {useAuth} from "../composables/useAuth";
import {defineNuxtRouteMiddleware, navigateTo} from "nuxt/app";

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { isAuthenticated, authReady } = useAuth()

    // Liste des routes publiques
    const publicRoutes = ['/auth/login', '/auth/signup', '/']

    if (!authReady.value) {
        return
    }

    // Si la route n'est pas publique et l'utilisateur n'est pas authentifié
    if (!publicRoutes.includes(to.path) && !isAuthenticated.value) {
        return navigateTo('/auth/login')
    }

    // Si l'utilisateur est authentifié et essaie d'accéder à login/signup
    if (isAuthenticated.value && (to.path === '/auth/login' || to.path === '/auth/signup')) {
        return navigateTo('/')
    }
})
