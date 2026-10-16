'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/actions/auth/auth'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      toast.success('Sesión cerrada')
      router.push('/')
      router.refresh()
    } catch {
      toast.error('Error al cerrar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin mr-1.5" />
      ) : (
        <LogOut className="size-4 mr-1.5" />
      )}
      <span>Cerrar Sesión</span>
    </Button>
  )
}
