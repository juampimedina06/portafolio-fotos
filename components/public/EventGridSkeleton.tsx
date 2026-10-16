export function EventGridSkeleton() {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="text-center space-y-3">
        <div className="mx-auto h-12 w-48 rounded-2xl bg-zinc-200/80" />
        <div className="mx-auto h-4 w-36 rounded-full bg-zinc-200/60" />
      </div>

      {/* Filter skeleton */}
      <div className="h-10 w-full rounded-full bg-zinc-200/70" />

      {/* Pill items skeleton */}
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-full border border-zinc-200/80 bg-white/80 p-2 pr-4 shadow-xs"
          >
            <div className="size-12 rounded-full bg-zinc-200/80 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-2/3 rounded bg-zinc-200/80" />
              <div className="h-3 w-1/3 rounded bg-zinc-200/60" />
            </div>
            <div className="h-7 w-20 rounded-full bg-zinc-200/80 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
