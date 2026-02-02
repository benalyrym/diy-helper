<template>
    <label
        class="preservative-option-compact"
        :class="{ 'compact-selected': isSelected }"
        :for="`preservative-${preservative.id}`"
    >
        <input
            :id="`preservative-${preservative.id}`"
            type="radio"
            :value="preservative.id"
            :checked="isSelected"
            @change="$emit('select', preservative.id)"
            class="sr-only"
        />

        <div class="compact-content">
      <span class="compact-icon" :aria-hidden="true">
        {{ preservative.icon }}
      </span>
            <div class="compact-text">
                <span class="compact-name">{{ preservative.name }}</span>
                <span class="compact-dosage">{{ preservative.recommendation }}</span>
            </div>
            <div v-if="isSelected" class="compact-check" aria-hidden="true">
                ✓
            </div>
        </div>
    </label>
</template>

<script setup>
const props = defineProps({
    preservative: Object,
    selected: Boolean
})

const emit = defineEmits(['select'])

const isSelected = computed(() => props.selected)
</script>

<style scoped>
.preservative-option-compact {
    @apply border-2 rounded-lg p-3 cursor-pointer transition-colors
    hover:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500;
}

.compact-selected {
    @apply border-blue-500 bg-blue-50;
}

.compact-content {
    @apply flex items-center gap-3;
}

.compact-icon {
    @apply text-xl;
}

.compact-text {
    @apply flex-1 flex flex-col;
}

.compact-name {
    @apply font-medium text-gray-900;
}

.compact-dosage {
    @apply text-sm text-gray-500;
}

.compact-check {
    @apply text-blue-600 font-bold;
}
</style>