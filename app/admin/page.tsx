'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import type { EventItem } from '@/types/database'
import { getAllEventsAdmin } from '@/services/events.service'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { EventsTable } from '@/components/admin/EventsTable'
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm'
import {
  Camera,
  ExternalLink,
  LogOut,
  Sliders,
  Ticket,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'settings'>('events')
  const [events, setEvents] = useState<EventItem[]>([])
  const [isEventsLoading, setIsEventsLoading] = useState(false)

  const supabase = createClient()

  // 1. Auth session listener
  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        setSession(currentSession)
      } catch (err) {
        console.error('Error checking auth session:', err)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setIsAuthLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // 2. Fetch admin events
  const fetchEvents = useCallback(async () => {
    setIsEventsLoading(true)
    try {
      const data = await getAllEventsAdmin()
      setEvents(data)
    } catch (err) {
      toast.error('Error al cargar eventos: ' + (err instanceof Error ? err.message : ''))
    } finally {
      setIsEventsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session, fetchEvents])

  // 3. Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      toast.success('Sesión cerrada')
    } catch (err) {
      toast.error('Error al cerrar sesión: ' + (err instanceof Error ? err.message : ''))
    }
  }

  // Loading state during auth check
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="size-8 animate-spin text-zinc-200" />
          <p className="text-xs uppercase tracking-wider font-medium">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Unauthenticated view
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <AdminLogin
          onSuccess={async () => {
            const {
              data: { session: newSession },
            } = await supabase.auth.getSession()
            setSession(newSession)
          }}
        />
      </main>
    )
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-inner">
              <Camera className="size-4 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-zinc-100">
                Tomás Fotografía
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span>Panel de Administración</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <ShieldCheck className="size-3" />
                  Activo
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
            >
              <span>Ver web pública</span>
              <ExternalLink className="size-3.5 text-zinc-500" />
            </a>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-medium text-zinc-200">
                {session.user.email}
              </span>
              <span className="text-[10px] text-zinc-500">Sesión iniciada</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition"
              title="Cerrar sesión"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'events'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <Ticket className="size-4" />
            <span>Mis Eventos</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === 'events'
                  ? 'bg-zinc-900 text-zinc-100'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {events.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <Sliders className="size-4" />
            <span>Personalizar Inicio</span>
          </button>
        </div>

        {/* Tab 1: Mis Eventos */}
        {activeTab === 'events' && (
          <EventsTable
            events={events}
            isLoading={isEventsLoading}
            onEventsChange={fetchEvents}
          />
        )}

        {/* Tab 2: Personalizar Inicio */}
        {activeTab === 'settings' && <SiteSettingsForm />}
      </main>
    </div>
  )
}
