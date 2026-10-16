export function EventGridSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Skeleton */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 space-y-4">
          <div className="mx-auto h-6 w-36 rounded-full bg-zinc-900 animate-pulse" />
          <div className="mx-auto h-12 w-3/4 max-w-lg rounded-2xl bg-zinc-900 animate-pulse" />
          <div className="mx-auto h-5 w-2/3 max-w-md rounded-xl bg-zinc-900/60 animate-pulse" />
          <div className="mx-auto pt-4">
            <div className="mx-auto h-11 w-44 rounded-xl bg-zinc-900 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid Section Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Controls Skeleton */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-full max-w-md rounded-xl bg-zinc-900 animate-pulse" />
            <div className="h-10 w-48 rounded-xl bg-zinc-900 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-full bg-zinc-900 animate-pulse" />
            <div className="h-7 w-20 rounded-full bg-zinc-900 animate-pulse" />
            <div className="h-7 w-24 rounded-full bg-zinc-900 animate-pulse" />
          </div>
        </div>

        {/* Cards Skeleton Grid (6 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-0 shadow-lg"
            >
              {/* Image skeleton */}
              <div className="aspect-4/5 w-full bg-zinc-800/40 animate-pulse" />

              {/* Card info skeleton */}
              <div className="p-5 space-y-3">
                <div className="h-4 w-1/2 rounded bg-zinc-800/60 animate-pulse" />
                <div className="h-6 w-3/4 rounded-lg bg-zinc-800/80 animate-pulse" />
                <div className="h-3.5 w-full rounded bg-zinc-800/40 animate-pulse" />
                <div className="h-3.5 w-4/5 rounded bg-zinc-800/40 animate-pulse" />

                <div className="pt-4 flex items-center gap-2">
                  <div className="h-10 flex-1 rounded-xl bg-zinc-800/80 animate-pulse" />
                  <div className="size-10 rounded-xl bg-zinc-800/60 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
