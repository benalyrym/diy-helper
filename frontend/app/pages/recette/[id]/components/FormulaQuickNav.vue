<template>
    <nav class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-100 sticky top-20 z-40">
        <div class="flex flex-wrap gap-2 justify-center">
            <a v-for="section in sections"
               :key="section.id"
               :href="`#${section.id}`"
               @click.prevent="$emit('scroll-to-section', section.id)"
               class="nav-link group"
               :aria-label="`Aller à la section ${section.name}`">
                <span class="text-lg mr-2 transition-transform group-hover:scale-110">{{ section.icon }}</span>
                <span>{{ section.name }}</span>
                <span class="nav-link-indicator" :class="{ 'active': activeSection === section.id }"></span>
            </a>
        </div>
    </nav>
</template>

<script setup>
defineProps({
    sections: {
        type: Array,
        default: () => []
    },
    activeSection: {
        type: String,
        default: 'description'
    }
})

defineEmits(['scroll-to-section'])
</script>

<style scoped>
.nav-link {
    @apply relative px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-all duration-300
    hover:border-gray-300;
}

.nav-link-indicator {
    @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-blue-600 rounded-t-full transition-all duration-300 opacity-0;
}

.nav-link-indicator.active {
    @apply w-3/4 opacity-100;
}
</style>