<template>
  <section id="contacto" :aria-label="t('contact.aria')" class="scroll-mt-20 bg-white">
    <div class="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <p class="text-xs tracking-[0.35em] uppercase text-[#131834]/60 font-semibold">
        {{ t("contact.eyebrow") }}
      </p>
      <h2 class="mt-3 font-serif text-3xl md:text-5xl font-semibold text-[#131834]">
        {{ t("contact.title") }}
      </h2>
      <p class="mt-4 text-[#131834]/70">
        {{ t("contact.copy") }}
      </p>
      <div class="mt-8">
        <ClientForm />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLang();
</script>
