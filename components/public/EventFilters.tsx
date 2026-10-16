'use client'

import { CalendarClock, Filter, Search, X } from 'lucide-react'

export type TimeFilterOption = 'upcoming' | 'all'

interface EventFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  timeFilter: TimeFilterOption
  onTimeFilterChange: (filter: TimeFilterOption) => void
  totalCount: number
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  timeFilter,
  onTimeFilterChange,
  totalCount,
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Input & Time Toggle Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título o ciudad..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-10 pr-9 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              title="Limpiar búsqueda"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Time Tabs (Próximos vs Todos) */}
        <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onTimeFilterChange('upcoming')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${
              timeFilter === 'upcoming'
                ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarClock className="size-3.5" />
            <span>Próximos</span>
          </button>
          <button
            type="button"
            onClick={() => onTimeFilterChange('all')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${
              timeFilter === 'all'
                ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Todos / Pasados</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-900">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {/* "Todos" Pill */}
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-zinc-950 font-semibold shadow-xs'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            Todos
          </button>

          {/* Dynamic Category Pills */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-xs'
                    : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* Counter Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Filter className="size-3" />
          <span>
            {totalCount} {totalCount === 1 ? 'evento' : 'eventos'}
          </span>
        </div>
      </div>
    </div>
  )
}
