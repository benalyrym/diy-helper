<template>
  <section id="preservatives"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">🧪</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Système de conservation</h2>
        <p class="text-gray-600">Assurez la stabilité microbiologique selon le Règlement UE</p>
        <div class="mt-2 text-sm text-purple-600 font-medium flex items-center gap-1">
          <span>⚠️</span>
          <span>La conservation est obligatoire pour toute formule contenant de l'eau</span>
        </div>
      </div>
    </div>

    <div class="space-y-8">
      <div>
        <fieldset class="space-y-4">
          <legend class="label required flex items-center gap-2">
            Type de système de conservation *
            <span class="text-xs font-normal text-gray-500">(Sélectionnez une seule option)</span>
          </legend>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup">
            <label v-for="preservative in preservativeSystems"
                   :key="preservative.id"
                   :class="[
                     'preservative-card transform transition-all duration-300 hover:-translate-y-1',
                     formData.preservativeSystem === preservative.id
                       ? 'preservative-card-selected ring-2 ring-offset-2 ring-purple-500 shadow-xl'
                       : 'preservative-card-default hover:shadow-md'
                   ]">
              <input type="radio"
                     v-model="formData.preservativeSystem"
                     :value="preservative.id"
                     class="sr-only"
                     required
                     :aria-labelledby="`preservative-label-${preservative.id}`">

              <div class="p-4 h-full flex flex-col">
                <div class="mb-4">
                  <span class="text-3xl" :aria-label="preservative.iconLabel">
                    {{ preservative.icon }}
                  </span>
                </div>

                <div class="flex-1">
                  <h3 :id="`preservative-label-${preservative.id}`"
                      class="font-bold text-gray-900 text-lg mb-2">
                    {{ preservative.name }}
                  </h3>
                  <p class="text-sm text-gray-600 mb-3">
                    {{ preservative.description }}
                  </p>

                  <ul class="space-y-1 mb-4">
                    <li v-for="(feature, idx) in preservative.features.slice(0, 2)"
                        :key="idx"
                        class="text-xs text-gray-500 flex items-start gap-1">
                      <span class="text-purple-500 mt-1">•</span>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <div class="pt-4 border-t border-gray-200">
                  <div class="text-sm">
                    <span class="text-gray-700 font-medium">Dosage:</span>
                    <span class="text-purple-600 font-bold ml-1">{{ preservative.recommendation }}</span>
                  </div>
                  <div v-if="preservative.max" class="text-xs text-gray-500">
                    Max: {{ preservative.max }}%
                  </div>
                </div>
              </div>

              <div v-if="formData.preservativeSystem === preservative.id"
                   class="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-white text-sm font-bold">✓</span>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

      <div v-if="formData.preservativeSystem === 'cosgard'"
           class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300 shadow-lg">
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="lg:w-1/3">
            <div class="sticky top-24">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-3 bg-purple-100 rounded-xl">
                  <span class="text-2xl text-purple-600">🛡️</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-xl">Cosgard</h3>
                  <p class="text-sm text-gray-600">Conservateur large spectre</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">INCI</h4>
                  <p class="text-sm font-mono text-gray-700 bg-white p-3 rounded-lg border">
                    Benzyl Alcohol, Dehydroacetic Acid
                  </p>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Conformité UE</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li class="flex items-center gap-2">
                      <span class="text-green-500">✓</span>
                      <span>Annexe V du Règlement UE 1223/2009</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-500">✓</span>
                      <span>Max autorisé: 1.0% (en mélange)</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-500">✓</span>
                      <span>pH stable: 3-8</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:w-2/3">
            <div class="space-y-6">
              <div>
                <label for="cosgard-percent" class="label required">
                  Concentration de Cosgard *
                </label>
                <div class="flex flex-col md:flex-row gap-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-4">
                      <div class="relative flex-1">
                        <input id="cosgard-percent"
                               v-model.number="formData.cosgardPercent"
                               type="number"
                               min="0.5"
                               max="1.0"
                               step="0.1"
                               :class="[
                                 'input-field pr-12 text-center text-lg',
                                 formData.cosgardPercent < 0.5 || formData.cosgardPercent > 1.0
                                   ? 'input-error'
                                   : 'input-valid'
                               ]"
                               required
                               aria-required="true"
                               aria-describedby="cosgard-help">
                        <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">%</span>
                      </div>
                      <div class="text-center">
                        <span class="block text-2xl font-bold text-purple-600">{{ grams(formData.cosgardPercent) }}</span>
                        <span class="text-sm text-gray-500">grammes</span>
                      </div>
                    </div>

                    <div class="mt-6 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Minimum requis: 0.5%</span>
                        <span class="font-bold text-purple-600">{{ formData.cosgardPercent }}%</span>
                        <span class="text-gray-600">Maximum autorisé: 1.0%</span>
                      </div>
                      <input type="range"
                             v-model.number="formData.cosgardPercent"
                             min="0.5"
                             max="1.0"
                             step="0.05"
                             class="w-full h-3 bg-gradient-to-r from-pink-200 via-purple-400 to-pink-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-xl">

                      <div class="flex justify-between text-xs text-gray-500 px-2">
                        <span :class="formData.cosgardPercent < 0.6 ? 'font-bold text-purple-600' : ''">Faible</span>
                        <span :class="formData.cosgardPercent >= 0.6 && formData.cosgardPercent <= 0.8 ? 'font-bold text-green-600' : ''">Optimal</span>
                        <span :class="formData.cosgardPercent > 0.8 ? 'font-bold text-purple-600' : ''">Élevé</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex md:flex-col gap-2">
                    <button type="button"
                            @click="formData.cosgardPercent = 0.5"
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                              formData.cosgardPercent === 0.5
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            ]">
                      Min (0.5%)
                    </button>
                    <button type="button"
                            @click="formData.cosgardPercent = 0.7"
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                              formData.cosgardPercent === 0.7
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            ]">
                      Optimal (0.7%)
                    </button>
                    <button type="button"
                            @click="formData.cosgardPercent = 1.0"
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                              formData.cosgardPercent === 1.0
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            ]">
                      Max (1.0%)
                    </button>
                  </div>
                </div>

                <p id="cosgard-help" class="help-text mt-2">
                  Plage conforme UE: 0.5-1.0%. Recommandé: 0.6-0.8% pour la plupart des formules.
                </p>
              </div>

              <div class="bg-white rounded-xl p-5 border border-purple-200">
                <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span class="text-purple-600">📋</span>
                  Mode d'emploi Cosgard
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 class="font-medium text-gray-800 mb-2">Précautions d'utilisation</h5>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li class="flex items-start gap-2">
                        <span class="text-purple-500 mt-1">•</span>
                        <span>Ajouter à la phase aqueuse à température ambiante (20-25°C)</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-purple-500 mt-1">•</span>
                        <span>Mélanger jusqu'à dissolution complète</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-purple-500 mt-1">•</span>
                        <span>Éviter les températures supérieures à 40°C</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800 mb-2">Compatibilités</h5>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li class="flex items-start gap-2">
                        <span class="text-green-500 mt-1">✓</span>
                        <span>Compatible avec la plupart des émulsifiants</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-green-500 mt-1">✓</span>
                        <span>Stable avec les tensioactifs anioniques</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-purple-500 mt-1">⚠️</span>
                        <span>Limiter les huiles essentielles à 1% max</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-300">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <span class="text-3xl text-blue-600">🔬</span>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-xl mb-3">Pourquoi la conservation est-elle cruciale ?</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-2">Exigences réglementaires (UE 1223/2009)</h4>
                <ul class="text-sm text-gray-600 space-y-2">
                  <li class="flex items-start gap-2">
                    <span class="text-purple-500 font-bold">§1</span>
                    <span>Tout produit cosmétique contenant de l'eau doit être protégé contre la contamination microbienne</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-purple-500 font-bold">§2</span>
                    <span>Le système de conservation doit être efficace pendant la durée de vie du produit</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-purple-500 font-bold">§3</span>
                    <span>Les conservateurs doivent être listés dans l'Annexe V</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-2">Bonnes pratiques</h4>
                <ul class="text-sm text-gray-600 space-y-2">
                  <li class="flex items-start gap-2">
                    <span class="text-green-500">✓</span>
                    <span>Utiliser du matériel stérilisé (alcool 70° minimum)</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500">✓</span>
                    <span>Conserver au frais, à l'abri de la lumière et de l'humidité</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500">✓</span>
                    <span>Durée de vie: 3-6 mois pour les formules maison</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500">✓</span>
                    <span>Test de stabilité recommandé (challenge test)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  preservativeSystems: { type: Array, required: true }
})

const volume = computed(() => props.formData?.volume || 100)

const grams = (percent) => {
  return Number(((volume.value * percent) / 100).toFixed(2))
}
</script>

