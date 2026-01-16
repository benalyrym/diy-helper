<template>
    <div class="p-8  mx-auto">
        <h1 class="text-2xl font-bold">Signup</h1>
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
            @click="onSignup"
            class="bg-green-600 text-white p-2 rounded"
        >
            Signup
        </button>
    </div>
</template>

<script setup>
import {useAuth} from "../../composables/useAuth.js";
import {navigateTo} from "nuxt/app";

const email = ref("")
const pass = ref("")
const { signup } = useAuth()

async function onSignup() {
    await signup(email.value, pass.value)
    navigateTo("/auth/login")
}
</script>
