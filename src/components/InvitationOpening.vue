<script setup>
import { ref } from 'vue'
import wedding from '../data/wedding'
import FloralBackground from './FloralBackground.vue'
import Kuthuvilakku from './Kuthuvilakku.vue'
import MangoThoranam from './MangoThoranam.vue'
import TempleEntrance3D from './TempleEntrance3D.vue'

defineProps({ opened: { type: Boolean, default: false } })
const emit = defineEmits(['open'])
const templeScene = ref(null)

function openInvitation() {
  templeScene.value?.openDoors()
  emit('open')
}
</script>

<template>
  <Transition name="invitation-cover">
    <section v-if="!opened" class="invitation-opening" role="dialog" aria-modal="true" aria-label="Wedding invitation">
      <img class="opening-temple-art" src="/images/south-indian-mandapam.svg" alt="" fetchpriority="high" />
      <TempleEntrance3D ref="templeScene" />
      <div class="opening-backdrop"></div>
      <FloralBackground :opening="true" />
      <MangoThoranam class="opening-thoranam" />
      <Kuthuvilakku class="opening-lamp opening-lamp--left" />
      <Kuthuvilakku class="opening-lamp opening-lamp--right" />
      <div class="opening-ornate-frame" aria-hidden="true"></div>
      <div class="opening-content">
        <p class="opening-auspicious" lang="ta">॥ ஸ்ரீ கணேஷாய நமः ॥</p>
        <p class="opening-family">With the Blessings of the Almighty and Our Elders</p>
        <span class="opening-auspicious-rule" aria-hidden="true">✦ &nbsp; ♥ &nbsp; ✦</span>
        <h1 class="opening-title">Two Souls,<br /><i>One Beautiful Story</i></h1>
        <p class="opening-invitation-line">From Strangers to Best Friends, From Best Friends to Forever.</p>
        <div class="opening-name-lockup">
          <h2>{{ wedding.brideName }}</h2>
          <span class="opening-ampersand" aria-label="and">♥</span>
          <h3>{{ wedding.groomName }}</h3>
        </div>
        <p class="opening-tie">We are getting married!</p>
        <span class="opening-gold-rule" aria-hidden="true"><i></i> ✦ <i></i></span>
        <time class="opening-calendar-date" :datetime="wedding.weddingDate" :aria-label="wedding.weddingDateLabel">
          <span>{{ wedding.weddingCalendarDate.weekday }}</span>
          <strong>{{ wedding.weddingCalendarDate.day }}</strong>
          <span>{{ wedding.weddingCalendarDate.month }} <i>{{ wedding.weddingCalendarDate.year }}</i></span>
        </time>
        <div class="opening-time-block">
          <span class="material-symbols-rounded" aria-hidden="true">schedule</span>
          <span><small>MUHURTHAM</small><strong>{{ wedding.weddingTime }}</strong></span>
        </div>
        <button class="open-invitation-button" type="button" @click="openInvitation">
          <span class="button-halo" aria-hidden="true"></span>
          <span>Enter Our Wedding</span>
          <span class="material-symbols-rounded" aria-hidden="true">favorite</span>
        </button>
        <p class="opening-venue">{{ wedding.venueName }} <span aria-hidden="true">·</span> {{ wedding.venueAddress }}</p>
      </div>
      <span class="opening-side-note opening-side-note--left">॥ சுபமஸ்து ॥</span>
      <span class="opening-side-note opening-side-note--right">A little forever starts here</span>
    </section>
  </Transition>
</template>
