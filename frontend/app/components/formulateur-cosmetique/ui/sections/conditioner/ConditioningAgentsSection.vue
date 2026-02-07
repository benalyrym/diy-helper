<template>
  <section id="conditioning-agents"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">✨</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Agents démêlants & Épaississants</h2>
        <p class="text-gray-600">Sélectionnez les agents de soin et contrôle de la viscosité</p>
      </div>
    </div>

    <!-- Agents démêlants -->
    <div class="mb-8">
      <h3 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
        <span class="text-emerald-600">💫</span>
        Agents démêlants
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="agent in conditioningAgents"
             :key="agent.name"
             :class="[
               'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1',
               agent.selected ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-md' : 'border-gray-200 hover:border-emerald-200'
             ]">
          <div class="flex items-start gap-3">
            <div class="flex items-center h-6 pt-1">
              <input :id="`agent-${agent.name}`"
                     type="checkbox"
                     v-model="agent.selected"
                     class="h-5 w-5 rounded border-2 border-gray-300 checked:border-emerald-600 checked:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            </div>
            <div class="flex-1">
              <label :for="`agent-${agent.name}`"
                     class="font-bold text-gray-900 cursor-pointer hover:text-emerald-600">
                {{ agent.name }}
              </label>
              <p class="text-xs text-gray-500 mt-1 mb-2">{{ agent.description }}</p>

              <div v-if="agent.selected" class="mt-3 space-y-2">
                <label class="block text-xs font-medium text-gray-700">
                  Dosage (%)
                </label>
                <div class="flex items-center gap-2">
                  <input type="number"
                         v-model.number="agent.percent"
                         :min="agent.min"
                         :max="agent.max"
                         step="0.1"
                         class="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <span class="text-xs text-gray-500">{{ grams(agent.percent) }} g</span>
                </div>
              </div>

              <div class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span v-for="prop in agent.properties"
                        :key="prop"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {{ prop }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Épaississants -->
    <div>
      <h3 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
        <span class="text-blue-600">🌊</span>
        Épaississants naturels
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="thickener in thickeners"
             :key="thickener.name"
             :class="[
               'rounded-lg p-4 border-2 transition-all duration-300 transform hover:-translate-y-1',
               formData.thickener === thickener.name ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-md' : 'border-gray-200 hover:border-blue-200'
             ]"
             @click="formData.thickener = thickener.name">
          <div class="flex items-start gap-3">
            <div class="flex items-center h-6 pt-1">
              <input :id="`thickener-${thickener.name}`"
                     type="radio"
                     v-model="formData.thickener"
                     :value="thickener.name"
                     class="h-5 w-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            </div>
            <div class="flex-1">
              <label :for="`thickener-${thickener.name}`"
                     class="font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                {{ thickener.name }}
              </label>
              <p class="text-xs text-gray-500 mt-1 mb-2">{{ thickener.description }}</p>

              <div class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span v-for="prop in thickener.properties"
                        :key="prop"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                    {{ prop }}
                  </span>
                </div>
              </div>

              <div v-if="formData.thickener === thickener.name" class="mt-3 space-y-2">
                <label class="block text-xs font-medium text-gray-700">
                  Concentration (%)
                </label>
                <div class="flex items-center gap-2">
                  <input type="number"
                         v-model.number="formData.thickenerPercent"
                         :min="thickener.min"
                         :max="thickener.max"
                         step="0.1"
                         class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <span class="text-xs text-gray-500">{{ grams(formData.thickenerPercent) }} g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé des agents -->
    <div v-if="selectedConditioningAgents.length > 0 || formData.thickener"
         class="mt-8 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-300">
      <h3 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
        <span class="text-emerald-600">📊</span>
        Résumé des agents
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="selectedConditioningAgents.length > 0">
          <h4 class="font-medium text-gray-900 mb-3">Agents démêlants sélectionnés</h4>
          <div class="space-y-2">
            <div v-for="agent in selectedConditioningAgents"
                 :key="agent.name"
                 class="flex justify-between items-center p-2 bg-white/80 rounded-lg">
              <span class="text-sm font-medium">{{ agent.name }}</span>
              <span class="font-bold text-emerald-700">{{ agent.percent }}%</span>
            </div>
            <div class="pt-2 border-t border-emerald-200">
              <div class="flex justify-between font-bold">
                <span>Total démêlants</span>
                <span class="text-emerald-700">{{ totalConditioningPercent.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="formData.thickener">
          <h4 class="font-medium text-gray-900 mb-3">Épaississant sélectionné</h4>
          <div class="p-4 bg-white/80 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold">{{ formData.thickener }}</span>
              <span class="text-blue-700 font-bold">{{ formData.thickenerPercent }}%</span>
            </div>
            <p class="text-sm text-gray-600">
              {{ grams(formData.thickenerPercent) }} g pour {{ formData.volume }}ml
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  conditioningAgents: { type: Array, required: true },
  thickeners: { type: Array, required: true },
  formData: { type: Object, required: true },
  selectedConditioningAgents: { type: Array, required: true },
  totalConditioningPercent: { type: Number, required: true },
  grams: { type: Function, required: true }
})
</script>
