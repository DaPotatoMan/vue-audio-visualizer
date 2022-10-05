import { clamp } from '@antfu/utils'
import type { Ref } from 'vue'

type MoveEvent = any

export function useSeekbar(target: HTMLElement, audio: HTMLAudioElement, progress: Ref<number>) {
  let active = false
  let currentX = 0
  let initialX = 0
  let xOffset = 0

  const parent = target.parentElement!
  let parentWidth = parent.clientWidth
  let parentLeft = 0

  function resize() {
    const rect = parent.getBoundingClientRect()
    parentLeft = rect.x
    parentWidth = rect.width
  }

  function updateTime(x: number) {
    audio.currentTime = (x / parentWidth) * audio.duration
  }

  function setTranslate(x: number) {
    const value = clamp(x, 0, parentWidth)

    target.style.transform = `translate3d(${value}px, 0, 0)`
    progress.value = (value / parentWidth) * 100
  }

  function dragEnd() {
    if (!active) return

    updateTime(initialX = currentX)
    active = false
  }

  function dragStart(e: MoveEvent) {
    if (e.type === 'touchstart')
      initialX = e.touches[0].clientX - xOffset

    else
      initialX = e.clientX - xOffset

    if (e.target === target || parent)
      active = true
  }

  function drag(e: MoveEvent) {
    if (active) {
      e.preventDefault()

      if (e.type === 'touchmove')
        currentX = e.touches[0].clientX - initialX

      else
        currentX = e.clientX - initialX

      xOffset = currentX

      setTranslate(currentX)
    }
  }

  parent.addEventListener('click', (e) => {
    const x = xOffset = currentX = e.clientX - parentLeft
    updateTime(x)
  })

  parent.addEventListener('touchstart', dragStart, { passive: true })
  window.addEventListener('touchend', dragEnd, { passive: true })
  window.addEventListener('touchmove', drag, false)

  target.addEventListener('mousedown', dragStart, { passive: true })
  window.addEventListener('mouseup', dragEnd, { passive: true })
  window.addEventListener('mousemove', drag, false)

  // Audio events
  audio.addEventListener('timeupdate', () => {
    if (active) return

    const time = (audio.currentTime / audio.duration)
    const x = xOffset = currentX = parentWidth * time

    setTranslate(x)
  })

  return { resize }
}
