import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import { getPhotos } from '@/actions/photos/photos'
import { Camera, Sparkles, SlidersHorizontal } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tomás Fotografía | Portafolio Oficial',
  description: 'Galería de fotos y trabajos fotográficos profesionales',
}

export default async function HomePage() {
  const photos = await getPhotos()

  // Sample curated placeholders if database is empty initially
  const displayPhotos = photos.length > 0 ? photos : [
    {
      id: 'demo-1',
      title: 'Atardecer Urbano',
      category: 'Urbana',
      image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'demo-2',
      title: 'Retrato Natural',
      category: 'Retratos',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'demo-3',
      title: 'Luces de la Noche',
      category: 'Nocturna',
      image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'demo-4',
      title: 'Montañas y Niebla',
      category: 'Paisajes',
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'demo-5',
      title: 'Arquitectura Minimalista',
      category: 'Arquitectura',
      image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'demo-6',
      title: 'Silueta al Mar',
      category: 'Paisajes',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-neutral-900 selection:text-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 py-20 md:py-28 text-center bg-radial from-muted/50 to-background">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground mb-6 shadow-xs">
              <Sparkles className="size-3 text-amber-500" />
              <span>Portafolio Fotográfico</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl font-sans text-balance">
              Capturando momentos con <span className="underline decoration-neutral-400 underline-offset-8">identidad</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Explora una selección cuidada de retratos, paisajes y fotografía urbana realizada por Tomás.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Galería Destacada</h2>
                <p className="text-sm text-muted-foreground">Trabajos recientes y sesiones fotográficas</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/80 px-3 py-1.5 rounded-lg bg-card">
                <SlidersHorizontal className="size-3.5" />
                <span>Mostrando todas las obras</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayPhotos.map((photo) => (
                <article
                  key={photo.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {photo.category && (
                      <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-white">
                        {photo.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-base leading-snug group-hover:text-neutral-600 transition-colors">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Tomás Fotografía</p>
                    </div>
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
