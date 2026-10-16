import type { SupabaseClient } from '@supabase/supabase-js'
import type { CreateEventDTO, EventItem, UpdateEventDTO } from '@/types/database'
import {
  deleteEventRow,
  findAllEvents,
  findActiveEvents,
  incrementClickRpc,
  insertEvent,
  updateEventRow,
} from './events.repository'
import {
  deleteStorageFile,
  uploadStorageFile,
} from './storage.service'
import { compressAndConvertToWebP } from '@/utils/compressImage'

export const EVENTS_STORAGE_BUCKET = 'event-images'

/**
 * Upload an event flyer image using the decoupled storage service.
 * Automatically compresses and converts image to WebP format before uploading.
 */
export async function uploadEventImage(
  file: File,
  client?: SupabaseClient
): Promise<{ image_url: string; image_path: string }> {
  // Compress and convert to WebP before uploading
  const processedFile = await compressAndConvertToWebP(file)

  // Ensure file name always ends with .webp
  const originalBase = processedFile.name.replace(/\.[^/.]+$/, '')
  const webpFileName = `${originalBase}.webp`
  const finalFile =
    processedFile.name === webpFileName && processedFile.type === 'image/webp'
      ? processedFile
      : new File([processedFile], webpFileName, { type: 'image/webp' })

  const result = await uploadStorageFile(
    EVENTS_STORAGE_BUCKET,
    finalFile,
    'flyers',
    client,
    { contentType: 'image/webp' }
  )

  return {
    image_url: result.publicUrl,
    image_path: result.path,
  }
}

/**
 * Remove an event flyer from storage.
 */
export async function deleteEventImage(
  imagePath: string,
  client?: SupabaseClient
): Promise<void> {
  await deleteStorageFile(EVENTS_STORAGE_BUCKET, imagePath, client)
}

/**
 * Fetch active events ordered for public display.
 */
export async function getPublicEvents(client?: SupabaseClient): Promise<EventItem[]> {
  return findActiveEvents(client)
}

/**
 * Fetch all events for admin management.
 */
export async function getAllEventsAdmin(client?: SupabaseClient): Promise<EventItem[]> {
  return findAllEvents(client)
}

/**
 * Orchestrate event creation with image upload and automatic rollback.
 */
export async function createEvent(
  data: CreateEventDTO,
  client?: SupabaseClient
): Promise<EventItem> {
  const { imageFile, ...restData } = data

  let imageUrl = restData.image_url ?? null
  let imagePath = restData.image_path ?? null

  if (imageFile) {
    const uploaded = await uploadEventImage(imageFile, client)
    imageUrl = uploaded.image_url
    imagePath = uploaded.image_path
  }

  try {
    return await insertEvent(
      {
        ...restData,
        image_url: imageUrl,
        image_path: imagePath,
      },
      client
    )
  } catch (dbError) {
    // Transactional rollback: avoid orphan storage files when DB fails
    if (imageFile && imagePath) {
      try {
        await deleteEventImage(imagePath, client)
      } catch (cleanupError) {
        console.error('Failed to cleanup orphan image after creation error:', cleanupError)
      }
    }
    throw dbError
  }
}

/**
 * Orchestrate event update with optional image replacement and cleanup.
 */
export async function updateEvent(
  id: string,
  data: UpdateEventDTO,
  currentImagePath?: string | null,
  client?: SupabaseClient
): Promise<EventItem> {
  const { imageFile, ...restData } = data

  let imageUrl = restData.image_url
  let imagePath = restData.image_path

  if (imageFile) {
    const uploaded = await uploadEventImage(imageFile, client)
    imageUrl = uploaded.image_url
    imagePath = uploaded.image_path

    if (currentImagePath) {
      try {
        await deleteEventImage(currentImagePath, client)
      } catch (cleanupError) {
        console.error('Failed to delete previous flyer image:', cleanupError)
      }
    }
  }

  const payload: Partial<EventItem> = {
    ...restData,
    ...(imageUrl !== undefined && { image_url: imageUrl }),
    ...(imagePath !== undefined && { image_path: imagePath }),
  }

  return updateEventRow(id, payload, client)
}

/**
 * Quick toggle for event active status.
 */
export async function toggleEventStatus(
  id: string,
  isActive: boolean,
  client?: SupabaseClient
): Promise<EventItem> {
  return updateEventRow(id, { is_active: isActive }, client)
}

/**
 * Quick toggle for event featured status.
 */
export async function toggleEventFeatured(
  id: string,
  isFeatured: boolean,
  client?: SupabaseClient
): Promise<EventItem> {
  return updateEventRow(id, { is_featured: isFeatured }, client)
}

/**
 * Delete event record and its stored flyer.
 */
export async function deleteEvent(
  id: string,
  imagePath?: string | null,
  client?: SupabaseClient
): Promise<void> {
  if (imagePath) {
    try {
      await deleteEventImage(imagePath, client)
    } catch (cleanupError) {
      console.error('Failed to delete flyer from storage:', cleanupError)
    }
  }

  await deleteEventRow(id, client)
}

/**
 * Increment click count using the RPC function.
 */
export async function registerEventClick(
  id: string,
  client?: SupabaseClient
): Promise<void> {
  return incrementClickRpc(id, client)
}
