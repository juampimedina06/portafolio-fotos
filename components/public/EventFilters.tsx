'use client'

import { Search, X } from 'lucide-react'

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
    <div className="space-y-3">
      {/* Buscador & Selector de Tiempo en formato píldora */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-between">
        {/* Buscador */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por evento o lugar..."
            className="w-full rounded-full border border-zinc-200/90 bg-white/90 pl-9 pr-8 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              title="Borrar búsqueda"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Toggle Próximos / Todos */}
        <div className="inline-flex items-center self-center sm:self-auto w-fit shrink-0 rounded-full border border-zinc-200/90 bg-white/90 p-1 text-[11px] font-medium backdrop-blur-sm shadow-xs">
          <button
            type="button"
            onClick={() => onTimeFilterChange('all')}
            className={`rounded-full px-3.5 py-1 transition whitespace-nowrap ${
              timeFilter === 'all'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onTimeFilterChange('upcoming')}
            className={`rounded-full px-3.5 py-1 transition whitespace-nowrap ${
              timeFilter === 'upcoming'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Próximos
          </button>
        </div>
      </div>

      {/* Píldoras de Categorías */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'border border-zinc-200/80 bg-white/80 text-zinc-600 hover:bg-white'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => {
              const isSelected = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'border border-zinc-200/80 bg-white/80 text-zinc-600 hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <span className="text-[11px] text-zinc-400">
            {totalCount} {totalCount === 1 ? 'evento' : 'eventos'}
          </span>
        </div>
      )}
    </div>
  )
}
