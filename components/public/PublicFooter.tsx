import Link from 'next/link'
import Image from 'next/image'
import { Camera, Lock, MessageCircle } from 'lucide-react'
import { InstagramIcon } from './InstagramIcon'
import { GoogleDriveIcon } from './GoogleDriveIcon'
import type { SiteSettings } from '@/types/database'
import { buildWhatsAppUrl, normalizeDriveUrl, normalizeInstagramUrl } from '@/utils/formatters'

interface PublicFooterProps {
  settings?: SiteSettings | null
}

export function PublicFooter({ settings }: PublicFooterProps) {
  const instagramHref = normalizeInstagramUrl(settings?.instagram_url)
  const whatsappHref = buildWhatsAppUrl(settings?.whatsapp_number)
  const driveHref = normalizeDriveUrl(settings?.drive_url)

  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
              <Camera className="size-3.5 text-amber-400" />
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} <span className="text-zinc-300 font-medium">Tomás Fotografía</span>.
            </p>
            <span className="text-zinc-800 hidden sm:inline">•</span>
            <a
              href="https://codiarg.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-300"
              title="Desarrollado por Codiarg - Software & Web"
            >
              <span className="text-zinc-600 group-hover:text-zinc-500 transition-colors">Hecho por</span>
              <div className="relative size-3.5 overflow-hidden rounded-full border border-zinc-700/80">
                <Image
                  src="/img/codiarg-logo.jpg"
                  alt="Codiarg"
                  width={14}
                  height={14}
                  className="size-full object-cover"
                />
              </div>
              <span className="font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">Codiarg</span>
            </a>
          </div>

          {/* Social Links & Admin Access */}
          <div className="flex items-center gap-4 text-xs">
            {driveHref && (
              <a
                href={driveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-400 transition hover:text-sky-400"
              >
                <GoogleDriveIcon className="size-3.5" />
                <span>Drive</span>
              </a>
            )}

            {instagramHref && (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-400 transition hover:text-pink-400"
              >
                <InstagramIcon className="size-3.5" />
                <span>Instagram</span>
              </a>
            )}

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-400 transition hover:text-emerald-400"
              >
                <MessageCircle className="size-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <span className="text-zinc-800">|</span>

            {/* Discrete Admin Link */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] text-zinc-600 transition hover:text-zinc-400"
              title="Acceso administrativo"
            >
              <Lock className="size-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
