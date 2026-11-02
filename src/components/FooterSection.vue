<script setup>
import wedding from '../data/wedding'
import Kuthuvilakku from './Kuthuvilakku.vue'
import MangoThoranam from './MangoThoranam.vue'
</script>

<template>
  <footer class="wedding-footer">
    <MangoThoranam class="footer-thoranam" />
    <Kuthuvilakku class="footer-lamp footer-lamp--left" />
    <Kuthuvilakku class="footer-lamp footer-lamp--right" />
    <div class="closing-arch" aria-hidden="true"></div>
    <div class="footer-frame reveal">
      <span class="section-kicker" lang="ta">மங்களம் · MANGALAM</span>
      <span class="footer-flower" aria-hidden="true">❁</span>
      <h2 class="footer-closing-title">Two Hearts,<br /><i>One Beautiful Beginning</i></h2>
      <p class="footer-message">Your presence will make our celebration unforgettable.</p>
      <p class="footer-couple">{{ wedding.brideName }} <i>&</i> {{ wedding.groomName }}</p>
      <p class="footer-forever">With the blessings of our families</p>
      <span class="footer-date">{{ wedding.weddingDateLabel }} · {{ wedding.weddingTime }}</span>
      <div class="footer-socials">
        <a :href="wedding.socialLinks.instagram" target="_blank" rel="noreferrer" aria-label="Instagram"><span class="material-symbols-rounded">photo_camera</span></a>
        <a :href="wedding.socialLinks.facebook" target="_blank" rel="noreferrer" aria-label="Facebook"><span class="material-symbols-rounded">public</span></a>
        <a :href="`mailto:${wedding.email}`" aria-label="Email the families"><span class="material-symbols-rounded">mail</span></a>
      </div>
    </div>
    <p class="footer-credit">Made with love for our favourite people</p>
  </footer>
</template>
