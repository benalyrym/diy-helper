<template>
    <div class="progress-container">
        <div class="progress-labels">
            <span>Progression</span>
            <span class="progress-percentage">{{ percentage }}%</span>
        </div>

        <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: `${percentage}%` }"
                role="progressbar"
                :aria-valuenow="percentage"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuetext="`${percentage}% complété`"
            ></div>
        </div>

        <div class="progress-marks">
      <span v-for="mark in marks" :key="mark" :class="markClass(mark)">
        {{ mark }}%
      </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
    percentage: {
        type: Number,
        default: 0,
        validator: value => value >= 0 && value <= 100
    }
})

const marks = [0, 25, 50, 75, 100]

const markClass = computed(() => (mark) => ({
    'progress-mark': true,
    'mark-reached': props.percentage >= mark,
    'mark-future': props.percentage < mark
}))
</script>

<style scoped>
.progress-container {
    @apply space-y-2;
}

.progress-labels {
    @apply flex justify-between items-center;
}

.progress-percentage {
    @apply font-bold text-blue-600;
}

.progress-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
    @apply h-full bg-gradient-to-r from-blue-500 to-blue-600
    rounded-full transition-all duration-1000 ease-out;
}

.progress-marks {
    @apply flex justify-between text-xs text-gray-500 px-1;
}

.progress-mark {
    @apply transition-colors duration-300;
}

.mark-reached {
    @apply font-medium text-blue-600;
}

.mark-future {
    @apply text-gray-400;
}
</style>