'use client'

import { useEffect, useRef, useState } from 'react'
import {
  X,
  UploadCloud,
  Loader2,
  Trash2,
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
      toast.error('El enlace a la galería de fotos es obligatorio')
      return
    }

    setIsSaving(true)

    try {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-200/90 bg-white shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {isEdit ? 'Editar Evento' : 'Crear Evento'}
            </h2>
            <p className="text-xs text-zinc-500">
              Completá los datos del espectáculo o fecha
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body - 2 Columns */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-h-[75vh] overflow-y-auto">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-4">
              {/* Title & External Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Título del evento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Festival de Primavera 2026"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Enlace a la galería de fotos (Drive, Pixieset, web) *
                </label>
                <input
                  type="url"
                  required
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://drive.google.com/... o https://..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve reseña del evento, artistas, horarios..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition resize-none"
                />
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Fecha y hora
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Lugar o sala
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Niceto Club, CABA"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>
              </div>

              {/* Category & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ej: Recitales, Boliche"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Prioridad de orden
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-zinc-700">
                  Flyer del evento
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 bg-zinc-50/40 hover:border-zinc-300'
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
                  <UploadCloud className="size-5 text-zinc-400 mb-1" />
                  <p className="text-xs font-medium text-zinc-700">
                    Arrastrá una imagen o hacé clic para explorar
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    PNG, JPG o WEBP (máx. 10MB)
                  </p>
                </div>

                {previewUrl && (
                  <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700">
                    <span className="truncate max-w-55">
                      {imageFile ? imageFile.name : 'Flyer actual'}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-zinc-400 hover:text-red-600 p-1 rounded transition"
                      title="Quitar flyer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-700">
                    Marcar como Destacado
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-0"
                  />
                  <span className="text-xs text-zinc-700">
                    Visible en web pública
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="sticky top-0 space-y-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Vista Previa
                </span>
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
          <div className="flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{isEdit ? 'Guardar cambios' : 'Publicar evento'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
