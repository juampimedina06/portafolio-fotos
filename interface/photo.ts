export interface Photo {
  id: string
  title: string
  description?: string | null
  image_url: string
  category?: string | null
  featured?: boolean
  created_at: string
  updated_at?: string
}

export interface Album {
  id: string
  title: string
  slug: string
  description?: string | null
  cover_image?: string | null
  created_at: string
}
