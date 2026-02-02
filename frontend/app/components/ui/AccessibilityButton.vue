<template>
    <button
        class="accessibility-button"
        :class="{ 'button-active': active }"
        @click="$emit('click')"
        type="button"
        :aria-pressed="active"
    >
        <span class="icon" aria-hidden="true">{{ icon }}</span>
        <span class="label">{{ label }}</span>
        <span class="sublabel">{{ sublabel }}</span>
    </button>
</template>

<script setup>
defineProps({
    icon: String,
    label: String,
    sublabel: String,
    active: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.accessibility-button {
    @apply flex flex-col items-center p-4 rounded-lg border border-gray-200
    bg-white hover:border-blue-300 hover:bg-blue-50
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.button-active {
    @apply border-blue-400 bg-blue-50;
}

.icon {
    @apply text-2xl mb-2;
}

.label {
    @apply font-medium text-gray-900 text-sm mb-1 text-center;
}

.sublabel {
    @apply text-xs text-gray-500;
}
</style>