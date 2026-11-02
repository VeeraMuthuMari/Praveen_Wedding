import { onMounted, onUnmounted } from 'vue'

export function useReveal() {
  let observer

  onMounted(() => {
    const targets = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((element) => element.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })

    targets.forEach((element) => observer.observe(element))
  })

  onUnmounted(() => observer?.disconnect())
}
