<template>
  <section ref="rootRef" class="relative overflow-hidden bg-[#0a1428] text-white" :aria-label="t('showcase.aria')">
    <div :class="reduced ? 'relative px-5 py-20' : 'relative h-[220vh]'">
      <div :class="reduced ? 'relative' : 'sticky top-0 flex h-screen flex-col overflow-hidden'">
        <!-- Palabra gigante detrás -->
        <div
          aria-hidden="true"
          class="display pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(4rem,18vw,16rem)] leading-none text-transparent"
          style="-webkit-text-stroke: 1px rgba(255,255,255,0.14)"
        >
          {{ t("showcase.giant") }}
        </div>

        <!-- Mancha orgánica azul royal -->
        <svg
          data-float-blob
          aria-hidden="true"
          viewBox="0 0 600 600"
          class="absolute left-1/2 top-1/2 z-[1] h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2"
        >
          <path
            fill="#2451e6"
            opacity="0.9"
            d="M421 306c0 88-70 172-166 172S76 407 76 311 141 133 251 133s170 85 170 173z"
          />
          <path
            fill="#173aab"
            opacity="0.55"
            d="M470 340c0 70-62 140-148 140s-150-70-150-150 66-140 152-140 146 80 146 150z"
          />
        </svg>

        <!-- Diamantes -->
        <span aria-hidden="true" class="absolute left-[8%] top-[12%] z-[2] text-[#eab308] animate-pulse">◆</span>
        <span aria-hidden="true" class="absolute right-[10%] top-[24%] z-[2] text-[#eab308]/70 text-sm animate-pulse">◆</span>
        <span aria-hidden="true" class="absolute bottom-[14%] left-[42%] z-[2] text-[#eab308]/50 text-xs animate-pulse">◆</span>

        <!-- Titular -->
        <div data-float-head class="relative z-10 mx-auto w-full max-w-[1100px] px-5 pt-24 text-center md:px-8">
          <p class="eyebrow text-[#9db8ff]">{{ t("showcase.eyebrow") }}</p>
          <h2 class="display mx-auto mt-4 max-w-[16ch] text-[clamp(2.2rem,6vw,4.2rem)]">
            {{ t("showcase.titleA") }}<span class="text-[#eab308]">{{ t("showcase.titleB") }}</span>
          </h2>
        </div>

        <!-- Tarjetas flotantes -->
        <div :class="reduced ? 'mx-auto mt-10 grid max-w-[1100px] grid-cols-2 gap-4 px-5 md:grid-cols-3' : 'absolute inset-0 z-[3]'">
          <figure
            v-for="card in cards"
            :key="card.src"
            :data-float-card="!reduced || undefined"
            :data-speed="card.speed"
            :class="reduced
              ? 'overflow-hidden rounded-2xl border border-white/15 bg-white/5'
              : `absolute w-[34vw] max-w-[300px] min-w-[170px] ${card.mobile ? '' : 'hidden md:block'}`"
            :style="reduced ? undefined : { left: card.x, top: card.y, zIndex: card.z, transform: `rotate(${card.r}deg)` }"
          >
            <div :data-float-bob="!reduced || undefined">
              <div class="group overflow-hidden rounded-2xl border border-white/20 bg-[#0a1428] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)] transition-transform duration-300 hover:scale-[1.05] hover:-rotate-1">
                <img :src="card.src" :alt="card.label" loading="lazy" class="aspect-[4/3] w-full rounded-xl object-cover" />
                <figcaption class="flex items-center justify-between px-2 py-2.5">
                  <span class="text-[13px] font-bold tracking-wide">{{ card.label }}</span>
                  <span aria-hidden="true" class="text-[#eab308] text-xs">◆</span>
                </figcaption>
              </div>
            </div>
          </figure>
        </div>

        <!-- Objetos 3D flotantes (acentos sin marco) -->
        <template v-if="!reduced">
          <div
            v-for="obj in objects"
            :key="obj.src"
            data-float-card
            :data-speed="obj.speed"
            aria-hidden="true"
            class="absolute z-[2] pointer-events-none"
            :class="`${obj.size} ${obj.mobile ? '' : 'hidden md:block'}`"
            :style="{ left: obj.x, top: obj.y, transform: `rotate(${obj.r}deg)` }"
          >
            <div data-float-bob>
              <img :src="obj.src" :alt="obj.alt" loading="lazy" class="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)]" />
            </div>
          </div>
        </template>

        <!-- Cloche 3D: sustituye al PNG plano, con giro 360° al hover -->
        <div
          v-if="!reduced"
          data-float-card
          data-speed="110"
          class="absolute z-[2] w-36 md:w-44"
          style="left: 28%; top: 6%; transform: rotate(-10deg)"
        >
          <div data-float-bob>
            <div class="origin-top-left scale-[0.55] cursor-pointer">
              <Cloche3D />
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="relative z-10 mx-auto pb-16 text-center" :class="reduced ? 'mt-10' : 'mt-auto'">
          <a
            href="/solicitar-servicio"
            class="inline-flex items-center rounded-full bg-[#eab308] px-8 py-4 text-[15px] font-bold text-[#0a1428] transition-transform duration-300 hover:scale-[1.04]"
          >
            {{ t("showcase.cta") }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { t, dict } = useLang();

interface CardDef { src: string; x: string; y: string; r: number; speed: number; z: number; mobile: boolean }
interface ObjDef { src: string; alt: string; x: string; y: string; r: number; speed: number; size: string; mobile: boolean }

const CARD_DEFS: CardDef[] = [
  { src: "/images/escaparate-flotante/camareros.jpg", x: "6%", y: "16%", r: -8, speed: 90, z: 3, mobile: true },
  { src: "/images/escaparate-flotante/maitres.jpg", x: "70%", y: "10%", r: 7, speed: -70, z: 2, mobile: true },
  { src: "/images/escaparate-flotante/cocina.jpg", x: "38%", y: "30%", r: -3, speed: 50, z: 4, mobile: true },
  { src: "/images/escaparate-flotante/housekeeping.jpg", x: "14%", y: "60%", r: 6, speed: -90, z: 2, mobile: false },
  { src: "/images/escaparate-flotante/hostess.jpg", x: "72%", y: "58%", r: -6, speed: 80, z: 3, mobile: false },
  { src: "/images/escaparate-flotante/supervisores.jpg", x: "42%", y: "66%", r: 4, speed: -50, z: 5, mobile: false },
];

/** Objetos 3D renderizados flotando sin marco, como acentos entre las tarjetas. */
const OBJECTS: ObjDef[] = [
  { src: "/images/elementos/copa-champagne.png", alt: "Copa de champán", x: "60%", y: "10%", r: 8, speed: -90, size: "w-28 md:w-36", mobile: true },
  { src: "/images/elementos/pajarita.png", alt: "Pajarita", x: "30%", y: "50%", r: 6, speed: -110, size: "w-32 md:w-40", mobile: false },
  { src: "/images/elementos/gorro-chef.png", alt: "Gorro de chef", x: "62%", y: "72%", r: -8, speed: 100, size: "w-36 md:w-44", mobile: false },
];

const cards = computed(() => CARD_DEFS.map((c, i) => ({ ...c, label: dict.value.showcase.cards[i] ?? "" })));
const objects = OBJECTS;

const rootRef = ref<HTMLElement | null>(null);
const reduced = ref(false);
let ctx: gsap.Context | null = null;

onMounted(() => {
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!rootRef.value || reduced.value) return;

  const root = rootRef.value;
  ctx = gsap.context(() => {
    // Parallax con scrub en el contenedor exterior…
    gsap.utils.toArray<HTMLElement>("[data-float-card]").forEach((card) => {
      const speed = Number(card.dataset.speed || 60);
      gsap.fromTo(
        card,
        { y: speed },
        {
          y: -speed,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );
    });

    // …y flotación idle en un wrapper interior (no compiten por el mismo transform)
    gsap.utils.toArray<HTMLElement>("[data-float-bob]").forEach((bob) => {
      gsap.to(bob, {
        y: 14,
        rotation: 1.2,
        duration: 2.6 + Math.random() * 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2,
      });
    });

    // La mancha respira con el scroll
    gsap.fromTo(
      "[data-float-blob]",
      { scale: 0.92 },
      {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
      }
    );

    // Entrada del titular
    gsap.fromTo(
      "[data-float-head]",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%" },
      }
    );
  }, root);
});

onUnmounted(() => ctx?.revert());
</script>
