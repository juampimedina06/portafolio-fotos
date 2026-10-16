import Link from 'next/link'
import { Camera, MessageCircle } from 'lucide-react'
import { InstagramIcon } from './InstagramIcon'
import type { SiteSettings } from '@/types/database'
import { buildWhatsAppUrl, normalizeInstagramUrl } from '@/utils/formatters'

interface PublicNavbarProps {
  settings: SiteSettings | null
}

export function PublicNavbar({ settings }: PublicNavbarProps) {
  const instagramHref = normalizeInstagramUrl(settings?.instagram_url ?? null)
  const whatsappHref = buildWhatsAppUrl(settings?.whatsapp_number ?? null)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
        >
          <div className="flex size-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-inner transition group-hover:border-zinc-500">
            <Camera className="size-4 text-amber-400 transition group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-zinc-100 sm:text-base">
              Tomás Fotografía
            </span>
            <span className="text-[10px] font-medium text-zinc-400">
              Coberturas & Eventos
            </span>
          </div>
        </Link>

        {/* Quick Actions (Instagram & WhatsApp) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {instagramHref && (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de Instagram"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition hover:border-pink-500/50 hover:bg-zinc-800 hover:text-pink-400 active:scale-95"
            >
              <InstagramIcon className="size-4" />
            </a>
          )}

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="size-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
