<template>
  <section id="preservatives"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">🛡️</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Système de conservation</h2>
        <p class="text-gray-600">Assurez la stabilité microbiologique selon le Règlement UE</p>
        <div class="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span>
          <span>La conservation est obligatoire pour toute formule contenant de l'eau</span>
        </div>
      </div>
    </div>

    <!-- Sélection du type -->
    <div class="space-y-6">
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
                     ? 'preservative-card-selected ring-2 ring-offset-2 ring-red-500 shadow-xl'
                     : 'preservative-card-default hover:shadow-md'
                 ]">
            <input type="radio"
                   v-model="formData.preservativeSystem"
                   :value="preservative.id"
                   class="sr-only"
                   required
                   :aria-labelledby="`preservative-label-${preservative.id}`">

            <div class="p-4 h-full flex flex-col">
              <!-- Icone -->
              <div class="mb-4">
                <span class="text-3xl" :aria-label="preservative.iconLabel">
                  {{ preservative.icon }}
                </span>
              </div>

              <!-- Nom et description -->
              <div class="flex-1">
                <h3 :id="`preservative-label-${preservative.id}`"
                    class="font-bold text-gray-900 text-lg mb-2">
                  {{ preservative.name }}
                </h3>
                <p class="text-sm text-gray-600 mb-3">
                  {{ preservative.description }}
                </p>

                <!-- Caractéristiques -->
                <ul class="space-y-1 mb-4">
                  <li v-for="(feature, idx) in preservative.features.slice(0, 2)"
                      :key="idx"
                      class="text-xs text-gray-500 flex items-start gap-1">
                    <span class="text-red-500 mt-1">•</span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Plage de dosage -->
              <div class="pt-4 border-t border-gray-200">
                <div class="text-sm">
                  <span class="text-gray-700 font-medium">Dosage:</span>
                  <span class="text-red-600 font-bold ml-1">{{ preservative.recommendation }}</span>
                </div>
                <div v-if="preservative.max" class="text-xs text-gray-500">
                  Max: {{ preservative.max }}%
                </div>
              </div>
            </div>

            <!-- Indicateur de sélection -->
            <div v-if="formData.preservativeSystem === preservative.id"
                 class="absolute top-3 right-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-white text-sm font-bold">✓</span>
            </div>
          </label>
        </div>
      </fieldset>
    </div>

    <!-- Importance de la conservation -->
    <div class="mt-8 bg-gradient-to-br from-gray-50 to-red-50 rounded-xl p-6 border border-gray-300">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <span class="text-3xl text-red-600">⚠️</span>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-gray-900 text-xl mb-3">Pourquoi la conservation est-elle cruciale pour les après-shampoings ?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Exigences réglementaires (UE 1223/2009)</h4>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-red-500 font-bold">§1</span>
                  <span>Tout produit capillaire contenant de l'eau doit être protégé contre la contamination microbienne</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500 font-bold">§2</span>
                  <span>Le système de conservation doit être efficace pendant la durée de vie du produit</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500 font-bold">§3</span>
                  <span>Les conservateurs doivent être listés dans l'Annexe V</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Risques spécifiques aux après-shampoings</h4>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-red-500">•</span>
                  <span>Contact fréquent avec l'eau de la douche (contamination)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500">•</span>
                  <span>Présence de matière organique (actifs naturels)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500">•</span>
                  <span>pH souvent proche de la neutralité (favorable aux micro-organismes)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  formData: { type: Object, required: true },
  preservativeSystems: { type: Array, required: true }
})
</script>
