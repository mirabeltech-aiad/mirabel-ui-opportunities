import React, { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { PowerMultiselect } from '@/shared/components/ui/PowerMultiselect'
import { 
  Save, 
  Globe,
  User,
  AlertCircle
} from 'lucide-react'
import { ColumnDefinition, SavedView } from '@/shared/types/views'

interface AddViewTabProps {
  columns: ColumnDefinition[]
  visibleColumns: string[]
  onToggleColumn: (columnKey: string) => void
  onReorderColumns?: (columnKeys: string[]) => void
  onSaveView: (name: string, description?: string) => SavedView
  onSwitchToSaved: () => void
  editingView?: SavedView | null
}

const AddViewTab: React.FC<AddViewTabProps> = ({
  columns,
  visibleColumns,
  onToggleColumn,
  onReorderColumns,
  onSaveView,
  onSwitchToSaved,
  editingView
}) => {
  const [viewName, setViewName] = useState('')
  const [isGlobal, setIsGlobal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Pre-populate form when editing a view
  useEffect(() => {
    if (editingView) {
      setViewName(editingView.name)
      setIsGlobal(editingView.isGlobal || false)
    } else {
      // Reset form when not editing
      setViewName('')
      setIsGlobal(false)
    }
  }, [editingView])

  const visibleColumnKeys = visibleColumns
  const visibleCount = visibleColumns.length

  // Convert ColumnDefinition[] to PowerMultiselect format
  const columnOptions = columns.map(col => ({
    value: col.key,
    label: col.title
    // Removed category and description to keep simple single-column layout
  }))

  const handleColumnSelectionChange = (selectedKeys: string[]) => {
    // Directly update the visible columns array - same as rate card edit page
    if (onReorderColumns) {
      onReorderColumns(selectedKeys)
    }
  }

  const handleSave = async () => {
    if (!viewName.trim() || visibleCount === 0) return

    setIsSaving(true)
    try {
      await onSaveView(viewName.trim())
      
      // Reset form
      setViewName('')
      setIsGlobal(false)
      
      // Switch to saved views tab
      onSwitchToSaved()
    } catch (error) {
      console.error('Failed to save view:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const canSave = viewName.trim().length > 0 && visibleCount > 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Compact Header Form */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 space-y-3">
        <div className="space-y-3">
          <Input
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="View name *"
            className="h-8 text-sm"
            maxLength={50}
          />
          
          {/* View Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-ocean-600">View Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewType"
                  checked={!isGlobal}
                  onChange={() => setIsGlobal(false)}
                  className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Personal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewType"
                  checked={isGlobal}
                  onChange={() => setIsGlobal(true)}
                  className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Global</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              {isGlobal 
                ? 'Available to all users (requires admin permissions)' 
                : 'Only visible to you'
              }
            </p>
          </div>
        </div>

        {visibleCount === 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-700">Select at least one column</span>
          </div>
        )}
      </div>

      {/* Column Selector */}
      <div className="flex-1 overflow-hidden p-4">
        <PowerMultiselect
          placeholder="Search and select columns..."
          value={visibleColumnKeys}
          options={columnOptions}
          onChange={handleColumnSelectionChange}
          label="Select Columns"
          chipLabel="Selected Columns"
          className="w-full"
        />
      </div>

      {/* Save Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="w-full bg-ocean-500 hover:bg-ocean-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving View...' : 'Save View'}
        </Button>
        
        {!canSave && (
          <p className="text-xs text-gray-500 text-center mt-2">
            {!viewName.trim() 
              ? 'Enter a view name to continue' 
              : 'Select at least one column to save'
            }
          </p>
        )}
      </div>
    </div>
  )
}

export default AddViewTab
