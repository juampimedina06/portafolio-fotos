'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CreateEventDTO, EventItem, UpdateEventDTO } from '@/types/database'
import {
  createEvent as createEventService,
  deleteEvent as deleteEventService,
  getAllEventsAdmin,
  getPublicEvents,
  registerEventClick as registerEventClickService,
  toggleEventFeatured as toggleEventFeaturedService,
  toggleEventStatus as toggleEventStatusService,
  updateEvent as updateEventService,
} from '@/services/events.service'

/**
 * Hook for consuming public events in client components.
 */
export function usePublicEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublicEvents()
      setEvents(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching events'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const registerClick = useCallback(async (eventId: string) => {
    try {
      await registerEventClickService(eventId)
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, clicks_count: event.clicks_count + 1 }
            : event
        )
      )
    } catch (err) {
      console.error('Failed to increment click count:', err)
    }
  }, [])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    registerClick,
  }
}

/**
 * Hook for consuming and managing admin events with full CRUD operations.
 */
export function useAdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllEventsAdmin()
      setEvents(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching admin events'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleCreate = useCallback(async (dto: CreateEventDTO): Promise<EventItem> => {
    const created = await createEventService(dto)
    setEvents((prev) => [created, ...prev])
    return created
  }, [])

  const handleUpdate = useCallback(
    async (id: string, dto: UpdateEventDTO, currentImagePath?: string | null): Promise<EventItem> => {
      const updated = await updateEventService(id, dto, currentImagePath)
      setEvents((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    []
  )

  const handleToggleStatus = useCallback(
    async (id: string, isActive: boolean): Promise<EventItem> => {
      const updated = await toggleEventStatusService(id, isActive)
      setEvents((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    []
  )

  const handleToggleFeatured = useCallback(
    async (id: string, isFeatured: boolean): Promise<EventItem> => {
      const updated = await toggleEventFeaturedService(id, isFeatured)
      setEvents((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    []
  )

  const handleDelete = useCallback(
    async (id: string, imagePath?: string | null): Promise<void> => {
      await deleteEventService(id, imagePath)
      setEvents((prev) => prev.filter((item) => item.id !== id))
    },
    []
  )

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    createEvent: handleCreate,
    updateEvent: handleUpdate,
    toggleStatus: handleToggleStatus,
    toggleFeatured: handleToggleFeatured,
    deleteEvent: handleDelete,
  }
}
