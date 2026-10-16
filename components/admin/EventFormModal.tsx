'use client'

import { useEffect, useRef, useState } from 'react'
import {
  X,
  UploadCloud,
  Loader2,
  Trash2,
  Check,
  Calendar,
  Link as LinkIcon,
  MapPin,
  Tag,
  ArrowUpDown,
  Sparkles,
  Eye,
} from 'lucide-react'
import type { CreateEventDTO, EventItem, UpdateEventDTO } from '@/types/database'
import { createEvent, updateEvent } from '@/services/events.service'
import { EventCardPreview } from './EventCardPreview'
import toast from 'react-hot-toast'

interface EventFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (event: EventItem, isEdit: boolean) => void
  initialEvent?: EventItem | null
}

export function EventFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialEvent,
}: EventFormModalProps) {
  const isEdit = Boolean(initialEvent)

  // Form State
  const [title, setTitle] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form when modal opens or initialEvent changes
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '')
      setExternalLink(initialEvent.external_link || '')
      setDescription(initialEvent.description || '')
      // Convert ISO date string to datetime-local format: YYYY-MM-DDTHH:MM
      if (initialEvent.event_date) {
        const dateObj = new Date(initialEvent.event_date)
        const localIso = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
        setEventDate(localIso)
      } else {
        setEventDate('')
      }
      setLocation(initialEvent.location || '')
      setCategory(initialEvent.category || '')
      setSortOrder(initialEvent.sort_order ?? 0)
      setIsFeatured(initialEvent.is_featured ?? false)
      setIsActive(initialEvent.is_active ?? true)
      setPreviewUrl(initialEvent.image_url)
      setImageFile(null)
    } else {
      setTitle('')
      setExternalLink('')
      setDescription('')
      setEventDate('')
      setLocation('')
      setCategory('')
      setSortOrder(0)
      setIsFeatured(false)
      setIsActive(true)
      setImageFile(null)
      setPreviewUrl(null)
    }
  }, [initialEvent, isOpen])

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor seleccioná un archivo de imagen válido')
      return
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = URL.createObjectURL(file)
    setImageFile(file)
    setPreviewUrl(objectUrl)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setImageFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('El título del evento es obligatorio')
      return
    }

    if (!externalLink.trim()) {
      toast.error('El link externo es obligatorio')
      return
    }

    setIsSaving(true)

    try {
      // Prepare payload
      const formattedDate = eventDate ? new Date(eventDate).toISOString() : null

      if (isEdit && initialEvent) {
        const updateDto: UpdateEventDTO = {
          title: title.trim(),
          external_link: externalLink.trim(),
          description: description.trim() || null,
          event_date: formattedDate,
          location: location.trim() || null,
          category: category.trim() || null,
          sort_order: Number(sortOrder) || 0,
          is_featured: isFeatured,
          is_active: isActive,
          imageFile,
        }

        const updated = await updateEvent(initialEvent.id, updateDto, initialEvent.image_path)
        toast.success('Evento actualizado exitosamente')
        onSuccess(updated, true)
      } else {
        const createDto: CreateEventDTO = {
          title: title.trim(),
          external_link: externalLink.trim(),
          description: description.trim() || null,
          event_date: formattedDate,
          location: location.trim() || null,
          category: category.trim() || null,
          sort_order: Number(sortOrder) || 0,
          is_featured: isFeatured,
          is_active: isActive,
          imageFile,
        }

        const created = await createEvent(createDto)
        toast.success('Evento creado exitosamente')
        onSuccess(created, false)
      }

      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el evento'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-800 text-zinc-100 border border-zinc-700">
              <Sparkles className="size-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">
                {isEdit ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h2>
              <p className="text-xs text-zinc-400">
                Completá los datos y visualizá los cambios en vivo en la tarjeta
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body - 2 Columns */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-h-[75vh] overflow-y-auto">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-4">
              {/* Title & External Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Festival de Primavera 2026"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <LinkIcon className="size-3.5 text-zinc-500" />
                  Link Externo (Entradas / Más Info) *
                </label>
                <input
                  type="url"
                  required
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://passline.com/eventos/..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve reseña del evento, artistas, horarios..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none resize-none"
                />
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-zinc-500" />
                    Fecha y Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-zinc-500" />
                    Lugar / Ubicación
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Niceto Club, CABA"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Tag className="size-3.5 text-zinc-500" />
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ej: Recitales, Teatro, Boliche"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <ArrowUpDown className="size-3.5 text-zinc-500" />
                    Orden de Prioridad
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Flyer / Imagen del Evento
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-amber-400 bg-amber-400/5'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0])
                      }
                    }}
                  />
                  <UploadCloud className="size-6 text-zinc-500 mb-1.5" />
                  <p className="text-xs font-medium text-zinc-300">
                    Hacé clic para subir o arrastrá un archivo
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    PNG, JPG o WEBP (máx. 10MB)
                  </p>
                </div>

                {previewUrl && (
                  <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300">
                    <span className="truncate max-w-55">
                      {imageFile ? imageFile.name : 'Imagen actual guardada'}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-400 hover:text-red-300 p-1 rounded transition"
                      title="Quitar imagen"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Toggles (Switches) */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="size-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-xs font-medium text-zinc-300">
                    Marcar como Destacado
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-xs font-medium text-zinc-300">
                    Evento Activo (Visible en web)
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="sticky top-0 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <Eye className="size-3.5 text-zinc-500" />
                  <span>Vista Previa en Vivo</span>
                </div>
                <EventCardPreview
                  title={title}
                  description={description}
                  external_link={externalLink}
                  image_url={previewUrl}
                  event_date={eventDate}
                  location={location}
                  category={category}
                  is_featured={isFeatured}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-zinc-950" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5 text-zinc-950" />
                  <span>{isEdit ? 'Actualizar Evento' : 'Publicar Evento'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
