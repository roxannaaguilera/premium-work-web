<template>
  <section
    id="nosotros"
    class="relative scroll-mt-[calc(5rem+1px)] overflow-hidden bg-[linear-gradient(165deg,#0a1428_0%,#0a1428_58%,#060d1f_100%)] py-14 text-white md:py-28"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(80,130,255,.14)_0%,transparent_62%)]"
    />
    <div class="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-10">
      <header
        ref="headRef"
        class="reveal grid gap-4 md:grid-cols-[.65fr_1.35fr] md:items-end md:gap-12"
      >
        <p class="eyebrow flex items-center gap-2 text-white/60">
          <span class="text-[#eab308]" aria-hidden="true">◆</span> {{ t("why.eyebrow") }}
        </p>
        <h2 class="display max-w-4xl text-[clamp(2.5rem,5.4vw,5.4rem)] text-white">
          {{ t("why.titleA") }}<em class="box-decoration-clone bg-[#2451e6] px-2 not-italic text-white">{{ t("why.titleB") }}</em>
        </h2>
      </header>

      <div class="mt-8 grid gap-3 md:mt-16 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <article
          v-for="(benefit, index) in benefits"
          :key="benefit.title"
          ref="cardRefs"
          class="reveal group rounded-2xl border border-white/15 bg-white/[.05] p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#2451e6]/70 hover:bg-white/[.08] hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,.5)] md:rounded-[20px] md:p-7"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <p class="display text-3xl leading-none text-[#9db8ff] transition-transform duration-300 group-hover:scale-105 md:text-6xl">
            /{{ String(index + 1).padStart(2, "0") }}
          </p>
          <h3 class="mt-4 text-base font-bold leading-snug text-white md:mt-7 md:text-lg">{{ benefit.title }}</h3>
          <p class="mt-1 text-sm leading-6 text-white/80 md:mt-2">{{ benefit.copy }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const { t, dict } = useLang();
const benefits = dict.value.why.benefits;

const headRef = ref<HTMLElement | null>(null);
const cardRefs = ref<HTMLElement[]>([]);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "-60px" }
  );
  const targets: Element[] = [];
  if (headRef.value) targets.push(headRef.value);
  targets.push(...cardRefs.value);
  targets.forEach((el) => observer?.observe(el));
});

onUnmounted(() => observer?.disconnect());
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
