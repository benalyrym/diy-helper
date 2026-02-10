<template>
    <div class="border p-4 mb-4">
        <h3 class="font-bold">{{ phase }}</h3>
        <div v-for="(ing, idx) in ingredients" :key="idx" class="flex gap-2">
            <input
                v-model="ing.name"
                class="border p-1 flex-1"
                placeholder="Ingrédient"
            />
            <input
                v-model.number="ing.ratio"
                type="number"
                class="border p-1 w-20"
                placeholder="Ratio"
            />
            <input
                v-model.number="ing.density"
                type="number"
                class="border p-1 w-24"
                placeholder="Densité"
            />
        </div>
        <button
            @click="addIngredient"
            class="bg-blue-600 text-white px-3 py-1 rounded"
        >
            + Ingrédient
        </button>
    </div>
</template>

<script setup lang="ts">
type Ingredient = {
    name: string
    ratio: number
    density: number
}

const props = defineProps<{
    phase: string
    ingredients: Ingredient[]
}>()

const emit = defineEmits<{
    (event: "update:ingredients", value: Ingredient[]): void
}>()

const addIngredient = () => {
    emit("update:ingredients", [
        ...props.ingredients,
        { name: "", ratio: 0, density: 1 },
    ])
}
</script>


