/**
 * Utility to compress and convert images to WebP format using HTML5 Canvas.
 * Operates purely in the browser without third-party dependencies.
 *
 * @param file - Original user-selected file
 * @param maxWidth - Maximum allowable width (default: 1200)
 * @param quality - WebP export quality between 0 and 1 (default: 0.82)
 * @param maxHeight - Maximum allowable height (default: 1500)
 * @returns Promise resolving to the compressed WebP File
 */
export async function compressAndConvertToWebP(
  file: File,
  maxWidth = 1200,
  quality = 0.82,
  maxHeight = 1500
): Promise<File> {
  // Graceful fallback for non-browser environments (SSR / test runners)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file
  }

  // Si el archivo no es una imagen o es un GIF animado, lo devuelva sin tocar
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img

      // Mantener aspect ratio si supera maxWidth o maxHeight
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }

          // Generar nombre de archivo con extensión .webp
          const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
          const newFileName = `${originalNameWithoutExt}.webp`

          const webpFile = new File([blob], newFileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          })

          resolve(webpFile)
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}
