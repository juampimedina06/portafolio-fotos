'use client'

import { useMemo, useState } from 'react'
import {
  Calendar,
  ExternalLink,
  Flame,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Ticket,
  MousePointerClick,
  Sparkles,
} from 'lucide-react'
import type { EventItem } from '@/types/database'
import { toggleEventFeatured, toggleEventStatus, deleteEvent } from '@/services/events.service'
import { EventFormModal } from './EventFormModal'
import toast from 'react-hot-toast'

interface EventsTableProps {
  events: EventItem[]
  isLoading: boolean
  onEventsChange: () => void
}

export function EventsTable({ events, isLoading, onEventsChange }: EventsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null)

  // KPIs
  const totalEvents = events.length
  const activeEvents = events.filter((e) => e.is_active).length
  const totalClicks = events.reduce((acc, curr) => acc + (curr.clicks_count || 0), 0)

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events
    const term = searchTerm.toLowerCase()
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        (e.category && e.category.toLowerCase().includes(term)) ||
        (e.location && e.location.toLowerCase().includes(term))
    )
  }, [events, searchTerm])

  const handleOpenCreate = () => {
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (event: EventItem) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (event: EventItem) => {
    setActionInProgressId(event.id)
    try {
      await toggleEventStatus(event.id, !event.is_active)
      toast.success(
        !event.is_active ? 'Evento activado en la web' : 'Evento desactivado'
      )
      onEventsChange()
    } catch (err) {
      toast.error('Error al cambiar estado: ' + (err instanceof Error ? err.message : ''))
    } finally {
      setActionInProgressId(null)
    }
  }

  const handleToggleFeatured = async (event: EventItem) => {
    setActionInProgressId(event.id)
    try {
      await toggleEventFeatured(event.id, !event.is_featured)
      toast.success(
        !event.is_featured ? 'Marcado como destacado' : 'Desmarcado de destacados'
      )
      onEventsChange()
    } catch (err) {
      toast.error('Error al cambiar destacado: ' + (err instanceof Error ? err.message : ''))
    } finally {
      setActionInProgressId(null)
    }
  }

  const handleDelete = async (event: EventItem) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseás eliminar el evento "${event.title}"? Esta acción borrará el registro y su flyer de forma permanente.`
    )
    if (!confirmed) return

    setActionInProgressId(event.id)
    try {
      await deleteEvent(event.id, event.image_path)
      toast.success('Evento eliminado correctamente')
      onEventsChange()
    } catch (err) {
      toast.error('Error al eliminar evento: ' + (err instanceof Error ? err.message : ''))
    } finally {
      setActionInProgressId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. KPIs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total de Eventos
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
              <Ticket className="size-4 text-zinc-400" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-100">
            {totalEvents}
          </p>
          <span className="text-xs text-zinc-500">Eventos registrados en catálogo</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Eventos Activos
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-400">
            {activeEvents}
          </p>
          <span className="text-xs text-zinc-500">Visibles al público en cartelera</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Clics Totales
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MousePointerClick className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-amber-400">
            {totalClicks}
          </p>
          <span className="text-xs text-zinc-500">Interacciones en links de compra</span>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 size-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, categoría o ubicación..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 shadow-md"
        >
          <Plus className="size-4" />
          <span>Crear Nuevo Evento</span>
        </button>
      </div>

      {/* 3. Table / Cards List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl overflow-hidden backdrop-blur-sm">
        {isLoading ? (
          <div className="divide-y divide-zinc-800/80">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="size-16 rounded-xl bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-zinc-800" />
                  <div className="h-3 w-1/4 rounded bg-zinc-800/60" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            <Ticket className="mx-auto size-12 opacity-30 mb-3 stroke-1" />
            <p className="text-base font-medium text-zinc-300">
              {searchTerm ? 'No se encontraron eventos con esa búsqueda' : 'No hay eventos cargados aún'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {searchTerm
                ? 'Probá buscando con otro término'
                : 'Hacé clic en "Crear Nuevo Evento" para publicar el primero'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Evento</th>
                  <th className="px-3 py-3.5">Fecha & Enlace</th>
                  <th className="px-3 py-3.5">Métricas</th>
                  <th className="px-3 py-3.5 text-center">Destacado</th>
                  <th className="px-3 py-3.5 text-center">Estado</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredEvents.map((event) => {
                  const isProcessing = actionInProgressId === event.id
                  const formattedDate = event.event_date
                    ? new Date(event.event_date).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Sin fecha'

                  return (
                    <tr
                      key={event.id}
                      className="transition-colors hover:bg-zinc-800/30"
                    >
                      {/* Flyer & Info */}
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                            {event.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-zinc-600">
                                <ImageIcon className="size-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-zinc-100 truncate max-w-50 sm:max-w-65">
                                {event.title}
                              </h4>
                              {event.is_featured && (
                                <Sparkles className="size-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                              {event.category && (
                                <span className="rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300">
                                  {event.category}
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center gap-1 truncate max-w-[150px]">
                                  <MapPin className="size-3 text-zinc-500" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Link */}
                      <td className="px-3 py-4">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                            <Calendar className="size-3.5 text-zinc-500" />
                            {formattedDate}
                          </span>
                          <a
                            href={event.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition underline-offset-4 hover:underline"
                          >
                            <span className="truncate max-w-35">Entradas</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </td>

                      {/* Clicks Badge */}
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                          <Flame className="size-3 text-amber-400" />
                          <span>{event.clicks_count} clics</span>
                        </span>
                      </td>

                      {/* Featured Star Switch */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleToggleFeatured(event)}
                          title={event.is_featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                          className={`rounded-lg p-2 transition ${
                            event.is_featured
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                          }`}
                        >
                          <Star
                            className={`size-4 ${
                              event.is_featured ? 'fill-amber-300' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Active Status Switch */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleToggleActive(event)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            event.is_active ? 'bg-emerald-500' : 'bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              event.is_active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleOpenEdit(event)}
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
                            title="Editar evento"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleDelete(event)}
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition"
                            title="Eliminar evento"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Drawer for Create & Edit */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEvent={selectedEvent}
        onSuccess={() => {
          onEventsChange()
        }}
      />
    </div>
  )
}
