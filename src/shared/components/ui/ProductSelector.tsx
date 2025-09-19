import React, { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical, Search, Plus, Minus } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'

export interface ProductItem {
    id: string
    name: string
    type?: string
    status?: string
}

interface ProductCapsuleProps {
    product: ProductItem
    isSelected: boolean
    isDragging?: boolean
    onRemove?: () => void
    onAdd?: () => void
}

const ProductCapsule: React.FC<ProductCapsuleProps> = ({
    product,
    isSelected,
    isDragging = false,
    onRemove,
    onAdd
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: product.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging || isSortableDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
        border transition-all duration-200 cursor-pointer
        ${isSelected
                    ? 'bg-ocean-100 border-ocean-300 text-ocean-800'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }
        ${isDragging || isSortableDragging ? 'shadow-lg scale-105' : 'shadow-sm'}
      `}
            {...attributes}
        >
            {isSelected && (
                <div {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-3 w-3 text-ocean-600" />
                </div>
            )}

            <span className="truncate max-w-32">{product.name}</span>

            {/* Product type label removed per user request */}

            {isSelected ? (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="h-4 w-4 p-0 hover:bg-red-100 rounded-full"
                >
                    <X className="h-3 w-3 text-red-600" />
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAdd}
                    className="h-4 w-4 p-0 hover:bg-ocean-100 rounded-full"
                >
                    <Plus className="h-3 w-3 text-ocean-600" />
                </Button>
            )}
        </div>
    )
}

interface ProductSelectorProps {
    selectedProducts: ProductItem[]
    availableProducts: ProductItem[]
    onSelectionChange: (selectedProducts: ProductItem[]) => void
    label?: string
    placeholder?: string
    maxSelections?: number
    className?: string
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
    selectedProducts,
    availableProducts,
    onSelectionChange,
    label = "Select Products",
    placeholder = "Search products...",
    maxSelections,
    className = ""
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeId, setActiveId] = useState<string | null>(null)

    // Filter available products based on search and exclude already selected
    const filteredAvailableProducts = availableProducts.filter(product =>
        !selectedProducts.some(selected => selected.id === product.id) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }, [])

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = selectedProducts.findIndex(item => item.id === active.id)
            const newIndex = selectedProducts.findIndex(item => item.id === over?.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedProducts = arrayMove(selectedProducts, oldIndex, newIndex)
                onSelectionChange(reorderedProducts)
            }
        }

        setActiveId(null)
    }, [selectedProducts, onSelectionChange])

    const handleAddProduct = useCallback((product: ProductItem) => {
        if (maxSelections && selectedProducts.length >= maxSelections) {
            return
        }
        onSelectionChange([...selectedProducts, product])
    }, [selectedProducts, onSelectionChange, maxSelections])

    const handleRemoveProduct = useCallback((productId: string) => {
        onSelectionChange(selectedProducts.filter(p => p.id !== productId))
    }, [selectedProducts, onSelectionChange])

    const clearAll = useCallback(() => {
        onSelectionChange([])
    }, [onSelectionChange])

    const draggedProduct = activeId ? selectedProducts.find(p => p.id === activeId) : null

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-ocean-600">{label}</Label>
                    {selectedProducts.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            className="text-xs text-gray-500 hover:text-red-600"
                        >
                            <Minus className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
                    )}
                </div>

                {maxSelections && (
                    <p className="text-xs text-gray-500">
                        {selectedProducts.length} of {maxSelections} selected
                    </p>
                )}
            </div>

            {/* Selected Products Section */}
            <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                    Selected Products ({selectedProducts.length})
                </div>

                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="min-h-16 p-3 border-2 border-dashed border-ocean-200 rounded-lg bg-ocean-50">
                        {selectedProducts.length === 0 ? (
                            <div className="flex items-center justify-center h-10 text-sm text-gray-500">
                                Drag products here or click + to add
                            </div>
                        ) : (
                            <SortableContext
                                items={selectedProducts.map(p => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {selectedProducts.map((product) => (
                                        <ProductCapsule
                                            key={product.id}
                                            product={product}
                                            isSelected={true}
                                            onRemove={() => handleRemoveProduct(product.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        )}
                    </div>

                    <DragOverlay>
                        {draggedProduct && (
                            <ProductCapsule
                                product={draggedProduct}
                                isSelected={true}
                                isDragging={true}
                            />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Available Products Section */}
            <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                    Available Products
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Available Products Grid */}
                <div className="max-h-48 overflow-y-auto p-3 border rounded-lg bg-gray-50">
                    {filteredAvailableProducts.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-500">
                            {searchTerm ? 'No products match your search' : 'No available products'}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {filteredAvailableProducts.map((product) => (
                                <ProductCapsule
                                    key={product.id}
                                    product={product}
                                    isSelected={false}
                                    onAdd={() => handleAddProduct(product)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// AdvancedMultiselect component for column selection
interface AdvancedMultiselectOption {
  label: string
  value: string
  category?: string
  description?: string
  locked?: boolean
  required?: boolean
}

interface AdvancedMultiselectProps {
  selected: AdvancedMultiselectOption[]
  available: AdvancedMultiselectOption[]
  onChange: (selected: AdvancedMultiselectOption[]) => void
  label?: string
  placeholder?: string
  maxSelections?: number
  className?: string
  enableDragDrop?: boolean
  enableReordering?: boolean
}

export const AdvancedMultiselect: React.FC<AdvancedMultiselectProps> = ({
  selected,
  available,
  onChange,
  label = "Select Items",
  placeholder = "Search items...",
  maxSelections,
  className = "",
  enableDragDrop = true,
  enableReordering = true
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  // Filter available items based on search and exclude already selected
  const filteredAvailable = available.filter(item =>
    !selected.some(selectedItem => selectedItem.value === item.value) &&
    (item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && enableReordering) {
      const oldIndex = selected.findIndex(item => item.value === active.id)
      const newIndex = selected.findIndex(item => item.value === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(selected, oldIndex, newIndex)
        onChange(reorderedItems)
      }
    }

    setActiveId(null)
  }, [selected, onChange, enableReordering])

  const handleAddItem = useCallback((item: AdvancedMultiselectOption) => {
    if (maxSelections && selected.length >= maxSelections) {
      return
    }
    onChange([...selected, item])
  }, [selected, onChange, maxSelections])

  const handleRemoveItem = useCallback((itemValue: string) => {
    onChange(selected.filter(item => item.value !== itemValue))
  }, [selected, onChange])

  const clearAll = useCallback(() => {
    onChange([])
  }, [onChange])

  const draggedItem = activeId ? selected.find(item => item.value === activeId) : null

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-ocean-600">{label}</Label>
          {selected.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-red-600"
            >
              <Minus className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {maxSelections && (
          <p className="text-xs text-gray-500">
            {selected.length} of {maxSelections} selected
          </p>
        )}
      </div>

      {/* Selected Items Section */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">
          Selected Items ({selected.length})
        </div>

        {enableDragDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="min-h-16 p-3 border-2 border-dashed border-ocean-200 rounded-lg bg-ocean-50">
              {selected.length === 0 ? (
                <div className="flex items-center justify-center h-10 text-sm text-gray-500">
                  Drag items here or click + to add
                </div>
              ) : (
                <SortableContext
                  items={selected.map(item => item.value)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-wrap gap-2">
                    {selected.map((item) => (
                      <div
                        key={item.value}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-ocean-100 border-ocean-300 text-ocean-800 border transition-all duration-200 cursor-move shadow-sm"
                      >
                        <GripVertical className="h-3 w-3 text-ocean-600" />
                        <span className="truncate max-w-32">{item.label}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.value)}
                          className="h-4 w-4 p-0 hover:bg-red-100 rounded-full"
                          disabled={item.locked}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>

            <DragOverlay>
              {draggedItem && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-ocean-100 border-ocean-300 text-ocean-800 border shadow-lg scale-105 opacity-50">
                  <GripVertical className="h-3 w-3 text-ocean-600" />
                  <span className="truncate max-w-32">{draggedItem.label}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="min-h-16 p-3 border-2 border-dashed border-ocean-200 rounded-lg bg-ocean-50">
            {selected.length === 0 ? (
              <div className="flex items-center justify-center h-10 text-sm text-gray-500">
                Click + to add items
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selected.map((item) => (
                  <div
                    key={item.value}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-ocean-100 border-ocean-300 text-ocean-800 border transition-all duration-200 shadow-sm"
                  >
                    <span className="truncate max-w-32">{item.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.value)}
                      className="h-4 w-4 p-0 hover:bg-red-100 rounded-full"
                      disabled={item.locked}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Available Items Section */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">
          Available Items
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Available Items Grid */}
        <div className="max-h-48 overflow-y-auto p-3 border rounded-lg bg-gray-50">
          {filteredAvailable.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              {searchTerm ? 'No items match your search' : 'No available items'}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredAvailable.map((item) => (
                <div
                  key={item.value}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 border transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <span className="truncate max-w-32">{item.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddItem(item)}
                    className="h-4 w-4 p-0 hover:bg-ocean-100 rounded-full"
                  >
                    <Plus className="h-3 w-3 text-ocean-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductSelector