import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel de Administración | Tomás Fotografía & Eventos',
  description: 'Gestión de eventos, publicaciones y personalización del inicio',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800 selection:text-zinc-100">
      {children}
    </div>
  )
}
