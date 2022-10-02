<template>
  <div :class="$style.wrapper">
    <div v-for="(item, i) in data" :key="i" :class="$style.item" :style="{ height: `${item * 100}px` }" />
  </div>
  <svg viewBox="0 0 800 100">
    <defs>
      <linearGradient id="fill" x1="0" x2="1" y1="0" y2="0">
        <stop :offset="`${progress}%`" stop-color="#fff" />
        <stop :offset="`${progress}%`" stop-color="transparent" />
      </linearGradient>
    </defs>

    <polyline :points="points.join(' ')" fill="#fff" :class="$style.blend" />
    <polyline :points="points.join(' ')" fill="url(#fill)" />
  </svg>

  <svg viewBox="0 0 800 110">
    <defs>
      <linearGradient id="fill" x1="0" x2="1" y1="0" y2="0">
        <stop :offset="`${progress}%`" stop-color="#fff" />
        <stop :offset="`${progress}%`" stop-color="transparent" />
      </linearGradient>
    </defs>

    <defs>
      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#FF4AB7" />
        <stop offset="100%" stop-color="#76292D" />
      </linearGradient>
    </defs>

    <path :d="path" transform="translate(0,10)" fill="url(#grad)" />
    <path :d="path" transform="translate(0,10)" fill="url(#fill)" :class="$style.blend" />
  </svg>

  <input v-model="progress" type="range" min="0" max="100">

  <button @click="init">
    Start
  </button>
</template>

<style module lang="postcss">
html {
  background: radial-gradient(96.68% 96.68% at 50% 1.63%, rgba(255, 0, 199, 0.062) 0%, rgba(139, 68, 81, 0.082) 28.12%, rgba(182, 64, 64, 0.032) 53.65%, rgba(44, 35, 100, 0.0196446) 75%, rgba(0, 0, 0, 0.076) 100%), #111111;
}

.wrapper {
  @apply flex items-end h-150px bg-black/10;
}

.item {
  @apply w-10px bg-red-500;
}

.blend {
  @apply mix-blend-overlay;
}
</style>

<script setup lang="ts">
import { $shallowRef } from 'vue/macros'

import { visualize } from './utils'
import type { Points } from './canvas'
import { drawCurve } from './canvas'

let data = $shallowRef<number[]>([])
let points = $shallowRef<Points>([])
let path = $shallowRef('')

const progress = $shallowRef(0)

async function init() {
  data = await visualize('/lofi.mp3')

  const xrect = 800 / 100

  points = [[0, 100], ...data.map((i, j) => [j * xrect, 100 - (i * 100)]) as Points, [800, 100]]
  path = drawCurve(points)
}
</script>
