import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { SiteSettings, UpdateSiteSettingsDTO } from '@/types/database'

let defaultBrowserClient: SupabaseClient | null = null

function getClient(client?: SupabaseClient): SupabaseClient {
  if (client) return client
  if (!defaultBrowserClient) {
    defaultBrowserClient = createClient()
  }
  return defaultBrowserClient
}

/**
 * Repository layer for public.site_settings table (singleton id = 1).
 */
export async function findSiteSettings(client?: SupabaseClient): Promise<SiteSettings> {
  const supabase = getClient(client)

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as SiteSettings
}

export async function updateSiteSettingsRow(
  data: UpdateSiteSettingsDTO,
  client?: SupabaseClient
): Promise<SiteSettings> {
  const supabase = getClient(client)

  const { data: updatedSettings, error } = await supabase
    .from('site_settings')
    .update(data)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedSettings as SiteSettings
}
