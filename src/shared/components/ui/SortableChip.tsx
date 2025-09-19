import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export interface SortableChipProps {
  id: string
  label: string
  badge?: string
  onRemove: () => void
}

export const SortableChip: React.FC<SortableChipProps> = ({ id, label, badge, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="inline-flex items-center gap-2 px-3 py-1 bg-ocean-50 text-ocean-800 border border-ocean-200 rounded-full text-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-ocean-600 hover:text-ocean-800"
      >
        <GripVertical className="h-3 w-3" />
      </div>
      <span>{label}</span>
      {badge && (
        <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">{badge}</span>
      )}
      <button onClick={onRemove} className="text-ocean-600 hover:text-ocean-800 ml-1">
        ×
      </button>
    </div>
  )
}

export default SortableChip


