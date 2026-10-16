'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SiteSettings, UpdateSiteSettingsDTO } from '@/types/database'
import {
  getSiteSettings as getSiteSettingsService,
  updateSiteSettings as updateSiteSettingsService,
} from '@/services/settings.service'

/**
 * Hook for managing site settings state and updates.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSiteSettingsService()
      setSettings(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching site settings'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSettings = useCallback(
    async (dto: UpdateSiteSettingsDTO): Promise<SiteSettings> => {
      const updated = await updateSiteSettingsService(dto)
      setSettings(updated)
      return updated
    },
    []
  )

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
  }
}
