import React, { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Checkbox } from './checkbox'
import { Badge } from './badge'
import { Alert, AlertDescription } from './alert'
import { 
  Calendar, 
  Edit, 
  Eye, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Clock,
  Hash,
  Type,
  Info
} from 'lucide-react'
import { Tooltip } from './tooltip'

interface SimpleBatchUpdateDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: any[]
  onSuccess?: (updatedItems: any[]) => void
}

interface BatchTask {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'dates' | 'text' | 'numbers'
  fields: string[]
  enabled: boolean
  value?: any
  options?: any
}

// Available date fields for reference in relative date calculations
const DATE_FIELDS = [
  { key: 'date', label: 'Main Date (Billing Date)' },
  { key: 'materialDue', label: 'Material Due' },
  { key: 'proofArrival', label: 'Proof Arrival' },
  { key: 'onSaleDate', label: 'On Sale Date' },
  { key: 'filesShipped', label: 'Files Shipped' },
  { key: 'periodicalsShipped', label: 'Periodicals Shipped' },
  { key: 'accountingComplete', label: 'Accounting Complete' }
]

const BATCH_TASKS: BatchTask[] = [
  // Date Tasks - The Three Primary Ways Users Update Schedules
  {
    id: 'shift-all-dates',
    name: 'Shift All Dates',
    description: 'Move all dates forward or backward by the same amount',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['date', 'materialDue', 'proofArrival', 'onSaleDate', 'filesShipped', 'periodicalsShipped', 'accountingComplete'],
    enabled: false
  },
  {
    id: 'update-material-due',
    name: 'Update Material Due Dates',
    description: 'Set material due dates using exact date, days before, or days after another event',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['materialDue'],
    enabled: false
  },
  {
    id: 'update-proof-arrival',
    name: 'Update Proof Arrival Dates',
    description: 'Set proof arrival dates using exact date, days before, or days after another event',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['proofArrival'],
    enabled: false
  },
  {
    id: 'update-on-sale-date',
    name: 'Update On Sale Dates',
    description: 'Set on sale dates using exact date, days before, or days after another event',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['onSaleDate'],
    enabled: false
  },
  {
    id: 'update-files-shipped',
    name: 'Update Files Shipped Dates',
    description: 'Set files shipped dates using exact date, days before, or days after another event',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['filesShipped'],
    enabled: false
  },
  {
    id: 'update-periodicals-shipped',
    name: 'Update Periodicals Shipped Dates',
    description: 'Set periodicals shipped dates using exact date, days before, or days after another event',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['periodicalsShipped'],
    enabled: false
  },
  {
    id: 'update-accounting-complete',
    name: 'Update Accounting Complete Dates',
    description: 'Set accounting complete dates using exact date, days before, or days after another event',
    icon: <Calendar className="h-4 w-4" />,
    category: 'dates',
    fields: ['accountingComplete'],
    enabled: false
  },
  {
    id: 'clear-all-dates',
    name: 'Clear All Date Fields',
    description: 'Remove all dates except the main date (useful for draft schedules)',
    icon: <X className="h-4 w-4" />,
    category: 'dates',
    fields: ['materialDue', 'proofArrival', 'onSaleDate', 'filesShipped', 'periodicalsShipped', 'accountingComplete'],
    enabled: false
  },

  // Text Tasks
  {
    id: 'add-year-to-names',
    name: 'Add Year to Names',
    description: 'Add the year to the beginning of all schedule names (e.g., "January" → "2024 January")',
    icon: <Type className="h-4 w-4" />,
    category: 'text',
    fields: ['name'],
    enabled: false
  },
  {
    id: 'set-volume-numbers',
    name: 'Set Volume Numbers',
    description: 'Set volume numbers starting from a specific number',
    icon: <Hash className="h-4 w-4" />,
    category: 'text',
    fields: ['volume'],
    enabled: false
  },
  {
    id: 'clear-text-fields',
    name: 'Clear Text Fields',
    description: 'Clear volume, mailing list, and reservation fields',
    icon: <X className="h-4 w-4" />,
    category: 'text',
    fields: ['volume', 'mailingListCount', 'reservation'],
    enabled: false
  },

  // Number Tasks
  {
    id: 'set-quantities',
    name: 'Set All Quantities',
    description: 'Set the same quantity for all selected items',
    icon: <Hash className="h-4 w-4" />,
    category: 'numbers',
    fields: ['quantity'],
    enabled: false
  },
  {
    id: 'increase-quantities',
    name: 'Increase Quantities',
    description: 'Increase all quantities by a percentage or fixed amount',
    icon: <Hash className="h-4 w-4" />,
    category: 'numbers',
    fields: ['quantity'],
    enabled: false
  }
]

export const SimpleBatchUpdateDialog: React.FC<SimpleBatchUpdateDialogProps> = ({
  isOpen,
  onClose,
  selectedItems,
  onSuccess
}) => {
  const [tasks, setTasks] = useState<BatchTask[]>(BATCH_TASKS)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  // Update task configuration
  const updateTask = (taskId: string, updates: Partial<BatchTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  // Get enabled tasks
  const enabledTasks = useMemo(() => 
    tasks.filter(task => task.enabled), 
    [tasks]
  )

  // Generate preview
  const generatePreview = () => {
    const preview = selectedItems.map(item => {
      let updatedItem = { ...item }
      let changes: string[] = []

      enabledTasks.forEach(task => {
        switch (task.id) {
          case 'shift-all-dates':
            const days = parseInt(task.value?.days || '0')
            if (days !== 0) {
              task.fields.forEach(field => {
                if (updatedItem[field]) {
                  // Parse the date - handle both MM/DD/YYYY and YYYY-MM-DD formats
                  let currentDate: Date
                  if (updatedItem[field].includes('/')) {
                    // MM/DD/YYYY format
                    const [month, day, year] = updatedItem[field].split('/')
                    currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                  } else {
                    // YYYY-MM-DD format or other
                    currentDate = new Date(updatedItem[field])
                  }
                  
                  currentDate.setDate(currentDate.getDate() + days)
                  const newDate = currentDate.toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit', 
                    year: 'numeric' 
                  }).replace(/\//g, '/')
                  updatedItem[field] = newDate
                  changes.push(`${field}: shifted by ${days} days`)
                }
              })
            }
            break

          case 'update-material-due':
          case 'update-proof-arrival':
          case 'update-on-sale-date':
          case 'update-files-shipped':
          case 'update-periodicals-shipped':
          case 'update-accounting-complete':
            const fieldName = task.fields[0]
            const updateMethod = task.value?.method || 'exact'
            
            if (updateMethod === 'exact' && task.value?.exactDate) {
              // Method 1: Exact date - convert from YYYY-MM-DD to MM/DD/YYYY
              const exactDate = new Date(task.value.exactDate)
              const formattedDate = exactDate.toLocaleDateString('en-US', { 
                month: '2-digit', 
                day: '2-digit', 
                year: 'numeric' 
              }).replace(/\//g, '/')
              updatedItem[fieldName] = formattedDate
              changes.push(`${fieldName}: set to exact date ${formattedDate}`)
            } else if (updateMethod === 'before' && task.value?.referenceField && task.value?.daysBefore) {
              // Method 2: Days before another event
              const referenceDate = updatedItem[task.value.referenceField]
              if (referenceDate) {
                // Parse the reference date - handle both MM/DD/YYYY and YYYY-MM-DD formats
                let baseDate: Date
                if (referenceDate.includes('/')) {
                  // MM/DD/YYYY format
                  const [month, day, year] = referenceDate.split('/')
                  baseDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                } else {
                  // YYYY-MM-DD format or other
                  baseDate = new Date(referenceDate)
                }
                
                baseDate.setDate(baseDate.getDate() - parseInt(task.value.daysBefore))
                const newDate = baseDate.toLocaleDateString('en-US', { 
                  month: '2-digit', 
                  day: '2-digit', 
                  year: 'numeric' 
                }).replace(/\//g, '/')
                updatedItem[fieldName] = newDate
                const refFieldLabel = DATE_FIELDS.find(f => f.key === task.value.referenceField)?.label || task.value.referenceField
                changes.push(`${fieldName}: set to ${task.value.daysBefore} days before ${refFieldLabel}`)
              }
            } else if (updateMethod === 'after' && task.value?.referenceField && task.value?.daysAfter) {
              // Method 3: Days after another event
              const referenceDate = updatedItem[task.value.referenceField]
              if (referenceDate) {
                // Parse the reference date - handle both MM/DD/YYYY and YYYY-MM-DD formats
                let baseDate: Date
                if (referenceDate.includes('/')) {
                  // MM/DD/YYYY format
                  const [month, day, year] = referenceDate.split('/')
                  baseDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                } else {
                  // YYYY-MM-DD format or other
                  baseDate = new Date(referenceDate)
                }
                
                baseDate.setDate(baseDate.getDate() + parseInt(task.value.daysAfter))
                const newDate = baseDate.toLocaleDateString('en-US', { 
                  month: '2-digit', 
                  day: '2-digit', 
                  year: 'numeric' 
                }).replace(/\//g, '/')
                updatedItem[fieldName] = newDate
                const refFieldLabel = DATE_FIELDS.find(f => f.key === task.value.referenceField)?.label || task.value.referenceField
                changes.push(`${fieldName}: set to ${task.value.daysAfter} days after ${refFieldLabel}`)
              }
            }
            break

          case 'clear-all-dates':
            task.fields.forEach(field => {
              if (updatedItem[field]) {
                updatedItem[field] = ''
                changes.push(`${field}: cleared`)
              }
            })
            break

          case 'add-year-to-names':
            const year = task.value?.year || new Date().getFullYear()
            if (updatedItem.name && !updatedItem.name.includes(year.toString())) {
              updatedItem.name = `${year} ${updatedItem.name}`
              changes.push(`Name: added year ${year}`)
            }
            break

          case 'set-volume-numbers':
            const startVolume = parseInt(task.value?.startNumber || '1')
            const itemIndex = selectedItems.indexOf(item)
            updatedItem.volume = (startVolume + itemIndex).toString()
            changes.push(`Volume: set to ${updatedItem.volume}`)
            break

          case 'clear-text-fields':
            task.fields.forEach(field => {
              if (updatedItem[field]) {
                updatedItem[field] = ''
                changes.push(`${field}: cleared`)
              }
            })
            break

          case 'set-quantities':
            const quantity = parseInt(task.value?.quantity || '0')
            updatedItem.quantity = quantity
            changes.push(`Quantity: set to ${quantity}`)
            break

          case 'increase-quantities':
            const increaseType = task.value?.type || 'percentage'
            const increaseValue = parseFloat(task.value?.value || '0')
            if (increaseType === 'percentage') {
              updatedItem.quantity = Math.round(updatedItem.quantity * (1 + increaseValue / 100))
              changes.push(`Quantity: increased by ${increaseValue}%`)
            } else {
              updatedItem.quantity = updatedItem.quantity + increaseValue
              changes.push(`Quantity: increased by ${increaseValue}`)
            }
            break
        }
      })

      return {
        original: item,
        updated: updatedItem,
        changes
      }
    })

    setPreviewData(preview)
    setShowPreview(true)
  }

  // Apply changes
  const applyChanges = () => {
    const updatedItems = previewData.map(item => item.updated)
    onSuccess?.(updatedItems)
    onClose()
  }

  // Render task configuration
  const renderTaskConfig = (task: BatchTask) => {
    switch (task.id) {
      case 'shift-all-dates':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Days to shift</Label>
              <Input
                type="number"
                placeholder="Enter days (+ forward, - backward)"
                value={task.value?.days || ''}
                onChange={(e) => updateTask(task.id, { 
                  value: { ...task.value, days: e.target.value }
                })}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Example</Label>
              <div className="text-xs text-gray-600 pt-2">
                +7 = move 1 week forward<br/>
                -14 = move 2 weeks backward
              </div>
            </div>
          </div>
        )

      case 'update-material-due':
      case 'update-proof-arrival':
      case 'update-on-sale-date':
      case 'update-files-shipped':
      case 'update-periodicals-shipped':
      case 'update-accounting-complete':
        return (
          <div className="space-y-3">
            {/* Method Selection */}
            <div className="space-y-1">
              <Label>Update Method</Label>
              <select
                value={task.value?.method || 'exact'}
                onChange={(e) => updateTask(task.id, { 
                  value: { ...task.value, method: e.target.value }
                })}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none bg-white"
              >
                <option value="exact">Set to exact date</option>
                <option value="before">Set to days before another event</option>
                <option value="after">Set to days after another event</option>
              </select>
            </div>

            {/* Configuration based on method */}
            {task.value?.method === 'exact' && (
              <div className="space-y-1">
                <Label>Exact Date</Label>
                <Input
                  type="date"
                  value={task.value?.exactDate || ''}
                  onChange={(e) => updateTask(task.id, { 
                    value: { ...task.value, exactDate: e.target.value }
                  })}
                  className="h-9"
                />
              </div>
            )}

            {task.value?.method === 'before' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Days Before</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={task.value?.daysBefore || ''}
                    onChange={(e) => updateTask(task.id, { 
                      value: { ...task.value, daysBefore: e.target.value }
                    })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Reference Event</Label>
                  <select
                    value={task.value?.referenceField || 'date'}
                    onChange={(e) => updateTask(task.id, { 
                      value: { ...task.value, referenceField: e.target.value }
                    })}
                    className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none bg-white"
                  >
                    {DATE_FIELDS.filter(field => field.key !== task.fields[0]).map(field => (
                      <option key={field.key} value={field.key}>{field.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {task.value?.method === 'after' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Days After</Label>
                  <Input
                    type="number"
                    placeholder="7"
                    value={task.value?.daysAfter || ''}
                    onChange={(e) => updateTask(task.id, { 
                      value: { ...task.value, daysAfter: e.target.value }
                    })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Reference Event</Label>
                  <select
                    value={task.value?.referenceField || 'date'}
                    onChange={(e) => updateTask(task.id, { 
                      value: { ...task.value, referenceField: e.target.value }
                    })}
                    className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none bg-white"
                  >
                    {DATE_FIELDS.filter(field => field.key !== task.fields[0]).map(field => (
                      <option key={field.key} value={field.key}>{field.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Helper text */}
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              {task.value?.method === 'exact' && 'All selected items will have this field set to the same date.'}
              {task.value?.method === 'before' && 'Each item\'s date will be calculated based on its reference event date.'}
              {task.value?.method === 'after' && 'Each item\'s date will be calculated based on its reference event date.'}
            </div>
          </div>
        )

      case 'add-year-to-names':
        return (
          <div className="space-y-1">
            <Label>Year to add</Label>
            <Input
              type="number"
              placeholder={new Date().getFullYear().toString()}
              value={task.value?.year || new Date().getFullYear()}
              onChange={(e) => updateTask(task.id, { 
                value: { ...task.value, year: e.target.value }
              })}
              className="h-9"
            />
          </div>
        )

      case 'set-volume-numbers':
        return (
          <div className="space-y-1">
            <Label>Starting volume number</Label>
            <Input
              type="number"
              placeholder="1"
              value={task.value?.startNumber || '1'}
              onChange={(e) => updateTask(task.id, { 
                value: { ...task.value, startNumber: e.target.value }
              })}
              className="h-9"
            />
          </div>
        )

      case 'set-quantities':
        return (
          <div className="space-y-1">
            <Label>Quantity for all items</Label>
            <Input
              type="number"
              placeholder="1000"
              value={task.value?.quantity || ''}
              onChange={(e) => updateTask(task.id, { 
                value: { ...task.value, quantity: e.target.value }
              })}
              className="h-9"
            />
          </div>
        )

      case 'increase-quantities':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Increase by</Label>
              <select
                value={task.value?.type || 'percentage'}
                onChange={(e) => updateTask(task.id, { 
                  value: { ...task.value, type: e.target.value }
                })}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Value</Label>
              <Input
                type="number"
                placeholder={task.value?.type === 'percentage' ? '10' : '100'}
                value={task.value?.value || ''}
                onChange={(e) => updateTask(task.id, { 
                  value: { ...task.value, value: e.target.value }
                })}
                className="h-9"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Batch Update Schedule Items
            <Badge variant="secondary" className="ml-2">
              {selectedItems.length} items selected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How to use:</strong> Select the tasks you want to perform, configure the settings, 
                then preview your changes before applying them. You can select multiple tasks to run together.
              </AlertDescription>
            </Alert>

            {/* Task Categories */}
            {['dates', 'text', 'numbers'].map(category => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-ocean-800 capitalize flex items-center gap-2">
                  {category === 'dates' && <Calendar className="h-4 w-4" />}
                  {category === 'text' && <Type className="h-4 w-4" />}
                  {category === 'numbers' && <Hash className="h-4 w-4" />}
                  {category} Tasks
                </h3>
                
                <div className="grid gap-3">
                  {tasks.filter(task => task.category === category).map(task => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.enabled}
                          onCheckedChange={(checked) => updateTask(task.id, { enabled: !!checked })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {task.icon}
                            <h4 className="font-medium">{task.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          
                          {task.enabled && (
                            <div className="bg-gray-50 rounded-md p-3">
                              {renderTaskConfig(task)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={generatePreview}
                disabled={enabledTasks.length === 0}
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Changes
              </Button>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Preview Changes ({previewData.filter(p => p.changes.length > 0).length} items will be updated)
              </h3>
              <div className="flex gap-2">
                <Button onClick={() => setShowPreview(false)} variant="outline" size="sm">
                  Back to Edit
                </Button>
                <Button onClick={applyChanges} size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Changes
                </Button>
              </div>
            </div>

            {/* Preview Items */}
            <div className="space-y-2">
              {previewData.slice(0, 20).map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.original.name}</span>
                    <Badge variant={item.changes.length > 0 ? "default" : "secondary"}>
                      {item.changes.length} changes
                    </Badge>
                  </div>
                  
                  {item.changes.length > 0 && (
                    <div className="space-y-1 text-sm">
                      {item.changes.map((change: any, i: number) => (
                        <div key={i} className="text-green-700 bg-green-50 px-2 py-1 rounded">
                          ✓ {change}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {previewData.length > 20 && (
                <div className="text-center text-gray-500 text-sm py-2">
                  ... and {previewData.length - 20} more items
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SimpleBatchUpdateDialog