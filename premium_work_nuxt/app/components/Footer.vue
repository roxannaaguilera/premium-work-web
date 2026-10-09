<script setup lang="ts">
// Migración de components/Footer.tsx (Next.js/React).
//
// DEPENDENCIA: usa el composable `useLang()` (en construcción en paralelo).
// Ver types/lang.d.ts para el contrato documentado.
//
// Los iconos de lucide-react (ArrowUpRight, Mail) se reimplementaron como SVG
// en línea con los mismos paths de Lucide para no añadir dependencias.

const { t, dict } = useLang()

const WHATSAPP_NUMBER = '34604858113'
const NAV_HREFS = ['#inicio', '#servicios', '#nosotros', '#contacto'] as const

const year = new Date().getFullYear()
const navigation = NAV_HREFS.map((href, i) => ({ href, label: dict.value.header.nav[i] ?? href }))
const services: string[] = dict.value.footer.services ?? []

/** Slug de servicio (paridad con la lógica del Footer original). */
function serviceSlug(service: string): string {
  if (service === 'Camareros/as') return 'camareros'
  return service
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(' ', '-')
}
</script>

<template>
  <footer id="contacto" class="scroll-mt-[calc(5rem+1px)] border-t border-white/10 bg-[#0a1428] text-white">
    <div class="mx-auto flex h-full max-w-[1600px] flex-col px-5 py-10 md:px-8 lg:px-10">
      <div class="grid min-h-0 flex-1 gap-8 py-10 md:gap-14 lg:grid-cols-[1.35fr_.65fr] lg:py-14">
        <div class="flex min-h-0 flex-col justify-center">
          <p class="hidden max-w-lg text-sm leading-6 text-white/60 md:block">
            {{ t('footer.tagline') }}
          </p>
          <h2 class="display footer-title mt-4 text-[clamp(2.8rem,5.2vw,5.8rem)] leading-[1.08] text-white md:mt-7">
            {{ t('footer.titleA') }}<em class="box-decoration-clone bg-[#2451e6] px-2 leading-[1.2] text-white not-italic">{{ t('footer.titleB') }}</em>
          </h2>
          <div class="mt-10 flex flex-wrap gap-3 md:mt-12">
            <a href="/solicitar-servicio" class="btn btn-lime group">
              {{ t('footer.request') }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
            </a>
            <a href="mailto:hola@premiumwork.es" class="btn btn-outline-on-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              hola@premiumwork.es
            </a>
          </div>
        </div>

        <div class="flex flex-col items-start gap-7 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:gap-14 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div>
            <p class="eyebrow text-[#9db8ff]">{{ t('footer.sales') }}</p>
            <a
              :href="`https://wa.me/${WHATSAPP_NUMBER}`"
              target="_blank"
              rel="noreferrer"
              class="mt-3 inline-flex items-center gap-2 text-base font-semibold text-white transition hover:text-[#9db8ff]"
            >
              {{ t('footer.whatsapp') }}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
            </a>
            <a href="mailto:hola@premiumwork.es" class="mt-2 block text-sm text-white/60 transition hover:text-white">
              hola@premiumwork.es
            </a>
          </div>
          <div>
            <p class="eyebrow text-[#9db8ff]">{{ t('footer.follow') }}</p>
            <div class="mt-3 flex gap-2">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#2451e6] hover:bg-[#2451e6] hover:text-white">
                <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#2451e6] hover:bg-[#2451e6] hover:text-white">
                <svg class="size-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 8.7H3.4V20h3.1V8.7ZM5 3.7A1.8 1.8 0 1 0 5 7.3a1.8 1.8 0 0 0 0-3.6ZM20.6 13.5c0-3.4-1.8-5-4.3-5-2 0-2.9 1.1-3.4 1.9V8.7H9.8V20h3.1v-5.6c0-1.5.3-3 2.1-3 1.9 0 1.9 1.8 1.9 3.1V20H20v-6.5h.6Z" /></svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#2451e6] hover:bg-[#2451e6] hover:text-white">
                <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H16V3.9c-.4-.1-1.3-.1-2.3-.1-2.4 0-4 1.4-4 4.1V10H7v3h2.7v8h3.8Z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="grid shrink-0 gap-4 border-y border-white/15 py-5 sm:grid-cols-2 lg:grid-cols-[.65fr_1.35fr]">
        <nav :aria-label="t('footer.navAria')" class="flex flex-wrap gap-x-5 gap-y-1">
          <a v-for="item in navigation" :key="item.label" :href="item.href" class="text-sm font-semibold text-white transition hover:text-[#9db8ff]">
            {{ item.label }}
          </a>
        </nav>
        <div class="flex flex-wrap gap-x-5 gap-y-3">
          <a v-for="service in services" :key="service" :href="`/#${serviceSlug(service)}`" class="text-sm text-white/60 transition hover:text-white">
            {{ service }}
          </a>
        </div>
      </div>

      <div class="flex shrink-0 flex-wrap items-center justify-between gap-4 pb-4 pt-5 text-[0.62rem] uppercase tracking-[.12em] text-white/50">
        <p>© {{ year }} Premium Work</p>
        <div class="flex flex-wrap gap-4">
          <a href="/aviso-legal" class="hover:text-white">{{ t('footer.legal.0') }}</a>
          <a href="/politica-de-privacidad" class="hover:text-white">{{ t('footer.legal.1') }}</a>
          <a href="/politica-de-cookies" class="hover:text-white">{{ t('footer.legal.2') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
