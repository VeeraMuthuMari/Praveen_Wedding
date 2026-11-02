<script setup>
defineProps({ paused: { type: Boolean, default: false } })

const particles = Array.from({ length: window.innerWidth < 700 ? 6 : 11 }, (_, index) => ({
  id: index,
  style: {
    '--particle-left': `${Math.random() * 100}%`,
    '--particle-top': `${Math.random() * 100}%`,
    '--particle-size': `${3 + Math.random() * 4}px`,
    '--particle-duration': `${3.4 + Math.random() * 5}s`,
    '--particle-delay': `${Math.random() * -8}s`,
  },
}))

</script>

<template>
  <div class="golden-particles" :class="{ 'is-paused': paused }" aria-hidden="true">
    <span v-for="particle in particles" :key="particle.id" class="golden-particle" :style="particle.style">✦</span>
  </div>
</template>
