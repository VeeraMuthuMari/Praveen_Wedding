<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import wedding from '../data/wedding'

defineProps({ visible: { type: Boolean, default: false } })

const menuOpen = ref(false)
const activeSection = ref('home')
const scrolled = ref(false)
const links = [
  { label: 'Home', id: 'home' },
  { label: 'Couple', id: 'couple' },
  { label: 'Events', id: 'events' },
  { label: 'Venue', id: 'venue' },
  { label: 'RSVP', id: 'rsvp' },
]
let observer

function scrollToSection(id) {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
  menuOpen.value = false
}

function updateScrolled() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visibleEntry) activeSection.value = visibleEntry.target.id
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.5] })
  links.forEach(({ id }) => {
    const section = document.getElementById(id)
    if (section) observer.observe(section)
  })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', updateScrolled)
})
</script>

<template>
  <Transition name="nav-reveal">
    <header v-if="visible" class="wedding-nav" :class="{ 'wedding-nav--scrolled': scrolled }">
      <button class="nav-brand" type="button" aria-label="Scroll to the couple introduction" @click="scrollToSection('couple')">
        <span>{{ wedding.brideName.charAt(0) }}<i>&</i>{{ wedding.groomName.charAt(0) }}</span>
        <strong>{{ wedding.brideName }} <i>&</i> {{ wedding.groomName }}</strong>
      </button>
      <button class="nav-toggle" type="button" :aria-expanded="menuOpen" aria-label="Toggle navigation" @click="menuOpen = !menuOpen">
        <span class="material-symbols-rounded" aria-hidden="true">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
      <nav class="nav-links" :class="{ 'nav-links--open': menuOpen }" aria-label="Wedding sections">
        <button
          v-for="link in links"
          :key="link.id"
          type="button"
          :class="{ 'nav-link--active': activeSection === link.id }"
          @click="scrollToSection(link.id)"
        >{{ link.label }}</button>
      </nav>
    </header>
  </Transition>
</template>
