<template>
  <section class="h-screen w-screen flex flex-col items-center justify-center">
    <AudioPlayer class="w-[70%] max-w-800px mb-100px" :audio="audio" />

    <button @click="audio.play">
      Play
    </button>
  </section>
</template>

<script setup lang="ts">
import AudioPlayer from '../app/AudioPlayer.vue'
import audioSrc from './audio.mp3'

const audio = new Audio(audioSrc)
</script>
