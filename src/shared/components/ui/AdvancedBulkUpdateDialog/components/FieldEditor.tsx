import React from 'react'
import { FloatingLabelInput } from '../../FloatingLabelInput'
import { Checkbox } from '../../checkbox'
import type { FieldUpdate } from '../types'

interface FieldEditorProps {
  field: FieldUpdate
  onUpdate: (fieldKey: string, updates: Partial<FieldUpdate>) => void
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate }) => {
  const handleFieldUpdate = (updates: Partial<FieldUpdate>) => {
    onUpdate(field.field, updates)
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-4">
        <Checkbox
          checked={field.enabled}
          onCheckedChange={(checked) => handleFieldUpdate({ enabled: !!checked })}
          className="mt-1"
        />
        <div className="flex-1">
          <label className="font-semibold text-sm text-ocean-800">
            {field.field}
          </label>
          <div className="w-full mt-2">
            <FloatingLabelInput
              label={`Enter ${field.field}`}
              value={field.value?.toString() || ''}
              onChange={(value) => handleFieldUpdate({ value })}
              disabled={!field.enabled}
              modal
            />
          </div>
        </div>
      </div>
    </div>
  )
}