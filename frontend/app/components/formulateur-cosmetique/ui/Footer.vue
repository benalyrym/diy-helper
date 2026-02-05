<template>
    <footer class="mt-12 pt-8 border-t border-gray-200">
        <div class="text-center space-y-3">
            <p class="text-sm text-gray-500 max-w-3xl mx-auto">
                <span class="font-medium">Avertissement important :</span>
                Cet outil fournit des recommandations techniques basées sur le Règlement UE 1223/2009.
                Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable de la Conformité (PRC).
                Toute commercialisation nécessite une évaluation de sécurité complète par un expert qualifié.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
                <span>Version 2.2 • Conforme UE 1223/2009</span>
                <span>•</span>
                <span>Dernière mise à jour : {{ currentDate }}</span>
                <span>•</span>
                <span>© 2024 Formulateur Cosmétique Pro</span>
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