export interface User {
  id: string
  name: string
  email: string
  avatar_url: string | null
  role: 'admin'
  created_at: string
  updated_at: string
}
