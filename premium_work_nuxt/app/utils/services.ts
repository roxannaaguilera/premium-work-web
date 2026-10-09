/**
 * Slugs de servicio vigentes en Premium Work.
 * Bodas y celebraciones se retiró del carrusel el 09/10/2026 (a petición de Roxanna).
 */
export const SERVICE_SLUGS = [
  'hoteles',
  'restaurantes',
  'catering',
  'eventos-corporativos',
  'eventos-deportivos',
  'festivales',
  'experiencias-privadas',
] as const

export type ServiceSlug = (typeof SERVICE_SLUGS)[number]

/** Comprueba si un slug corresponde a un servicio vigente. */
export function isServiceSlug(slug: string): slug is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(slug)
}
