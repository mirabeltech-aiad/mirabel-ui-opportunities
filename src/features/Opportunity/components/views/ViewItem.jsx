
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X, Copy, Save, Edit } from "lucide-react";
import { getViewColor, getColumnCount } from "./utils/viewColorUtils";
import { UserId, IsAdmin } from "@/features/Opportunity/constants/opportunityOptions";

const ViewItem = ({ 
  view, 
  index,
  isGlobal, 
  canEdit = true,
  editingId,
  editName,
  setEditName,
  onEditStart,
  onEditSave,
  onEditCancel,
  onLoadView,
  onDeleteView,
  onSaveAsView,
  onEditView,
  loggedInUserID, // Added loggedInUserID prop
}) => {
  // Debug logging
  console.log('ViewItem Debug:', {
    viewName: view.NameOfView,
    viewType: view.ViewType,
    canEdit,
    isGlobal,
    editingId,
    loggedInUserID,
    isAdmin: IsAdmin,
    createdBy: view.CreatedBy,
    isDefault: view.IsDefault,
    visibleColumns: view.VisibleColumns
  });

  // Define view type enums to match the reference logic
  const enumColumnViewTypes = {
    DEFAULT_VIEWS: 1,
    PUBLIC_VIEWS: 2,
    CUSTOM_VIEWS: 0
  };
  
  // Use view.ViewType directly instead of expecting viewType prop
  const viewType = view.ViewType;

  // Logic for Save As visibility based on reference
  const shouldShowSaveAs = (
    (viewType === enumColumnViewTypes.PUBLIC_VIEWS && view.CreatedBy === loggedInUserID) ||
    viewType === enumColumnViewTypes.CUSTOM_VIEWS ||
    viewType === enumColumnViewTypes.DEFAULT_VIEWS
  );

  // Logic for Edit visibility based on reference - with admin check for PUBLIC_VIEWS
  console.log('shouldShowEdit calculation:', viewType, enumColumnViewTypes, 'IsAdmin:', IsAdmin);
  const shouldShowEdit = (
    (viewType === enumColumnViewTypes.PUBLIC_VIEWS && IsAdmin) ||
    viewType === enumColumnViewTypes.CUSTOM_VIEWS
  );
  console.log('shouldShowEdit:', shouldShowEdit, 'viewType:', viewType);

  // Logic for Delete visibility based on reference - with admin check for PUBLIC_VIEWS
  console.log('shouldShowDelete calculation:', viewType, enumColumnViewTypes, 'IsAdmin:', IsAdmin);
  const shouldShowDelete = (
    (viewType === enumColumnViewTypes.PUBLIC_VIEWS && IsAdmin) ||
    viewType === enumColumnViewTypes.CUSTOM_VIEWS
  );

  // Use IsDefault instead of activeViewId for highlighting
  const isActive = view.IsDefault;

  return (
    <div 
      key={view.ID} 
      className={`group flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded cursor-pointer transition-all duration-200 border ${
        isActive 
          ? 'bg-blue-50 border-blue-200' 
          : 'border-transparent hover:border-gray-200'
      }`}
      onClick={() => onLoadView(view)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getViewColor(index, isGlobal)}`}></div>
        
        {editingId === view.ID ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-6 text-xs flex-1 border-blue-200 focus:border-blue-400"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                onEditSave();
              }}
              className="h-6 w-6 p-0 hover:bg-green-50"
            >
              <Check className="h-3 w-3 text-green-600" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                onEditCancel();
              }}
              className="h-6 w-6 p-0 hover:bg-red-50"
            >
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`text-sm font-medium truncate ${
              isActive ? 'text-blue-700' : 'text-gray-900'
            }`}>
              {view.NameOfView}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">({getColumnCount(view.VisibleColumns)})</span>
          </div>
        )}
      </div>
      
      {/* Action buttons based on conditional logic */}
      {!editingId && (
        <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
          {/* Save As button - conditional based on reference logic */}
          {shouldShowSaveAs && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onSaveAsView && onSaveAsView(view);
              }}
              className="h-6 w-6 p-0 hover:bg-blue-50"
              title="Save As"
            >
              <Save className="h-2.5 w-2.5 text-blue-600" />
            </Button>
          )}
          
          {/* Edit View button (opens Add/Edit tab) - conditional based on reference logic with admin check */}
          {shouldShowEdit && onEditView && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit View button clicked for view:', view.NameOfView, 'VisibleColumns:', view.VisibleColumns);
                onEditView(view);
              }}
              className="h-6 w-6 p-0 hover:bg-purple-50"
              title="Edit View"
            >
              <Edit className="h-2.5 w-2.5 text-purple-600" />
            </Button>
          )}
          
          {/* Edit Name button (inline editing) - conditional based on reference logic with admin check */}
          {shouldShowEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit Name button clicked for view:', view.NameOfView);
                onEditStart(view);
              }}
              className="h-6 w-6 p-0 hover:bg-yellow-50"
              title="Edit Name"
            >
              <Pencil className="h-2.5 w-2.5 text-yellow-600" />
            </Button>
          )}
          
          {/* Delete button - conditional based on reference logic with admin check */}
          {shouldShowDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteView(view.ID);
              }}
              className="h-6 w-6 p-0 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-2.5 w-2.5 text-red-600" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewItem;
