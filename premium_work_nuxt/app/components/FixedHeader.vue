<script setup lang="ts">
// Migración de components/chrome/FixedHeader.tsx (Next.js/React).
//
// DEPENDENCIA: usa el composable `useLang()` (en construcción en paralelo).
// Ver types/lang.d.ts para el contrato documentado.
//
// La animación de apertura del menú (antes con gsap) se reimplementó con
// <Transition> de Vue + transiciones CSS con stagger por índice.
// Hook opcional de Lenis: si el proyecto expone la instancia global en
// `window.__lenis`, se detiene/reanuda con el menú; si no, se ignora.
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const { lang, setLang, t, dict } = useLang()

const LINK_HREFS = ['#inicio', '#servicios', '#nosotros', '#contacto'] as const

const scrolled = ref(false)
const open = ref(false)

const links = computed(() =>
  LINK_HREFS.map((href, i) => ({ href, label: dict.value.header.nav[i] ?? href })),
)

interface LenisLike {
  stop: () => void
  start: () => void
}

function getLenis(): LenisLike | null {
  // Integración opcional con Lenis (paridad con lib/lenis-instance del
  // proyecto Next.js). Conectar aquí cuando el proyecto Nuxt la exponga.
  try {
    const w = window as unknown as { __lenis?: LenisLike }
    return w.__lenis ?? null
  } catch {
    return null
  }
}

function onScroll(): void {
  scrolled.value = window.scrollY > 40
}

function close(): void {
  open.value = false
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

// Bloqueo de scroll del fondo mientras el menú está abierto.
watch(open, (isOpen) => {
  if (isOpen) {
    getLenis()?.stop()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    getLenis()?.start()
  }
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-[60] transition-all duration-300"
    :class="
      scrolled
        ? 'bg-[#fdf3eb]/90 backdrop-blur-md border-b border-[#131834]/10'
        : 'bg-transparent border-b border-transparent'
    "
  >
    <div class="grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 pt-7 md:pt-9 pb-3">
      <div class="justify-self-start">
        <div role="group" aria-label="Language / Idioma" class="flex items-center gap-2">
          <button
            v-for="l in (['es', 'en'] as const)"
            :key="l"
            type="button"
            :aria-pressed="lang === l"
            :aria-label="l === 'es' ? 'Español' : 'English'"
            class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            :class="
              lang === l
                ? 'bg-[#131834] text-[#faf6ee]'
                : 'border border-[#131834]/25 text-[#131834]/60 hover:border-[#131834]/60 hover:text-[#131834]'
            "
            @click="setLang(l)"
          >
            {{ l }}
          </button>
        </div>
      </div>

      <a :href="'#inicio'" :aria-label="t('header.logoLabel')" class="block justify-self-center">
        <img :src="'/images/logo-premium-work.png'" alt="Premium Work" class="h-28 md:h-36 w-auto" />
      </a>

      <div class="flex items-center gap-2 justify-self-end">
        <button
          type="button"
          :aria-haspopup="'dialog'"
          :aria-expanded="open"
          class="inline-flex items-center rounded-full bg-[#131834] px-5 py-2 text-sm font-semibold tracking-wide text-[#faf6ee] hover:bg-[#1e2450] transition-colors"
          @click="open = true"
        >
          {{ t('header.menu') }}
        </button>
        <button
          type="button"
          :aria-haspopup="'dialog'"
          :aria-expanded="open"
          :aria-label="t('header.openMenu')"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-[#131834] hover:bg-[#1e2450] transition-colors"
          @click="open = true"
        >
          <span aria-hidden="true" class="inline-block h-2.5 w-2.5 rotate-45 bg-[#eab308]" />
        </button>
      </div>
    </div>
  </header>

  <!-- Menú a pantalla completa -->
  <Transition name="menu">
    <div
      v-if="open"
      role="dialog"
      aria-modal="true"
      :aria-label="t('header.menuLabel')"
      class="fixed inset-0 z-[70] flex flex-col bg-[#131834] text-[#faf6ee]"
    >
      <div class="grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 pt-7 md:pt-9 pb-3">
        <div aria-hidden="true" />
        <span
          class="font-serif text-xl md:text-2xl tracking-[0.25em] font-semibold justify-self-center"
        >
          PREMIUM WORK
        </span>
        <div class="flex items-center justify-self-end">
          <button
            type="button"
            :aria-label="t('header.closeMenu')"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-[#faf6ee]/40 text-[#faf6ee] hover:bg-[#faf6ee] hover:text-[#131834] transition-colors"
            @click="close"
          >
            <span aria-hidden="true" class="text-lg leading-none">✕</span>
          </button>
        </div>
      </div>

      <nav class="flex flex-1 items-center px-5 md:px-16">
        <ul class="space-y-2 md:space-y-4">
          <li
            v-for="(l, i) in links"
            :key="l.href"
            class="menu-item"
            :style="{ transitionDelay: `${120 + i * 70}ms` }"
          >
            <a :href="l.href" class="group flex items-baseline gap-4 md:gap-6" @click="close">
              <span class="text-sm text-[#faf6ee]/50 font-mono">0{{ i + 1 }}</span>
              <span
                class="font-serif text-5xl md:text-7xl font-semibold leading-tight text-[#faf6ee] group-hover:text-[#eab308] transition-colors"
              >
                {{ l.label }}
              </span>
            </a>
          </li>
        </ul>
      </nav>

      <div
        class="flex flex-col md:flex-row gap-2 md:items-center md:justify-between px-5 md:px-16 pb-8 text-sm text-[#faf6ee]/70"
      >
        <span>{{ t('header.tagline') }}</span>
        <a
          href="#contacto"
          class="underline underline-offset-4 hover:text-[#eab308]"
          @click="close"
        >
          {{ t('header.requestService') }} →
        </a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Apertura del overlay: fundido + leve deslizamiento (antes gsap power3.out 0.45s) */
.menu-enter-active {
  transition:
    opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-leave-active {
  transition: opacity 0.3s ease-in;
}
.menu-enter-from {
  opacity: 0;
  transform: translateY(-4%);
}
.menu-leave-to {
  opacity: 0;
}
/* Stagger de los enlaces (antes gsap stagger 0.07s, delay 0.12s) */
.menu-enter-active .menu-item {
  transition:
    opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-enter-from .menu-item {
  opacity: 0;
  transform: translateY(44px);
}
.menu-leave-active .menu-item {
  transition: opacity 0.2s ease-in;
  transition-delay: 0ms !important;
}
.menu-leave-to .menu-item {
  opacity: 0;
}
</style>
