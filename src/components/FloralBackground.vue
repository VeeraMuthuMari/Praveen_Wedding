<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import FallingPetals from './FallingPetals.vue'
import GoldenParticles from './GoldenParticles.vue'

defineProps({ opening: { type: Boolean, default: false } })
const tabHidden = ref(document.hidden)

function updateVisibility() {
  tabHidden.value = document.hidden
}

onMounted(() => document.addEventListener('visibilitychange', updateVisibility))
onUnmounted(() => document.removeEventListener('visibilitychange', updateVisibility))
</script>

<template>
  <div class="floral-background" :class="opening ? 'floral-background--opening' : 'floral-background--page'" aria-hidden="true">
    <FallingPetals :paused="tabHidden" />
    <GoldenParticles :paused="tabHidden" />
  </div>
</template>
