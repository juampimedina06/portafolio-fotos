'use server'

import { Photo, Album } from '@/interface/photo'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPhotos(filter?: { category?: string; featured?: boolean }): Promise<Photo[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from('photos').select('*').order('created_at', { ascending: false })

    if (filter?.category) {
      query = query.eq('category', filter.category)
    }

    if (filter?.featured !== undefined) {
      query = query.eq('featured', filter.featured)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching photos:', error)
      return []
    }

    return (data as Photo[]) ?? []
  } catch (error) {
    console.error('Unexpected error fetching photos:', error)
    return []
  }
}

export async function getAlbums(): Promise<Album[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching albums:', error)
      return []
    }

    return (data as Album[]) ?? []
  } catch (error) {
    console.error('Unexpected error fetching albums:', error)
    return []
  }
}

export async function deletePhoto(photoId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('photos').delete().eq('id', photoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
