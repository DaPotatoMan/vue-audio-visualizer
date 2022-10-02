import { clamp } from '@antfu/utils'
import type { Ref } from 'vue'

type MoveEvent = any

/** // !TODO
 * Store parent width and `left pos` and update on window resize
*/

export function useSeekbar(target: HTMLElement, audio: HTMLAudioElement, progress: Ref<number>) {
  let active = false
  let currentX = 0
  let initialX = 0
  let xOffset = 0

  const parent = target.parentElement!

  function updateTime(x: number) {
    audio.currentTime = (x / parent.clientWidth) * audio.duration
  }

  function setTranslate(x: number) {
    const width = parent.clientWidth
    const value = clamp(x, 0, width - (target.clientWidth / 2))

    target.style.transform = `translate3d(${value}px, 0, 0)`
    progress.value = (value / width) * 100
  }

  function dragEnd() {
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
    const rect = parent.getBoundingClientRect()
    const x = xOffset = currentX = e.clientX - rect.x
    updateTime(x)
  })

  parent.addEventListener('touchstart', dragStart, false)
  window.addEventListener('touchend', dragEnd, false)
  window.addEventListener('touchmove', drag, false)

  target.addEventListener('mousedown', dragStart, false)
  window.addEventListener('mouseup', dragEnd, false)
  window.addEventListener('mousemove', drag, false)

  // Audio events
  audio.addEventListener('timeupdate', () => {
    if (active)
      return

    const rect = parent.getBoundingClientRect()
    const time = (audio.currentTime / audio.duration)
    const x = xOffset = currentX = rect.width * time

    setTranslate(x)
  })
}
