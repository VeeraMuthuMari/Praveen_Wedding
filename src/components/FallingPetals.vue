<script setup>
defineProps({ paused: { type: Boolean, default: false } })

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const petals = Array.from({ length: window.innerWidth < 700 ? 15 : 29 }, (_, index) => {
  const kind = index % 8 === 0 ? 'cluster' : index % 4 === 0 ? 'blossom' : 'petal'
  const size = kind === 'petal' ? 11 + Math.random() * 15 : 12 + Math.random() * 10
  const drift = -125 + Math.random() * 250
  return {
    id: index,
    kind,
    symbol: ['✿', '❀', '✽'][index % 3],
    style: {
      '--left': `${Math.random() * 100}%`,
      '--size': `${size}px`,
      '--width': `${size * (0.58 + Math.random() * 0.3)}px`,
      '--duration': `${15 + Math.random() * 18}s`,
      '--delay': `${Math.random() * -30}s`,
      '--wind-a': `${drift}px`,
      '--wind-b': `${-drift * 0.48}px`,
      '--wind-c': `${drift * 0.76}px`,
      '--rotation': `${Math.random() * 360}deg`,
      '--swing': `${12 + Math.random() * 28}px`,
      '--petal-opacity': `${0.31 + Math.random() * 0.32}`,
      '--blur': `${kind === 'cluster' && index % 2 === 0 ? 1.2 : 0}px`,
    },
  }
})

</script>

<template>
  <div class="falling-petals" :class="{ 'is-paused': paused, 'is-static': reducedMotion }" aria-hidden="true">
    <span
      v-for="petal in petals"
      :key="petal.id"
      class="falling-petal"
      :class="`falling-petal--${petal.kind}`"
      :style="petal.style"
    >
      <span v-if="petal.kind !== 'petal'" class="falling-petal-bloom">{{ petal.symbol }}</span>
      <template v-else></template>
    </span>
  </div>
</template>
