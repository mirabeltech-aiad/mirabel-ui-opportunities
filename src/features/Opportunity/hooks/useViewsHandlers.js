import React, { useState } from 'react';
import { toast } from "@/features/Opportunity/hooks/use-toast";
import reportsViewsService from "@/features/Opportunity/Services/reports/ReportsViewsService";

export const useViewsHandlers = (onClose, onViewSelect, onColumnVisibilityChange, setVisibleColumns) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("saved");
  const [saveAsViewData, setSaveAsViewData] = useState(null);
  const [editViewData, setEditViewData] = useState(null);
  const [selectedViewId, setSelectedViewId] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleLoadView = async (view) => {
    console.log('Loading view:', view.name || view.NameOfView);
    
    const visibleColumns = view.visible_columns || view.VisibleColumns;
    if (visibleColumns) {
      setVisibleColumns(visibleColumns);
      onColumnVisibilityChange?.(visibleColumns);
    }
    
    setSelectedViewId(view.id || view.ID);
    onViewSelect?.(view);
    
    toast({
      title: "View applied",
      description: `"${view.name || view.NameOfView}" view has been applied.`
    });
    
    onClose();
  };

  const handleViewSaved = async () => {
    console.log('View saved, refreshing list');
    
    // Add delay to ensure API processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Refresh the saved views list
    setRefreshKey(prev => prev + 1);
    setActiveTab("saved");
    setSaveAsViewData(null);
    setEditViewData(null);
  };

  const handleDeleteView = async (viewId, viewName) => {
    try {
      const result = await reportsViewsService.deleteView(viewId);
      if (result.success) {
        setRefreshKey(prev => prev + 1);
        toast({
          title: "View deleted",
          description: `"${viewName}" has been deleted.`
        });
      }
    } catch (error) {
      console.error('Error deleting view:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the view. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditView = (view) => {
    setEditViewData({
      viewId: view.id || view.ID,
      viewName: view.name || view.NameOfView,
      visibleColumns: view.visible_columns || view.VisibleColumns,
      isPublicView: view.view_type === 'global' || view.ViewType === 2
    });
    setSaveAsViewData(null);
    setActiveTab("add");
  };

  const handleSaveAsView = (view) => {
    setSaveAsViewData({
      originalViewName: view.name || view.NameOfView,
      visibleColumns: view.visible_columns || view.VisibleColumns
    });
    setEditViewData(null);
    setActiveTab("add");
  };

  const getTabTitle = () => {
    if (editViewData) return "EDIT VIEW";
    return "ADD VIEW";
  };

  return {
    refreshKey,
    setRefreshKey,
    activeTab,
    setActiveTab,
    saveAsViewData,
    setSaveAsViewData,
    editViewData,
    setEditViewData,
    selectedViewId,
    showInstructions,
    setShowInstructions,
    handleLoadView,
    handleViewSaved,
    handleDeleteView,
    handleEditView,
    handleSaveAsView,
    getTabTitle
  };
};