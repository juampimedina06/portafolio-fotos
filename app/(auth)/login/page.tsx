import { SignInForm } from '@/components/auth/SignInForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Iniciar Sesión | Admin Tomás Foto',
  description: 'Panel de acceso administrativo',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver a la galería pública
        </Link>
      </div>

      <SignInForm />
    </div>
  )
}
