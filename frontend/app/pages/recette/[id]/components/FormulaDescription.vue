<template>
    <section id="description"
             class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 section-card">
        <div class="flex items-start gap-4 mb-8">
            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg" aria-hidden="true">
                <span class="text-2xl text-white">📝</span>
            </div>
            <div class="flex-1">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Description de la formule</h2>
                <p class="text-gray-600">Informations générales et caractéristiques principales</p>
            </div>
        </div>

        <!-- Contenu -->
        <div class="space-y-8">
            <!-- Description principale -->
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="text-blue-600">📋</span>
                    <span>Résumé de la formule</span>
                </h3>
                <div class="prose max-w-none">
                    <p class="text-gray-700 whitespace-pre-line leading-relaxed">
                        {{ formula.description || 'Aucune description fournie pour cette formule.' }}
                    </p>
                </div>
            </div>

            <!-- Caractéristiques -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                    <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span class="text-purple-600">🎯</span>
                        <span>Caractéristiques principales</span>
                    </h4>
                    <ul class="space-y-3">
                        <li class="flex items-start gap-3">
                            <span class="text-purple-600 mt-1">•</span>
                            <div>
                                <span class="font-medium text-gray-900">Type de formule:</span>
                                <span class="text-gray-700 ml-2 capitalize">{{ formula.type || 'skincare' }}</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="text-purple-600 mt-1">•</span>
                            <div>
                                <span class="font-medium text-gray-900">Volume total:</span>
                                <span class="text-gray-700 ml-2">{{ formula.volume }} ml</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="text-purple-600 mt-1">•</span>
                            <div>
                                <span class="font-medium text-gray-900">Type de peau cible:</span>
                                <span class="text-gray-700 ml-2 capitalize">{{ formula.skinType }}</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="text-purple-600 mt-1">•</span>
                            <div>
                                <span class="font-medium text-gray-900">Système de conservation:</span>
                                <span class="text-gray-700 ml-2">{{ getPreservativeSystem() }}</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                    <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span class="text-emerald-600">📊</span>
                        <span>Statistiques techniques</span>
                    </h4>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-emerald-700">{{ formula.ingredients.length }}</div>
                                <div class="text-sm text-gray-600">Ingrédients totaux</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-700">{{ actives.length }}</div>
                                <div class="text-sm text-gray-600">Actifs cosmétiques</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                                    {{ heTotal.toFixed(2) }}%
                                </div>
                                <div class="text-sm text-gray-600">Total HE</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-700">{{ essentialOils.length }}</div>
                                <div class="text-sm text-gray-600">Huiles essentielles</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recommandations pour le type de peau -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="text-amber-600">💡</span>
                    <span>Recommandations pour peau {{ formula.skinType }}</span>
                </h4>
                <div class="prose max-w-none">
                    <ul class="space-y-2">
                        <li v-for="(tip, index) in getSkinTypeTips(formula.skinType)"
                            :key="index"
                            class="flex items-start gap-2 text-gray-700">
                            <span class="text-amber-500 mt-1">✓</span>
                            <span>{{ tip }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    formula: {
        type: Object,
        required: true
    },
    actives: {
        type: Array,
        default: () => []
    },
    essentialOils: {
        type: Array,
        default: () => []
    },
    heTotal: {
        type: Number,
        default: 0
    }
})

// Types de peau avec descriptions et conseils
const skinTypes = {
    'seche': {
        description: 'Peau déshydratée, besoin en nutrition élevé',
        tips: [
            'Privilégiez les huiles riches (avocat, amande douce)',
            'Utilisez des actifs hydratants (acide hyaluronique, B5)',
            'Évitez les textures trop légères',
            'Incorporez des émollients nourrissants',
            'Protégez la barrière cutanée avec des céramides'
        ]
    },
    'grasse': {
        description: 'Sécrétion sébacée importante, pores dilatés',
        tips: [
            'Optez pour des huiles légères (jojoba, noisette)',
            'Utilisez des actifs séborégulateurs (acide salicylique, niacinamide)',
            'Privilégiez les textures fluides et non comédogènes',
            'Évitez les formules trop riches',
            'Incorporez des ingrédients matifiants'
        ]
    },
    'sensible': {
        description: 'Réactivité cutanée élevée, tolérance limitée',
        tips: [
            'Choisissez des ingrédients apaisants (camomille, calendula)',
            'Limitez le nombre d\'actifs à maximum 2-3',
            'Évitez les parfums, alcools et ingrédients irritants',
            'Testez toujours la formule sur une petite zone avant usage',
            'Privilégiez les textures simples et minimalistes'
        ]
    },
    'mixte': {
        description: 'Combinaison de zones sèches et grasses',
        tips: [
            'Équilibrez hydratation et légèreté',
            'Ciblez les zones avec des actifs spécifiques',
            'Utilisez des textures adaptées aux deux types (crèmes-gels)',
            'Évitez les formules trop lourdes sur la zone T',
            'Appliquez différemment selon les zones du visage'
        ]
    },
    'mature': {
        description: 'Besoins anti-âge et restructuration',
        tips: [
            'Intégrez des actifs anti-âge (vitamines C et E, rétinol)',
            'Utilisez des huiles régénérantes (rose musquée, argan)',
            'Privilégiez les textures nourrissantes et onctueuses',
            'Incorporez des antioxydants et des peptides',
            'Protégez avec des filtres UV si usage diurne'
        ]
    }
}

// Fonctions utilitaires
const getPreservativeSystem = () => {
    const preservative = props.formula?.ingredients?.find((ing) =>
        ing.type === 'preservative' || ing.name.includes('Cosgard') || ing.name.includes('Conservateur')
    )
    return preservative?.name || 'Non spécifié'
}

const getSkinTypeTips = (skinType) => {
    return skinTypes[skinType]?.tips || ['Aucune recommandation spécifique']
}
</script>

<style scoped>
.section-card {
    animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.prose {
    color: #374151;
}

.prose ul {
    list-style-type: none;
    padding-left: 0;
}

.prose li {
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .section-card {
        padding: 1.5rem;
    }
}
</style>