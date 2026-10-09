<template>
  <section :aria-label="t('sectors.aria')" class="relative overflow-hidden bg-white py-10 md:py-16">
    <div aria-hidden="true" class="hero-dots pointer-events-none absolute inset-0" />
    <div class="relative z-10 mx-auto grid w-full max-w-[1600px] gap-6 px-5 md:gap-12 md:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-24 lg:px-10">
      <div class="lg:sticky lg:top-28 lg:self-start">
        <p class="eyebrow flex items-center gap-2 text-[#131313]/60">
          <span class="text-[#eab308]" aria-hidden="true">◆</span> {{ t("sectors.eyebrow") }}
        </p>
        <h2 class="display mt-4 text-3xl leading-[1.02] text-[#131313] md:mt-6 md:text-[clamp(2.5rem,5vw,4.5rem)]">
          {{ t("sectors.titleA") }}<br />{{ t("sectors.titleB") }}
        </h2>
        <p class="mt-6 hidden max-w-md text-base leading-7 text-[#131313]/70 md:block">
          {{ t("sectors.copy") }}
        </p>
        <a
          href="/solicitar-servicio"
          class="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2451e6] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b45c4] md:mt-8"
        >
          {{ t("sectors.cta") }}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>

      <div class="border-t border-[#131313]/15">
        <div v-for="(sector, index) in sectors" :key="sector.slug" class="border-b border-[#131313]/15">
          <button
            type="button"
            :aria-expanded="open === index"
            :aria-controls="`sector-panel-${sector.slug}`"
            class="group flex w-full items-center justify-between gap-6 py-3 text-left md:py-4"
            @click="open = open === index ? null : index"
          >
            <span
              class="display text-xl transition-colors md:text-[1.75rem]"
              :class="open === index ? 'text-[#173aab]' : 'text-[#131313] group-hover:text-[#173aab]'"
            >
              {{ sector.title }}
            </span>
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-full border transition-all md:size-10"
              :class="open === index ? 'rotate-180 border-[#2451e6] bg-[#2451e6] text-white' : 'border-[#131313]/25 text-[#131313]/70 group-hover:border-[#173aab]/60'"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div
            :id="`sector-panel-${sector.slug}`"
            role="region"
            class="grid transition-[grid-template-rows] duration-300 ease-out"
            :class="open === index ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'"
          >
            <div class="overflow-hidden">
              <div class="pb-7 pr-4 md:pr-16">
                <p class="max-w-xl text-base leading-7 text-[#131313]/70">{{ sector.copy }}</p>
                <a
                  :href="`/solicitar-servicio?sector=${sector.slug}`"
                  class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#173aab] transition hover:gap-3"
                >
                  {{ t("sectors.requestFor") }} {{ sector.title.toLowerCase() }}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { t, dict } = useLang();

const SLUGS = ["hoteles", "restaurantes", "catering", "eventos-corporativos", "eventos-deportivos", "festivales", "bodas-y-celebraciones", "experiencias-privadas"];
const sectors = dict.value.sectors.items.map((s, i) => ({ ...s, slug: SLUGS[i] ?? `sector-${i}` }));

const open = ref<number | null>(0);
</script>
