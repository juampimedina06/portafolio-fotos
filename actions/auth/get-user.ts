'use server'

import { User } from '@/interface/user'
import { createClient } from '@/lib/supabase/server'

export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser()

    if (!sessionUser) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    return profile as User
  } catch (error) {
    console.error('Unexpected error fetching user:', error)
    return null
  }
}
