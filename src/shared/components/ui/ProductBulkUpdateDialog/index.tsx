import React, { useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dialog'
import { Button } from '../button'
import { Badge } from '../badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'
import { Edit, Eye, Save, Clock, Package } from 'lucide-react'
import { ProductBulkUpdateDialogProps, DialogTab } from './types'
import { PRODUCT_FIELDS } from './constants/productFields'
import { useBulkUpdateState } from './hooks/useBulkUpdateState'
import { useBulkUpdateExecution } from './hooks/useBulkUpdateExecution'
import { FieldEditor } from './components/FieldEditor'
import { PreviewTab } from './components/PreviewTab'
import { ProgressTab } from './components/ProgressTab'

/**
 * Bulk update dialog for products with field-level operations
 */
export const ProductBulkUpdateDialog: React.FC<ProductBulkUpdateDialogProps> = React.memo(({
  isOpen,
  onClose,
  selectedItems,
  onSuccess
}) => {
  const {
    activeTab,
    fieldUpdates,
    executionState,
    enabledUpdates,
    hasEnabledUpdates,
    setActiveTab,
    handleFieldToggle,
    handleFieldValueChange,
    handleOperationChange,
    handleFindReplaceChange,
    updateExecutionState,
    setProgress,
    setCurrentOperation
  } = useBulkUpdateState(isOpen)

  const { executeBulkUpdate } = useBulkUpdateExecution()

  const handleExecute = useCallback(async () => {
    if (!hasEnabledUpdates) return

    updateExecutionState({
      isProcessing: true,
      progress: 0,
      results: { successful: 0, failed: 0, errors: [] },
      showResults: false
    })
    setActiveTab('progress')

    try {
      const result = await executeBulkUpdate(
        selectedItems,
        enabledUpdates,
        setProgress,
        setCurrentOperation
      )

      updateExecutionState({
        isProcessing: false,
        results: result,
        showResults: true
      })

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error: any) {
      console.error('Bulk update failed:', error)
      updateExecutionState({
        isProcessing: false,
        results: { 
          successful: 0, 
          failed: selectedItems.length, 
          errors: [error.message || 'Bulk update failed'] 
        },
        showResults: true
      })
    }
  }, [
    hasEnabledUpdates,
    selectedItems,
    enabledUpdates,
    executeBulkUpdate,
    updateExecutionState,
    setActiveTab,
    setProgress,
    setCurrentOperation,
    onSuccess
  ])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-ocean-600" />
            Bulk Update Products
            <Badge variant="outline" className="ml-2">
              {selectedItems.length} selected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DialogTab)} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields" disabled={executionState.isProcessing}>
              <Edit className="h-4 w-4 mr-2" />
              Fields
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={executionState.isProcessing || !hasEnabledUpdates}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={!executionState.isProcessing && !executionState.showResults}>
              <Clock className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="flex-1 overflow-y-auto space-y-4 mt-4">
            <div className="space-y-4">
              {PRODUCT_FIELDS.map((field) => {
                const update = fieldUpdates.find(u => u.field === field.key)
                return update ? (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    update={update}
                    selectedItemsCount={selectedItems.length}
                    onToggle={handleFieldToggle}
                    onValueChange={handleFieldValueChange}
                    onOperationChange={handleOperationChange}
                    onFindReplaceChange={handleFindReplaceChange}
                  />
                ) : null
              })}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-y-auto mt-4">
            <PreviewTab
              enabledUpdates={enabledUpdates}
              selectedItemsCount={selectedItems.length}
            />
          </TabsContent>

          <TabsContent value="progress" className="flex-1 overflow-y-auto mt-4">
            <ProgressTab executionState={executionState} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {hasEnabledUpdates && (
              <Badge variant="outline">
                {enabledUpdates.length} field{enabledUpdates.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={executionState.isProcessing}
            >
              {executionState.showResults ? 'Close' : 'Cancel'}
            </Button>
            
            {!executionState.showResults && (
              <Button
                onClick={handleExecute}
                disabled={!hasEnabledUpdates || executionState.isProcessing}
                className="bg-ocean-600 hover:bg-ocean-700"
              >
                {executionState.isProcessing ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update {selectedItems.length} Products
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})