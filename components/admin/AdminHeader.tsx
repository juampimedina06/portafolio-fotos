'use client'

import { useAuth } from '@/context/AuthContext'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Camera, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <div className="size-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Camera className="size-4" />
            </div>
            <span>Panel Admin</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium border border-emerald-500/20">
            <ShieldCheck className="size-3" />
            Admin Activo
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Ver web pública
          </Link>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold leading-tight">{user?.name || 'Administrador'}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
