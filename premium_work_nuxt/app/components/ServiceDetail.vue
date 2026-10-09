<script setup lang="ts">
/**
 * Migración de components/ServiceDetail.tsx (Next.js/React) a Nuxt 3 (Vue).
 *
 * - Título del servicio en grande (2 líneas) y objeto PNG abajo, asomando la mitad.
 * - Al hacer scroll, el objeto sube y se centra sobre las letras reduciéndose
 *   (progreso ligado al scroll con listener nativo + rAF; sin framer-motion).
 * - Transición de entrada tipo Agrumea: si hay datos de vuelo (prop
 *   `initialFlight`, estado Nuxt `pw-flight` o sessionStorage `pw-flight`),
 *   un clon vuela desde el rect del héroe hasta el reposo con coreografía
 *   (crece → cae con rebote, 1.65 s, Web Animations API) y cede al objeto real
 *   por crossfade; las letras caen tras el aterrizaje.
 * - Sin vuelo (visita directa): el objeto entra con coreografía directa (2 s).
 * - Clic en el objeto: vuelve a `/` (página) o llama a `onClose` (overlay SPA).
 */

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { isServiceSlug } from '../utils/services'

/** Datos del vuelo del clon, emitidos por el carrusel en `pw-open-service`. */
export interface Flight {
  src: string
  slug: string
  fromY: number
  fromH: number
  rotate: number
}

const props = defineProps<{
  slug: string
  initialFlight?: Flight | null
  onClose?: () => void
}>()

const { dict } = useLang()

const items = computed(() => dict.value.serviceDetail.items)
const idx = computed(() => items.value.findIndex((i: { slug: string }) => i.slug === props.slug))
const item = computed(() => items.value[idx.value]!)
const sector = computed(() => dict.value.sectors.items[idx.value]!)
const lines = computed(() => splitTitle(sector.value.title.toUpperCase()))
const logoLabel = computed(() => dict.value.header.logoLabel)

const others = computed(() =>
  items.value
    .map((o: { slug: string; img: string }, i: number) => ({ ...o, title: dict.value.sectors.items[i]?.title ?? o.slug }))
    .filter((o: { slug: string }) => o.slug !== props.slug && isServiceSlug(o.slug)),
)

/** Divide un título en dos líneas equilibradas (p. ej. EVENTOS / PRIVADOS). */
function splitTitle(title: string): string[] {
  const words = title.split(' ')
  if (words.length === 1) return [title]
  let best = 1
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length
    const b = words.slice(i).join(' ').length
    const d = Math.abs(a - b)
    if (d < bestDiff) {
      bestDiff = d
      best = i
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

const from = ref<{ dx: number; dy: number } | null>(null)
const ready = ref(false)
const flight = ref<Flight | null>(props.initialFlight ?? null)
const landed = ref(false)
const scrollP = ref(0)
const titleVisible = ref(false)

/** Estado Nuxt compartido para el vuelo (lo fijaría quien navegue con navigateTo). */
const sharedFlight = useState<Flight | null>('pw-flight', () => null)

const secRef = ref<HTMLElement | null>(null)
const cloneRef = ref<HTMLElement | null>(null)
const entryRef = ref<HTMLElement | null>(null)

let cloneAnim: Animation | null = null
let entryAnim: Animation | null = null
let rafId = 0
let scrollQueued = false

/**
 * Progreso 0→1 del tramo sticky: 0 cuando la sección toca arriba del viewport,
 * 1 cuando su final toca abajo (equivale al offset ["start start", "end end"]).
 * Se mide con getBoundingClientRect, así funciona tanto con scroll de ventana
 * (página) como con scroll del contenedor (overlay).
 */
function measureScroll(): void {
  scrollQueued = false
  const el = secRef.value
  if (!el || typeof window === 'undefined') return
  const total = el.offsetHeight - window.innerHeight
  scrollP.value =
    total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0
}

function onScroll(): void {
  if (scrollQueued) return
  scrollQueued = true
  rafId = requestAnimationFrame(measureScroll)
}

/** El objeto sube 50vh y se encoge a 0.35 durante el primer 60% del scroll. */
const riseStyle = computed(() => {
  const t = Math.min(scrollP.value / 0.6, 1)
  return {
    transform: `translateY(${(-50 * t).toFixed(2)}vh) scale(${(1 - 0.65 * t).toFixed(4)})`,
    willChange: 'transform' as const,
  }
})

/** Clon volador: crece → cae con rebote (1.65 s). Al terminar cede al real. */
function startCloneFlight(): void {
  const f = flight.value
  const el = cloneRef.value
  if (!f || !el || typeof window === 'undefined') return
  const vh = window.innerHeight
  // Estado inicial en línea para evitar un flash antes del primer fotograma.
  el.style.height = `${f.fromH}px`
  el.style.transform = `translateY(0px) rotate(${f.rotate}deg)`
  cloneAnim?.cancel()
  cloneAnim = el.animate(
    [
      {
        height: `${f.fromH}px`,
        transform: `translateY(0px) rotate(${f.rotate}deg)`,
        offset: 0,
        easing: 'ease-out',
      },
      {
        height: `${f.fromH * 1.35}px`,
        transform: `translateY(-70px) rotate(${f.rotate}deg)`,
        offset: 0.35,
        easing: 'ease-in',
      },
      {
        height: `${vh * 0.62 * 1.02}px`,
        transform: `translateY(${(vh * 0.7 - f.fromY + 22).toFixed(1)}px) rotate(-3deg)`,
        offset: 0.8,
        easing: 'ease-out',
      },
      {
        height: `${vh * 0.62}px`,
        transform: `translateY(${(vh * 0.7 - f.fromY).toFixed(1)}px) rotate(0deg)`,
        offset: 1,
      },
    ],
    { duration: 1650, fill: 'forwards' },
  )
  cloneAnim.onfinish = () => {
    landed.value = true
  }
}

/** Entrada directa coreografiada (2 s): avanza agrandándose y cae con rebote. */
function startEntry(): void {
  const el = entryRef.value
  const fr = from.value
  if (!el || !fr || typeof window === 'undefined') return
  el.style.transform = `translate(${fr.dx}px, ${fr.dy}px) scale(1.14) rotate(-22deg)`
  entryAnim?.cancel()
  entryAnim = el.animate(
    [
      {
        transform: `translate(${fr.dx}px, ${fr.dy}px) scale(1.14) rotate(-22deg)`,
        offset: 0,
        easing: 'ease-out',
      },
      {
        transform: `translate(${(fr.dx * 0.4).toFixed(1)}px, ${(fr.dy - 100).toFixed(1)}px) scale(1.5) rotate(-22deg)`,
        offset: 0.38,
        easing: 'ease-in',
      },
      {
        transform: `translate(0px, 26px) scale(0.94) rotate(-4deg)`,
        offset: 0.78,
        easing: 'ease-out',
      },
      { transform: `translate(0px, 0px) scale(1) rotate(0deg)`, offset: 1 },
    ],
    { duration: 2000, fill: 'forwards' },
  )
}

function handleBackClick(): void {
  props.onClose?.()
}

/**
 * (Re)inicializa el estado para un slug. Se llama al montar y si cambia el slug
 * (p. ej. navegando entre servicios con NuxtLink sin remontar la página).
 * La lectura de sessionStorage/estado se hace solo en cliente para no romper
 * la hidratación: el servidor renderiza siempre sin vuelo.
 */
async function init(slug: string): Promise<void> {
  cloneAnim?.cancel()
  entryAnim?.cancel()
  landed.value = false
  titleVisible.value = false
  scrollP.value = 0
  ready.value = false

  const vw = window.innerWidth
  const vh = window.innerHeight
  let dx = 0
  let dy = vh * 0.45
  try {
    const raw = sessionStorage.getItem('pw-element-from')
    if (raw) {
      const p = JSON.parse(raw) as { x: number; y: number; slug: string }
      sessionStorage.removeItem('pw-element-from')
      if (p.slug === slug) {
        dx = p.x - vw / 2
        dy = p.y - vh * 0.74
      }
    }
  } catch {
    /* visita directa: entra desde abajo */
  }
  from.value = { dx, dy }

  // Vuelo: prop (overlay) > estado Nuxt (navegación cliente) > sessionStorage.
  if (!flight.value || flight.value.slug !== slug) {
    flight.value = null
    if (sharedFlight.value && sharedFlight.value.slug === slug) {
      flight.value = sharedFlight.value
      sharedFlight.value = null
    } else {
      try {
        const raw = sessionStorage.getItem('pw-flight')
        if (raw) {
          const f = JSON.parse(raw) as Flight
          sessionStorage.removeItem('pw-flight')
          if (f.slug === slug) flight.value = f
        }
      } catch {
        /* sin vuelo: entrada directa */
      }
    }
  }

  ready.value = true
  await nextTick()
  if (flight.value) {
    startCloneFlight()
  } else {
    startEntry()
    // Las letras caen con retardo; el CSS aplica el transition-delay.
    titleVisible.value = true
  }
  measureScroll()
}

// Las letras caen tras el aterrizaje del clon (el CSS aplica el retardo).
watch(landed, (v) => {
  if (v) titleVisible.value = true
})

watch(
  () => props.slug,
  (s) => {
    void init(s)
  },
)

onMounted(() => {
  void init(props.slug)
  // capture:true para cazar también el scroll del contenedor del overlay.
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
  window.addEventListener('resize', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(rafId)
  cloneAnim?.cancel()
  entryAnim?.cancel()
})
</script>

<template>
  <FixedHeader />

  <!-- Clon volador (sin panel): vuela desde el rect del héroe hasta el reposo -->
  <div
    v-if="flight && !landed"
    aria-hidden="true"
    class="pointer-events-none fixed inset-x-0 z-[100] flex justify-center"
    :style="{ top: `${flight!.fromY}px` }"
  >
    <div ref="cloneRef">
      <img :src="flight!.src" alt="" draggable="false" class="h-full w-auto select-none" />
    </div>
  </div>

  <main class="bg-[#fdf3eb] text-[#131834]">
    <!-- Nombre centrado + elemento que sube con el scroll -->
    <section ref="secRef" :aria-label="sector.title" class="relative h-[240vh]">
      <div class="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <h1
          class="svc-title z-10 px-4 text-center font-serif font-semibold uppercase leading-[0.9] tracking-tight text-[#131834] text-[clamp(3.5rem,13vw,12rem)]"
          :class="{ 'is-visible': titleVisible }"
          :style="{ transitionDelay: flight ? '0.3s' : '1.7s' }"
        >
          <span v-for="(l, i) in lines" :key="i" class="block">{{ l }}</span>
        </h1>
        <!-- Entrada desde el hero (fuera) + subida con scroll (dentro).
             En reposo asoma la mitad del objeto sin tapar el nombre.
             La entrada es una coreografía lenta: el objeto avanza hacia la
             pantalla agrandándose (manteniendo la inclinación del hover) y
             luego cae con rebote hasta su posición final. -->
        <div class="pointer-events-none absolute inset-x-0 -bottom-[32vh] z-20 flex justify-center">
          <template v-if="flight">
            <!-- Relevo del clon volador: aparece al aterrizar (crossfade invisible) -->
            <div :style="{ opacity: landed ? 1 : 0, transition: 'opacity 250ms ease' }">
              <div :style="riseStyle" class="pointer-events-auto">
                <button
                  v-if="onClose"
                  type="button"
                  :aria-label="logoLabel"
                  :title="logoLabel"
                  class="block cursor-pointer"
                  @click="handleBackClick"
                >
                  <img
                    :src="item.img"
                    :alt="sector.title"
                    class="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                  />
                </button>
                <NuxtLink
                  v-else
                  to="/"
                  :aria-label="logoLabel"
                  :title="logoLabel"
                  class="block cursor-pointer"
                >
                  <img
                    :src="item.img"
                    :alt="sector.title"
                    class="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                  />
                </NuxtLink>
              </div>
            </div>
          </template>
          <template v-else-if="ready">
            <div ref="entryRef">
              <div :style="riseStyle" class="pointer-events-auto">
                <button
                  v-if="onClose"
                  type="button"
                  :aria-label="logoLabel"
                  :title="logoLabel"
                  class="block cursor-pointer"
                  @click="handleBackClick"
                >
                  <img
                    :src="item.img"
                    :alt="sector.title"
                    class="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                  />
                </button>
                <NuxtLink
                  v-else
                  to="/"
                  :aria-label="logoLabel"
                  :title="logoLabel"
                  class="block cursor-pointer"
                >
                  <img
                    :src="item.img"
                    :alt="sector.title"
                    class="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                  />
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Descripción y qué incluye -->
    <section class="px-5 md:px-10 py-14 md:py-20">
      <p class="max-w-2xl font-serif text-2xl md:text-3xl italic text-[#131834]/85">
        {{ item.tagline }}
      </p>
      <p class="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-[#131834]/85">
        {{ sector.copy }}
      </p>
      <h2 class="mt-12 text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
        {{ dict.serviceDetail.includesTitle }}
      </h2>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2 max-w-4xl">
        <li
          v-for="inc in item.includes"
          :key="inc"
          class="flex items-start gap-3 text-base md:text-lg"
        >
          <span
            aria-hidden="true"
            class="mt-2 inline-block h-2.5 w-2.5 shrink-0 rotate-45 bg-[#d9a83f]"
          />
          <span>{{ inc }}</span>
        </li>
      </ul>
      <NuxtLink
        :to="`/solicitar-servicio?sector=${slug}`"
        class="mt-10 inline-flex items-center gap-3 rounded-full bg-[#131834] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#faf6ee] transition-colors hover:bg-[#1e2450]"
      >
        <span aria-hidden="true" class="inline-block h-2.5 w-2.5 rotate-45 bg-[#eab308]" />
        {{ dict.serviceDetail.cta }}
      </NuxtLink>
    </section>

    <!-- Los otros servicios -->
    <section class="border-t border-[#131834]/10 px-5 md:px-10 py-14 md:py-20">
      <h2 class="text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
        {{ dict.serviceDetail.otherTitle }}
      </h2>
      <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <NuxtLink
          v-for="o in others"
          :key="o.slug"
          :to="`/servicios/${o.slug}`"
          class="group rounded-2xl bg-[#faf6ee] p-5 transition-transform hover:-translate-y-1"
        >
          <img
            :src="o.img"
            alt=""
            class="mx-auto h-28 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <p class="mt-4 text-center text-sm font-bold uppercase tracking-wider text-[#131834]">
            {{ o.title }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </main>
  <Footer />
</template>

<style scoped>
.svc-title {
  opacity: 0;
  transform: translateY(-96px);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.svc-title.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
