'use client'

import { useMemo, useState } from 'react'
import {
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
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
    <div className="space-y-8">
      {/* 1. KPIs Section - Clean, editorial layout without nested cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-zinc-200/80">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Total de Eventos
          </span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            {totalEvents}
          </p>
          <span className="text-xs text-zinc-400 mt-0.5 block">
            Registrados en catálogo
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Eventos Activos
          </span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            {activeEvents}
          </p>
          <span className="text-xs text-zinc-400 mt-0.5 block">
            Visibles en cartelera pública
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Visitas a Galerías
          </span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            {totalClicks}
          </p>
          <span className="text-xs text-zinc-400 mt-0.5 block">
            Clics en enlaces a fotos
          </span>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, categoría o lugar..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>Crear Evento</span>
        </button>
      </div>

      {/* 3. Table / Events List - Clean, serene white table */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="divide-y divide-zinc-100">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="size-14 rounded-lg bg-zinc-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-zinc-100" />
                  <div className="h-3 w-1/3 rounded bg-zinc-50" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            <p className="text-sm font-medium text-zinc-600">
              {searchTerm ? 'No hay eventos que coincidan con la búsqueda' : 'No hay eventos registrados'}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {searchTerm
                ? 'Probá buscando con otros términos'
                : 'Creá tu primer evento para publicarlo en la cartelera.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200/80 bg-zinc-50/60 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Evento / Cobertura</th>
                  <th className="px-3 py-3.5">Fecha & Galería</th>
                  <th className="px-3 py-3.5">Métricas</th>
                  <th className="px-3 py-3.5 text-center">Destacado</th>
                  <th className="px-3 py-3.5 text-center">Estado</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
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
                      className="transition-colors hover:bg-zinc-50/70"
                    >
                      {/* Flyer & Info */}
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                            {event.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-[10px] text-zinc-400">
                                Sin foto
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-zinc-900 truncate max-w-50 sm:max-w-65">
                                {event.title}
                              </h4>
                              {event.is_featured && (
                                <span className="rounded-full bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
                                  Destacado
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                              {event.category && (
                                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600">
                                  {event.category}
                                </span>
                              )}
                              {event.location && (
                                <span className="truncate max-w-[150px]">
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
                          <span className="block text-zinc-800 font-medium">
                            {formattedDate}
                          </span>
                          <a
                            href={event.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-900 transition underline-offset-4 hover:underline"
                          >
                            <span className="truncate max-w-35">Ver fotos</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </td>

                      {/* Clicks Badge */}
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700">
                          {event.clicks_count} clics
                        </span>
                      </td>

                      {/* Featured Star Switch */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleToggleFeatured(event)}
                          title={event.is_featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                          className={`rounded-lg p-1.5 transition ${
                            event.is_featured
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-zinc-300 hover:text-zinc-500'
                          }`}
                        >
                          <Star
                            className={`size-4 ${
                              event.is_featured ? 'fill-amber-400 text-amber-500' : ''
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
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            event.is_active ? 'bg-zinc-900' : 'bg-zinc-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              event.is_active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleOpenEdit(event)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
                            title="Editar evento"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleDelete(event)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
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
