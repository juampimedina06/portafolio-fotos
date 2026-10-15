'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Image as ImageIcon, FolderArchive, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Resumen', href: '/admin', icon: LayoutDashboard },
  { name: 'Fotografías', href: '/admin/fotos', icon: ImageIcon },
  { name: 'Álbumes', href: '/admin/albumes', icon: FolderArchive },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border/80 min-h-[calc(100vh-4rem)] p-4 bg-muted/20 hidden md:block">
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
