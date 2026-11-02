<script setup>
import { computed, reactive, ref } from 'vue'
import wedding from '../data/wedding'

const response = reactive({
  name: '',
  mobile: '',
  guests: 1,
  attendance: 'yes',
  message: '',
})
const status = ref('')
const error = ref('')
const whatsappHref = ref('')
const guestCount = computed(() => Number(response.guests))

function submitRsvp() {
  error.value = ''
  status.value = ''
  whatsappHref.value = ''

  const name = response.name.trim()
  const mobile = response.mobile.replace(/\D/g, '')
  const configuredNumber = wedding.whatsappNumber.replace(/\D/g, '')

  if (name.length < 2) {
    error.value = 'Please enter your name.'
    return
  }
  if (mobile.length < 7 || mobile.length > 15) {
    error.value = 'Please enter a valid mobile number.'
    return
  }
  if (!Number.isInteger(guestCount.value) || guestCount.value < 1 || guestCount.value > 20) {
    error.value = 'Please choose between 1 and 20 guests.'
    return
  }
  if (!configuredNumber || /^0+$/.test(configuredNumber)) {
    error.value = 'RSVP is not available yet. Please use the WhatsApp contact button to reach the couple.'
    return
  }

  const attending = response.attendance === 'yes' ? 'Yes, I will be there' : 'Sorry, I cannot attend'
  const lines = [
    `Wedding RSVP for ${wedding.brideName} & ${wedding.groomName}`,
    `Name: ${name}`,
    `Mobile: ${response.mobile.trim()}`,
    `Attendance: ${attending}`,
    `Guests: ${guestCount.value}`,
    response.message.trim() ? `Wishes: ${response.message.trim()}` : '',
  ].filter(Boolean)

  whatsappHref.value = `https://wa.me/${configuredNumber}?text=${encodeURIComponent(lines.join('\n'))}`
  const opened = window.open(whatsappHref.value, '_blank', 'noopener,noreferrer')
  status.value = opened
    ? 'WhatsApp opened with your response. Please send the prefilled message to confirm.'
    : 'Your response is ready. Open WhatsApp below to send it.'
}
</script>

<template>
  <section id="rsvp" class="rsvp-section wedding-section">
    <div class="rsvp-glow" aria-hidden="true"></div>
    <div class="section-inner rsvp-inner">
      <div class="section-heading reveal">
        <span class="section-kicker">A NOTE BACK · RSVP</span>
        <h2>Will you celebrate <i>with us?</i></h2>
        <span class="ornament-rule" aria-hidden="true">✦ &nbsp; ♥ &nbsp; ✦</span>
        <p>Your presence will make our day even more meaningful.</p>
      </div>

      <form class="rsvp-card reveal" @submit.prevent="submitRsvp" novalidate>
        <label class="rsvp-field">
          <span>Guest name</span>
          <input v-model="response.name" autocomplete="name" name="name" required maxlength="80" placeholder="Your name" />
        </label>
        <label class="rsvp-field">
          <span>Mobile number</span>
          <input v-model="response.mobile" autocomplete="tel" inputmode="tel" name="mobile" required maxlength="20" placeholder="Your mobile number" />
        </label>
        <label class="rsvp-field">
          <span>Number of guests</span>
          <input v-model.number="response.guests" type="number" name="guests" min="1" max="20" required />
        </label>
        <label class="rsvp-field">
          <span>Will you be joining us?</span>
          <select v-model="response.attendance" name="attendance" required>
            <option value="yes">Joyfully accepts</option>
            <option value="no">Regretfully declines</option>
          </select>
        </label>
        <label class="rsvp-field rsvp-field--wide">
          <span>Wishes or a message <small>(optional)</small></span>
          <textarea v-model="response.message" name="message" rows="3" maxlength="500" placeholder="Send the couple a little love…"></textarea>
        </label>
        <p v-if="error" class="rsvp-feedback rsvp-feedback--error" role="alert">{{ error }}</p>
        <p v-if="status" class="rsvp-feedback" role="status">{{ status }}</p>
        <a v-if="whatsappHref" class="rsvp-whatsapp-link" :href="whatsappHref" target="_blank" rel="noreferrer">
          <span class="material-symbols-rounded" aria-hidden="true">chat</span>
          Open WhatsApp message
        </a>
        <button class="wedding-button wedding-button--maroon rsvp-submit" type="submit">
          Send your RSVP <span class="material-symbols-rounded" aria-hidden="true">favorite</span>
        </button>
      </form>
    </div>
  </section>
</template>
