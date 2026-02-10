import type { Container } from "./container"

export const useContainer = (): Container => {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$container as Container
}
