<template>
    <div class="p-8 max-w-md mx-auto">
        <h1 class="text-2xl font-bold">Login</h1>
        <input
            v-model="email"
            placeholder="Email"
            class="border p-2 w-full"
        />
        <input
            v-model="pass"
            type="password"
            placeholder="Password"
            class="border p-2 w-full"
        />
        <button
            @click="onLogin"
            class="bg-blue-600 text-white p-2 rounded"
        >
            Login
        </button>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuth } from "../../composables/useAuth.js"
import { navigateTo } from "nuxt/app"

const email = ref("")
const pass = ref("")
const error = ref("")
const { login } = useAuth()

async function onLogin() {
    try {
        await login(email.value, pass.value)
        await navigateTo("/")
    } catch (err) {
        error.value = err?.data?.message || "Invalid credentials"
    }
}
</script>
