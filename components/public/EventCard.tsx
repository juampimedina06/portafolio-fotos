'use client'

import { useState } from 'react'
import {
  Calendar,
  Check,
  ExternalLink,
  ImageIcon,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react'
import type { EventItem } from '@/types/database'
import { formatEventDate, normalizeExternalUrl } from '@/utils/formatters'

interface EventCardProps {
  event: EventItem
  onEventClick: (event: EventItem) => void
}

export function EventCard({ event, onEventClick }: EventCardProps) {
  const [copied, setCopied] = useState(false)
  const formattedDate = formatEventDate(event.event_date)
  const normalizedUrl = normalizeExternalUrl(event.external_link)

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()

    const shareData = {
      title: event.title,
      text: event.description || `Entradas para ${event.title}`,
      url: normalizedUrl,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(normalizedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      } catch (clipboardErr) {
        console.error('Error copying to clipboard:', clipboardErr)
      }
    }
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-zinc-950/80">
      {/* Flyer Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-950">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt={event.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-radial from-zinc-800 to-zinc-950 text-zinc-600">
            <ImageIcon className="size-12 stroke-1 text-zinc-700" />
            <span className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
              Flyer no disponible
            </span>
          </div>
        )}

        {/* Gradient Overlay for Top Badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 pointer-events-none">
          {event.is_featured ? (
            <span className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-md backdrop-blur-md">
              <Sparkles className="size-3 text-amber-400" />
              <span>Destacado</span>
            </span>
          ) : (
            <div />
          )}

          {event.category && (
            <span className="pointer-events-auto inline-flex rounded-full border border-zinc-700/60 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 shadow-md backdrop-blur-md">
              {event.category}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Date & Location Metas */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1 text-zinc-300">
            <Calendar className="size-3.5 text-amber-400/90" />
            <span>{formattedDate}</span>
          </span>

          {event.location && (
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <MapPin className="size-3.5 text-zinc-500" />
              <span className="truncate max-w-40">{event.location}</span>
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="mt-2.5 text-lg font-bold tracking-tight text-zinc-100 transition-colors group-hover:text-amber-300/90">
          {event.title}
        </h3>

        {/* Short Description */}
        {event.description && (
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Spacer to push actions to bottom */}
        <div className="mt-auto pt-5">
          <div className="flex items-center gap-2">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => onEventClick(event)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98] shadow-sm"
            >
              <span>Conseguir Entradas</span>
              <ExternalLink className="size-3.5 text-zinc-950" />
            </button>

            {/* Share Secondary Button */}
            <button
              type="button"
              onClick={handleShare}
              title={copied ? '¡Enlace copiado!' : 'Compartir evento'}
              aria-label="Compartir evento"
              className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
            >
              {copied ? (
                <Check className="size-4 text-emerald-400 animate-in zoom-in-75 duration-200" />
              ) : (
                <Share2 className="size-4" />
              )}

              {/* Copied Feedback Bubble */}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 shadow-lg border border-zinc-700">
                  ¡Copiado!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
