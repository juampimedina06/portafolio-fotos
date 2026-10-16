'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import type { EventItem } from '@/types/database'
import { getAllEventsAdmin } from '@/services/events.service'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { EventsTable } from '@/components/admin/EventsTable'
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm'
import { Loader2 } from 'lucide-react'
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
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Loader2 className="size-6 animate-spin text-zinc-800" />
          <p className="text-xs uppercase tracking-widest font-medium text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Unauthenticated view
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#fafafa]">
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
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-900">
                Tomás Fotografía
              </span>
              <span className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase">
                Admin
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Activo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Ver web pública ↗
            </a>

            <div className="hidden sm:flex items-center text-xs text-zinc-400">
              <span>{session.user.email}</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-zinc-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100"
              title="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-zinc-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition relative ${
              activeTab === 'events'
                ? 'text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <span>Eventos</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                activeTab === 'events'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {events.length}
            </span>
            {activeTab === 'events' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 -mb-[1px]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition relative ${
              activeTab === 'settings'
                ? 'text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <span>Personalizar Portada</span>
            {activeTab === 'settings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 -mb-[1px]" />
            )}
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
