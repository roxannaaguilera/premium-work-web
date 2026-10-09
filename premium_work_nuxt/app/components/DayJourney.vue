<template>
  <section
    ref="rootRef"
    class="relative"
    :style="{ height: reduced ? 'auto' : '420vh' }"
    :aria-label="t('journey.aria')"
  >
    <div :class="reduced ? 'relative' : 'sticky top-0 flex h-screen items-center overflow-hidden'">
      <div data-journey-bg class="absolute inset-0" :style="{ backgroundColor: chapters[0]!.bg }" aria-hidden="true" />
      <!-- Dial sol/reloj -->
      <div
        data-journey-dial
        aria-hidden="true"
        class="absolute right-6 top-24 z-20 flex flex-col items-center gap-2 md:right-12"
        :style="{ color: chapters[0]!.ink }"
      >
        <div class="relative h-20 w-20 rounded-full border-2 border-current opacity-70">
          <span class="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current" />
          <span class="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current" />
          <span class="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-current" />
          <span class="absolute right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-current" />
          <div data-journey-hand class="absolute inset-0" style="transform: rotate(-135deg)">
            <span class="absolute left-1/2 top-[8%] h-[42%] w-0.5 -translate-x-1/2 bg-[#eab308]" />
          </div>
          <span class="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2451e6]" />
        </div>
        <span data-journey-clock class="display text-xl tabular-nums">06:00</span>
      </div>

      <!-- Capítulos -->
      <div :class="reduced ? 'relative mx-auto w-full max-w-[1100px] px-5 md:px-8 py-16 space-y-16' : 'absolute inset-0 z-10'">
        <article
          v-for="(c, i) in chapters"
          :key="c.time"
          data-journey-slide
          :class="reduced ? 'relative' : 'absolute inset-0 flex items-center'"
          :style="reduced ? { opacity: 1 } : { opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }"
        >
          <div class="mx-auto w-full max-w-[1100px] px-5 md:px-8">
            <p data-j-label class="eyebrow" :style="{ color: c.sub }">{{ c.time }} · {{ c.label }}</p>
            <h2 data-j-title class="display mt-5 text-[clamp(2.8rem,9vw,6.5rem)]" :style="{ color: c.ink }">
              {{ c.title }}
            </h2>
            <p data-j-text class="mt-6 max-w-[34rem] text-[15px] leading-7 sm:text-lg sm:leading-8" :style="{ color: c.sub }">
              {{ c.text }}
            </p>
            <p data-j-label class="eyebrow mt-8" :style="{ color: c.sub }">
              <span aria-hidden="true" class="text-[#eab308]">◆</span> {{ c.sectors }}
            </p>
          </div>
        </article>
      </div>

      <p data-journey-hint aria-hidden="true" class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 eyebrow" :style="{ color: chapters[0]!.sub }">
        {{ t("journey.hint") }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { t, dict } = useLang();

const CHAPTER_STYLE = [
  { bg: "#f7e8d3", ink: "#131313", sub: "#4a5264" },
  { bg: "#e9f1fb", ink: "#131313", sub: "#4a5264" },
  { bg: "#f3cf8e", ink: "#131313", sub: "#5a4a2a" },
  { bg: "#0a1428", ink: "#ffffff", sub: "#c6d4f5" },
];

const chapters = computed(() =>
  dict.value.journey.chapters.map((c, i) => ({ ...c, ...CHAPTER_STYLE[i]! }))
);

const rootRef = ref<HTMLElement | null>(null);
const reduced = ref(false);
let ctx: gsap.Context | null = null;

onMounted(() => {
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!rootRef.value || reduced.value) return;

  const root = rootRef.value;
  const CHAPTERS = chapters.value;

  ctx = gsap.context(() => {
    const bg = root.querySelector("[data-journey-bg]") as HTMLElement;
    const slides = gsap.utils.toArray<HTMLElement>("[data-journey-slide]");
    const hand = root.querySelector("[data-journey-hand]") as HTMLElement;
    const clock = root.querySelector("[data-journey-clock]") as HTMLElement;
    const dial = root.querySelector("[data-journey-dial]") as HTMLElement;
    const hint = root.querySelector("[data-journey-hint]") as HTMLElement;

    const interpBg = gsap.utils.interpolate(CHAPTERS.map((c) => c.bg));
    const interpInk = gsap.utils.interpolate(CHAPTERS.map((c) => c.ink));
    const interpSub = gsap.utils.interpolate(CHAPTERS.map((c) => c.sub));

    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: CHAPTERS.length - 1,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress * (CHAPTERS.length - 1);
          bg.style.backgroundColor = interpBg(self.progress);
          const ink = interpInk(self.progress);
          const sub = interpSub(self.progress);
          slides.forEach((slide, i) => {
            const dist = Math.abs(p - i);
            const vis = Math.max(0, 1 - dist * 1.4);
            slide.style.opacity = String(vis);
            slide.style.transform = `translateY(${(1 - vis) * 60}px)`;
            slide.style.visibility = vis > 0.02 ? "visible" : "hidden";
            (slide.querySelector("[data-j-title]") as HTMLElement).style.color = ink;
            (slide.querySelector("[data-j-text]") as HTMLElement).style.color = sub;
            (slide.querySelector("[data-j-label]") as HTMLElement).style.color = sub;
          });
          hand.style.transform = `rotate(${self.progress * 270 - 135}deg)`;
          const idx = Math.min(CHAPTERS.length - 1, Math.round(p));
          clock.textContent = CHAPTERS[idx]!.time;
          dial.style.color = ink;
          hint.style.color = sub;
        },
      },
    });

    // Entrada del dial
    gsap.fromTo(
      "[data-journey-dial]",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: root, start: "top 70%" },
      }
    );
  }, root);
});

onUnmounted(() => ctx?.revert());
</script>
