<template>
    <header class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-100">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <!-- Titre principal -->
            <div class="flex-1">
                <div class="flex items-center gap-4 mb-2">
                    <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg" role="img" aria-label="Icone formulation cosmétique">
                        <span class="text-2xl text-white">🧴</span>
                    </div>
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                            Formulateur Cosmétique Pro
                        </h1>
                        <p class="text-gray-600 mt-2 max-w-2xl">
                            Outil de formulation conforme au Règlement UE 1223/2009
                            <a href="https://eur-lex.europa.eu/eli/reg/2009/1223/oj"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="text-blue-600 hover:text-blue-800 underline ml-1 font-medium"
                               aria-label="Ouvrir le Règlement UE 1223/2009 dans un nouvel onglet">
                                Voir la réglementation
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Indicateur de conformité -->
            <div class="flex flex-col items-end gap-4">
                <div :class="[
          'px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-300',
          regulatoryStatus.isValid
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
            : 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
        ]"
                     role="status"
                     aria-live="polite"
                     :aria-label="regulatoryStatus.isValid ? 'Formule conforme aux réglementations européennes' : 'Formule non conforme, vérification nécessaire'">
          <span v-if="regulatoryStatus.isValid" class="flex items-center gap-2">
            <span class="text-xl">✅</span>
            <span>Conforme UE</span>
          </span>
                    <span v-else class="flex items-center gap-2">
            <span class="text-xl">⚠️</span>
            <span>Non conforme</span>
          </span>
                </div>

                <!-- Navigation rapide accessibilité -->
                <nav aria-label="Navigation des sections du formulaire" class="hidden lg:block">
                    <div class="flex flex-wrap gap-2">
                        <a v-for="section in sections"
                           :key="section.id"
                           :href="`#${section.id}`"
                           @click.prevent="$emit('scroll-to-section', section.id)"
                           class="text-xs px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                           :aria-label="`Aller à la section ${section.name}`">
                            {{ section.name }}
                        </a>
                    </div>
                </nav>
            </div>
        </div>

        <!-- Barre de progression -->
        <div class="mt-8">
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-700">Progression</span>
                    <div class="flex items-center gap-2">
                        <span class="text-lg font-bold text-blue-600">{{ completionPercentage }}%</span>
                        <span class="text-xs text-gray-500">complété</span>
                    </div>
                </div>
                <button @click="$emit('toggle-accessibility')"
                        class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-1"
                        aria-label="Options d'accessibilité">
                    <span>♿</span>
                    <span>Accessibilité</span>
                </button>
            </div>

            <div class="relative">
                <div class="w-full h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div class="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-1000 ease-out shadow-md"
                         :style="{ width: `${completionPercentage}%` }"
                         role="progressbar"
                         :aria-valuenow="completionPercentage"
                         aria-valuemin="0"
                         aria-valuemax="100"
                         :aria-valuetext="`${completionPercentage} pour cent complété`">
                    </div>
                </div>
                <!-- Points d'étape -->
                <div class="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-2">
                    <div v-for="(mark, index) in progressMarks"
                         :key="index"
                         :class="[
                 'w-3 h-3 rounded-full border-2 transition-all duration-300',
                 completionPercentage >= mark.percent ? 'bg-white border-blue-600 shadow-md' : 'bg-gray-300 border-gray-300'
               ]"
                         :title="`${mark.percent}% - ${mark.label}`">
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    completionPercentage: {
        type: Number,
        required: true
    },
    regulatoryStatus: {
        type: Object,
        required: true
    },
    sections: {
        type: Array,
        required: true
    }
})

defineEmits(['scroll-to-section', 'toggle-accessibility'])

const progressMarks = [
    { percent: 25, label: 'Informations de base' },
    { percent: 50, label: 'Phase aqueuse' },
    { percent: 75, label: 'Phase huileuse' },
    { percent: 100, label: 'Validation' }
]
</script>

