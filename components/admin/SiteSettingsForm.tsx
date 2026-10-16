'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { SiteSettings, UpdateSiteSettingsDTO } from '@/types/database'
import { getSiteSettings, updateSiteSettings } from '@/services/settings.service'
import toast from 'react-hot-toast'

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroBgUrl, setHeroBgUrl] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true)
      try {
        const data = await getSiteSettings()
        setSettings(data)
        setHeroTitle(data.hero_title || 'Próximos Eventos')
        setHeroSubtitle(data.hero_subtitle || '')
        setHeroBgUrl(data.hero_bg_url || '')
        setCtaText(data.cta_text || '')
        setInstagramUrl(data.instagram_url || '')
        setWhatsappNumber(data.whatsapp_number || '')
      } catch (err) {
        toast.error('Error al cargar configuración: ' + (err instanceof Error ? err.message : ''))
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!heroTitle.trim()) {
      toast.error('El título principal es obligatorio')
      return
    }

    setIsSaving(true)
    try {
      const payload: UpdateSiteSettingsDTO = {
        hero_title: heroTitle.trim(),
        hero_subtitle: heroSubtitle.trim() || null,
        hero_bg_url: heroBgUrl.trim() || null,
        cta_text: ctaText.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        whatsapp_number: whatsappNumber.trim() || null,
      }

      const updated = await updateSiteSettings(payload)
      setSettings(updated)
      toast.success('Configuración guardada exitosamente')
    } catch (err) {
      toast.error('Error al actualizar configuración: ' + (err instanceof Error ? err.message : ''))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-12">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="size-6 animate-spin text-zinc-800" />
          <p className="text-xs uppercase tracking-wider font-medium">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-8 flex items-baseline justify-between border-b border-zinc-100 pb-5">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Personalizar Portada
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ajustá los textos principales, enlaces de contacto y fondo del inicio
            </p>
          </div>
          {settings && (
            <span className="hidden sm:inline-flex text-[11px] text-zinc-400">
              Actualizado el {new Date(settings.updated_at).toLocaleDateString('es-AR')}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Sección Principal (Hero)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">
                  Título principal *
                </label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Ej: Próximos Eventos & Shows"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">
                  Subtítulo / Bajada
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Ej: Descubrí las fechas de los mejores espectáculos en vivo"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">
                  URL de Imagen de Fondo (Hero)
                </label>
                <input
                  type="url"
                  value={heroBgUrl}
                  onChange={(e) => setHeroBgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              {heroBgUrl && (
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-zinc-500 block mb-1.5 font-medium">
                    Vista previa del fondo:
                  </span>
                  <div className="relative aspect-21/9 w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroBgUrl}
                      alt="Hero background preview"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-3 left-4 text-xs font-medium text-white">
                      Fondo actual cargado
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700">
                  Texto del botón de acción (CTA)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ej: Explorar Cartelera"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>
            </div>
          </div>

          {/* Social Links & Contact */}
          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Canales de Contacto Directo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  URL perfil de Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/tomas_fotos"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Número de WhatsApp (con código de país)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+5491112345678"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar cambios</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
