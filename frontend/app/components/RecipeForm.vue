<template>
    <CosmeticFormulator
        :initial-data="initialData"
        @save="$emit('save', $event)"
        @cancel="$emit('cancel', $event)"
        @save-draft="$emit('save-draft', $event)"
    />
</template>

<script setup>
import CosmeticFormulator from './cosmetic-formulator/CosmeticFormulator.vue'

defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
})

defineEmits(["save", "cancel", "save-draft"])
</script>
