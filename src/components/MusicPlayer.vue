<script setup>
import { onUnmounted, ref } from 'vue'
import wedding from '../data/wedding'

defineProps({ show: { type: Boolean, default: false } })

const playing = ref(false)
const errorMessage = ref('')
let audio

function getAudio() {
  if (!audio) {
    audio = new Audio(wedding.backgroundMusicPath)
    audio.loop = true
    audio.volume = 0.32
    audio.addEventListener('error', onAudioError)
  }
  return audio
}

function onAudioError() {
  playing.value = false
  errorMessage.value = `Unable to load the configured music file: ${wedding.backgroundMusicPath}`
}

async function start() {
  errorMessage.value = ''
  try {
    await getAudio().play()
    playing.value = true
  } catch {
    playing.value = false
    errorMessage.value = `Unable to play the configured music file: ${wedding.backgroundMusicPath}`
  }
}

async function toggleMusic() {
  errorMessage.value = ''
  if (playing.value) {
    audio?.pause()
    playing.value = false
    return
  }
  await start()
}

defineExpose({ start })

onUnmounted(() => {
  audio?.pause()
  audio?.removeEventListener('error', onAudioError)
})
</script>

<template>
  <div v-if="show" class="music-widget">
    <button class="music-toggle" type="button" :aria-label="playing ? 'Pause wedding music' : 'Play wedding music'" @click="toggleMusic">
      <span class="music-orbit" :class="{ 'music-orbit--playing': playing }" aria-hidden="true">
        <span class="material-symbols-rounded">{{ playing ? 'pause' : 'music_note' }}</span>
      </span>
      <span>{{ playing ? 'Pause music' : 'Play music' }}</span>
    </button>
    <span v-if="errorMessage" class="music-error" role="status">{{ errorMessage }}</span>
  </div>
</template>
