import React, { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, DragOverEvent, useDroppable } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical, Search, Plus, Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'

export interface SelectableItem {
    id: string
    label: string
    description?: string
    category?: string
    metadata?: Record<string, any>
}

interface DroppablePanelProps {
    id: string
    children: React.ReactNode
    className?: string
}

const DroppablePanel: React.FC<DroppablePanelProps> = ({ id, children, className = "" }) => {
    const { setNodeRef } = useDroppable({
        id,
        data: {
            type: 'panel',
            accepts: ['item']
        }
    })

    return (
        <div ref={setNodeRef} className={className}>
            {children}
        </div>
    )
}

interface ItemCapsuleProps {
    item: SelectableItem
    isSelected: boolean
    isDragging?: boolean
    onRemove?: () => void
    onEdit?: (item: SelectableItem) => void
    showGrip?: boolean
    allowDrag?: boolean
    isMultiSelected?: boolean
    onMultiSelect?: (item: SelectableItem, isCtrlPressed: boolean) => void
}

const ItemCapsule: React.FC<ItemCapsuleProps> = ({
    item,
    isSelected,
    isDragging = false,
    onRemove,
    onEdit,
    showGrip = true,
    allowDrag = false,
    isMultiSelected = false,
    onMultiSelect
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({
        id: item.id,
        disabled: !allowDrag,
        data: {
            type: 'item',
            isSelected,
            item
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging || isSortableDragging ? 0.7 : 1,
    }

    const handleClick = (e: React.MouseEvent) => {
        if (onMultiSelect && !isSortableDragging) {
            onMultiSelect(item, e.ctrlKey || e.metaKey)
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={handleClick}
            className={`
                group relative flex items-center gap-2 px-3 py-2 rounded-md text-sm
                border transition-all duration-200 select-none cursor-pointer
                ${isSelected
                    ? 'bg-gradient-to-r from-ocean-50 to-ocean-100 border-ocean-300 text-ocean-900 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }
                ${isMultiSelected
                    ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 border-blue-300'
                    : ''
                }
                ${isDragging || isSortableDragging ? 'shadow-lg scale-105 rotate-1 z-50' : ''}
            `}
            {...(allowDrag ? attributes : {})}
        >
            {/* Drag Handle */}
            {showGrip && allowDrag && (
                <div
                    className="cursor-grab active:cursor-grabbing opacity-60 hover:opacity-100 transition-opacity"
                    {...listeners}
                >
                    <GripVertical className="h-3.5 w-3.5 text-ocean-600" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className={`font-medium truncate text-sm ${isSelected ? 'text-ocean-900' : 'text-gray-900'}`}>
                    {item.label}
                </div>
                {item.description && (
                    <div className={`text-xs truncate ${isSelected ? 'text-ocean-700' : 'text-gray-500'}`}>
                        {item.description}
                    </div>
                )}
            </div>

            {/* Category badge removed per user request */}

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
                {/* Edit Button - Show for all items when onEdit is provided */}
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                        }}
                        className="h-6 w-6 p-0 hover:bg-ocean-100 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                        title="Edit item"
                    >
                        <Pencil className="h-3 w-3 text-ocean-600" />
                    </Button>
                )}

                {/* Remove Button - Only show for selected items */}
                {isSelected && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove?.()
                        }}
                        className="h-6 w-6 p-0 hover:bg-red-100 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                        title="Remove item"
                    >
                        <X className="h-3 w-3 text-red-600" />
                    </Button>
                )}
            </div>
        </div>
    )
}

interface DualPanelSelectorProps {
    selectedItems?: SelectableItem[]
    availableItems?: SelectableItem[]
    onSelectionChange: (selectedItems: SelectableItem[]) => void
    onEdit?: (item: SelectableItem) => void
    label?: string
    availableLabel?: string
    selectedLabel?: string
    placeholder?: string
    maxSelections?: number
    allowReordering?: boolean
    showSearch?: boolean
    className?: string
    height?: string
    // Compat props
    title?: string
    leftTitle?: string
    rightTitle?: string
    leftItems?: SelectableItem[]
    rightItems?: SelectableItem[]
    searchPlaceholder?: string
}

export const DualPanelSelector: React.FC<DualPanelSelectorProps> = ({
    selectedItems: selectedItemsProp,
    availableItems: availableItemsProp,
    onSelectionChange,
    onEdit,
    label,
    availableLabel = "Available",
    selectedLabel = "Added",
    placeholder = "Search items...",
    maxSelections,
    allowReordering = true,
    showSearch = true,
    className = "",
    height = "300px",
    title,
    leftTitle,
    rightTitle,
    leftItems,
    rightItems,
    searchPlaceholder
}) => {
    const selectedItems = rightItems ?? selectedItemsProp ?? []
    const availableItems = leftItems ?? availableItemsProp ?? []
    const [searchTerm, setSearchTerm] = useState('')
    const [activeId, setActiveId] = useState<string | null>(null)
    const [dragOverPanel, setDragOverPanel] = useState<'available' | 'selected' | null>(null)
    const [multiSelectedItems, setMultiSelectedItems] = useState<Set<string>>(new Set())

    // Filter available items based on search and exclude already selected
    const filteredAvailableItems = availableItems.filter(item =>
        !selectedItems.some(selected => selected.id === item.id) &&
        ((item.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleMultiSelect = useCallback((item: SelectableItem, isCtrlPressed: boolean) => {
        if (isCtrlPressed) {
            setMultiSelectedItems(prev => {
                const newSet = new Set(prev)
                if (newSet.has(item.id)) {
                    newSet.delete(item.id)
                } else {
                    newSet.add(item.id)
                }
                return newSet
            })
        } else {
            setMultiSelectedItems(new Set([item.id]))
        }
    }, [])

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const draggedId = event.active.id as string
        setActiveId(draggedId)

        // If the dragged item is not in the multi-selection, clear multi-selection and select just this item
        if (!multiSelectedItems.has(draggedId)) {
            setMultiSelectedItems(new Set([draggedId]))
        }
    }, [multiSelectedItems])

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { over } = event

        if (over?.id === 'selected-panel') {
            setDragOverPanel('selected')
        } else if (over?.id === 'available-panel') {
            setDragOverPanel('available')
        } else {
            setDragOverPanel(null)
        }
    }, [])

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        const draggedId = active.id as string

        if (!over) {
            setActiveId(null)
            setDragOverPanel(null)
            setMultiSelectedItems(new Set())
            return
        }

        // Get all items to move (either multi-selected or just the dragged item)
        const itemsToMove = multiSelectedItems.size > 0
            ? Array.from(multiSelectedItems).map(id =>
                availableItems.find(item => item.id === id) ||
                selectedItems.find(item => item.id === id)
            ).filter(Boolean) as SelectableItem[]
            : [availableItems.find(item => item.id === draggedId) ||
                selectedItems.find(item => item.id === draggedId)].filter(Boolean) as SelectableItem[]

        if (itemsToMove.length === 0) {
            setActiveId(null)
            setDragOverPanel(null)
            setMultiSelectedItems(new Set())
            return
        }

        // Check if dragging to selected panel
        if (over.id === 'selected-panel') {
            // Add items to selected if they're currently available
            const itemsToAdd = itemsToMove.filter(item =>
                availableItems.some(avail => avail.id === item.id) &&
                !selectedItems.some(selected => selected.id === item.id)
            )

            if (itemsToAdd.length > 0) {
                const remainingSlots = maxSelections ? maxSelections - selectedItems.length : Infinity
                const itemsToActuallyAdd = itemsToAdd.slice(0, remainingSlots)
                onSelectionChange([...selectedItems, ...itemsToActuallyAdd])
            }
        }
        // Check if dragging to available panel
        else if (over.id === 'available-panel') {
            // Remove items from selected if they're currently selected
            const itemIdsToRemove = new Set(itemsToMove.map(item => item.id))
            const newSelectedItems = selectedItems.filter(item => !itemIdsToRemove.has(item.id))
            onSelectionChange(newSelectedItems)
        }
        // Reordering within selected items (only for single item)
        else if (itemsToMove.length === 1 && selectedItems.some(item => item.id === draggedId) && selectedItems.some(item => item.id === over.id)) {
            const oldIndex = selectedItems.findIndex(item => item.id === active.id)
            const newIndex = selectedItems.findIndex(item => item.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reorderedItems = arrayMove(selectedItems, oldIndex, newIndex)
                onSelectionChange(reorderedItems)
            }
        }

        setActiveId(null)
        setDragOverPanel(null)
        setMultiSelectedItems(new Set())
    }, [selectedItems, availableItems, onSelectionChange, maxSelections, multiSelectedItems])

    const handleRemoveItem = useCallback((itemId: string) => {
        onSelectionChange(selectedItems.filter(item => item.id !== itemId))
    }, [selectedItems, onSelectionChange])

    const handleAddAll = useCallback(() => {
        const itemsToAdd = filteredAvailableItems.slice(0,
            maxSelections ? Math.max(0, maxSelections - selectedItems.length) : filteredAvailableItems.length
        )
        onSelectionChange([...selectedItems, ...itemsToAdd])
    }, [filteredAvailableItems, selectedItems, onSelectionChange, maxSelections])

    const handleRemoveAll = useCallback(() => {
        onSelectionChange([])
    }, [onSelectionChange])

    const draggedItem = activeId ?
        selectedItems.find(item => item.id === activeId) ||
        availableItems.find(item => item.id === activeId) : null

    const draggedItemsCount = multiSelectedItems.size > 1 ? multiSelectedItems.size : 1

    // Custom scrollbar styles
    const scrollbarStyles = {
        scrollbarWidth: 'thin' as const,
        scrollbarColor: '#9ca3af #f9fafb',
    }

    return (
        <>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                    border-radius: 6px;
                    border: 2px solid #f9fafb;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:active {
                    background: #4b5563;
                }
            `}</style>

            <div className={`space-y-4 ${className}`}>
                {(label || title) && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-ocean-600">{label || title}</Label>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {maxSelections && (
                                    <p className="text-xs text-gray-500">
                                        {selectedItems.length} of {maxSelections} selected
                                    </p>
                                )}
                                {multiSelectedItems.size > 0 && (
                                    <p className="text-xs text-blue-600 font-medium">
                                        {multiSelectedItems.size} items selected for drag
                                    </p>
                                )}
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="inline-flex items-center gap-1">
                                    <GripVertical className="h-3 w-3" />
                                    Drag to reorder
                                </span>
                                <span className="mx-2">•</span>
                                <span>Ctrl+Click to multi-select</span>
                            </div>
                        </div>
                    </div>
                )}

                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-2 gap-4 min-h-0" style={{ height, maxHeight: height }}>
                        {/* Available Items Panel */}
                        <DroppablePanel
                            id="available-panel"
                            className={`
                                flex flex-col border-2 rounded-lg bg-white transition-all duration-200 min-h-0
                                ${dragOverPanel === 'available' ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                            `}
                        >
                            <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">{leftTitle || availableLabel}</span>
                                    <span className="text-xs text-gray-500">({filteredAvailableItems.length})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {filteredAvailableItems.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleAddAll}
                                            className="text-xs text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50"
                                            disabled={!!maxSelections && selectedItems.length >= maxSelections}
                                        >
                                            Add All
                                            <Plus className="h-3 w-3 ml-1" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {showSearch && (
                                <div className="p-3 border-b flex-shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                                        <input
                                            type="text"
                                            placeholder={searchPlaceholder || placeholder}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="left-3 w-full h-8 pl-10 pr-30 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-600 bg-white"
                                        />
                                    </div>
                                </div>
                            )}

                            <div
                                className="flex-1 overflow-y-auto p-3 custom-scrollbar min-h-0"
                                style={scrollbarStyles}
                            >
                                <SortableContext
                                    items={filteredAvailableItems.map(item => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {filteredAvailableItems.length === 0 ? (
                                            <div className="text-center py-12 text-sm text-gray-500">
                                                <div className="mb-2">
                                                    {searchTerm ? 'No items match your search' : 'No available items'}
                                                </div>
                                                {searchTerm && (
                                                    <div className="text-xs text-gray-400">
                                                        Try adjusting your search terms
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            filteredAvailableItems.map((item) => (
                                                <ItemCapsule
                                                    key={item.id}
                                                    item={item}
                                                    isSelected={false}
                                                    showGrip={true}
                                                    allowDrag={true}
                                                    isMultiSelected={multiSelectedItems.has(item.id)}
                                                    onMultiSelect={handleMultiSelect}
                                                    onEdit={onEdit}
                                                />
                                            ))
                                        )}
                                    </div>
                                </SortableContext>
                            </div>
                        </DroppablePanel>

                        {/* Selected Items Panel */}
                        <DroppablePanel
                            id="selected-panel"
                            className={`
                                flex flex-col border-2 rounded-lg bg-white transition-all duration-200 min-h-0
                                ${dragOverPanel === 'selected' ? 'border-ocean-300 bg-ocean-50' : 'border-gray-200'}
                            `}
                        >
                            <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">{rightTitle || selectedLabel}</span>
                                    <span className="text-xs text-gray-500">({selectedItems.length})</span>
                                    {maxSelections && (
                                        <span className="text-xs text-gray-400">
                                            / {maxSelections}
                                        </span>
                                    )}
                                    {allowReordering && selectedItems.length > 1 && (
                                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            <GripVertical className="h-3 w-3" />
                                            <span>Reorderable</span>
                                        </div>
                                    )}
                                </div>
                                {selectedItems.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveAll}
                                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Remove All
                                        <X className="h-3 w-3 ml-1" />
                                    </Button>
                                )}
                            </div>

                            <div
                                className="flex-1 overflow-y-auto p-3 custom-scrollbar min-h-0"
                                style={scrollbarStyles}
                            >
                                {selectedItems.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                                        <div className="text-center">
                                            <div className="mb-2">No items selected</div>
                                            <div className="text-xs">Drag items here to add</div>
                                            {allowReordering && (
                                                <div className="text-xs text-blue-600 mt-2 flex items-center justify-center gap-1">
                                                    <GripVertical className="h-3 w-3" />
                                                    <span>Items can be reordered once added</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : allowReordering ? (
                                    <div className="space-y-2">
                                        {activeId && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <GripVertical className="h-3 w-3" />
                                                    <span>Drag to reorder items • Release to drop in new position</span>
                                                </div>
                                            </div>
                                        )}
                                        <SortableContext
                                            items={selectedItems.map(item => item.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-2">
                                                {selectedItems.map((item) => (
                                                    <ItemCapsule
                                                        key={item.id}
                                                        item={item}
                                                        isSelected={true}
                                                        showGrip={true}
                                                        allowDrag={true}
                                                        isMultiSelected={multiSelectedItems.has(item.id)}
                                                        onMultiSelect={handleMultiSelect}
                                                        onRemove={() => handleRemoveItem(item.id)}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedItems.map((item) => (
                                            <ItemCapsule
                                                key={item.id}
                                                item={item}
                                                isSelected={true}
                                                showGrip={false}
                                                allowDrag={false}
                                                isMultiSelected={multiSelectedItems.has(item.id)}
                                                onMultiSelect={handleMultiSelect}
                                                onRemove={() => handleRemoveItem(item.id)}
                                                onEdit={onEdit}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </DroppablePanel>
                    </div>

                    <DragOverlay>
                        {draggedItem && (
                            <div className="transform rotate-2 relative">
                                <ItemCapsule
                                    item={draggedItem}
                                    isSelected={selectedItems.some(item => item.id === draggedItem.id)}
                                    isDragging={true}
                                    showGrip={true}
                                    allowDrag={true}
                                />
                                {draggedItemsCount > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-lg">
                                        {draggedItemsCount}
                                    </div>
                                )}
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </>
    )
}

export default DualPanelSelector