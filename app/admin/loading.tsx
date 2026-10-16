export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-36 rounded-lg bg-zinc-200" />
        <div className="h-3 w-56 rounded bg-zinc-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-zinc-200">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-zinc-100" />
          <div className="h-7 w-16 rounded bg-zinc-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-zinc-100" />
          <div className="h-7 w-16 rounded bg-zinc-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-zinc-100" />
          <div className="h-7 w-16 rounded bg-zinc-200" />
        </div>
      </div>

      <div className="h-96 rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="h-full rounded-xl bg-zinc-50" />
      </div>
    </div>
  )
}
