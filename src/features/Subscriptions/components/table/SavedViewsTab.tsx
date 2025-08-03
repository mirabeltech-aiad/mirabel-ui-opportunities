
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash, Check, X, Save } from "lucide-react";

const SavedViewsTab = ({ savedViews, onLoadView, onDeleteView, onUpdateView, activeViewId }) => {
  const [editingViewId, setEditingViewId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const globalViews = savedViews.filter(view => 
    ["Proposal Overview", "Financial Analysis"].includes(view.name)
  );
  
  const myViews = savedViews.filter(view => 
    !["Proposal Overview", "Financial Analysis"].includes(view.name)
  );

  const getViewColor = (viewName) => {
    const colorMap = {
      "Proposal Overview": "#6b7280",
      "Financial Analysis": "#3b82f6", 
      "Pipeline Tracking": "#10b981"
    };
    return colorMap[viewName] || "#6b7280";
  };

  const isTemplate = (viewName) => {
    return ["Proposal Overview", "Financial Analysis"].includes(viewName);
  };

  const handleEditStart = (view) => {
    setEditingViewId(view.id);
    setEditingName(view.name);
  };

  const handleEditSave = (viewId) => {
    if (editingName.trim() && onUpdateView) {
      onUpdateView(viewId, editingName.trim());
    }
    setEditingViewId(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingViewId(null);
    setEditingName("");
  };

  const ViewItem = ({ view, showActions = true }) => (
    <div className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 group rounded-md transition-colors ${
      activeViewId === view.id ? 'bg-blue-50 border border-blue-200' : ''
    }`}>
      <div className="flex items-center gap-2 flex-1">
        <div 
          className="w-3 h-3 rounded-full border border-gray-200"
          style={{ backgroundColor: getViewColor(view.name) }}
        />
        {editingViewId === view.id ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="h-6 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSave(view.id);
                if (e.key === 'Escape') handleEditCancel();
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-500 hover:text-green-700"
              onClick={() => handleEditSave(view.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              onClick={handleEditCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <div 
              className={`text-sm cursor-pointer hover:text-blue-600 font-medium transition-colors ${
                activeViewId === view.id ? 'text-blue-600' : 'text-gray-700'
              }`}
              onClick={() => onLoadView(view)}
            >
              {view.name}
            </div>
            {isTemplate(view.name) && (
              <div title="Template view">
                <Save className="h-3 w-3 text-blue-500" />
              </div>
            )}
            {activeViewId === view.id && (
              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                Active
              </span>
            )}
            <span className="text-xs text-gray-400">({view.columns.length} cols)</span>
          </>
        )}
      </div>
      
      {showActions && editingViewId !== view.id && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-yellow-500 hover:text-yellow-700"
            onClick={() => handleEditStart(view)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500 hover:text-red-700"
            onClick={() => onDeleteView(view.id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2 px-3">
          Global Views
        </div>
        <div className="space-y-1">
          {globalViews.map((view) => (
            <ViewItem key={view.id} view={view} showActions={!isTemplate(view.name)} />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="text-sm font-medium text-gray-900 mb-2 px-3">
          My Views
        </div>
        <div className="space-y-1">
          {myViews.map((view) => (
            <ViewItem key={view.id} view={view} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedViewsTab;
