<template>
    <a href="#main-content" class="skip-to-content">
        Passer au contenu principal
    </a>
</template>

<script setup>
// Ce composant permet de sauter directement au contenu principal pour les utilisateurs de lecteurs d'écran
</script>

<style scoped>
.skip-to-content {
    @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
    bg-blue-600 text-white px-4 py-3 rounded-lg z-50
    font-medium text-sm shadow-lg;
}
</style>