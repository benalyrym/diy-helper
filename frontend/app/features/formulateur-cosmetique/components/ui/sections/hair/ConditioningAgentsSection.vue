<template>
  <section
      id="conditioning-agents"
      class="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      aria-labelledby="conditioning-agents-title"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg">
          <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>
        <h2 id="conditioning-agents-title" class="text-2xl font-bold text-gray-900">
          Agents conditionnants
        </h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
          Total : {{ agentsTotal.toFixed(1) }}%
        </div>
        <div class="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
          Score de glissement : {{ slipScore.toFixed(1) }}/10
        </div>
      </div>
    </div>

    <!-- Introduction -->
    <div class="mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm text-gray-700">
            Les agents conditionnants améliorent la maniabilité, le démêlage et la douceur des cheveux.
            <strong>Les agents cationiques (charge positive)</strong> se lient aux charges négatives des cheveux,
            offrant un meilleur effet conditionnant.
          </p>
        </div>
      </div>
    </div>

    <!-- Liste des agents conditionnants -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
          v-for="agent in conditioningAgents"
          :key="agent.id"
          :class="[
          'conditioning-agent-card p-5',
          agent.enabled ? 'conditioning-agent-card-selected' : 'conditioning-agent-card-default'
        ]"
          role="checkbox"
          :aria-checked="agent.enabled"
          tabindex="0"
          @click="toggleAgent(agent)"
          @keydown.enter="toggleAgent(agent)"
          @keydown.space.prevent="toggleAgent(agent)"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="font-bold text-gray-900 mb-1">
              {{ agent.name }}
            </div>
            <div class="text-xs text-gray-500 mb-2">
              {{ agent.inci }}
            </div>
            <div class="flex items-center gap-2 mb-3">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getChargeClass(agent.charge)
              ]">
                Charge : {{ getChargeLabel(agent.charge) }}
              </span>
              <span class="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                Glissement : {{ agent.slipScore }}/10
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-right">
              <div v-if="agent.enabled" class="text-lg font-bold text-teal-700">
                {{ agent.percent.toFixed(1) }}%
              </div>
              <div class="text-xs text-gray-500">
                {{ agent.min }}-{{ agent.max }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Contrôles pour agent sélectionné -->
        <div v-if="agent.enabled" class="space-y-3">
          <!-- Contrôle de pourcentage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">
                Concentration :
              </label>
              <div class="flex items-center gap-2">
                <button
                    @click.stop="adjustAgentPercent(agent.id, -0.1)"
                    :disabled="agent.percent <= agent.min"
                    class="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    type="button"
                    aria-label="Diminuer la concentration"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="text-sm font-bold text-teal-700 min-w-[50px] text-center">
                  {{ agent.percent.toFixed(1) }}%
                </span>
                <button
                    @click.stop="adjustAgentPercent(agent.id, 0.1)"
                    :disabled="agent.percent >= agent.max"
                    class="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    type="button"
                    aria-label="Augmenter la concentration"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <input
                type="range"
                v-model.number="agent.percent"
                @input="updateAgentPercent(agent.id, $event.target.value)"
                :min="agent.min"
                :max="agent.max"
                step="0.1"
                class="w-full h-2 bg-gradient-to-r from-teal-100 to-teal-300 rounded-lg appearance-none cursor-pointer"
                aria-label="Concentration de l'agent conditionnant"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>{{ agent.min }}%</span>
              <span>{{ agent.max }}%</span>
            </div>
          </div>

          <!-- Effets et bénéfices -->
          <div class="pt-3 border-t border-gray-200">
            <div class="text-sm text-gray-600">
              <p class="mb-2"><strong>Effets :</strong> {{ getEffects(agent) }}</p>
              <p><strong>Utilisation :</strong> {{ getUsageTips(agent) }}</p>
            </div>
          </div>
        </div>

        <!-- Description pour agent non sélectionné -->
        <div v-else class="pt-3 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            <p>{{ getAgentDescription(agent) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques et recommandations -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Statistiques -->
      <div class="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
        <h3 class="font-bold text-gray-900 mb-3">Statistiques des agents</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Agents sélectionnés :</span>
            <span class="font-medium text-gray-900">{{ selectedAgents.length }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Pourcentage total :</span>
            <span class="font-medium text-teal-700">{{ agentsTotal.toFixed(1) }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Moyenne par agent :</span>
            <span class="font-medium text-gray-900">
              {{ selectedAgents.length > 0 ? (agentsTotal / selectedAgents.length).toFixed(1) : '0' }}%
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Charge prédominante :</span>
            <span :class="[
              'font-medium rounded-full px-2 py-1 text-xs',
              getDominantChargeClass()
            ]">
              {{ getDominantChargeLabel() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recommandations -->
      <div class="p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-200">
        <h3 class="font-bold text-gray-900 mb-3">Recommandations</h3>
        <div class="space-y-2 text-sm text-gray-700">
          <p v-if="formData.applicationType === 'leave-in'">
            • <strong>Sans rinçage</strong> : Utilisez 1-2 agents cationiques (0.5-2% total) pour un effet durable
          </p>
          <p v-if="formData.applicationType === 'rinse'">
            • <strong>Avec rinçage</strong> : 2-3 agents (1-3% total) pour un conditionnement immédiat
          </p>
          <p v-if="formData.applicationType === 'mask'">
            • <strong>Masque</strong> : 2-4 agents (2-5% total) pour un traitement intensif
          </p>
          <p>• Les agents cationiques offrent le meilleur démêlage et adhérence</p>
          <p>• Évitez de dépasser 5% d'agents conditionnants au total</p>
          <p>• Pour cheveux fins : privilégiez les agents légers (Polyquaternium-7)</p>
          <p>• Pour cheveux épais/abîmés : Behentrimonium Chloride pour un effet intense</p>
        </div>
      </div>
    </div>

    <!-- Avertissement -->
    <div v-if="agentsTotal > 5" class="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-bold text-amber-800">Attention : Concentration élevée d'agents conditionnants</p>
          <p class="text-sm text-amber-700 mt-1">
            Un total supérieur à 5% peut rendre les cheveux lourds et créer des résidus.
            Réduisez le pourcentage ou choisissez moins d'agents.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  conditioningAgents: {
    type: Array,
    required: true
  },
  selectedAgents: {
    type: Array,
    required: true
  },
  agentsTotal: {
    type: Number,
    required: true
  },
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-conditioning-agents', 'toggle-agent'])

const toggleAgent = (agent) => {
  emit('toggle-agent', agent)
}

const updateAgentPercent = (agentId, percent) => {
  emit('update-conditioning-agents', agentId, { percent: parseFloat(percent) })
}

const adjustAgentPercent = (agentId, adjustment) => {
  const agent = props.conditioningAgents.find(a => a.id === agentId)
  if (!agent) return

  const newPercent = Math.max(
      agent.min,
      Math.min(agent.max, agent.percent + adjustment)
  )

  emit('update-conditioning-agents', agentId, { percent: newPercent })
}

// Méthodes helpers
const getChargeLabel = (charge) => {
  const labels = {
    'positive': 'Positive',
    'neutral': 'Neutre',
    'negative': 'Négative'
  }
  return labels[charge] || charge
}

const getChargeClass = (charge) => {
  const classes = {
    'positive': 'bg-blue-100 text-blue-800',
    'neutral': 'bg-gray-100 text-gray-800',
    'negative': 'bg-red-100 text-red-800'
  }
  return classes[charge] || 'bg-gray-100 text-gray-800'
}

const getEffects = (agent) => {
  const effects = {
    'behentrimonium': 'Démêlage intense, douceur durable, réduction des frisottis',
    'cetrimonium': 'Démêlage efficace, légèreté, brillance',
    'polyquaternium': 'Légèreté, volume, protection thermique',
    'hydroxyethylcellulose': 'Texture crémeuse, stabilité, légèreté',
    'guar_gum': 'Texture onctueuse, hydratation, démêlage doux'
  }
  return effects[agent.id] || 'Conditionnement général, démêlage'
}

const getUsageTips = (agent) => {
  const tips = {
    'behentrimonium': 'Idéal pour cheveux épais, abîmés ou crépus',
    'cetrimonium': 'Excellent pour cheveux fins à normaux',
    'polyquaternium': 'Parfait pour les sprays et lotions légères',
    'hydroxyethylcellulose': 'Agit comme épaississant et conditionneur léger',
    'guar_gum': 'Convient aux formulations sensorielles agréables'
  }
  return tips[agent.id] || 'Adapté à la plupart des types de cheveux'
}

const getAgentDescription = (agent) => {
  const descriptions = {
    'behentrimonium': 'Agent conditionnant cationique puissant, excellent démêlant pour cheveux difficiles',
    'cetrimonium': 'Agent conditionnant léger, idéal pour les formulations sans effet lourd',
    'polyquaternium': 'Polymère conditionnant qui dépose un film léger sur les cheveux',
    'hydroxyethylcellulose': 'Épaississant dérivé de cellulose avec propriétés conditionnantes légères',
    'guar_gum': 'Polysaccharide naturel qui améliore la texture et le démêlage'
  }
  return descriptions[agent.id] || 'Agent conditionnant standard'
}

const getDominantCharge = () => {
  if (props.selectedAgents.length === 0) return 'none'

  const charges = props.selectedAgents.reduce((acc, agent) => {
    acc[agent.charge] = (acc[agent.charge] || 0) + 1
    return acc
  }, {})

  return Object.keys(charges).reduce((a, b) => charges[a] > charges[b] ? a : b)
}

const getDominantChargeLabel = () => {
  const charge = getDominantCharge()
  if (charge === 'none') return 'Aucune'
  return getChargeLabel(charge)
}

const getDominantChargeClass = () => {
  const charge = getDominantCharge()
  if (charge === 'none') return 'bg-gray-100 text-gray-800'
  return getChargeClass(charge)
}

// Calcul du score de glissement
const slipScore = computed(() => {
  if (props.selectedAgents.length === 0) return 0

  const totalSlip = props.selectedAgents.reduce((total, agent) => {
    return total + (agent.slipScore * (agent.percent / 100))
  }, 0)

  return Math.min(10, totalSlip * 10)
})
</script>

