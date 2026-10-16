'use client'

import { useEffect, useState } from 'react'
import {
  Sliders,
  Check,
  Loader2,
  Phone,
  Image as ImageIcon,
  Type,
  FileText,
  MousePointer,
  Sparkles,
} from 'lucide-react'
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
      <div className="flex min-h-100 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="size-8 animate-spin text-zinc-200" />
          <p className="text-xs uppercase tracking-wider">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100">
              <Sliders className="size-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">
                Personalizar Portada e Inicio
              </h2>
              <p className="text-xs text-zinc-400">
                Ajustá los textos principales, enlaces de contacto y fondo del Hero
              </p>
            </div>
          </div>
          {settings && (
            <span className="hidden sm:inline-flex text-[11px] text-zinc-500">
              Última actualización: {new Date(settings.updated_at).toLocaleDateString('es-AR')}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Sección Principal (Hero)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Type className="size-3.5 text-zinc-500" />
                  Título Principal del Hero *
                </label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Ej: Próximos Eventos & Shows"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <FileText className="size-3.5 text-zinc-500" />
                  Subtítulo / Bajada
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Ej: Descubrí las fechas de los mejores espectáculos en vivo"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-zinc-500" />
                  URL de Imagen de Fondo del Hero
                </label>
                <input
                  type="url"
                  value={heroBgUrl}
                  onChange={(e) => setHeroBgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              {heroBgUrl && (
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-zinc-400 block mb-1">
                    Vista previa de imagen de fondo:
                  </span>
                  <div className="relative aspect-21/9 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroBgUrl}
                      alt="Hero background preview"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-3 left-4 text-xs font-medium text-white">
                      Fondo cargado
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <MousePointer className="size-3.5 text-zinc-500" />
                  Texto del Botón de Acción Principal (CTA)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ej: Explorar Cartelera"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Links & Contact */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Canales de Contacto Directo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <svg
                    className="size-3.5 text-zinc-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  URL Perfil de Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/tomas_fotos"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-zinc-500" />
                  Número de WhatsApp (con código de país)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+5491112345678"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50 shadow-md"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-zinc-950" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5 text-zinc-950" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
