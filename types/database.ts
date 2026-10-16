export interface EventItem {
  id: string
  title: string
  description: string | null
  external_link: string
  image_url: string | null
  image_path: string | null
  event_date: string | null
  location: string | null
  category: string | null
  is_featured: boolean
  is_active: boolean
  clicks_count: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  hero_title: string
  hero_subtitle: string | null
  hero_bg_url: string | null
  cta_text: string | null
  instagram_url: string | null
  whatsapp_number: string | null
  updated_at: string
}

export interface CreateEventDTO {
  title: string
  description?: string | null
  external_link: string
  image_url?: string | null
  image_path?: string | null
  event_date?: string | null
  location?: string | null
  category?: string | null
  is_featured?: boolean
  is_active?: boolean
  sort_order?: number
  imageFile?: File | null
}

export type UpdateEventDTO = Partial<CreateEventDTO>

export type UpdateSiteSettingsDTO = Partial<Omit<SiteSettings, 'id' | 'updated_at'>>

export interface Database {
  public: {
    Tables: {
      events: {
        Row: EventItem
        Insert: {
          id?: string
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
          clicks_count?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      site_settings: {
        Row: SiteSettings
        Insert: Omit<SiteSettings, 'id' | 'updated_at'> & {
          id?: number
          updated_at?: string
        }
        Update: Partial<Omit<SiteSettings, 'id' | 'updated_at'>> & {
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_event_click: {
        Args: {
          event_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
