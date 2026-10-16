import type { SupabaseClient } from '@supabase/supabase-js'
import type { SiteSettings, UpdateSiteSettingsDTO } from '@/types/database'
import {
  findSiteSettings,
  updateSiteSettingsRow,
} from './settings.repository'

/**
 * Fetch the singleton site settings row (id = 1).
 */
export async function getSiteSettings(client?: SupabaseClient): Promise<SiteSettings> {
  return findSiteSettings(client)
}

/**
 * Update the singleton site settings row (id = 1).
 */
export async function updateSiteSettings(
  data: UpdateSiteSettingsDTO,
  client?: SupabaseClient
): Promise<SiteSettings> {
  return updateSiteSettingsRow(data, client)
}
