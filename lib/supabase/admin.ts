import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL

  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      'Supabase Admin environment variables are missing (SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY)'
    )
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
