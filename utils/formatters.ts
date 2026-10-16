/**
 * URL and Date formatting utilities for the public landing page.
 */

/**
 * Normalizes external links to guarantee an absolute protocol (https://).
 * Prevents relative navigation errors (e.g., ticketek.com.ar -> https://ticketek.com.ar).
 */
export function normalizeExternalUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return '#'
  const trimmed = rawUrl.trim()
  if (!trimmed) return '#'
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

/**
 * Normalizes an Instagram username or URL to a valid HTTPS link.
 */
export function normalizeInstagramUrl(handleOrUrl: string | null | undefined): string | null {
  if (!handleOrUrl) return null
  const trimmed = handleOrUrl.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const cleanHandle = trimmed.replace(/^@/, '')
  return `https://instagram.com/${cleanHandle}`
}

/**
 * Normalizes a Google Drive URL to guarantee an absolute protocol.
 */
export function normalizeDriveUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null
  return normalizeExternalUrl(trimmed)
}


/**
 * Builds a direct wa.me URL from a phone number string.
 */
export function buildWhatsAppUrl(phoneNumber: string | null | undefined): string | null {
  if (!phoneNumber) return null
  const digits = phoneNumber.replace(/[^0-9]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

/**
 * Formats an ISO event date string into Spanish format:
 * e.g., "Sáb 24 Oct · 23:00 hs"
 */
export function formatEventDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Fecha a confirmar'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha a confirmar'

    // Format components in Spanish (es-AR locale)
    const weekdayRaw = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(date)
    const day = date.getDate()
    const monthRaw = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(date)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    const capitalize = (text: string) =>
      text.charAt(0).toUpperCase() + text.slice(1).replace('.', '')

    const weekday = capitalize(weekdayRaw)
    const month = capitalize(monthRaw)

    return `${weekday} ${day} ${month} · ${hours}:${minutes} hs`
  } catch {
    return 'Fecha a confirmar'
  }
}
