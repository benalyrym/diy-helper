<template>
    <div class="skin-type-tips" role="complementary" :aria-label="`Conseils pour peau ${profile.label}`">
        <div class="tips-header">
            <span class="tips-icon" aria-hidden="true">💡</span>
            <h4>Conseils pour peau {{ profile.label }}</h4>
        </div>

        <ul class="tips-list">
            <li v-for="(tip, index) in profile.tips" :key="index" class="tip-item">
                {{ tip }}
            </li>
        </ul>
    </div>
</template>

<script setup>
defineProps({
    profile: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.skin-type-tips {
    @apply bg-blue-50 rounded-lg p-4 border border-blue-200;
}

.tips-header {
    @apply flex items-center gap-2 mb-3;
}

.tips-icon {
    @apply text-blue-600 text-xl;
}

.tips-header h4 {
    @apply font-semibold text-blue-900;
}

.tips-list {
    @apply space-y-1;
}

.tip-item {
    @apply text-sm text-blue-800 flex items-start gap-2;
}

.tip-item::before {
    content: "•";
    @apply text-blue-500 mt-0.5 flex-shrink-0;
}
</style>