<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center">
    <!-- Carte de connexion principale -->
    <div class="min-h-screen w-full bg-white  overflow-hidden">
      <div class="min-h-screen flex flex-col md:flex-row justify-center">
        <!-- Section de l'illustration (cachée sur mobile) -->
        <div class="hidden md:flex md:w-2/5 bg-gradient-to-b from-emerald-500 to-blue-600 p-8 items-center justify-center">
          <div class="w-full" aria-hidden="true">
            <!-- SVG clean : Cosmétique DIY -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 520" class="w-full h-auto" aria-hidden="true">
              <defs>
                <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stop-color="#ffffff" stop-opacity="0.92"/>
                  <stop offset="1" stop-color="#ffffff" stop-opacity="0.55"/>
                </linearGradient>

                <linearGradient id="liquidBlue" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stop-color="#60a5fa" stop-opacity="0.95"/>
                  <stop offset="1" stop-color="#3b82f6" stop-opacity="0.90"/>
                </linearGradient>

                <linearGradient id="liquidMint" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stop-color="#34d399" stop-opacity="0.95"/>
                  <stop offset="1" stop-color="#10b981" stop-opacity="0.90"/>
                </linearGradient>

                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.18"/>
                </filter>

                <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.12"/>
                </filter>
              </defs>

              <!-- Halo -->
              <circle cx="260" cy="260" r="200" fill="#dbeafe" opacity="0.35"/>
              <circle cx="260" cy="260" r="160" fill="#ffffff" opacity="0.22"/>

              <!-- Sparkles -->
              <g opacity="0.9">
                <path d="M260 120 l10 18 18 10 -18 10 -10 18 -10 -18 -18 -10 18 -10 Z" fill="#ffffff"/>
                <path d="M390 210 l6 10 10 6 -10 6 -6 10 -6 -10 -10 -6 10 -6 Z" fill="#ffffff" opacity="0.75"/>
              </g>

              <!-- Leaf (ingredient) -->
              <g filter="url(#soft)">
                <path d="M120 300c-22-30-6-70 34-78 44-9 80 25 74 66-6 41-54 60-90 41-8-4-14-9-18-13z"
                      fill="url(#liquidMint)"/>
                <path d="M132 255c28 18 52 40 74 66" fill="none" stroke="#059669" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
              </g>

              <!-- Jar -->
              <g filter="url(#shadow)">
                <!-- lid -->
                <rect x="145" y="338" width="170" height="40" rx="18" fill="#93c5fd"/>
                <rect x="160" y="348" width="140" height="20" rx="10" fill="#60a5fa" opacity="0.9"/>
                <!-- body -->
                <rect x="135" y="368" width="190" height="92" rx="26" fill="url(#glass)" stroke="#3b82f6" stroke-width="4"/>
                <!-- cream -->
                <path d="M160 402c14-20 36-28 52-18 9 5 16 14 26 14 11 0 18-12 32-16 18-6 38 6 46 28
             -2 24-32 38-78 38-46 0-76-14-78-46z"
                      fill="#ffffff" opacity="0.9"/>
                <path d="M170 438h120" stroke="#c7d2fe" stroke-width="10" stroke-linecap="round" opacity="0.65"/>
              </g>

              <!-- Pump bottle -->
              <g filter="url(#shadow)">
                <!-- bottle -->
                <rect x="338" y="250" width="120" height="210" rx="34" fill="url(#glass)" stroke="#3b82f6" stroke-width="4"/>
                <!-- label -->
                <rect x="360" y="312" width="76" height="88" rx="18" fill="#93c5fd" opacity="0.85"/>
                <rect x="372" y="330" width="52" height="10" rx="5" fill="#ffffff" opacity="0.85"/>
                <rect x="372" y="350" width="42" height="10" rx="5" fill="#ffffff" opacity="0.70"/>
                <!-- liquid -->
                <path d="M350 388c18-12 36-18 48-18s30 6 48 18v56c-16 12-34 18-48 18s-32-6-48-18z"
                      fill="url(#liquidBlue)" opacity="0.9"/>
                <!-- neck -->
                <rect x="360" y="220" width="76" height="44" rx="18" fill="#93c5fd" stroke="#3b82f6" stroke-width="4"/>
                <!-- pump -->
                <rect x="386" y="182" width="24" height="46" rx="12" fill="#9ca3af"/>
                <path d="M398 182v-20c0-10 8-18 18-18h40" fill="none" stroke="#6b7280" stroke-width="10" stroke-linecap="round"/>
                <circle cx="456" cy="144" r="7" fill="#6b7280"/>
              </g>

              <!-- Dropper bottle -->
              <g filter="url(#shadow)">
                <!-- cap -->
                <rect x="226" y="130" width="68" height="56" rx="18" fill="#9ca3af"/>
                <rect x="252" y="186" width="16" height="44" rx="8" fill="#9ca3af"/>
                <!-- bottle -->
                <rect x="200" y="220" width="120" height="190" rx="44" fill="url(#glass)" stroke="#3b82f6" stroke-width="4"/>
                <!-- liquid -->
                <path d="M220 330c18-18 40-26 40-26s22 8 40 26v70c-14 14-30 20-40 20s-26-6-40-20z"
                      fill="url(#liquidBlue)" opacity="0.85"/>
                <!-- highlight -->
                <path d="M228 246c0 0 0 120 0 140" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity="0.28"/>
              </g>

              <!-- Droplets -->
              <g>
                <path d="M286 206c0-16 22-18 22 0 0 13-11 24-11 24s-11-11-11-24z" fill="#60a5fa" opacity="0.9">
                  <animate attributeName="transform" values="translate(0,0);translate(0,8);translate(0,0)" dur="2.4s" repeatCount="indefinite"/>
                </path>

                <path d="M312 214c0-12 16-14 16 0 0 10-8 18-8 18s-8-8-8-18z" fill="#34d399" opacity="0.85">
                  <animate attributeName="transform" values="translate(0,0);translate(0,10);translate(0,0)" dur="2.0s" repeatCount="indefinite"/>
                </path>
              </g>

              <!-- Bubbles -->
              <g fill="#ffffff" opacity="0.75">
                <circle cx="315" cy="288" r="6">
                  <animate attributeName="cy" values="288;278;288" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="338" cy="300" r="4">
                  <animate attributeName="cy" values="300;292;300" dur="2.4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="180" cy="320" r="5">
                  <animate attributeName="cy" values="320;310;320" dur="2.8s" repeatCount="indefinite"/>
                </circle>
              </g>
            </svg>



          </div>
        </div>

        <!-- Section du formulaire -->
        <div class="w-full md:w-3/5 p-8">
          <!-- En-tête -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Accès CosmeticLab</h1>
            <p class="text-gray-600 mt-2">Votre espace de création cosmétique</p>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="onLogin" class="space-y-6">
            <!-- Champ Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Adresse email
                </div>
              </label>
              <input
                  v-model="email"
                  id="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  autocomplete="email"
                  aria-describedby="email-help"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              />
              <p id="email-help" class="mt-1 text-xs text-gray-500">Utilisez l'adresse associée à votre compte</p>
            </div>

            <!-- Champ Mot de passe -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Mot de passe
                  </div>
                </label>
                <a href="#" class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <input
                  v-model="pass"
                  id="password"
                  type="password"
                  required
                  placeholder="Votre mot de passe"
                  autocomplete="current-password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              />
            </div>

            <!-- Case à cocher "Se souvenir de moi" -->
            <div class="flex items-center">
              <input
                  id="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <!-- Bouton de connexion -->
            <button
                type="submit"
                id="onLogin"
                class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                :disabled="loading"
                :aria-busy="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Se connecter
              </span>
            </button>

            <!-- Message d'erreur -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-red-700 text-sm font-medium">{{ error }}</span>
              </div>
            </div>
          </form>

          <!-- Lien d'inscription -->
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <p class="text-gray-600 text-sm">
              Nouveau sur CosmeticLab ?
              <NuxtLink to="/auth/signup" class="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors ml-1">
                Créer un compte
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Informations d'accessibilité (visible pour les lecteurs d'écran) -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      Page de connexion à l'application CosmeticLab. Remplissez votre email et mot de passe pour accéder à votre espace de création de formulations cosmétiques DIY.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuth } from "~/composables/useAuth.ts"
import { navigateTo } from "nuxt/app"

definePageMeta({
  layout: "auth"
})

const email = ref("")
const pass = ref("")
const error = ref("")
const loading = ref(false)
const { login } = useAuth()

async function onLogin() {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ""

    await login(email.value, pass.value)
    await navigateTo("/")
  } catch (err) {
    error.value = err?.data?.message || "Identifiants incorrects. Veuillez vérifier vos informations."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Améliorations pour l'accessibilité */
input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Animation pour le bouton de chargement */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Support pour le mode sombre */
@media (prefers-color-scheme: dark) {
  .dark\:bg-gray-900 {
    background-color: #111827;
  }

  .dark\:text-white {
    color: #ffffff;
  }

  .dark\:bg-gray-800 {
    background-color: #1f2937;
  }
}

/* Classes utilitaires pour l'accessibilité */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>

