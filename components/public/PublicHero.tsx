'use client'

import {
  ArrowDown,
  Calendar,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react'
import type { EventItem, SiteSettings } from '@/types/database'
import { formatEventDate } from '@/utils/formatters'

interface PublicHeroProps {
  settings: SiteSettings | null
  featuredEvent?: EventItem | null
  onEventClick: (event: EventItem) => void
}

export function PublicHero({
  settings,
  featuredEvent,
  onEventClick,
}: PublicHeroProps) {
  const title = settings?.hero_title || 'Próximos Eventos & Shows'
  const subtitle =
    settings?.hero_subtitle ||
    'Descubrí las mejores fechas, conseguí tus entradas y no te pierdas ninguna cobertura fotográfica.'
  const ctaText = settings?.cta_text || 'Explorar Cartelera'
  const bgUrl = settings?.hero_bg_url

  const handleScrollToEvents = () => {
    const el = document.getElementById('eventos')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 bg-zinc-950">
      {/* Background Graphic or Image */}
      {bgUrl ? (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgUrl}
            alt="Hero Background"
            className="size-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-zinc-900/40 via-zinc-950 to-zinc-950" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28 text-center">
        {/* Portafolio pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-sm backdrop-blur-md mb-6">
          <Sparkles className="size-3 text-amber-400" />
          <span>Agenda Oficial</span>
        </div>

        {/* H1 Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-6xl md:text-7xl font-sans text-balance leading-none">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto text-balance leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleScrollToEvents}
            className="group inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 active:scale-95 shadow-lg shadow-zinc-950/50"
          >
            <span>{ctaText}</span>
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        {/* Spotlight Featured Event Card */}
        {featuredEvent && (
          <div className="mt-12 text-left mx-auto max-w-2xl">
            <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md transition hover:border-amber-500/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                {/* Featured Flyer Thumbnail */}
                {featuredEvent.image_url && (
                  <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredEvent.image_url}
                      alt={featuredEvent.title}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300 mb-1.5">
                    <Sparkles className="size-3 text-amber-400" />
                    <span>⭐ Evento Destacado</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 truncate">
                    {featuredEvent.title}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1 text-zinc-300">
                      <Calendar className="size-3 text-amber-400" />
                      <span>{formatEventDate(featuredEvent.event_date)}</span>
                    </span>

                    {featuredEvent.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3 text-zinc-500" />
                        <span className="truncate max-w-40">{featuredEvent.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => onEventClick(featuredEvent)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 active:scale-95 shadow-sm"
                  >
                    <span>Entradas</span>
                    <ExternalLink className="size-3 text-zinc-950" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
