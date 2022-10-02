<template>
  <div ref="wrapperRef" :class="$style.wrapper">
    <svg ref="svgRef" viewBox="0 0 800 110">
      <defs>
        <linearGradient id="fill" x1="0" x2="1" y1="0" y2="0">
          <stop :offset="`${progress}%`" stop-color="rgb(255 255 255 / 40%)" />
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

    <div ref="seekbarRef" :class="$style.seekbar" />
  </div>
</template>

<style module lang="css">
.blend {
  /* @apply mix-blend-overlay; */
}

.wrapper {
  @apply relative;
}

.seekbar {
  @apply w-20px h-110px absolute top-0 -left-10px
  bg-white/10;

  cursor: e-resize;
}
</style>

<script setup lang="ts">
import { debounce } from '@antfu/utils'
import { onMounted, shallowRef } from 'vue'
import { $ref, $shallowRef } from 'vue/macros'

import type { Points } from './utils/canvas'
import { drawCurve } from './utils/canvas'
import { useSeekbar } from './utils/seekbar'
import { getAudioData } from './utils/waveform'

const wrapperRef = $ref<HTMLElement>()
const svgRef = $ref<SVGElement>()
const seekbarRef = $ref<HTMLElement>()

let path = $shallowRef('')

const progress = shallowRef(0)

const audio = new Audio('/lofi.mp3')
audio.volume = 0.1

async function init() {
  const getData = await getAudioData(audio.src)

  const update = debounce(200, false, () => {
    const width = wrapperRef.clientWidth
    const bars = Math.round(width / 10) - 2
    const xrect = width / bars
    const data = getData(bars)

    svgRef.setAttribute('viewBox', `0 0 ${width} 110`)
    path = drawCurve(
      [[0, 100], ...data.map((i, j) => [j * xrect, 100 - (i * 100)]) as Points, [width, 100]]
    )
  })

  update()
  window.addEventListener('resize', update)
  useSeekbar(seekbarRef, audio, progress)
}

onMounted(init)

window.onclick = () => {
  if (audio.paused)
    audio.play()
}
</script>
