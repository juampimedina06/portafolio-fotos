import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

let defaultBrowserClient: SupabaseClient | null = null

function getClient(client?: SupabaseClient): SupabaseClient {
  if (client) return client
  if (!defaultBrowserClient) {
    defaultBrowserClient = createClient()
  }
  return defaultBrowserClient
}

/**
 * Sanitize filename and append unique identifier and timestamp.
 */
export function generateUniqueStoragePath(fileName: string, folder = 'flyers'): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'webp'
  const sanitizedBase = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase()

  const uniqueId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).substring(2, 10)

  return `${folder}/${Date.now()}-${uniqueId}-${sanitizedBase}.${extension}`
}

/**
 * Pure storage service for uploading files to any Supabase bucket.
 */
export async function uploadStorageFile(
  bucket: string,
  file: File,
  folder = 'flyers',
  client?: SupabaseClient,
  options?: { contentType?: string; cacheControl?: string; upsert?: boolean }
): Promise<{ publicUrl: string; path: string }> {
  const supabase = getClient(client)
  const filePath = generateUniqueStoragePath(file.name, folder)

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: options?.cacheControl ?? '3600',
      upsert: options?.upsert ?? false,
      contentType: options?.contentType ?? file.type ?? 'image/webp',
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    publicUrl: publicUrlData.publicUrl,
    path: filePath,
  }
}

/**
 * Pure storage service for removing files from any Supabase bucket.
 */
export async function deleteStorageFile(
  bucket: string,
  path: string,
  client?: SupabaseClient
): Promise<void> {
  if (!path) return

  const supabase = getClient(client)
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(error.message)
  }
}
