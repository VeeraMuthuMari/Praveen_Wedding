function resetTilt(element) {
  element.style.setProperty('--tilt-x', '0deg')
  element.style.setProperty('--tilt-y', '0deg')
  element.style.setProperty('--tilt-z', '0px')
}

export default {
  mounted(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover)').matches) return

    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      element.style.setProperty('--tilt-x', `${-y * 5}deg`)
      element.style.setProperty('--tilt-y', `${x * 6}deg`)
      element.style.setProperty('--tilt-z', '7px')
    }, { passive: true })

    element.addEventListener('pointerleave', () => resetTilt(element), { passive: true })
  },
  unmounted(element) {
    resetTilt(element)
  },
}
