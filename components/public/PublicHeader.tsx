import Link from 'next/link'
import { Camera, Lock } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
          <div className="size-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
            <Camera className="size-4" />
          </div>
          <span>Tomás Foto</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-foreground transition-colors hover:text-muted-foreground">
            Galería
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Lock className="size-3" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
