<template>
    <footer class="mt-12 pt-8 border-t border-gray-200">
        <div class="text-center space-y-4">
            <p class="text-sm text-gray-500 max-w-3xl mx-auto">
                <span class="font-medium">Avertissement important :</span>
                Cet outil fournit des recommandations techniques basées sur le Règlement UE 1223/2009.
                Il ne remplace pas l'expertise d'un toxicologue ou la validation finale par un Responsable de la Conformité (PRC).
                Toute commercialisation nécessite une évaluation de sécurité complète par un expert qualifié.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
                <span>Formule ID: {{ formula.id }}</span>
                <span class="hidden sm:inline">•</span>
                <span>Créée le: {{ formatDate(formula.createdAt) }}</span>
                <span class="hidden sm:inline">•</span>
                <span>Dernière modification: {{ formatDate(formula.updatedAt) }}</span>
            </div>
            <div class="text-xs text-gray-400">
                Version de l'analyse: {{ formula.compliance?.version || '1.0' }} •
                © {{ new Date().getFullYear() }} Formulateur Cosmétique Pro
            </div>
        </div>
    </footer>
</template>

<script setup>
defineProps({
    formula: {
        type: Object,
        required: true
    }
})

const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}
</script>