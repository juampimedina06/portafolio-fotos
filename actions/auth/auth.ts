'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient()

  const { error, data } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    // If not admin, sign out immediately
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'Acceso no autorizado: se requiere rol de administrador.',
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
    message: 'Sesión iniciada exitosamente',
    data: {
      ...data,
      role: profile.role,
    },
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function sendRecoveryEmail(formData: { email: string }) {
  const supabase = await createClient()

  const { error, data } = await supabase.auth.resetPasswordForEmail(formData.email)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    message: 'Se ha enviado un correo de recuperación.',
    data,
  }
}
