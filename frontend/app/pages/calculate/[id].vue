<template>
    <div class="p-8">
        <h1 class="text-xl font-bold">Calcul Ingrédients</h1>

        <label>
            Volume total (ml):
            <input v-model.number="volume" type="number" class="border p-2"/>
        </label>

        <button
            @click="onCalc"
            class="bg-blue-600 text-white px-3 py-1 rounded"
        >
            Calculer
        </button>

        <ul class="mt-4 space-y-2">
            <li v-for="i in results" :key="i.name">
                {{ i.name }} : {{ i.quantity.toFixed(2) }} ml
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { calculateIngredients } from "~/application/services/RecipeCalculator"
import {useApi} from "../../composables/useApi.js";
import {onMounted, ref} from "vue";
import {useRoute} from "nuxt/app";

const route = useRoute()
const volume = ref(100)
const recipe = ref(null)
const results = ref([])



const { getRecipe } = useApi()

onMounted(async () => {
    const id = route.params.id
    if (!id) return
    recipe.value = await getRecipe(id)
})

const onCalc = () => {
    results.value = calculateIngredients(
        recipe.value.ingredients,
        volume.value
    )
}
</script>
