import React from 'react'
import { Label } from './label'
import { Tooltip } from './tooltip'
import { Switch } from './switch'
import { Info } from 'lucide-react'

export interface ToggleRowProps {
  label: string
  tooltip?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

// Renders two grid cells: [label+tooltip] [switch]
export const ToggleRow: React.FC<ToggleRowProps> = ({ label, tooltip, checked, onChange }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {tooltip && (
          <Tooltip content={tooltip} theme="default">
            <Info className="h-4 w-4 text-gray-400" />
          </Tooltip>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </>
  )
}

export default ToggleRow


