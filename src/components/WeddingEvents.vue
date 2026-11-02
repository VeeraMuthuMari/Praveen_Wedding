<script setup>
import wedding from '../data/wedding'
import WeddingDateCard from './WeddingDateCard.vue'
</script>

<template>
  <section id="events" class="events-section wedding-section">
    <div class="section-inner">
      <div class="section-heading reveal">
        <span class="section-kicker" lang="ta">மங்கள நிகழ்வுகள் · OUR CELEBRATIONS</span>
        <h2>Join us for <i>the festivities</i></h2>
        <span class="ornament-rule" aria-hidden="true">❁ &nbsp; ❖ &nbsp; ❁</span>
        <p>We would be honoured by your presence at these two joyful occasions.</p>
      </div>

      <div class="events-editorial">
        <WeddingDateCard
          v-for="(event, index) in wedding.events"
          :key="event.id"
          :event="event"
          :featured="index === 0"
        />
      </div>
    </div>
  </section>
</template>
