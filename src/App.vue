<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import wedding from './data/wedding'
import FloralBackground from './components/FloralBackground.vue'
import WeddingNavbar from './components/WeddingNavbar.vue'
import InvitationOpening from './components/InvitationOpening.vue'
import CoupleSection from './components/CoupleSection.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import WeddingEvents from './components/WeddingEvents.vue'
import VenueSection from './components/VenueSection.vue'
import RSVPSection from './components/RSVPSection.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import FooterSection from './components/FooterSection.vue'
import { useReveal } from './composables/useReveal'

const invitationOpen = ref(false)
const musicPlayer = ref(null)
const topButtonVisible = ref(false)
let scrollFrame = 0
useReveal()

function openInvitation() {
  musicPlayer.value?.start()
  invitationOpen.value = true
  document.body.classList.remove('invitation-locked')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.setTimeout(() => {
    document.getElementById('couple')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, reducedMotion ? 0 : 1800)
}

function scrollToTop() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  window.scrollTo({ top: 0, behavior })
}

function updateScrollButton() {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    topButtonVisible.value = window.scrollY > 600
    document.documentElement.style.setProperty('--scroll-parallax', `${Math.min(window.scrollY * 0.06, 90)}px`)
  })
}

onMounted(() => {
  document.title = `${wedding.brideName} & ${wedding.groomName} | Wedding Invitation`
  document.body.classList.add('invitation-locked')
  window.addEventListener('scroll', updateScrollButton, { passive: true })
})

onUnmounted(() => {
  document.body.classList.remove('invitation-locked')
  window.removeEventListener('scroll', updateScrollButton)
  window.cancelAnimationFrame(scrollFrame)
  document.documentElement.style.removeProperty('--scroll-parallax')
})
</script>

<template>
  <div class="wedding-site">
    <WeddingNavbar :visible="invitationOpen" />

    <InvitationOpening :opened="invitationOpen" @open="openInvitation" />

    <main id="home" class="wedding-content" :class="{ 'wedding-content--visible': invitationOpen }" :inert="!invitationOpen">
      <FloralBackground v-if="invitationOpen" />
      <CoupleSection />

      <section id="countdown" class="countdown-section wedding-section">
        <div class="countdown-backdrop" aria-hidden="true"></div>
        <div class="section-inner countdown-inner reveal">
          <span class="section-kicker" lang="ta">முகூர்த்த நாளை நோக்கி</span>
          <h2>Countdown to <i>forever</i></h2>
          <p class="countdown-date">{{ wedding.weddingDateLabel }} · {{ wedding.weddingTime }}</p>
          <CountdownTimer />
          <span class="countdown-ornament" aria-hidden="true">❁ &nbsp; ❖ &nbsp; ❁</span>
        </div>
      </section>

      <WeddingEvents />
      <VenueSection />
      <RSVPSection />
      <FooterSection />
    </main>

    <MusicPlayer ref="musicPlayer" :show="invitationOpen" />

    <a
      v-if="invitationOpen"
      class="floating-whatsapp"
      :href="`https://wa.me/${wedding.whatsappNumber}?text=${encodeURIComponent(`Hello! We have a question about ${wedding.brideName} and ${wedding.groomName}'s wedding.`)}`"
      target="_blank"
      rel="noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <span class="material-symbols-rounded" aria-hidden="true">chat</span>
    </a>

    <Transition name="top-button">
      <button v-if="topButtonVisible && invitationOpen" class="floating-top" type="button" aria-label="Scroll to top" @click="scrollToTop">
        <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
      </button>
    </Transition>
  </div>
</template>
