<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo + Nom application -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="flex items-center space-x-3 group" aria-label="Retour à l'accueil">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <div class="hidden md:block">
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                CosmeticLab
              </h1>
              <p class="text-xs text-gray-500">Création de formules cosmétiques</p>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation principale (desktop) -->
        <nav class="hidden md:flex items-center space-x-1" aria-label="Navigation principale">
          <NuxtLink
            to="/"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2',
              isActive('/')
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
            aria-current="page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Accueil</span>
          </NuxtLink>

          <NuxtLink
            to="/recettes"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2',
              isActive('/recettes')
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Recettes</span>
            <span v-if="recipes.length > 0" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {{ recipes.length }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/ingredients"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2',
              isActive('/ingredients')
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>Ingrédients</span>
          </NuxtLink>
        </nav>

        <!-- Actions droite -->
        <div class="flex items-center space-x-3">
          <div class="hidden lg:block">
            <NuxtLink
              to="/recette/choose-type"
              class="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle recette
              <div class="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </NuxtLink>
          </div>

          <!-- Menu utilisateur -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              :aria-expanded="userMenuOpen"
              :aria-label="`Menu utilisateur ${userName ? `de ${userName}` : ''}`"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center text-blue-700 font-semibold text-sm">
                {{ userInitials }}
              </div>
              <svg
                :class="['w-4 h-4 text-gray-500 transition-transform duration-200', userMenuOpen ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50"
              role="menu"
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ userName || 'Utilisateur' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ userEmail || 'email@example.com' }}</p>
              </div>

              <NuxtLink
                to="/profile"
                class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                role="menuitem"
                @click="userMenuOpen = false"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon profil
              </NuxtLink>

              <div class="border-t border-gray-100 my-1"></div>

              <button
                @click="logout"
                class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                role="menuitem"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>

          <!-- Menu burger (mobile) -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            :aria-expanded="mobileMenuOpen"
            aria-label="Menu principal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white px-4 py-3">
        <div class="space-y-1">
          <NuxtLink
            to="/"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accueil
          </NuxtLink>

          <NuxtLink
            to="/recettes"
            class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            @click="mobileMenuOpen = false"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recettes
            </div>
            <span v-if="recipes.length > 0" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {{ recipes.length }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/ingredients"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Ingrédients
          </NuxtLink>

          <NuxtLink
            to="/formulaire"
            class="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle recette
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import type { IRecipe } from '~/domain/models/Recipe'

const route = useRoute()
const router = useRouter()
const { logout: authLogout } = useAuth()
const { listRecipes } = useApi()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const user = ref({
  name: 'Marie Dubois',
  email: 'marie@example.com',
  initials: 'MD'
})

const recipes = ref<IRecipe[]>([])

const userName = computed(() => user.value?.name)
const userEmail = computed(() => user.value?.email)
const userInitials = computed(() => user.value?.initials || 'U')

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    userMenuOpen.value = false
  }
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

const logout = async () => {
  await authLogout()
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  await router.push('/auth/login')
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative') && !target.closest('button[aria-label*="Menu"]')) {
    mobileMenuOpen.value = false
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  void loadRecipes()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const loadRecipes = async () => {
  try {
    recipes.value = await listRecipes()
  } catch (error) {
    console.error('Erreur chargement recettes:', error)
    recipes.value = []
  }
}
</script>


