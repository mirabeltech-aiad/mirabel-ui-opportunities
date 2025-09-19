import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableChip } from './SortableChip'

export interface SelectedChipsListProps<T extends { id: string; label: string; badge?: string } = { id: string; label: string; badge?: string }>{
  selectedIds: string[]
  items: Array<{ id: string; label: string; badge?: string }>
  onRemove: (id: string) => void
  showAll: boolean
  setShowAll: (show: boolean) => void
  visibleLimit?: number
  labelSingular?: string
}

export const SelectedChipsList: React.FC<SelectedChipsListProps> = ({
  selectedIds,
  items,
  onRemove,
  showAll,
  setShowAll,
  visibleLimit = 3,
  labelSingular = 'item'
}) => {
  if (selectedIds.length === 0) return null

  const visible = showAll ? selectedIds : selectedIds.slice(0, visibleLimit)
  const hiddenCount = Math.max(0, selectedIds.length - visible.length)

  const resolve = (id: string) => items.find(i => i.id === id)

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        Selected {labelSingular}{selectedIds.length === 1 ? '' : 's'} ({selectedIds.length})
      </div>
      <SortableContext items={selectedIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-wrap gap-2 items-center">
          {visible.map(id => {
            const it = resolve(id)
            if (!it) return null
            return (
              <SortableChip
                key={id}
                id={id}
                label={it.label}
                badge={it.badge}
                onRemove={() => onRemove(id)}
              />
            )
          })}
          {hiddenCount > 0 && !showAll && (
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => setShowAll(true)}
            >
              +{hiddenCount} more
            </button>
          )}
          {showAll && selectedIds.length > visibleLimit && (
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => setShowAll(false)}
            >
              Collapse
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default SelectedChipsList


