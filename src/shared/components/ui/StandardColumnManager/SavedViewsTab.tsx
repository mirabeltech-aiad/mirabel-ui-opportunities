import React, { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Switch } from '@/shared/components/ui/switch'
import { RotateCcw, Globe, User } from 'lucide-react'
import { SavedView } from '@/shared/types/views'
import ViewRadioItem from './ViewRadioItem'
// Updated to use radio buttons for view selection

interface SavedViewsTabProps {
  globalViews: SavedView[]
  personalViews: SavedView[]
  activeView: SavedView | null
  loadingViewId?: string | null
  onLoadView: (viewId: string) => void
  onUpdateView: (viewId: string, updates: Partial<SavedView>) => void
  onDeleteView: (viewId: string) => void
  onSaveView: (name: string, description?: string) => SavedView
  onEditView: (view: SavedView) => void
  onResetToDefault: () => void
}

const SavedViewsTab: React.FC<SavedViewsTabProps> = ({
  globalViews,
  personalViews,
  activeView,
  loadingViewId,
  onLoadView,
  onUpdateView,
  onDeleteView,
  onSaveView,
  onEditView,
  onResetToDefault
}) => {
  const [defaultView, setDefaultView] = useState<'table' | 'advanced-filter'>('table')
  const hasViews = globalViews.length > 0 || personalViews.length > 0

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('products-default-view')
    if (saved && (saved === 'table' || saved === 'advanced-filter')) {
      setDefaultView(saved as 'table' | 'advanced-filter')
    }
  }, [])

  // Save preference to localStorage
  const handleDefaultViewChange = (view: 'table' | 'advanced-filter') => {
    setDefaultView(view)
    localStorage.setItem('products-default-view', view)
  }

  if (!hasViews) {
    return (
      <div className="px-6 py-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">No saved views</h3>
          <p className="text-sm text-gray-500 mb-4">
            Create your first custom view to save your preferred column layout.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetToDefault}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
          >
            <RotateCcw className="h-4 w-4 text-gray-500" />
            Reset to Default
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Global Views Section */}
      {globalViews.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-800">Global Views</h3>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-4 bg-blue-100 text-blue-700">
              {globalViews.length}
            </Badge>
          </div>
          <div className="space-y-0.5" role="radiogroup" aria-label="Global Views">
            {globalViews.map((view) => (
              <ViewRadioItem
                key={view.id}
                view={view}
                isSelected={activeView?.id === view.id}
                isLoading={loadingViewId === view.id}
                isGlobal={true}
                name="global-views"
                onSelect={() => onLoadView(view.id)}
                onUpdate={(updates: Partial<SavedView>) => onUpdateView(view.id, updates)}
                onDelete={() => onDeleteView(view.id)}
                onCopy={(viewToCopy: SavedView) => onSaveView(`${viewToCopy.name} (Copy)`, viewToCopy.description)}
                onEdit={onEditView}
              />
            ))}
          </div>
        </div>
      )}

      {/* Personal Views Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-purple-800">My Views</h3>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-4 bg-purple-100 text-purple-700">
            {personalViews.length}
          </Badge>
        </div>
        
        {personalViews.length > 0 ? (
          <div className="space-y-0.5" role="radiogroup" aria-label="Personal Views">
            {personalViews.map((view) => (
              <ViewRadioItem
                key={view.id}
                view={view}
                isSelected={activeView?.id === view.id}
                isLoading={loadingViewId === view.id}
                isGlobal={false}
                name="personal-views"
                onSelect={() => onLoadView(view.id)}
                onUpdate={(updates: Partial<SavedView>) => onUpdateView(view.id, updates)}
                onDelete={() => onDeleteView(view.id)}
                onCopy={(viewToCopy: SavedView) => onSaveView(`${viewToCopy.name} (Copy)`, viewToCopy.description)}
                onEdit={onEditView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-purple-200 rounded-lg bg-purple-25">
            <User className="mx-auto h-8 w-8 text-purple-400 mb-2" />
            <p className="text-sm text-purple-600 mb-1">No personal views yet</p>
            <p className="text-xs text-purple-500">
              Create a custom view to save your preferred column layout
            </p>
          </div>
        )}
      </div>

      {/* Preferences & Actions */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 space-y-3">
        {/* Default Page Preference */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="default-page-toggle" className="text-xs font-medium text-ocean-600">
              Start with Advanced Filter
            </label>
            <Switch
              id="default-page-toggle"
              checked={defaultView === 'advanced-filter'}
              onCheckedChange={(checked) => handleDefaultViewChange(checked ? 'advanced-filter' : 'table')}
            />
          </div>
          <p className="text-[10px] text-gray-500">
            When enabled, the Advanced Filter page will open by default instead of the Display page
          </p>
        </div>

        {/* Reset to Default */}
        <Button
          variant="outline"
          size="sm"
          onClick={onResetToDefault}
          className="w-full h-8 flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
        >
          <RotateCcw className="h-3 w-3 text-gray-500" />
          Reset to Default View
        </Button>
      </div>
    </div>
  )
}

export default SavedViewsTab
