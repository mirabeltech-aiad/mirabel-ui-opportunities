import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  RotateCcw,
  Info,
  X,
  Columns,
  Save
} from 'lucide-react'
import { ViewsSidebarProps, SavedView } from '@/shared/types/views'
import SavedViewsTab from './StandardColumnManager/SavedViewsTab'
import AddViewTab from './StandardColumnManager/AddViewTab'

const StandardColumnManager: React.FC<ViewsSidebarProps> = ({
  columns,
  visibleColumns,
  savedViews,
  activeView,
  isOpen,
  onClose,
  onToggleColumn,
  onReorderColumns,
  onLoadView,
  onSaveView,
  onUpdateView,
  onDeleteView,
  onResetToDefault
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'add'>('saved')
  const [showInstructions, setShowInstructions] = useState(true)
  const [editingView, setEditingView] = useState<SavedView | null>(null)
  const [loadingViewId, setLoadingViewId] = useState<string | null>(null)

  // Auto-dismiss instructions after 10 seconds
  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showInstructions])

  // Reset instructions when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setShowInstructions(true)
    } else {
      // Clear editing state when sidebar closes
      setEditingView(null)
    }
  }, [isOpen])

  // Clear editing state when switching to saved tab
  useEffect(() => {
    if (activeTab === 'saved') {
      setEditingView(null)
    }
  }, [activeTab])

  const globalViews = savedViews.filter(view => view.isGlobal)
  const personalViews = savedViews.filter(view => !view.isGlobal)

  const handleLoadView = async (viewId: string) => {
    setLoadingViewId(viewId)
    try {
      await onLoadView(viewId)
    } finally {
      // Clear loading state after a short delay to show feedback
      setTimeout(() => setLoadingViewId(null), 500)
    }
  }

  const handleEditView = (view: SavedView) => {
    // Load the view's columns first
    handleLoadView(view.id)
    // Set the view as being edited
    setEditingView(view)
    // Switch to the add/edit tab
    setActiveTab('add')
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Columns className="h-5 w-5 text-ocean-600" />
            <SheetTitle>Column Manager</SheetTitle>
          </div>
          <SheetClose />
        </SheetHeader>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="mx-6 mt-4 p-4 bg-ocean-50 border border-ocean-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-ocean-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm text-ocean-700">
                <p className="font-medium mb-1">Manage Your Table Views</p>
                <p className="text-ocean-600">
                  Save custom column layouts, load existing views, or create new ones. 
                  Global views are shared with everyone, while personal views are just for you.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(false)}
                className="h-6 w-6 p-0 text-ocean-500 hover:text-ocean-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex-1 flex flex-col mt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'saved' | 'add')} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-6">
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-ocean-500 data-[state=active]:text-white"
              >
                Saved Views
              </TabsTrigger>
              <TabsTrigger 
                value="add"
                className="data-[state=active]:bg-ocean-500 data-[state=active]:text-white"
              >
                {editingView ? 'Edit View' : 'Add View'}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="saved" className="h-full mt-6">
                <SavedViewsTab
                  globalViews={globalViews}
                  personalViews={personalViews}
                  activeView={activeView}
                  loadingViewId={loadingViewId}
                  onLoadView={handleLoadView}
                  onUpdateView={onUpdateView}
                  onDeleteView={onDeleteView}
                  onSaveView={onSaveView}
                  onEditView={handleEditView}
                  onResetToDefault={onResetToDefault}
                />
              </TabsContent>

              <TabsContent value="add" className="h-full mt-6">
                <AddViewTab
                  columns={columns}
                  visibleColumns={visibleColumns}
                  onToggleColumn={onToggleColumn}
                  onReorderColumns={onReorderColumns}
                  onSaveView={onSaveView}
                  onSwitchToSaved={() => setActiveTab('saved')}
                  editingView={editingView}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default StandardColumnManager
