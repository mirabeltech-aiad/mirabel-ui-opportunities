import React from 'react'
import { Info, Plus } from 'lucide-react'
import { Button } from './button'
import { Label } from './label'

interface HeaderAction {
  key: string
  icon?: React.ReactNode
  label?: string
  onClick: (e: React.MouseEvent) => void
}

export interface AccordionSectionHeaderProps {
  colorClass: string
  title: string
  tooltip?: string

  // Left badges such as counts
  badgesLeft?: Array<{ text: string; className?: string }>

  // Optional add button
  onAddClick?: (e: React.MouseEvent) => void
  addButtonAriaLabel?: string

  // Optional required checkbox on the right
  requiredId?: string
  requiredChecked?: boolean
  onToggleRequired?: (checked: boolean) => void

  // Right actions (e.g., copy)
  rightActions?: HeaderAction[]

  className?: string
}

export const AccordionSectionHeader: React.FC<AccordionSectionHeaderProps> = ({
  colorClass,
  title,
  tooltip,
  badgesLeft = [],
  onAddClick,
  addButtonAriaLabel = 'Add',
  requiredId,
  requiredChecked,
  onToggleRequired,
  rightActions = [],
  className
}) => {
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div className={`flex items-center justify-between w-full ${className || ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-1 h-6 rounded-full mr-3 ${colorClass}`}></div>
        <span className="text-lg font-semibold text-ocean-800">{title}</span>
        {tooltip && (
          <span className="inline-flex" title={tooltip} onClick={stop} onMouseDown={stop}>
            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </span>
        )}
        {badgesLeft.map((b, idx) => (
          <span key={idx} className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${b.className || 'bg-ocean-100 text-ocean-800'}`}>
            {b.text}
          </span>
        ))}
        {onAddClick && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="ml-2 p-1 h-6 w-6 text-ocean-600 hover:bg-ocean-50"
          >
            <span
              onClick={(e) => { stop(e); onAddClick(e) }}
              aria-label={addButtonAriaLabel}
              role="button"
            >
              <Plus className="h-4 w-4" />
            </span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mr-2">
        {typeof requiredChecked === 'boolean' && requiredId && onToggleRequired && (
          <>
            <input
              type="checkbox"
              id={requiredId}
              className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
              checked={requiredChecked}
              onChange={(e) => onToggleRequired(e.target.checked)}
              onClick={stop}
            />
            <Label htmlFor={requiredId} className="text-sm text-gray-600" onClick={stop}>
              Required
            </Label>
          </>
        )}
        {rightActions.map(action => (
          <Button
            key={action.key}
            asChild
            variant="ghost"
            size="sm"
            className="ml-2 p-1 h-6 w-6 text-ocean-600 hover:bg-ocean-50"
          >
            <span
              onClick={(e) => { stop(e); action.onClick(e) }}
              aria-label={action.label || action.key}
              title={action.label}
              role="button"
            >
              {action.icon}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default AccordionSectionHeader


