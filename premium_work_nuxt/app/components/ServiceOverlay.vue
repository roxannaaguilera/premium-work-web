<script setup lang="ts">
/**
 * Migración de components/ServiceOverlay.tsx (Next.js/React) a Nuxt 3.
 *
 * Overlay SPA para el detalle de servicio: escucha `pw-open-service`
 * (lo emite el carrusel del héroe al clicar un objeto) y renderiza el detalle
 * sin recarga — el objeto nunca desaparece.
 *
 * La ruta /servicios/[slug] sigue existiendo para visitas directas y SEO.
 * Montar este componente una vez en la home (o en app.vue).
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Flight } from './ServiceDetail.vue'

const flight = ref<Flight | null>(null)

function close(): void {
  flight.value = null
  // Restaurar la URL de la home sin recargar.
  if (window.location.pathname !== '/') {
    window.history.pushState({}, '', '/')
  }
}

function onOpen(e: Event): void {
  const f = (e as CustomEvent<Flight>).detail
  if (!f || !f.slug) return
  flight.value = f
  window.history.pushState({ pwService: f.slug }, '', `/servicios/${f.slug}`)
}

function onPop(): void {
  // Botón atrás del navegador: cerrar el overlay.
  flight.value = null
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') close()
}

// Bloquear/desbloquear el scroll del fondo ligado al estado del overlay.
watch(flight, (f) => {
  document.body.style.overflow = f ? 'hidden' : ''
  document.documentElement.style.overflow = f ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('pw-open-service', onOpen)
  window.addEventListener('popstate', onPop)
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('pw-open-service', onOpen)
  window.removeEventListener('popstate', onPop)
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div
    v-if="flight"
    class="fixed inset-0 z-[200] overflow-y-auto bg-[#fdf3eb]"
    role="dialog"
    aria-modal="true"
    :aria-label="flight.slug"
  >
    <ServiceDetail :slug="flight.slug" :initial-flight="flight" :on-close="close" />
  </div>
</template>
