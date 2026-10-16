import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EventItem } from '@/types/database'

let defaultBrowserClient: SupabaseClient | null = null

function getClient(client?: SupabaseClient): SupabaseClient {
  if (client) return client
  if (!defaultBrowserClient) {
    defaultBrowserClient = createClient()
  }
  return defaultBrowserClient
}

export type InsertEventPayload = {
  title: string
  external_link: string
  description?: string | null
  image_url?: string | null
  image_path?: string | null
  event_date?: string | null
  location?: string | null
  category?: string | null
  is_featured?: boolean
  is_active?: boolean
  sort_order?: number
}

export type UpdateEventPayload = Partial<InsertEventPayload>

/**
 * Repository layer for public.events table operations.
 * Pure data-access methods without business or storage logic.
 */
export async function findActiveEvents(client?: SupabaseClient): Promise<EventItem[]> {
  const supabase = getClient(client)

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('event_date', { ascending: true, nullsFirst: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as EventItem[]) ?? []
}

export async function findAllEvents(client?: SupabaseClient): Promise<EventItem[]> {
  const supabase = getClient(client)

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as EventItem[]) ?? []
}

export async function findEventById(
  id: string,
  client?: SupabaseClient
): Promise<EventItem | null> {
  const supabase = getClient(client)

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as EventItem | null
}

export async function insertEvent(
  payload: InsertEventPayload,
  client?: SupabaseClient
): Promise<EventItem> {
  const supabase = getClient(client)

  const { data, error } = await supabase
    .from('events')
    .insert(payload)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as EventItem
}

export async function updateEventRow(
  id: string,
  payload: UpdateEventPayload,
  client?: SupabaseClient
): Promise<EventItem> {
  const supabase = getClient(client)

  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as EventItem
}

export async function deleteEventRow(
  id: string,
  client?: SupabaseClient
): Promise<void> {
  const supabase = getClient(client)

  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function incrementClickRpc(
  id: string,
  client?: SupabaseClient
): Promise<void> {
  const supabase = getClient(client)

  const { error } = await supabase.rpc('increment_event_click', {
    event_id: id,
  })

  if (error) {
    throw new Error(error.message)
  }
}
