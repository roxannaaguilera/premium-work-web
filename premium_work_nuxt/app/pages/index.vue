<template>
  <div>
    <Preloader />
    <FixedHeader />
    <main class="bg-[#fdf3eb]">
      <!-- Hero con carrusel 3D -->
      <section id="inicio" class="relative h-screen overflow-hidden">
        <ClientOnly>
          <ElementsCarousel />
        </ClientOnly>
      </section>

      <!-- Overlay SPA para el detalle de servicio -->
      <ServiceOverlay />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// La home usa el overlay SPA para la transición héroe → servicio.
// Las secciones adicionales (WhyUs, Contact, etc.) se migrarán en la siguiente fase.
</script>
