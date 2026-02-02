<template>
    <label
        class="skin-type-card"
        :class="{
      'card-selected': selected,
      [`card-${profile.color}`]: true
    }"
        :for="`skin-type-${profile.value}`"
    >
        <input
            :id="`skin-type-${profile.value}`"
            type="radio"
            :value="profile.value"
            :checked="selected"
            @change="$emit('select', profile.value)"
            class="sr-only"
        />

        <div class="card-content">
            <div class="card-header">
        <span class="card-icon" :aria-hidden="true">
          {{ profile.icon }}
        </span>
                <h3 class="card-title">
                    {{ profile.label }}
                </h3>
            </div>

            <p class="card-description">
                {{ profile.description }}
            </p>

            <div class="card-indicator" v-if="selected">
                <span aria-hidden="true">✓</span>
            </div>
        </div>
    </label>
</template>

<script setup>
defineProps({
    profile: {
        type: Object,
        required: true
    },
    selected: Boolean
})

defineEmits(['select'])
</script>

<style scoped>
.skin-type-card {
    @apply relative border-2 rounded-lg p-4 cursor-pointer
    transition-all duration-300 hover:shadow-md
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2;
}

.skin-type-card.card-selected {
    @apply border-blue-500 bg-blue-50;
}

.card-content {
    @apply space-y-2;
}

.card-header {
    @apply flex items-center gap-3;
}

.card-icon {
    @apply text-2xl;
}

.card-title {
    @apply font-medium text-gray-900 capitalize;
}

.card-description {
    @apply text-sm text-gray-600;
}

.card-indicator {
    @apply absolute top-2 right-2 w-6 h-6 bg-blue-500
    rounded-full flex items-center justify-center;
}

.card-indicator span {
    @apply text-white text-sm;
}

/* Couleurs selon le type de peau */
.card-amber {
    @apply hover:border-amber-300;
}

.card-green {
    @apply hover:border-green-300;
}

.card-red {
    @apply hover:border-red-300;
}

.card-purple {
    @apply hover:border-purple-300;
}

.card-pink {
    @apply hover:border-pink-300;
}
</style>