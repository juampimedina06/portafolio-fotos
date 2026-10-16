'use client'

import { Calendar, MapPin, ExternalLink, Star, Image as ImageIcon } from 'lucide-react'

interface EventCardPreviewProps {
  title?: string
  description?: string | null
  external_link?: string
  image_url?: string | null
  event_date?: string | null
  location?: string | null
  category?: string | null
  is_featured?: boolean
}

export function EventCardPreview({
  title = 'Nombre del Evento',
  description = 'Descripción detallada del evento, artista invitado y datos clave.',
  external_link = 'https://entradas.com',
  image_url,
  event_date,
  location = 'Ubicación / Sala',
  category = 'Música',
  is_featured = false,
}: EventCardPreviewProps) {
  const formattedDate = event_date
    ? new Date(event_date).toLocaleString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Fecha por definir'

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-xl transition-all duration-300 hover:border-zinc-700">
      {/* Featured Badge */}
      {is_featured && (
        <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-300 backdrop-blur-md">
          <Star className="size-3 fill-amber-300 text-amber-300" />
          <span>DESTACADO</span>
        </div>
      )}

      {/* Category Tag */}
      {category && (
        <div className="absolute right-3 top-3 z-20 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
          {category}
        </div>
      )}

      {/* Flyer Image Container */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-950">
        {image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image_url}
            alt={title || 'Flyer del evento'}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-600">
            <ImageIcon className="size-8 stroke-1" />
            <span className="text-xs font-light">Sin flyer cargado</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta Info */}
        <div className="mb-2.5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-zinc-300">
            <Calendar className="size-3.5 text-zinc-500" />
            {formattedDate}
          </span>
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-zinc-500" />
              <span className="truncate max-w-35">{location}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-zinc-100">
          {title || 'Título del Evento'}
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {description || 'Sin descripción disponible.'}
        </p>

        {/* CTA Button */}
        <div className="mt-5 pt-3 border-t border-zinc-800/80">
          <a
            href={external_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!external_link) e.preventDefault()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            <span>Conseguir Entradas</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
