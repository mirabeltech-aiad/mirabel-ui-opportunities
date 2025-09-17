import React, { useCallback, useMemo } from 'react'
import { Checkbox } from '../../checkbox'
import { Badge } from '../../badge'
import { FloatingLabelInput } from '../../FloatingLabelInput'
import { SimpleMultiSelect } from '../../SimpleMultiSelect'
import { FieldUpdate } from '../types'
import { ProductFieldDefinition } from '../constants/productFields'

interface FieldEditorProps {
  field: ProductFieldDefinition
  update: FieldUpdate
  selectedItemsCount: number
  onToggle: (fieldKey: string, enabled: boolean) => void
  onValueChange: (fieldKey: string, value: any) => void
  onOperationChange: (fieldKey: string, operation: string) => void
  onFindReplaceChange: (fieldKey: string, findText: string, replaceText: string) => void
}

export const FieldEditor: React.FC<FieldEditorProps> = React.memo(({
  field,
  update,
  selectedItemsCount,
  onToggle,
  onValueChange,
  onOperationChange,
  onFindReplaceChange
}) => {
  const shouldShowValueInput = useMemo(() => {
    const operation = update.operation
    return operation !== 'clear' &&
      operation !== 'trim' &&
      operation !== 'uppercase' &&
      operation !== 'lowercase' &&
      operation !== 'title-case'
  }, [update.operation])

  const handleToggle = useCallback((checked: boolean) => {
    onToggle(field.key, checked)
  }, [field.key, onToggle])

  const handleValueChange = useCallback((value: any) => {
    onValueChange(field.key, value)
  }, [field.key, onValueChange])

  const handleOperationChange = useCallback((operation: string) => {
    onOperationChange(field.key, operation)
  }, [field.key, onOperationChange])

  const handleFindTextChange = useCallback((findText: string) => {
    onFindReplaceChange(field.key, findText, update.replaceText || '')
  }, [field.key, update.replaceText, onFindReplaceChange])

  const handleReplaceTextChange = useCallback((replaceText: string) => {
    onFindReplaceChange(field.key, update.findText || '', replaceText)
  }, [field.key, update.findText, onFindReplaceChange])

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={update.enabled}
            onCheckedChange={handleToggle}
          />
          <label className="text-sm font-medium text-ocean-600">
            {field.label}
          </label>
        </div>
        <Badge variant="outline" className="text-xs">
          {selectedItemsCount} items
        </Badge>
      </div>

      {update.enabled && (
        <div className="space-y-3 pl-6">
          {field.operations && field.operations.length > 1 && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-ocean-600">Operation</label>
              <select
                value={update.operation}
                onChange={(e) => handleOperationChange(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              >
                {field.operations.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {shouldShowValueInput && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-ocean-600">
                {update.operation === 'find-replace' ? 'New Value' : 'Value'}
              </label>

              {field.type === 'select' ? (
                <select
                  value={update.value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option: any) => (
                    <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
                      {typeof option === 'string' ? option : option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'multi-select' ? (
                <SimpleMultiSelect
                  placeholder={`Select ${field.label}`}
                  value={Array.isArray(update.value) ? update.value : []}
                  onChange={handleValueChange}
                  options={(field.options as string[])?.map((option: string) => ({ value: option, label: option })) || []}
                />
              ) : field.type === 'number' ? (
                <FloatingLabelInput
                  modal
                  label="Value"
                  type="number"
                  value={update.value}
                  onChange={handleValueChange}
                />
              ) : (
                <FloatingLabelInput
                  modal
                  label="Value"
                  value={update.value}
                  onChange={handleValueChange}
                />
              )}
            </div>
          )}

          {update.operation === 'find-replace' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-ocean-600">Find Text</label>
                <FloatingLabelInput
                  modal
                  label="Find"
                  value={update.findText || ''}
                  onChange={handleFindTextChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-ocean-600">Replace With</label>
                <FloatingLabelInput
                  modal
                  label="Replace"
                  value={update.replaceText || ''}
                  onChange={handleReplaceTextChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})