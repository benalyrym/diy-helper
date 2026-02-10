export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        if (process.dev) {
            console.error("Vue error:", error, info)
        }
    }

    nuxtApp.hook("app:error", error => {
        if (process.dev) {
            console.error("Nuxt app error:", error)
        }
    })
})
