import { useCallback } from 'react'
import { Product } from '../../../shared/types/product'
import { FieldUpdate, BulkUpdateResults } from '../types'
import { useFieldOperations } from './useFieldOperations'
import { PRODUCT_FIELDS } from '../constants/productFields'

/***
 * Custom hook for executing bulk updates
 */
export const useBulkUpdateExecution = () => {
  const { applyTextOperation, applyNumberOperation, applyTagsOperation } = useFieldOperations()

  /**
   * Apply all field updates to a single product
   */
  const applyUpdatesToProduct = useCallback((
    product: Product, 
    updates: FieldUpdate[]
  ): Product => {
    const updatedProduct = { ...product }

    for (const update of updates) {
      const field = PRODUCT_FIELDS.find(f => f.key === update.field)
      if (!field) continue

      switch (field.type) {
        case 'advanced-text':
          if (typeof updatedProduct[update.field as keyof Product] === 'string') {
            (updatedProduct as any)[update.field] = applyTextOperation(
              (updatedProduct as any)[update.field] as string,
              update.operation || 'set',
              update.value,
              update.findText,
              update.replaceText
            )
          }
          break
        case 'number':
          if (typeof updatedProduct[update.field as keyof Product] === 'number') {
            (updatedProduct as any)[update.field] = applyNumberOperation(
              (updatedProduct as any)[update.field] as number,
              update.operation || 'set',
              parseFloat(update.value) || 0
            )
          }
          break
        case 'multi-select':
          if (update.field === 'tags' && Array.isArray(updatedProduct.tags)) {
            updatedProduct.tags = applyTagsOperation(
              updatedProduct.tags,
              update.operation || 'set',
              Array.isArray(update.value) ? update.value : []
            )
          }
          break
        case 'select':
          (updatedProduct as any)[update.field] = update.value
          break
      }
    }

    return updatedProduct
  }, [applyTextOperation, applyNumberOperation, applyTagsOperation])

  /**
   * Execute bulk update operation
   */
  const executeBulkUpdate = useCallback(async (
    selectedItems: Product[],
    enabledUpdates: FieldUpdate[],
    onProgress: (progress: number) => void,
    onCurrentOperation: (operation: string) => void
  ): Promise<BulkUpdateResults & { updatedItems: Product[] }> => {
    const totalItems = selectedItems.length
    let successful = 0
    let failed = 0
    const errors: string[] = []
    const updatedItems: Product[] = []

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i]
      onCurrentOperation(`Updating ${item.name}...`)
      onProgress((i / totalItems) * 100)

      try {
        // Apply updates to the item
        const updatedItem = applyUpdatesToProduct(item, enabledUpdates)

        // Here you would typically call your API to update the product
        // For now, we'll simulate the update
        await new Promise(resolve => setTimeout(resolve, 100))
        
        updatedItems.push(updatedItem)
        successful++
      } catch (error: any) {
        failed++
        errors.push(`${item.name}: ${error.message || 'Unknown error'}`)
      }
    }

    onProgress(100)
    onCurrentOperation('Update completed!')

    return {
      successful,
      failed,
      errors,
      updatedItems
    }
  }, [applyUpdatesToProduct])

  return {
    executeBulkUpdate
  }
}