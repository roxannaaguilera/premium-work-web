<template>
  <div>
    <Preloader />
    <FixedHeader />
    <main class="overflow-x-clip bg-[#faf6ee]">
      <!-- Hero con carrusel 3D -->
      <section id="inicio" class="relative h-screen overflow-hidden">
        <ClientOnly>
          <ElementsCarousel />
        </ClientOnly>
      </section>

      <!-- El día del evento: scroll avanza el reloj de la jornada -->
      <ClientOnly>
        <DayJourney />
      </ClientOnly>

      <!-- Escaparate flotante de servicios -->
      <ClientOnly>
        <FloatingShowcase />
      </ClientOnly>

      <!-- Por qué nosotros -->
      <section id="nosotros" aria-label="Por qué Premium Work" class="scroll-mt-20">
        <WhyUs />
      </section>

      <!-- Sectores -->
      <SectorsAccordion />

      <!-- Contacto / solicitar servicio -->
      <ContactSection />

      <Footer />

      <!-- Overlay SPA para el detalle de servicio -->
      <ServiceOverlay />
    </main>
  </div>
</template>

<script setup lang="ts">
// Home concepto Agrumea: header fijo + carrusel 3D a pantalla completa,
// relato del día del evento, escaparate de servicios y cierre comercial.
// El scroll suave (Lenis) se activa vía app/plugins/lenis.client.ts.
// La home usa el overlay SPA para la transición héroe → servicio.
</script>
