'use server'

import { User } from '@/interface/user'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['1tomaschavez@gmail.com']

export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser()

    if (!sessionUser) {
      return null
    }

    const userEmail = sessionUser.email?.toLowerCase()
    const isEmailAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .single()

    if (profile) {
      return profile as User
    }

    // Fallback if profiles table is not used or row doesn't exist yet
    if (isEmailAdmin) {
      return {
        id: sessionUser.id,
        email: sessionUser.email ?? '',
        role: 'admin',
        created_at: sessionUser.created_at,
        updated_at: sessionUser.updated_at ?? sessionUser.created_at,
      } as User
    }

    return null
  } catch (error) {
    console.error('Unexpected error fetching user:', error)
    return null
  }
}
