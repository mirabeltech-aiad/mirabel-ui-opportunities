import React from 'react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { ArrowUpDown, Check } from 'lucide-react'
import { SortPreset, SORT_PRESETS } from '../../components/shared/types/sortPresets'

interface SortPresetsDropdownProps {
  onSortPresetChange: (preset: SortPreset | null) => void
  activePreset?: string | null
  disabled?: boolean
}

export const SortPresetsDropdown: React.FC<SortPresetsDropdownProps> = ({
  onSortPresetChange,
  activePreset = null,
  disabled = false
}) => {
  const handlePresetSelect = (preset: SortPreset) => {
    try {
      if (preset.id === 'default') {
        onSortPresetChange(null)
      } else {
        onSortPresetChange(preset)
      }
    } catch (error) {
      console.error('Error selecting sort preset:', error)
      // Graceful fallback - try to reset to default
      try {
        onSortPresetChange(null)
      } catch (fallbackError) {
        console.error('Failed to reset sort preset:', fallbackError)
      }
    }
  }

  const getTooltipText = () => {
    try {
      if (!activePreset) return 'Sort presets'
      const preset = SORT_PRESETS.find(p => p.id === activePreset)
      return preset ? `Sorted by: ${preset.label}` : 'Sort presets'
    } catch (error) {
      console.error('Error getting tooltip text:', error)
      return 'Sort presets'
    }
  }

  // Validate SORT_PRESETS exists and has content
  const availablePresets = Array.isArray(SORT_PRESETS) && SORT_PRESETS.length > 0 
    ? SORT_PRESETS 
    : [{ id: 'default', label: 'Default', sortConfig: [] }]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-9 w-9 p-0 ${activePreset ? 'bg-ocean-50 border-ocean-300' : ''}`}
          disabled={disabled}
          title={getTooltipText()}
        >
          <ArrowUpDown className={`h-4 w-4 ${activePreset ? 'text-ocean-600' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[18rem] max-w-[28rem]">
        {availablePresets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            className="flex items-center justify-between cursor-pointer whitespace-nowrap"
          >
            <span className="flex-1 min-w-0 whitespace-nowrap">
              {preset.label}
            </span>
            {((preset.id === 'default' && !activePreset) || preset.id === activePreset) && (
              <Check className="h-4 w-4 text-ocean-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}