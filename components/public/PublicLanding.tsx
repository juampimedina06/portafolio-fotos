'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarX, RotateCcw } from 'lucide-react'
import { InstagramIcon } from './InstagramIcon'
import type { EventItem, SiteSettings } from '@/types/database'
import { getPublicEvents, registerEventClick } from '@/services/events.service'
import { getSiteSettings } from '@/services/settings.service'
import { normalizeExternalUrl, normalizeInstagramUrl } from '@/utils/formatters'
import { PublicNavbar } from './PublicNavbar'
import { PublicHero } from './PublicHero'
import { EventCard } from './EventCard'
import { EventFilters, type TimeFilterOption } from './EventFilters'
import { EventGridSkeleton } from './EventGridSkeleton'
import { PublicFooter } from './PublicFooter'

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
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>('upcoming')

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

    // Asynchronous non-blocking tracking
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

  // First featured event for Hero spotlight
  const featuredEvent = useMemo(() => {
    return events.find((ev) => ev.is_featured) || null
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

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setTimeFilter('upcoming')
  }

  const instagramHref = normalizeInstagramUrl(settings?.instagram_url)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
        <PublicNavbar settings={settings} />
        <main className="flex-1 pb-20">
          <EventGridSkeleton />
        </main>
        <PublicFooter settings={settings} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Sticky Blurred Navbar */}
      <PublicNavbar settings={settings} />

      <main className="flex-1 pb-24">
        {/* Dynamic Hero Section */}
        <PublicHero
          settings={settings}
          featuredEvent={featuredEvent}
          onEventClick={handleEventClick}
        />

        {/* Events Grid Section with Anchor */}
        <section id="eventos" className="scroll-mt-20 pt-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Section Header & Filters */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
                  Cartelera de Fechas
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Seleccioná tu evento y conseguí tus entradas antes de que se agoten.
                </p>
              </div>

              {/* Filtering Controls */}
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

            {/* Event Cards Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEventClick={handleEventClick}
                  />
                ))}
              </div>
            ) : (
              /* Clean Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 px-6 py-16 text-center backdrop-blur-sm">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 mb-4 shadow-inner">
                  <CalendarX className="size-7 text-zinc-500" />
                </div>

                <h3 className="text-lg font-bold text-zinc-100">
                  No se encontraron eventos
                </h3>

                <p className="mt-1.5 text-xs text-zinc-400 max-w-md">
                  {searchQuery || selectedCategory !== 'all' || timeFilter !== 'upcoming'
                    ? 'No hay resultados que coincidan con los filtros seleccionados. Probá ajustar la búsqueda.'
                    : 'Actualmente no hay fechas programadas. Seguí las historias en Instagram para no perderte ningún anuncio.'}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {searchQuery || selectedCategory !== 'all' || timeFilter !== 'all' ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700 active:scale-95"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Limpiar filtros</span>
                    </button>
                  ) : null}

                  {instagramHref && (
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
                    >
                      <InstagramIcon className="size-3.5" />
                      <span>Ver novedades en Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <PublicFooter settings={settings} />
    </div>
  )
}
