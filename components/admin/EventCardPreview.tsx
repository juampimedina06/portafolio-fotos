'use client'

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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xs transition-all duration-300">
      {/* Featured Badge */}
      {is_featured && (
        <div className="absolute left-3 top-3 z-20 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-medium tracking-wide shadow-xs">
          DESTACADO
        </div>
      )}

      {/* Category Tag */}
      {category && (
        <div className="absolute right-3 top-3 z-20 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-zinc-700 shadow-xs backdrop-blur-xs border border-zinc-200/60">
          {category}
        </div>
      )}

      {/* Flyer Image Container */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-100">
        {image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image_url}
            alt={title || 'Flyer del evento'}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-zinc-400">
            <span className="text-xs font-light">Sin flyer seleccionado</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 space-y-2">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
          <span className="font-medium text-zinc-700">{formattedDate}</span>
          {location && (
            <>
              <span>•</span>
              <span className="truncate max-w-35 text-zinc-500">{location}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-zinc-900">
          {title || 'Título del Evento'}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
          {description || 'Sin descripción disponible.'}
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          <div
            className="flex w-full items-center justify-center rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition pointer-events-none"
          >
            <span>Ver fotos ↗</span>
          </div>
        </div>
      </div>
    </div>
  )
}
