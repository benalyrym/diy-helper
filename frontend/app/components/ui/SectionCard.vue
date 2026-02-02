<template>
    <section
        :id="id"
        class="section-card"
        :class="{ 'with-warning': warning }"
        :aria-labelledby="`section-${id}`"
    >
        <div class="card-content">
            <div class="card-header">
                <div class="header-icon" :aria-hidden="true">
                    {{ icon }}
                </div>

                <div class="header-text">
                    <h2 :id="`section-${id}`" class="card-title">
                        {{ title }}
                        <span v-if="warning" class="warning-badge" aria-label="Attention">
              ⚠️
            </span>
                    </h2>

                    <p v-if="description" class="card-description">
                        {{ description }}
                    </p>
                </div>
            </div>

            <div class="card-body">
                <slot />
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '📄'
    },
    description: String,
    warning: Boolean
})
</script>

<style scoped>
.section-card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200
    transition-all duration-300 hover:shadow-md
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2;
    scroll-margin-top: 1rem;
}

.section-card.with-warning {
    @apply border-orange-300 hover:border-orange-400;
}

.card-content {
    @apply p-5 md:p-6;
}

.card-header {
    @apply flex items-start gap-4 mb-6;
}

.header-icon {
    @apply flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600 text-2xl;
}

.header-text {
    @apply flex-1 min-w-0;
}

.card-title {
    @apply text-xl font-bold text-gray-900 flex items-center gap-2;
}

.warning-badge {
    @apply text-orange-500;
}

.card-description {
    @apply mt-1 text-gray-600;
}

.card-body {
    @apply space-y-4;
}

/* Réduire les animations si l'utilisateur le préfère */
@media (prefers-reduced-motion: reduce) {
    .section-card {
        transition: none;
    }
}
</style>