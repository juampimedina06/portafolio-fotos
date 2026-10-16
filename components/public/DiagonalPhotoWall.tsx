'use client'

// Fotos reales de Tomás Fotografía ubicadas en public/imagenes-tomi/
export const DEFAULT_BACKGROUND_PHOTOS = [
  '/imagenes-tomi/flor.jpeg',
  '/imagenes-tomi/foto4.jpeg',
  '/imagenes-tomi/foto5.jpeg',
  '/imagenes-tomi/foto6.jpeg',
  '/imagenes-tomi/foto7.jpeg',
  '/imagenes-tomi/foto8.jpeg',
  '/imagenes-tomi/foto9.jpeg',
  '/imagenes-tomi/foto10.jpeg',
  '/imagenes-tomi/foto11.jpeg',
  '/imagenes-tomi/foto12.jpeg',
  '/imagenes-tomi/foto13.jpeg',
  '/imagenes-tomi/foto14.jpeg',
  '/imagenes-tomi/foto15.jpeg',
  '/imagenes-tomi/foto16.jpeg',
  '/imagenes-tomi/foto17.jpeg',
  '/imagenes-tomi/foto18.jpeg',
  '/imagenes-tomi/foto19.jpeg',
  '/imagenes-tomi/foto20.jpeg',
  '/imagenes-tomi/foto21.jpeg',
  '/imagenes-tomi/foto22.jpeg',
  '/imagenes-tomi/foto23.jpeg',
  '/imagenes-tomi/foto24.jpeg',
  '/imagenes-tomi/foto25.jpeg',
  '/imagenes-tomi/foto26.jpeg',
  '/imagenes-tomi/foto27.jpeg',
  '/imagenes-tomi/foto28.jpeg',
  '/imagenes-tomi/lali.jpeg',
  '/imagenes-tomi/lobatos.jpeg',
]

interface DiagonalPhotoWallProps {
  customPhotos?: string[]
}

export function DiagonalPhotoWall({ customPhotos }: DiagonalPhotoWallProps) {
  const photos = customPhotos && customPhotos.length > 0 ? customPhotos : DEFAULT_BACKGROUND_PHOTOS

  // Distribuimos las 28 fotos reales entre 6 columnas diagonales
  const columns = [
    [photos[0], photos[1], photos[2], photos[3], photos[4]],
    [photos[5], photos[6], photos[7], photos[8], photos[9]],
    [photos[10], photos[11], photos[12], photos[13], photos[14]],
    [photos[15], photos[16], photos[17], photos[18], photos[19]],
    [photos[20], photos[21], photos[22], photos[23], photos[24]],
    [photos[25], photos[26], photos[27], photos[0], photos[1]],
  ]

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#f4f7fa]"
    >
      {/* Contenedor rotado en diagonal imitando el diseño de Canva */}
      <div className="absolute -inset-x-[35%] -inset-y-[45%] flex justify-center gap-4 sm:gap-6 rotate-[-28deg] scale-110 sm:scale-125 opacity-100">
        {columns.map((column, colIdx) => (
          <div
            key={colIdx}
            className={`flex flex-col gap-4 sm:gap-6 ${
              colIdx % 2 === 0 ? '-translate-y-12' : 'translate-y-8'
            }`}
          >
            {column.map((imgUrl, imgIdx) => (
              <div
                key={`${colIdx}-${imgIdx}`}
                className="w-36 sm:w-52 aspect-[3/4] rounded-2xl bg-white p-2 shadow-md border border-white/90 shrink-0 overflow-hidden"
              >
                <div className="size-full rounded-xl overflow-hidden bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt="Foto de Tomás Fotografía"
                    className="size-full object-cover filter brightness-[1.02] contrast-[1.05]"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Velo muy sutil para asegurar contraste sin tapar las fotos reales */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
    </div>
  )
}
