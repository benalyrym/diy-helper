<template>
    <div class="space-y-6">
        <div>
            <label class="block text-sm font-medium mb-1">Nom de la recette *</label>
            <input
                v-model="formData.name"
                placeholder="Ex: Pâtes Carbonara"
                class="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
                v-model="formData.description"
                placeholder="Décrivez votre recette..."
                rows="4"
                class="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
        </div>

        <!-- Afficher les ingrédients existants si on est en mode édition -->
        <div v-if="formData.ingredients && formData.ingredients.length > 0" class="mb-4">
            <label class="block text-sm font-medium mb-2">Ingrédients actuels :</label>
            <div class="bg-gray-50 p-3 rounded">
                <div v-for="(ing, idx) in formData.ingredients" :key="idx" class="flex justify-between items-center mb-1">
                    <span>{{ ing.name }} - {{ ing.quantity }} {{ ing.unit || '' }}</span>
                </div>
            </div>
        </div>

        <PhaseInput
            phase="Ingrédients"
            v-model:ingredients="newIngredients"
        />

        <div class="flex space-x-3 pt-4">
            <button
                @click="save"
                :disabled="!isValid || saving"
                class="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                <span v-if="saving">Enregistrement...</span>
                <span v-else>{{ isEditMode ? 'Mettre à jour' : 'Enregistrer la recette' }}</span>
            </button>

            <button
                @click="cancel"
                type="button"
                class="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300"
            >
                Annuler
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import PhaseInput from "./PhaseInput.vue"

const router = useRouter()
const emit = defineEmits(["save", "cancel"])

// Props pour les données initiales
const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
})

// Données du formulaire
const formData = ref({
    name: "",
    description: "",
    ingredients: []
})

// Nouveaux ingrédients ajoutés via PhaseInput
const newIngredients = ref([])
const saving = ref(false)
const errors = ref({})
const isEditMode = ref(false)

// Observer les changements de initialData
watch(() => props.initialData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        console.log('📥 RecipeForm receving initial data:', newData)
        isEditMode.value = true

        // Remplir le formulaire avec les données existantes
        formData.value = {
            name: newData.name || "",
            description: newData.description || "",
            ingredients: newData.ingredients?.map(ing => ({
                name: ing.name || "",
                quantity: ing.quantity || 0,
                unit: ing.unit || ""
            })) || []
        }

        // Pour l'édition, on montre les ingrédients existants mais on ne les modifie pas via PhaseInput
        // PhaseInput est utilisé pour ajouter de NOUVEAUX ingrédients
        newIngredients.value = []

        console.log('📥 Form data after update:', formData.value)
    }
}, { immediate: true })

// Validation
const isValid = computed(() => {
    return formData.value.name.trim().length > 0
})

const validateForm = () => {
    errors.value = {}

    if (!formData.value.name.trim()) {
        errors.value.name = "Le nom est requis"
        return false
    }

    return true
}

const save = async () => {
    if (!validateForm()) return

    saving.value = true

    // Combiner les ingrédients existants (en mode édition) avec les nouveaux
    const allIngredients = [
        ...formData.value.ingredients,
        ...newIngredients.value.filter(ing => ing.name.trim() !== "")
    ]

    emit("save", {
        name: formData.value.name,
        description: formData.value.description,
        ingredients: allIngredients,
        createdAt: isEditMode.value ? undefined : new Date().toISOString(),
        // Ajoute d'autres champs si nécessaire
    })

    saving.value = false
}

const cancel = () => {
    emit("cancel")

    // Si pas d'émission du parent, rediriger
    if (!emit.cancel) {
        router.push(isEditMode.value ? `/recette/${props.initialData.id}` : '/recettes')
    }
}
</script>