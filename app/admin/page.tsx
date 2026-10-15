import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, FolderArchive, Upload, Eye } from 'lucide-react'
import Link from 'next/link'
import { getPhotos, getAlbums } from '@/actions/photos/photos'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [photos, albums] = await Promise.all([getPhotos(), getAlbums()])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu catálogo fotográfico, álbumes y contenido visible en la web.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Eye className="size-4 mr-1.5" />
              Ver Web
            </Button>
          </Link>
          <Button size="sm">
            <Upload className="size-4 mr-1.5" />
            Subir Fotos
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fotografías</CardTitle>
            <ImageIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Fotos publicadas en la galería</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Álbumes / Colecciones</CardTitle>
            <FolderArchive className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{albums.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Categorías temáticas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <div className="size-2 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">En línea</div>
            <p className="text-xs text-muted-foreground mt-1">Supabase Auth & Storage activo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fotografías Recientes</CardTitle>
          <CardDescription>
            Últimas imágenes cargadas en el portafolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ImageIcon className="mx-auto size-10 opacity-30 mb-3" />
              <p className="text-sm">Aún no hay fotos cargadas en la base de datos.</p>
              <p className="text-xs mt-1">Usa el botón de arriba para subir tu primera fotografía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.image_url} alt={photo.title} className="object-cover size-full" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-white text-xs">
                    <span className="truncate">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
