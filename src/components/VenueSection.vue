<script setup>
import wedding from '../data/wedding'
import Kuthuvilakku from './Kuthuvilakku.vue'

const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(wedding.venueName + ' ' + wedding.venueAddress)}&output=embed`
</script>

<template>
  <section id="venue" class="venue-section wedding-section" :style="{ '--venue-image': `url('${wedding.venuePhoto}')` }">
    <div class="venue-backdrop" aria-hidden="true"></div>
    <div class="section-inner venue-inner">
      <div class="section-heading reveal">
        <span class="section-kicker" lang="ta">திருமண மண்டபம் · THE WEDDING VENUE</span>
        <h2>Gather with us in <i>Palakkad</i></h2>
        <span class="ornament-rule" aria-hidden="true">❁ &nbsp; ❖ &nbsp; ❁</span>
      </div>
      <div class="venue-card reveal">
        <div class="venue-card-copy">
          <Kuthuvilakku class="venue-lamp" />
          <span class="venue-pin material-symbols-rounded" aria-hidden="true">location_on</span>
          <span class="section-kicker">CEREMONY &amp; RECEPTION</span>
          <h3>{{ wedding.venueName }}</h3>
          <p>{{ wedding.venueAddress }}</p>
          <div class="venue-date"><span class="material-symbols-rounded" aria-hidden="true">calendar_month</span>{{ wedding.weddingDateLabel }}</div>
          <div class="venue-date"><span class="material-symbols-rounded" aria-hidden="true">schedule</span>{{ wedding.weddingTime }}</div>
          <a class="wedding-button wedding-button--maroon" :href="wedding.mapsUrl" target="_blank" rel="noreferrer">
            <span class="material-symbols-rounded" aria-hidden="true">near_me</span> Get directions
          </a>
        </div>
        <div class="venue-map">
          <iframe :src="mapEmbed" title="Map showing the wedding venue" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </section>
</template>
