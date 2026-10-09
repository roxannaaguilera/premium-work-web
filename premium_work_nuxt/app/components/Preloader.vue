<script setup lang="ts">
// Migración de components/chrome/Preloader.tsx (Next.js/React).
//
// Preloader estilo Agrumea con telón de teatro:
//  1. Ventana beige #fdf3eb con % de carga (0 → 100 en 1.9s).
//  2. Al 100%, el beige se desvanece y queda el telón rayado ya cerrado.
//  3. Una sola apertura del telón hacia los lados (0.85s).
//  4. Fundido del root y desmontaje.
//
// La línea temporal (antes con gsap) se reimplementó con requestAnimationFrame
// + transiciones CSS. Al abrirse el telón se emite el evento
// `pw-curtains-open` (paridad con `signalCurtainsOpening()` de
// components/motion/curtainSignal.ts del proyecto Next.js).
//
// La carga con porcentajes solo se muestra en la primera visita de la sesión
// (flag `pw-booted` en sessionStorage); al volver, el componente no se
// renderiza. IMPORTANTE: debe usarse dentro de `<ClientOnly>` para evitar
// desajustes de hidratación, ya que lee sessionStorage antes del pintado.
//
//   <ClientOnly><Preloader /></ClientOnly>
import { onMounted, onUnmounted, ref } from 'vue'

/** Nombre del evento de apertura del telón (paridad con curtainSignal.ts). */
export const CURTAINS_OPEN_EVENT = 'pw-curtains-open'

const done = ref(false)
const pct = ref(0)
const beigeGone = ref(false)
const curtainsOpen = ref(false)
const rootFaded = ref(false)

// Al volver, marcar como hecho antes del primer pintado: sin parpadeo beige.
// (Solo cliente; el padre debe envolver en <ClientOnly>.)
if (import.meta.client) {
  try {
    if (sessionStorage.getItem('pw-booted') === '1') done.value = true
  } catch {
    /* sin almacenamiento: se muestra la carga */
  }
}

const reduced: boolean =
  import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let cancelled = false
const timers: number[] = []

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    timers.push(window.setTimeout(resolve, ms))
  })
}

/** power2.inOut de gsap ≈ easeInOutCubic. */
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function runCounter(): Promise<void> {
  const duration = 1900
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = (now: number): void => {
      if (cancelled) {
        resolve()
        return
      }
      const p = Math.min(1, (now - start) / duration)
      pct.value = Math.round(easeInOutCubic(p) * 100)
      if (p < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
}

function finish(): void {
  if (cancelled) return
  document.body.style.overflow = ''
  try {
    sessionStorage.setItem('pw-booted', '1')
  } catch {
    /* sin almacenamiento: se repite la carga */
  }
  done.value = true
}

async function run(): Promise<void> {
  if (done.value) return
  document.body.style.overflow = 'hidden'

  if (reduced) {
    await wait(300)
    if (cancelled) return
    rootFaded.value = true
    await wait(400)
    finish()
    return
  }

  // 1. Contador 0 → 100 sobre beige, sin telón encima.
  await runCounter()
  if (cancelled) return
  // 2. El beige se va y deja ver el telón rayado cerrado.
  await wait(80)
  if (cancelled) return
  beigeGone.value = true
  await wait(280 + 120)
  if (cancelled) return
  // 3. Una sola apertura hacia los lados. Los objetos del héroe caen en ese instante.
  window.dispatchEvent(new CustomEvent(CURTAINS_OPEN_EVENT))
  curtainsOpen.value = true
  await wait(850 - 200)
  if (cancelled) return
  rootFaded.value = true
  await wait(250)
  finish()
}

onMounted(() => {
  void run()
})

onUnmounted(() => {
  cancelled = true
  timers.forEach((id) => clearTimeout(id))
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    v-if="!done"
    aria-hidden="true"
    class="fixed inset-0 z-[100]"
    :style="{ opacity: rootFaded ? 0 : 1, transition: 'opacity 0.25s ease' }"
  >
    <!-- Telón rayado cerrado, detrás del porcentaje hasta que este termina -->
    <div
      v-for="i in [0, 1]"
      :key="i"
      data-pl-curtain
      class="absolute top-0 bottom-0 w-1/2"
      :class="i === 0 ? 'left-0' : 'right-0'"
      :style="{
        background:
          'repeating-linear-gradient(90deg, #131834 0px, #131834 22px, #1b2148 22px, #1b2148 44px)',
        transform: curtainsOpen
          ? i === 0
            ? 'translateX(-102%)'
            : 'translateX(102%)'
          : 'translateX(0)',
        transition: 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)',
      }"
    >
      <!-- dobladillo dorado del telón -->
      <div class="absolute inset-x-0 bottom-0 h-1.5 bg-[#eab308]" />
    </div>

    <!-- Ventana beige con porcentaje, por encima del telón -->
    <div
      data-pl-beige
      class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#fdf3eb]"
      :style="{ opacity: beigeGone ? 0 : 1, transition: 'opacity 0.28s ease-in' }"
    >
      <span
        data-pl-num
        class="font-serif text-7xl md:text-8xl font-semibold text-[#131834] tabular-nums"
      >
        {{ pct }}%
      </span>
      <span class="mt-4 text-xs tracking-[0.45em] uppercase text-[#131834]/60 font-semibold">
        Premium Work
      </span>
    </div>
  </div>
</template>
