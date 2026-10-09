<script setup lang="ts">
/**
 * Migración de app/servicios/[slug]/page.tsx (Next.js) a Nuxt 3.
 * Ruta dinámica para los 7 slugs de servicio vigentes; cualquier otro → 404.
 */
import { isServiceSlug } from '../../utils/services'

const route = useRoute()
const { dict } = useLang()

const slug = computed(() => String(route.params.slug))

if (!isServiceSlug(slug.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Servicio no encontrado' })
}

const pageTitle = computed(() => {
  const i = dict.value.serviceDetail.items.findIndex((it: { slug: string }) => it.slug === slug.value)
  const title = i >= 0 ? dict.value.sectors.items[i]?.title : slug.value
  return `${title} — Premium Work`
})

useHead({
  title: pageTitle,
})
</script>

<template>
  <ServiceDetail :slug="slug" />
</template>
