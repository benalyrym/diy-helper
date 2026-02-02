<template>
    <div class="basic-info-form">
        <div class="form-grid">
            <!-- Nom de la formule -->
            <div class="form-group">
                <label for="formula-name" class="form-label required">
                    Nom de la formule
                </label>
                <div class="input-with-icon">
                    <span class="input-icon">✏️</span>
                    <input
                        id="formula-name"
                        v-model="nameModel"
                        type="text"
                        placeholder="Ex: Crème hydratante réparatrice"
                        class="form-input"
                        :class="{ 'input-error': errors.name }"
                        required
                        @input="clearError('name')"
                    />
                </div>
                <div v-if="errors.name" class="error-message">
                    {{ errors.name }}
                </div>
                <div class="char-count">
                    {{ nameModel.length }}/100 caractères
                </div>
            </div>

            <!-- Volume -->
            <div class="form-group">
                <label for="formula-volume" class="form-label required">
                    Volume total (ml)
                </label>
                <div class="input-with-suffix">
                    <input
                        id="formula-volume"
                        v-model.number="volumeModel"
                        type="number"
                        min="1"
                        max="1000"
                        class="form-input"
                        :class="{ 'input-error': errors.volume }"
                        required
                    />
                    <span class="input-suffix">ml</span>
                </div>
                <div class="volume-presets">
                    <button type="button" @click="volumeModel = 30" class="preset-btn">
                        30ml
                    </button>
                    <button type="button" @click="volumeModel = 50" class="preset-btn">
                        50ml
                    </button>
                    <button type="button" @click="volumeModel = 100" class="preset-btn">
                        100ml
                    </button>
                </div>
            </div>
        </div>

        <!-- Type de peau -->
        <div class="form-group">
            <fieldset class="skin-type-fieldset">
                <legend class="form-label required">
                    Type de peau cible
                </legend>

                <div class="skin-type-grid">
                    <SkinTypeCard
                        v-for="profile in skinProfilesOptions"
                        :key="profile.value"
                        :profile="profile"
                        :selected="skinTypeModel === profile.value"
                        @select="skinTypeModel = profile.value"
                    />
                </div>
            </fieldset>
        </div>

        <!-- Conseils du profil sélectionné -->
        <SkinTypeTips
            v-if="selectedProfile"
            :profile="selectedProfile"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import SkinTypeCard from '../ui/SkinTypeCard.vue'
import SkinTypeTips from '../ui/SkinTypeTips.vue'

const props = defineProps({
    name: String,
    volume: Number,
    skinType: String,
    skinProfiles: Object,
    errors: Object
})

const emit = defineEmits([
    'update:name',
    'update:volume',
    'update:skin-type'
])

const nameModel = computed({
    get: () => props.name,
    set: (value) => emit('update:name', value)
})

const volumeModel = computed({
    get: () => props.volume,
    set: (value) => emit('update:volume', value)
})

const skinTypeModel = computed({
    get: () => props.skinType,
    set: (value) => emit('update:skin-type', value)
})

const skinProfilesOptions = computed(() => {
    return Object.entries(props.skinProfiles || {}).map(([key, value]) => ({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        description: value.description,
        icon: getSkinTypeIcon(key),
        color: getSkinTypeColor(key)
    }))
})

const selectedProfile = computed(() => {
    if (!props.skinType || !props.skinProfiles) return null
    return {
        ...props.skinProfiles[props.skinType],
        label: props.skinType.charAt(0).toUpperCase() + props.skinType.slice(1)
    }
})

const getSkinTypeIcon = (type) => {
    const icons = {
        seche: '🏜️',
        grasse: '💦',
        sensible: '🌡️',
        mixte: '⚖️',
        mature: '👵'
    }
    return icons[type] || '👤'
}

const getSkinTypeColor = (type) => {
    const colors = {
        seche: 'amber',
        grasse: 'green',
        sensible: 'red',
        mixte: 'purple',
        mature: 'pink'
    }
    return colors[type] || 'gray'
}

const clearError = (field) => {
    if (props.errors?.[field]) {
        // Émettre un événement pour effacer l'erreur
        emit('update:errors', { ...props.errors, [field]: undefined })
    }
}
</script>

<style scoped>
.basic-info-form {
    @apply space-y-6;
}

.form-grid {
    @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.form-group {
    @apply space-y-2;
}

.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-label.required::after {
    content: " *";
    @apply text-red-500;
}

.input-with-icon {
    @apply relative;
}

.input-icon {
    @apply absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400;
}

.input-with-suffix {
    @apply relative;
}

.input-suffix {
    @apply absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500;
}

.form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors;
}

.form-input.input-error {
    @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.error-message {
    @apply text-sm text-red-600 mt-1;
}

.char-count {
    @apply text-xs text-gray-500 text-right mt-1;
}

.volume-presets {
    @apply flex gap-2 mt-2;
}

.preset-btn {
    @apply px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded
    hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors;
}

.skin-type-fieldset {
    @apply border-0 p-0 m-0;
}

.skin-type-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2;
}
</style>