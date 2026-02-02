<template>
    <section
        id="essential-oils"
        class="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        aria-labelledby="essential-oils-title"
    >
        <h2 id="essential-oils-title" class="sr-only">{{ t('essentialTitle') }}</h2>
        <EssentialOilsForm
            v-model:selected-he="formData.selectedHE"
            v-model:search="heSearch"
            v-model:property-filter="hePropertyFilter"
            v-model:filters="heFilters"
            :essential-oils="essentialOils"
            :volume="formData.volume"
        />
    </section>
</template>

<script setup>
import { inject } from 'vue'
import { FORM_CONTEXT_KEY } from '../utils/constants'
import EssentialOilsForm from '../../forms/EssentialOilsForm.vue'

const form = inject(FORM_CONTEXT_KEY)
const { t } = inject('i18n')
const { formData, essentialOils, heSearch, hePropertyFilter, heFilters } = form
</script>
