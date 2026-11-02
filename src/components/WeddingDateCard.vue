<script setup>
import Kuthuvilakku from './Kuthuvilakku.vue'
import MangoThoranam from './MangoThoranam.vue'

defineProps({
  event: { type: Object, required: true },
  featured: { type: Boolean, default: false },
})
</script>

<template>
  <article
    :id="featured ? 'wedding-date' : undefined"
    class="date-event reveal"
    :class="featured ? 'date-event--ceremony' : 'date-event--reception'"
  >
    <div v-tilt class="date-event-content">
      <MangoThoranam />
      <Kuthuvilakku class="event-lamp event-lamp--left" />
      <Kuthuvilakku class="event-lamp event-lamp--right" />
      <span class="section-kicker">{{ featured ? 'முகூர்த்தம் · WEDDING CEREMONY' : 'வரவேற்பு · WEDDING RECEPTION' }}</span>
      <h3>{{ event.name }}</h3>

      <time class="calendar-date" :datetime="event.dateTime" :class="{ 'calendar-date--reception': !featured }" :aria-label="event.date">
        <span class="calendar-weekday">{{ event.calendarDate.weekday }}</span>
        <span class="calendar-date-rule" aria-hidden="true">❖</span>
        <div class="calendar-day-lockup">
          <strong class="calendar-day">{{ event.calendarDate.day }}</strong>
          <span class="calendar-month-year">
            <b>{{ event.calendarDate.month }}</b>
            <i>{{ event.calendarDate.year }}</i>
          </span>
        </div>
        <span class="calendar-ornament calendar-ornament--left" aria-hidden="true">❁</span>
        <span class="calendar-ornament calendar-ornament--right" aria-hidden="true">❁</span>
      </time>

      <div class="event-time-highlight">
        <span class="event-clock-icon material-symbols-rounded" aria-hidden="true">schedule</span>
        <span class="event-time-copy">
          <small>{{ event.timeLabel }}</small>
          <strong>{{ event.time }}</strong>
        </span>
        <span class="event-time-flourish" aria-hidden="true">❖</span>
      </div>

      <p class="date-event-description">{{ event.description }}</p>
      <div class="date-event-venue">
        <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
        <span><strong>{{ event.venue }}</strong><small>{{ event.address }}</small></span>
      </div>
      <a class="event-directions" :href="event.mapsUrl" target="_blank" rel="noreferrer">
        <span class="material-symbols-rounded" aria-hidden="true">near_me</span>
        Get directions
        <span class="event-directions-arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  </article>
</template>
