<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <!-- Carte d'inscription -->
    <div class="min-h-screen w-full overflow-hidden">
      <div class="min-h-screen flex flex-col md:flex-row">
        <!-- Section formulaire -->
        <div class="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div class="w-full max-w-md">
            <!-- En-tête mobile -->
            <div class="md:hidden mb-8 text-center">
              <div class="inline-flex items-center gap-3 mb-4">
                <div
                    class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                </div>
                <span class="text-2xl font-bold text-gray-900">CosmeticLab</span>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Créer un compte</h1>
              <p class="text-gray-600 mt-2">Commencez votre aventure de formulation DIY</p>
            </div>

            <!-- En-tête desktop -->
            <div class="hidden md:block mb-8">
              <h1 class="text-3xl font-bold text-gray-900">Rejoignez-nous</h1>
              <p class="text-gray-600 mt-2">Créez votre compte gratuitement</p>
            </div>

            <!-- Formulaire -->
            <form @submit.prevent="onSignup" class="space-y-6">
              <!-- Prénom -->
              <div class="group">
                <label for="firstName"
                       class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                  Prénom
                </label>
                <input
                    v-model="firstName"
                    id="firstName"
                    type="text"
                    required
                    placeholder="Votre prénom"
                    autocomplete="given-name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <!-- Nom -->
              <div class="group">
                <label for="lastName"
                       class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                  Nom
                </label>
                <input
                    v-model="lastName"
                    id="lastName"
                    type="text"
                    required
                    placeholder="Votre nom"
                    autocomplete="family-name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <!-- Email -->
              <div class="group">
                <label for="email"
                       class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                  Adresse email
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <input
                      v-model="email"
                      id="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      autocomplete="email"
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <p class="mt-2 text-xs text-gray-500 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Nous enverrons un email de confirmation
                </p>
              </div>

              <!-- Mot de passe -->
              <div class="group">
                <label for="password"
                       class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                  Mot de passe
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                      v-model="password"
                      id="password"
                      type="password"
                      required
                      placeholder="Créez un mot de passe sécurisé"
                      autocomplete="new-password"
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div class="mt-3 space-y-2">
                  <div class="flex items-center">
                    <div
                        :class="['w-2 h-2 rounded-full mr-2 transition-colors', isPasswordValid.length ? 'bg-emerald-500' : 'bg-gray-300']"></div>
                    <span
                        :class="['text-xs transition-colors', isPasswordValid.length ? 'text-emerald-700' : 'text-gray-500']">
                      Au moins 8 caractères
                    </span>
                  </div>
                  <div class="flex items-center">
                    <div
                        :class="['w-2 h-2 rounded-full mr-2 transition-colors', hasUpperCase ? 'bg-emerald-500' : 'bg-gray-300']"></div>
                    <span :class="['text-xs transition-colors', hasUpperCase ? 'text-emerald-700' : 'text-gray-500']">
                      Une lettre majuscule
                    </span>
                  </div>
                </div>
              </div>

              <!-- Confirmation mot de passe -->
              <div class="group">
                <label for="confirmPassword"
                       class="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors">
                  Confirmer le mot de passe
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <input
                      v-model="confirmPassword"
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="Retapez votre mot de passe"
                      autocomplete="new-password"
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <p v-if="password && confirmPassword && !passwordsMatch"
                   class="mt-2 text-xs text-red-600 flex items-center animate-fade-in">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Les mots de passe ne correspondent pas
                </p>
              </div>

              <!-- Conditions d'utilisation -->
              <div class="flex items-start group">
                <input
                    v-model="acceptTerms"
                    id="terms"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1 transition-colors"
                />
                <label for="terms"
                       class="ml-2 text-sm text-gray-700 group-focus-within:text-emerald-600 transition-colors">
                  J'accepte les
                  <a href="#" class="text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">conditions
                    d'utilisation</a>
                  et la
                  <a href="#" class="text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">politique
                    de confidentialité</a>
                </label>
              </div>

              <!-- Bouton d'inscription -->
              <button
                  type="submit"
                  :disabled="loading || !passwordsMatch || !acceptTerms || !isPasswordStrong"
                  :class="[
                    'w-full py-3 px-4 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center',
                    !passwordsMatch || !acceptTerms || !isPasswordStrong
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700'
                  ]"
              >
                <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  Créer mon compte
                </span>
              </button>

              <!-- Messages -->
              <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in" role="alert">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-red-700 text-sm">{{ error }}</span>
                </div>
              </div>

              <div v-if="success" class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg animate-fade-in"
                   role="alert">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-emerald-700 text-sm">{{ success }}</span>
                </div>
              </div>
            </form>

            <!-- Lien vers connexion -->
            <div class="mt-8 pt-6 border-t border-gray-200 text-center">
              <p class="text-gray-600 text-sm">
                Déjà un compte ?
                <NuxtLink to="/auth/login"
                          class="font-medium text-emerald-600 hover:text-emerald-800 hover:underline transition-colors ml-1">
                  Se connecter
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>

        <!-- Section de l'illustration -->
        <div
            class="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-400 to-emerald-500 p-12 items-center justify-center relative overflow-hidden">
          <!-- Éléments décoratifs -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
          </div>

          <div class="relative z-10 w-full max-w-md">
            <!-- Logo/Icone -->
            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">CosmeticLab</span>
            </div>

            <!-- Illustration SVG -->
            <div class="w-full aspect-square mb-8" aria-hidden="true">
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
                  <path d="M132 255c28 18 52 40 74 66" fill="none" stroke="#059669" stroke-width="6"
                        stroke-linecap="round" opacity="0.9"/>
                </g>

                <!-- Jar -->
                <g filter="url(#shadow)">
                  <!-- lid -->
                  <rect x="145" y="338" width="170" height="40" rx="18" fill="#93c5fd"/>
                  <rect x="160" y="348" width="140" height="20" rx="10" fill="#60a5fa" opacity="0.9"/>
                  <!-- body -->
                  <rect x="135" y="368" width="190" height="92" rx="26" fill="url(#glass)" stroke="#3b82f6"
                        stroke-width="4"/>
                  <!-- cream -->
                  <path d="M160 402c14-20 36-28 52-18 9 5 16 14 26 14 11 0 18-12 32-16 18-6 38 6 46 28
             -2 24-32 38-78 38-46 0-76-14-78-46z"
                        fill="#ffffff" opacity="0.9"/>
                  <path d="M170 438h120" stroke="#c7d2fe" stroke-width="10" stroke-linecap="round" opacity="0.65"/>
                </g>

                <!-- Pump bottle -->
                <g filter="url(#shadow)">
                  <!-- bottle -->
                  <rect x="338" y="250" width="120" height="210" rx="34" fill="url(#glass)" stroke="#3b82f6"
                        stroke-width="4"/>
                  <!-- label -->
                  <rect x="360" y="312" width="76" height="88" rx="18" fill="#93c5fd" opacity="0.85"/>
                  <rect x="372" y="330" width="52" height="10" rx="5" fill="#ffffff" opacity="0.85"/>
                  <rect x="372" y="350" width="42" height="10" rx="5" fill="#ffffff" opacity="0.70"/>
                  <!-- liquid -->
                  <path d="M350 388c18-12 36-18 48-18s30 6 48 18v56c-16 12-34 18-48 18s-32-6-48-18z"
                        fill="url(#liquidBlue)" opacity="0.9"/>
                  <!-- neck -->
                  <rect x="360" y="220" width="76" height="44" rx="18" fill="#93c5fd" stroke="#3b82f6"
                        stroke-width="4"/>
                  <!-- pump -->
                  <rect x="386" y="182" width="24" height="46" rx="12" fill="#9ca3af"/>
                  <path d="M398 182v-20c0-10 8-18 18-18h40" fill="none" stroke="#6b7280" stroke-width="10"
                        stroke-linecap="round"/>
                  <circle cx="456" cy="144" r="7" fill="#6b7280"/>
                </g>

                <!-- Dropper bottle -->
                <g filter="url(#shadow)">
                  <!-- cap -->
                  <rect x="226" y="130" width="68" height="56" rx="18" fill="#9ca3af"/>
                  <rect x="252" y="186" width="16" height="44" rx="8" fill="#9ca3af"/>
                  <!-- bottle -->
                  <rect x="200" y="220" width="120" height="190" rx="44" fill="url(#glass)" stroke="#3b82f6"
                        stroke-width="4"/>
                  <!-- liquid -->
                  <path d="M220 330c18-18 40-26 40-26s22 8 40 26v70c-14 14-30 20-40 20s-26-6-40-20z"
                        fill="url(#liquidBlue)" opacity="0.85"/>
                  <!-- highlight -->
                  <path d="M228 246c0 0 0 120 0 140" stroke="#ffffff" stroke-width="10" stroke-linecap="round"
                        opacity="0.28"/>
                </g>

                <!-- Droplets -->
                <g>
                  <path d="M286 206c0-16 22-18 22 0 0 13-11 24-11 24s-11-11-11-24z" fill="#60a5fa" opacity="0.9">
                    <animate attributeName="transform" values="translate(0,0);translate(0,8);translate(0,0)" dur="2.4s"
                             repeatCount="indefinite"/>
                  </path>

                  <path d="M312 214c0-12 16-14 16 0 0 10-8 18-8 18s-8-8-8-18z" fill="#34d399" opacity="0.85">
                    <animate attributeName="transform" values="translate(0,0);translate(0,10);translate(0,0)" dur="2.0s"
                             repeatCount="indefinite"/>
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

            <!-- Citation -->
            <div class="text-center">
              <p class="text-white/90 text-lg italic mb-2">"Créez l'exceptionnel à partir de l'ordinaire"</p>
              <p class="text-white/70 text-sm">Rejoignez notre communauté de formulateurs passionnés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from "vue"
import {useAuth} from "~/composables/useAuth.ts"
import {navigateTo} from "#app"

definePageMeta({
  layout: "auth"
})

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const acceptTerms = ref(false)
const error = ref("")
const success = ref("")
const loading = ref(false)

const {signup} = useAuth()

// Validation du mot de passe
const isPasswordValid = computed(() => {
  return password.value.length >= 8
})

const hasUpperCase = computed(() => {
  return /[A-Z]/.test(password.value)
})

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value
})

const isPasswordStrong = computed(() => {
  return isPasswordValid.value && hasUpperCase.value
})

async function onSignup() {
  if (loading.value || !passwordsMatch.value || !acceptTerms.value || !isPasswordStrong.value) return

  try {
    loading.value = true
    error.value = ""
    success.value = ""

    await signup({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      displayName: `${firstName.value} ${lastName.value}`.trim()
    })

    success.value = "Compte créé avec succès ! Redirection..."

    setTimeout(async () => {
      await navigateTo("/auth/login")
    }, 1500)

  } catch (err) {
    error.value = err?.data?.message || "Une erreur est survenue lors de la création du compte. Veuillez réessayer."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Améliorations d'accessibilité */
input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Transitions douces */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>


