<template>
  <div ref="wrapperRef" :class="$style.wrapper">
    <svg ref="svgRef" viewBox="0 0 800 110">
      <defs>
        <linearGradient id="fill" x1="0" x2="1" y1="0" y2="0">
          <stop :offset="`${progress}%`" stop-color="rgb(255 255 255 / 40%)" />
          <stop :offset="`${progress}%`" stop-color="transparent" />
        </linearGradient>

        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#FF4AB7" />
          <stop offset="100%" stop-color="#76292D" />
        </linearGradient>
      </defs>

      <path class="path" transform="translate(0,10)" fill="url(#grad)" />
      <path class="path" transform="translate(0,10)" fill="url(#fill)" />
    </svg>

    <div id="seekbar" ref="seekbarRef" :class="$style.seekbar" />
  </div>
</template>

<style module lang="postcss">
.wrapper {
  @apply relative max-h-110px;

  svg {
    @apply w-auto h-110px;
  }
}

.seekbar {
  @apply w-20px h-110px absolute top-0 -left-10px;

  cursor: e-resize;
}
</style>

<script setup lang="ts">
import { debounce } from '@antfu/utils'
import { onMounted, shallowRef } from 'vue'
import { $ref } from 'vue/macros'

import { drawCurve } from './utils/canvas'
import { useSeekbar } from './utils/seekbar'
import { getAudioData } from './utils/waveform'

const props = defineProps<{
  /** `id` of the audio element */
  id: string

  /** Peaks data of audio file */
  data?: number[]
}>()

const wrapperRef = $ref<HTMLElement>()
const svgRef = $ref<SVGElement>()
const seekbarRef = $ref<HTMLElement>()
const progress = shallowRef(0)

async function init() {
  const audio = document.getElementById(props.id) as HTMLAudioElement

  if (!audio)
    return console.error('Audio element was not found')

  const getData = await getAudioData(audio.src, props.data)
  const seekbar = useSeekbar(seekbarRef, audio, progress)
  const pathNodes = Array.from(svgRef.querySelectorAll<SVGPathElement>('.path'))

  const update = debounce(200, false, () => {
    const width = wrapperRef.clientWidth
    const bars = Math.round(width / 10) - 2
    const data = getData(bars)

    if (!data.length) return console.warn('Dataset is empty')

    svgRef.setAttribute('viewBox', `0 0 ${width} 110`)
    seekbar.resize()

    // Update path
    const gap = width / bars
    const path = drawCurve(
      [[0, 100], ...data.map((y, x) => [x * gap, 100 - (y * 100)] as any), [width, 100]]
    )

    pathNodes.forEach(i => i.setAttribute('d', path))
  })

  update()
  window.addEventListener('resize', update)
}

onMounted(init)
</script>
