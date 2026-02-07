<template>
  <section id="fragrance"
           class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
    <div class="flex items-start gap-4 mb-8">
      <div class="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg" aria-hidden="true">
        <span class="text-2xl text-white">🌸</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Parfums & Huiles essentielles</h2>
        <p class="text-gray-600">Personnalisez la fragrance de votre après-shampoing</p>
      </div>
    </div>

    <!-- Options de parfum -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Type de parfum -->
        <div>
          <label class="label required">Type de fragrance *</label>
          <div class="space-y-2">
            <label v-for="option in fragranceOptions"
                   :key="option.value"
                   class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:border-pink-300"
                   :class="formData.fragranceType === option.value ? 'border-pink-400 bg-pink-50' : 'border-gray-200'">
              <input type="radio"
                     v-model="formData.fragranceType"
                     :value="option.value"
                     class="h-4 w-4 text-pink-600 focus:ring-pink-500">
              <div>
                <span class="font-medium">{{ option.label }}</span>
                <p class="text-xs text-gray-500">{{ option.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Intensité -->
        <div>
          <label class="label">Intensité de la fragrance</label>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Très légère</span>
              <span class="text-sm text-gray-600">Moyenne</span>
              <span class="text-sm text-gray-600">Intense</span>
            </div>
            <input type="range"
                   v-model.number="formData.fragranceIntensity"
                   min="1"
                   max="3"
                   step="1"
                   class="w-full h-2 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white">
            <div class="text-center">
              <span class="text-lg font-bold text-pink-600">
                {{ ['Légère', 'Moyenne', 'Intense'][formData.fragranceIntensity - 1] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sélection d'huiles essentielles (si choisi) -->
      <div v-if="formData.fragranceType === 'essential_oils'" class="mt-6">
        <h3 class="font-bold text-xl text-gray-900 mb-4">Sélection des huiles essentielles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="he in hairEssentialOils"
               :key="he.name"
               :class="[
                 'rounded-lg p-4 border-2 transition-all duration-300',
                 formData.selectedEssentialOils.some(eo => eo.name === he.name)
                   ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                   : 'border-gray-200 hover:border-green-300'
               ]">
            <div class="flex items-start gap-3">
              <input :id="`he-${he.name}`"
                     type="checkbox"
                     :checked="formData.selectedEssentialOils.some(eo => eo.name === he.name)"
                     @change="toggleEssentialOil(he)"
                     class="h-4 w-4 rounded border-2 border-gray-300 checked:border-green-600 checked:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1">
              <div class="flex-1">
                <label :for="`he-${he.name}`"
                       class="font-bold text-gray-900 cursor-pointer hover:text-green-600">
                  {{ he.name }}
                </label>
                <p class="text-xs text-gray-500 mt-1">{{ he.latinName }}</p>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span v-for="prop in he.properties"
                        :key="prop"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    {{ prop }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Note de parfum -->
      <div v-if="formData.fragranceType === 'synthetic' || formData.fragranceType === 'essential_oils'"
           class="mt-6">
        <label class="label">Note de parfum dominante</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label v-for="note in fragranceNotes"
                 :key="note.value"
                 class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-pink-300"
                 :class="formData.fragranceNote === note.value ? 'border-pink-400 bg-pink-50' : 'border-gray-200'">
            <input type="radio"
                   v-model="formData.fragranceNote"
                   :value="note.value"
                   class="h-4 w-4 text-pink-600">
            <div>
              <span class="font-medium">{{ note.label }}</span>
              <p class="text-xs text-gray-500">{{ note.examples }}</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  formData: { type: Object, required: true },
  fragranceOptions: { type: Array, required: true },
  fragranceNotes: { type: Array, required: true },
  hairEssentialOils: { type: Array, required: true },
  toggleEssentialOil: { type: Function, required: true }
})
</script>
