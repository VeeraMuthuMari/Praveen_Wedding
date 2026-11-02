<script setup>
const leaves = Array.from({ length: 17 }, (_, index) => {
  const progress = index / 16
  const arc = Math.sin(progress * Math.PI)
  return {
    id: index,
    style: {
      '--left': `${progress * 100}%`,
      '--top': `${10 + arc * 24}px`,
      '--turn': `${progress * 76 - 38}deg`,
    },
    flower: index % 4 === 1,
  }
})
</script>

<template>
  <div class="mango-thoranam" aria-hidden="true">
    <span class="thoranam-cord"></span>
    <span
      v-for="leaf in leaves"
      :key="leaf.id"
      class="thoranam-leaf"
      :style="leaf.style"
    ></span>
    <span v-for="leaf in leaves.filter((item) => item.flower)" :key="`jasmine-${leaf.id}`" class="thoranam-jasmine" :style="leaf.style">✿</span>
  </div>
</template>
