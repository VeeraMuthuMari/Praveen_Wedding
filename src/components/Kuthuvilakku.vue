<script setup>
import { useId } from 'vue'

const id = useId()
const flameId = `lamp-flame-${id}`
const brassId = `lamp-brass-${id}`
</script>

<template>
  <svg class="kuthuvilakku" viewBox="0 0 80 170" role="img" aria-label="Traditional brass oil lamp">
    <defs>
      <linearGradient :id="brassId" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#F5D98C" />
        <stop offset=".45" stop-color="#A87327" />
        <stop offset=".72" stop-color="#E7C46B" />
        <stop offset="1" stop-color="#75501E" />
      </linearGradient>
      <radialGradient :id="flameId">
        <stop stop-color="#FFF8C7" />
        <stop offset=".55" stop-color="#FFD35A" />
        <stop offset="1" stop-color="#E68C24" stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse class="lamp-aura" cx="40" cy="43" rx="35" ry="34" :fill="`url(#${flameId})`" />
    <path d="M40 11c-8 12-8 22 0 29 8-7 8-17 0-29Z" fill="#FFD565" />
    <path d="M40 18c-4 7-4 12 0 16 4-4 4-9 0-16Z" fill="#FFF4B0" />
    <path d="M27 42c-3 10-12 16-21 20 7 11 19 15 34 15s27-4 34-15c-9-4-18-10-21-20-8 6-18 6-26 0Z" :fill="`url(#${brassId})`" stroke="#7C541F" stroke-width="2" />
    <path d="M10 62h60M40 76v68M31 91h18M29 111h22M23 132h34M14 144h52" :stroke="`url(#${brassId})`" stroke-width="6" stroke-linecap="round" />
    <path d="M8 145q32 18 64 0v10q-32 18-64 0v-10Z" :fill="`url(#${brassId})`" stroke="#81591F" stroke-width="2" />
    <circle cx="22" cy="59" r="2" fill="#FFF0B4" />
    <circle cx="40" cy="64" r="2.5" fill="#FFF0B4" />
    <circle cx="58" cy="59" r="2" fill="#FFF0B4" />
  </svg>
</template>
