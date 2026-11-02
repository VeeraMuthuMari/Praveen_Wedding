<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import wedding from '../data/wedding'

const units = ref([
  { label: 'Days', value: '000' },
  { label: 'Hours', value: '00' },
  { label: 'Minutes', value: '00' },
  { label: 'Seconds', value: '00' },
])
const isPast = ref(false)
let timer

function updateCountdown() {
  const difference = new Date(wedding.weddingDate).getTime() - Date.now()
  isPast.value = difference <= 0
  const seconds = Math.max(0, Math.floor(difference / 1000))
  units.value = [
    { label: 'Days', value: String(Math.floor(seconds / 86400)).padStart(3, '0') },
    { label: 'Hours', value: String(Math.floor((seconds % 86400) / 3600)).padStart(2, '0') },
    { label: 'Minutes', value: String(Math.floor((seconds % 3600) / 60)).padStart(2, '0') },
    { label: 'Seconds', value: String(seconds % 60).padStart(2, '0') },
  ]
}

onMounted(() => {
  updateCountdown()
  timer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => window.clearInterval(timer))
</script>

<template>
  <div class="wedding-countdown" role="timer" :aria-label="isPast ? 'The wedding celebration has begun' : 'Time remaining until the wedding'">
    <p v-if="isPast" class="countdown-complete">The celebration has begun — we can't wait to see you!</p>
    <template v-else>
      <div v-for="unit in units" :key="unit.label" v-tilt class="countdown-box">
        <span class="countdown-value">{{ unit.value }}</span>
        <span class="countdown-unit-label">{{ unit.label }}</span>
      </div>
    </template>
  </div>
</template>
