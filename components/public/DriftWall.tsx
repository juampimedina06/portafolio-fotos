'use client'

import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export interface DriftWallItem {
  image: string
  title?: string
  href?: string
}

export interface DriftWallProps {
  items?: DriftWallItem[]
  columns?: number
  tileWidth?: number
  tileHeight?: number
  gap?: number
  radius?: number
  mobileColumns?: number
  mobileTileWidth?: number
  mobileTileHeight?: number
  mobileGap?: number
  mobileRadius?: number
  tilt?: number
  turn?: number
  roll?: number
  perspective?: number
  depth?: number
  speed?: number
  direction?: 'up' | 'down'
  variance?: number
  parallax?: number
  pauseOnHover?: boolean
  lift?: number
  fade?: number
  dim?: number
  grayscale?: boolean
  overlayColor?: string
  className?: string
  style?: CSSProperties
}

interface ColumnMeta {
  copyHeight: number
  copies: number
}

// 28 fotos reales de Tomás Fotografía
export const TOMI_DRIFT_ITEMS: DriftWallItem[] = [
  { image: '/imagenes-tomi/flor.jpeg', title: 'Show en vivo' },
  { image: '/imagenes-tomi/foto4.jpeg', title: 'Recital' },
  { image: '/imagenes-tomi/foto5.jpeg', title: 'Concierto' },
  { image: '/imagenes-tomi/foto6.jpeg', title: 'Festival' },
  { image: '/imagenes-tomi/foto7.jpeg', title: 'Show en vivo' },
  { image: '/imagenes-tomi/foto8.jpeg', title: 'Recital' },
  { image: '/imagenes-tomi/foto9.jpeg', title: 'Escenario' },
  { image: '/imagenes-tomi/foto10.jpeg', title: 'Concierto' },
  { image: '/imagenes-tomi/foto11.jpeg', title: 'Fiesta' },
  { image: '/imagenes-tomi/foto12.jpeg', title: 'Show en vivo' },
  { image: '/imagenes-tomi/foto13.jpeg', title: 'Recital' },
  { image: '/imagenes-tomi/foto14.jpeg', title: 'Boliche' },
  { image: '/imagenes-tomi/foto15.jpeg', title: 'Festival' },
  { image: '/imagenes-tomi/foto16.jpeg', title: 'Show en vivo' },
  { image: '/imagenes-tomi/foto17.jpeg', title: 'Recital' },
  { image: '/imagenes-tomi/foto18.jpeg', title: 'Concierto' },
  { image: '/imagenes-tomi/foto19.jpeg', title: 'Show' },
  { image: '/imagenes-tomi/foto20.jpeg', title: 'Fiesta' },
  { image: '/imagenes-tomi/foto21.jpeg', title: 'Escenario' },
  { image: '/imagenes-tomi/foto22.jpeg', title: 'Concierto' },
  { image: '/imagenes-tomi/foto23.jpeg', title: 'Recital' },
  { image: '/imagenes-tomi/foto24.jpeg', title: 'Festival' },
  { image: '/imagenes-tomi/foto25.jpeg', title: 'Show en vivo' },
  { image: '/imagenes-tomi/foto26.jpeg', title: 'Recital' },
  { image: '/imagenes-tomi/foto27.jpeg', title: 'Concierto' },
  { image: '/imagenes-tomi/foto28.jpeg', title: 'Show en vivo' },
  { image: '/imagenes-tomi/lali.jpeg', title: 'Lali Show' },
  { image: '/imagenes-tomi/lobatos.jpeg', title: 'Lobatos Show' },
]

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1
  return 1 + variance * pseudo
}

export function DriftWall({
  items = TOMI_DRIFT_ITEMS,
  columns = 6,
  tileWidth = 190,
  tileHeight = 250,
  gap = 20,
  radius = 16,
  mobileColumns = 6,
  mobileTileWidth = 110,
  mobileTileHeight = 150,
  mobileGap = 12,
  mobileRadius = 10,
  tilt = 12,
  turn = -10,
  roll = -26,
  perspective = 1100,
  depth = 80,
  speed = 30,
  direction = 'up',
  variance = 0.35,
  parallax = 0,
  pauseOnHover = false,
  lift = 60,
  fade = 0.2,
  dim = 0.95,
  grayscale = false,
  overlayColor = 'rgba(255,255,255,0.05)',
  className = '',
  style,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const trackRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const offsetsRef = useRef<number[]>([])
  const velocitiesRef = useRef<number[]>([])
  const hoveredColRef = useRef<number>(-1)
  const wallHoveredRef = useRef<boolean>(false)
  const pointerRef = useRef({ x: 0, y: 0 })
  const pointerDampedRef = useRef({ x: 0, y: 0 })
  const lastTsRef = useRef<number | null>(null)

  const [containerHeight, setContainerHeight] = useState(800)
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(null)
  const [reduced, setReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setReduced(prefersReducedMotion())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const actualColumns = isMobile ? mobileColumns : columns
  const actualTileWidth = isMobile ? mobileTileWidth : tileWidth
  const actualTileHeight = isMobile ? mobileTileHeight : tileHeight
  const actualGap = isMobile ? mobileGap : gap
  const actualRadius = isMobile ? mobileRadius : radius
  const actualLift = isMobile ? Math.min(24, lift) : lift

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: actualColumns }, () => [])
    items.forEach((item, i) => cols[i % actualColumns].push(item))
    return cols.map((col) => (col.length ? col : items.slice(0, 1)))
  }, [items, actualColumns])

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = actualTileHeight + actualGap
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit)
      const copies = Math.max(2, Math.ceil((containerHeight * 1.8) / copyHeight) + 1)
      return { copyHeight, copies }
    })
  }, [columnItems, actualTileHeight, actualGap, containerHeight])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 800)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === 'up' ? 1 : -1
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1
      return speed * columnFactor(c, variance) * dirSign * altSign
    })
  }, [columnItems, speed, direction, variance])

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1))
    velocitiesRef.current = columnItems.map(() => 0)
  }, [columnMeta, columnItems])

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current
      if (!plane) return
      const scale = isMobile ? 1.55 : 1.42
      plane.style.transform =
        `translate(-50%, -50%) scale(${scale}) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`
    },
    [tilt, turn, roll, depth, isMobile]
  )

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000)
      lastTsRef.current = ts

      const maxTilt = parallax * 8
      const targetX = pointerRef.current.x * maxTilt
      const targetY = -pointerRef.current.y * maxTilt
      const damp = 1 - Math.exp(-dt / 0.12)
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y)

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c]
          if (!meta) continue
          const paused = wallHoveredRef.current && pauseOnHover
          const factor = paused || hoveredColRef.current === c ? 0 : 1
          const target = baseVelocities[c] * factor

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28))
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight
          offsetsRef.current[c] = next

          const el = trackRefs.current[c]
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c]
          const meta = columnMeta[c]
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = null
    }
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform])

  const activate = useCallback((id: string, index: number): void => {
    activeIdRef.current = id
    hoveredColRef.current = index
    setActiveId(id)
  }, [])
  const release = useCallback((): void => {
    activeIdRef.current = null
    hoveredColRef.current = -1
    setActiveId(null)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        }
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY)
      const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null
      if (!tile) {
        if (activeIdRef.current !== null) {
          release()
        }
        return
      }
      const id = tile.dataset.tileId ?? null
      if (id === activeIdRef.current) return
      activeIdRef.current = id
      hoveredColRef.current = Number(tile.dataset.col)
      setActiveId(id)
    },
    [parallax, reduced, release]
  )

  const handlePointerLeaveWall = useCallback((): void => {
    wallHoveredRef.current = false
    pointerRef.current = { x: 0, y: 0 }
    release()
  }, [release])

  const maskStyle =
    'radial-gradient(ellipse 85% 88% at 50% 50%, #000 var(--dw-edge), transparent 100%), ' +
    'linear-gradient(to top, #000 var(--dw-edge), transparent 100%)'

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        '--dw-tile-w': `${actualTileWidth}px`,
        '--dw-tile-h': `${actualTileHeight}px`,
        '--dw-gap': `${actualGap}px`,
        '--dw-radius': `${actualRadius}px`,
        '--dw-lift': `${actualLift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        WebkitMaskImage: maskStyle,
        maskImage: maskStyle,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
        ...style,
      }) as CSSProperties,
    [
      actualTileWidth,
      actualTileHeight,
      actualGap,
      actualRadius,
      actualLift,
      dim,
      grayscale,
      overlayColor,
      fade,
      perspective,
      maskStyle,
      style,
    ]
  )

  const tileClass = cx(
    'group/tile relative block flex-none cursor-pointer outline-none',
    'w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]'
  )
  const innerClass = cx(
    'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-white p-1.5 shadow-md border border-white/90',
    'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]',
    'transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))_scale(1.06)]',
    'group-[.is-active]/tile:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.35)]',
    'group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))_scale(1.06)]'
  )
  const imgClass = cx(
    'block h-full w-full select-none object-cover rounded-[calc(var(--dw-radius)-4px)]',
    'transition-[filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
  )
  const overlayClass = cx(
    'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.2]',
    'transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-0'
  )

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const inner = (
      <span className={innerClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title ?? ''}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={imgClass}
        />
        <span className={overlayClass} aria-hidden="true" />
      </span>
    )
    const commonProps = {
      className: cx(tileClass, activeId === id && 'is-active'),
      'data-tile-id': id,
      'data-col': colIndex,
      onPointerEnter: () => activate(id, colIndex),
      onPointerLeave: release,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
    }
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      )
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden bg-[#f4f7fa]', className)}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of photos"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c]
          const copies = Array.from({ length: meta.copies })
          return (
            <div
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              key={`col-${c}`}
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DriftWall
