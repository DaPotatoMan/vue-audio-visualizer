<template>
  <section class="h-screen w-screen flex flex-col items-center justify-center">
    <audio id="audio-player" ref="audio" :src="src" preload="metadata" />
    <AudioPlayer id="audio-player" class="w-[70%] max-w-800px mb-100px" />

    <button @click="audio.play">
      Play
    </button>
  </section>
</template>

<script setup lang="ts">
import { $ref } from 'vue/macros'

import AudioPlayer from '../app/AudioPlayer.vue'
import src from './audio.mp3'

const audio = $ref<HTMLAudioElement>()
</script>
