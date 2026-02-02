<template>
    <footer class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>Â© 2024 Skincare Formulator Pro - Tous droits rÃ©servÃ©s</p>
            <div class="text-center text-sm text-gray-500">
                <p>
                    Cet outil fournit des recommandations techniques basÃ©es sur le RÃ¨glement UE 1223/2009.
                    Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable de la ConformitÃ©.
                </p>
                <p class="mt-2">
                    Version 2.0 â€¢ DerniÃ¨re mise Ã  jour: {{ currentDate }}
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
defineProps({
    currentDate: {
        type: String,
        required: true
    }
})
</script>
