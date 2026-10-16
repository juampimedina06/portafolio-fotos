'use client'

import { useState } from 'react'
import { ExternalLink, Share2, Check } from 'lucide-react'
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
      text: event.description || `Galería de fotos de ${event.title}`,
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
        setTimeout(() => setCopied(false), 2000)
      } catch (clipboardErr) {
        console.error('Error copying to clipboard:', clipboardErr)
      }
    }
  }

  return (
    <article
      onClick={() => onEventClick(event)}
      className="group relative flex items-center justify-between gap-3 sm:gap-4 rounded-full border border-zinc-200/90 bg-white/95 p-2 sm:p-2.5 pr-4 sm:pr-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md cursor-pointer active:scale-[0.99]"
    >
      {/* Flyer Thumbnail en Círculo */}
      <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-full border border-zinc-100 bg-zinc-100 shadow-xs">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt={event.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[10px] text-zinc-400">
            Foto
          </div>
        )}
      </div>

      {/* Información del Evento */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-sm sm:text-base text-zinc-900 group-hover:text-sky-600 transition-colors">
            {event.title}
          </h3>
          {event.is_featured && (
            <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
              Destacado
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 mt-0.5 truncate">
          <span className="font-medium text-zinc-700">{formattedDate}</span>
          {event.location && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="truncate">{event.location}</span>
            </>
          )}
          {event.category && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-400">{event.category}</span>
            </>
          )}
        </div>
      </div>

      {/* Botones de Acción (Share + Link a Entradas) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleShare}
          className="hidden sm:inline-flex size-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
          title="Compartir enlace"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Share2 className="size-3.5" />
          )}
        </button>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#29b6f6] hover:bg-[#0288d1] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors">
          <span>Ver fotos</span>
          <ExternalLink className="size-3" />
        </div>
      </div>
    </article>
  )
}
