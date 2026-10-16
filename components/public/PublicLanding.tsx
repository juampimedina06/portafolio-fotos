'use client'

import { useEffect, useMemo, useState } from 'react'
import { InstagramIcon } from './InstagramIcon'
import { MessageCircle, ShieldCheck } from 'lucide-react'
import type { EventItem, SiteSettings } from '@/types/database'
import { getPublicEvents, registerEventClick } from '@/services/events.service'
import { getSiteSettings } from '@/services/settings.service'
import { buildWhatsAppUrl, normalizeExternalUrl, normalizeInstagramUrl } from '@/utils/formatters'
import { EventCard } from './EventCard'
import { EventFilters, type TimeFilterOption } from './EventFilters'
import { EventGridSkeleton } from './EventGridSkeleton'
import { DriftWall } from './DriftWall'
import Link from 'next/link'

interface PublicLandingProps {
  initialEvents?: EventItem[]
  initialSettings?: SiteSettings | null
}

export function PublicLanding({
  initialEvents,
  initialSettings,
}: PublicLandingProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents || [])
  const [settings, setSettings] = useState<SiteSettings | null>(
    initialSettings || null
  )
  const [isLoading, setIsLoading] = useState(!initialEvents || !initialSettings)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>('all')

  // Fetch data on mount if not provided initially
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [fetchedEvents, fetchedSettings] = await Promise.all([
          getPublicEvents(),
          getSiteSettings().catch(() => null),
        ])

        if (isMounted) {
          setEvents(fetchedEvents)
          if (fetchedSettings) setSettings(fetchedSettings)
        }
      } catch (err) {
        console.error('Error fetching public landing data:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  // Fire-and-forget event click tracker + open URL in new tab
  const handleEventClick = (event: EventItem) => {
    const targetUrl = normalizeExternalUrl(event.external_link)

    registerEventClick(event.id).catch((err) => {
      console.error('Failed to register event click:', err)
    })

    if (typeof window !== 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Extract unique categories from current events
  const categories = useMemo(() => {
    const set = new Set<string>()
    events.forEach((ev) => {
      if (ev.category && ev.category.trim()) {
        set.add(ev.category.trim())
      }
    })
    return Array.from(set)
  }, [events])

  // Filter events by temporal range, category and text query
  const filteredEvents = useMemo(() => {
    const now = new Date()

    return events.filter((ev) => {
      // 1. Temporal filter: if 'upcoming', date >= now or date is null (considered valid/pending)
      if (timeFilter === 'upcoming' && ev.event_date) {
        const eventDate = new Date(ev.event_date)
        if (!isNaN(eventDate.getTime()) && eventDate < now) {
          return false
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false
      }

      // 3. Search query filter (title or location)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const titleMatch = ev.title.toLowerCase().includes(query)
        const locationMatch = ev.location
          ? ev.location.toLowerCase().includes(query)
          : false

        if (!titleMatch && !locationMatch) {
          return false
        }
      }

      return true
    })
  }, [events, timeFilter, selectedCategory, searchQuery])

  const instagramHref = normalizeInstagramUrl(settings?.instagram_url)
  const whatsappHref = buildWhatsAppUrl(settings?.whatsapp_number)

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-zinc-900 selection:bg-sky-200">
      {/* Fondo animado 3D interactivo con DriftWall de React Bits */}
      <div className="fixed inset-0 overflow-hidden select-none z-0">
        <DriftWall
          columns={6}
          speed={24}
          tilt={12}
          turn={-10}
          roll={-26}
          variance={0.35}
          parallax={0}
          lift={55}
          dim={0.93}
          tileWidth={190}
          tileHeight={250}
          gap={20}
          radius={16}
          mobileColumns={6}
          mobileTileWidth={110}
          mobileTileHeight={150}
          mobileGap={12}
          mobileRadius={10}
          className="size-full"
        />
        {/* Velo sutil con opacidad para suavizar las fotos del fondo y dar perfecta legibilidad */}
        <div className="absolute inset-0 bg-white/25 backdrop-blur-[0.5px] pointer-events-none" />
      </div>

      {/* Contenido Principal Flotante (pointer-events-none para que el espacio libre interactúe con el DriftWall) */}
      <main className="relative z-10 mx-auto w-full max-w-xl px-4 sm:px-6 py-10 sm:py-14 space-y-6 pointer-events-none">
        {/* Cabecera / Título sin caja grande: solo un contorno y pill ajustado al título */}
        <header className="text-center space-y-2.5 pointer-events-auto">
          <div className="inline-flex items-center justify-center   px-7 py-1.5 ">
            <h1 className="font-[family-name:var(--font-caveat)] text-6xl sm:text-7xl font-bold text-zinc-950 tracking-wide select-none leading-none ">
              Fotos Tom
            </h1>
          </div>

          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-800 [text-shadow:_0_1px_8px_rgba(255,255,255,1),_0_0_2px_white]">
            {settings?.hero_subtitle || 'Portafolio Fotográfico • Shows • Coberturas'}
          </p>

          {/* Botones de Redes Sociales en Píldora */}
          {(instagramHref || whatsappHref) && (
            <div className="flex items-center justify-center gap-2 pt-1">
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-xs hover:border-pink-300 hover:text-pink-600 hover:bg-white transition active:scale-95 backdrop-blur-sm"
                >
                  <InstagramIcon className="size-3.5 text-pink-500" />
                  <span>Instagram</span>
                </a>
              )}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-xs hover:border-emerald-300 hover:text-emerald-600 hover:bg-white transition active:scale-95 backdrop-blur-sm"
                >
                  <MessageCircle className="size-3.5 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          )}
        </header>

        {/* Filtros Estéticos */}
        {!isLoading && events.length > 0 && (
          <div className="pt-2 pointer-events-auto">
            <EventFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              totalCount={filteredEvents.length}
            />
          </div>
        )}

        {/* Lista de Eventos en Tarjetas Píldora */}
        <div className="space-y-3 pt-2 pointer-events-auto">
          {isLoading ? (
            <EventGridSkeleton />
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEventClick={handleEventClick}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-8 text-center backdrop-blur-sm shadow-xs">
              <p className="text-sm font-medium text-zinc-700">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No se encontraron fechas con esos filtros.'
                  : 'No hay eventos publicados por el momento.'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setTimeFilter('all')
                  }}
                  className="mt-3 text-xs font-semibold text-sky-600 hover:underline"
                >
                  Restablecer filtros
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer con Píldora Flotante para no perderse contra el fondo */}
      <footer className="relative z-10 py-6 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/90 px-5 py-1.5 text-xs text-zinc-600 shadow-xs backdrop-blur-md pointer-events-auto">
          <span>Tomás Fotografía & Eventos</span>
          <span className="text-zinc-300">•</span>
          <Link
            href="/admin"
            className="text-zinc-500 hover:text-zinc-900 transition underline-offset-4 hover:underline"
          >
            Acceso Admin
          </Link>
        </div>
      </footer>
    </div>
  )
}
