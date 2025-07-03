import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@OpportunityComponents/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@OpportunityComponents/ui/tabs";
import SavedViewsTab from "./SavedViewsTab";
import AddViewTab from "./AddViewTab";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useSavedViews } from "@/hooks/useSavedViews";
import { UserId } from "@/features/Opportunity/constants/opportunityOptions";
import { userId } from "@/services/httpClient";

import { mapApiColumnsToTableColumns, getDefaultColumnOrder } from "@/features/Opportunity/utils/columnMapping";
import apiService from "@/services/apiService";
import Loader from "@/features/Opportunity/components/ui/loader";

const ViewsSidebar = ({ 
  isOpen, 
  onClose, 
  columnOrder, 
  onColumnOrderChange, 
  onViewSelected,
  pageType = "opportunities" // Default to opportunities for backward compatibility
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("saved");
  const [saveAsViewData, setSaveAsViewData] = useState(null);
  const [editViewData, setEditViewData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewToDelete, setViewToDelete] = useState(null);
  
  // Make API calls for both opportunities and proposals
  const { savedViews, isLoading, error } = useSavedViews(refreshKey, pageType);

  const handleSaveView = (viewName, selectedColumns) => {
    // This would typically save to the API
    console.log('Saving view:', viewName, selectedColumns);
  };

  const handleViewSaved = async () => {
    console.log('View saved, preparing to refresh saved views list');
    
    // Add a delay to ensure the API has processed the new view
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh the saved views list and switch back to saved views tab
    console.log('Refreshing saved views list after delay');
    setRefreshKey(prev => prev + 1);
    
    setActiveTab("saved");
    setSaveAsViewData(null);
    setEditViewData(null);

    // For proposals, also notify the parent component to refresh the grid
    if (pageType === "proposals" && onViewSelected) {
      console.log('Notifying parent component to refresh proposals grid after view save');
      // Create a dummy view object to trigger grid refresh
      const dummyView = { NameOfView: 'View Saved - Refresh Grid' };
      onViewSelected(dummyView);
    }
  };

  const handleLoadView = async (view) => {
    console.log('=== VIEW SELECTION STARTED ===');
    console.log('Loading view:', view.NameOfView, 'with ID:', view.ID);
    console.log('View visible columns:', view.VisibleColumns);
    console.log('IsDefault:', view.IsDefault);
    console.log('PageType:', pageType);
    
    try {
      // Step 1: Get detailed view information including visible columns
      console.log('Step 1: Fetching view details for ID:', view.ID);
      const viewDetailsResponse = await apiService.getViewDetails(view.ID);
      console.log('Step 1: View details response:', viewDetailsResponse);
      
      let visibleColumns = view.VisibleColumns;
      
      // Check if we got detailed view data with visible columns
      if (viewDetailsResponse?.content?.Status === 'Success' && viewDetailsResponse?.content?.List?.length > 0) {
        const viewDetails = viewDetailsResponse.content.List[0];
        console.log('Step 1: Using detailed view data:', viewDetails);
        visibleColumns = viewDetails.VisibleColumns || view.VisibleColumns;
      }
      
      console.log('Step 1: Final visible columns to use:', visibleColumns);
      
      // Step 2: Create the correct payload based on pageType
      let updatePayload;
      
      if (pageType === "proposals") {
        // Use the specific payload structure for proposals
        updatePayload = {
          NameOfView: view.NameOfView,
          IsDefault: true,
          VisibleColumns: visibleColumns,
          DBColumnsNames: "",
          User: {
            ID: userId // Use userId from httpClient.js
          },
          ID: view.ID,
          PageType: 1, // Always 1 for both opportunities and proposals
          ViewType: view.ViewType,
          productType: 2 // 2 for proposals
        };
      } else {
        // Keep the existing payload structure for opportunities
        updatePayload = {
          NameOfView: view.NameOfView,
          IsDefault: true,
          VisibleColumns: visibleColumns,
          DBColumnsNames: view.DBColumnsNames || "",
          User: { ID: view.User?.ID || UserId },
          ID: view.ID,
          PageType: view.PageType || 1,
          ViewType: view.ViewType || 0,
          productType: 1 // 1 for opportunities
        };
      }
      
      console.log('Step 2: Calling update view API with payload:', updatePayload);
      await apiService.updateView(updatePayload);
      console.log('Step 2: View update API call successful');
      
      // Step 3: For opportunities only, process visible columns and update column order
      if (pageType === "opportunities") {
        console.log('Step 3: Processing visible columns for opportunities with mapApiColumnsToTableColumns:', visibleColumns);
        
        // CRITICAL: Use ONLY the mapped columns, NO fallback to default
        const filteredColumns = mapApiColumnsToTableColumns(visibleColumns);
        console.log('Step 3: Mapped columns from utility (these will be the ONLY columns shown):', filteredColumns.map(col => col.id));
        console.log('Step 3: Total number of columns that will be displayed:', filteredColumns.length);
        
        // Validate that we got columns
        if (filteredColumns.length === 0) {
          console.error('Step 3: ERROR - No columns were mapped from visible columns:', visibleColumns);
          console.error('Step 3: This should not happen - check the mapping logic');
          // Don't return here, let it continue but with empty array
        }
        
        console.log('Step 3: Final filtered columns that will be set:', filteredColumns.map(col => ({ id: col.id, label: col.label })));
        
        // Step 4: Update the column order in the table (THIS IS CRITICAL for opportunities)
        console.log('Step 4: Setting column order to filtered columns');
        console.log('Step 4: Calling onColumnOrderChange with:', filteredColumns.length, 'columns');
        onColumnOrderChange(filteredColumns);
        console.log('Step 4: Column order change completed');
      } else {
        console.log('Step 3-4: Skipping column processing for proposals (not needed)');
      }
      
      // Step 5: Create view object with updated visible columns for parent component
      const updatedView = {
        ...view,
        VisibleColumns: visibleColumns,
        IsDefault: true
      };
      
      // Step 6: Notify parent component that a view was selected so it can refetch data
      if (onViewSelected) {
        console.log('Step 6: Notifying parent component to refetch data for selected view');
        onViewSelected(updatedView);
      }
      
      // Step 7: Refresh the views list to show updated IsDefault status
      console.log('Step 7: Refreshing views list to show updated IsDefault status');
      setRefreshKey(prev => prev + 1);
      
      // Step 8: Close the sidebar
      console.log('=== VIEW SELECTION COMPLETED ===');
      onClose();
      
    } catch (error) {
      console.error('Failed to load view:', error);
    }
  };

  const handleDeleteView = (viewId) => {
    console.log('=== DELETE VIEW CLICKED ===');
    console.log('ViewID requested for deletion:', viewId);
    console.log('PageType:', pageType);
    
    // Only show confirmation dialog for proposals
    if (pageType === "proposals") {
      // Find the view to get its name for the confirmation dialog
      const view = savedViews.find(v => v.ID === viewId);
      console.log('Found view for deletion:', view);
      if (view) {
        console.log('Setting view to delete and opening confirmation dialog');
        setViewToDelete(view);
        setDeleteDialogOpen(true);
      } else {
        console.error('View not found in savedViews array for ID:', viewId);
      }
    } else {
      // For opportunities, just log without showing confirmation dialog
      console.log('Delete view for opportunities:', viewId, '(no action taken)');
    }
  };

  const handleDeleteConfirm = async () => {
    console.log('=== DELETE CONFIRMATION CLICKED ===');
    console.log('ViewToDelete:', viewToDelete);
    
    if (!viewToDelete) {
      console.error('No view to delete - viewToDelete is null/undefined');
      return;
    }
    
    try {
      console.log('Starting deletion process for view:', viewToDelete.NameOfView, 'with ID:', viewToDelete.ID);
      
      // Only call delete API for proposals
      if (pageType === "proposals") {
        console.log('Making DELETE API call for proposal view...');
        console.log('Calling apiService.deleteProposalView with ID:', viewToDelete.ID);
        
        const deleteResponse = await apiService.deleteProposalView(viewToDelete.ID);
        console.log('Delete API response:', deleteResponse);
        console.log('Proposal view deleted successfully');
        
        // Refresh the views list after successful deletion
        console.log('Refreshing views list after successful deletion');
        setRefreshKey(prev => prev + 1);
      } else {
        // For opportunities, just log (maintain existing behavior)
        console.log('Delete view for opportunities:', viewToDelete.ID);
      }
      
    } catch (error) {
      console.error('Failed to delete view:', error);
      console.error('Error details:', error.message, error.stack);
    } finally {
      // Close dialog and reset state
      console.log('Closing delete dialog and resetting state');
      setDeleteDialogOpen(false);
      setViewToDelete(null);
      console.log('=== DELETE PROCESS COMPLETED ===');
    }
  };

  const handleDeleteCancel = () => {
    console.log('Delete cancelled by user');
    setDeleteDialogOpen(false);
    setViewToDelete(null);
  };

  const handleUpdateView = (viewId, newName) => {
    // This would typically update the API
    console.log('Update view:', viewId, newName);
  };

  const handleSaveAsView = (view) => {
    console.log('Save As clicked for view:', view);
    
    // Set the view data for the Add View tab
    setSaveAsViewData({
      originalViewName: view.NameOfView,
      visibleColumns: view.VisibleColumns
    });
    
    // Clear edit data if any
    setEditViewData(null);
    
    // Switch to Add View tab
    setActiveTab("add");
  };

  const handleEditView = (view) => {
    console.log('Edit clicked for view:', view);
    
    // Set the view data for editing
    setEditViewData({
      viewId: view.ID,
      viewName: view.NameOfView,
      visibleColumns: view.VisibleColumns,
      isPublicView: view.ViewType === 2 // PUBLIC_VIEWS = 2
    });
    
    // Clear save as data if any
    setSaveAsViewData(null);
    
    // Switch to Add View tab (which will show as Edit View)
    setActiveTab("add");
  };

  const handleClearEditData = () => {
    setEditViewData(null);
    setSaveAsViewData(null);
  };

  const getTabTitle = () => {
    if (editViewData) return "EDIT VIEW";
    return "ADD VIEW";
  };

  // Show loading for both page types
  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-1/2 min-w-[600px] max-w-[900px] z-50 bg-white">
          <SheetHeader className="border-b border-gray-100 pb-3">
            <SheetTitle className="text-lg font-semibold text-blue-600">Views</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center items-center h-64">
            <Loader text="Loading saved views..." />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Show error for both page types
  if (error) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-1/2 min-w-[600px] max-w-[900px] z-50 bg-white">
          <SheetHeader className="border-b border-gray-100 pb-3">
            <SheetTitle className="text-lg font-semibold text-blue-600">Views</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center items-center h-64 text-red-500">
            Error loading views: {error}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40"
          style={{ backdropFilter: 'blur(1px)' }}
        />
      )}
      
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-1/2 min-w-[600px] max-w-[900px] z-50 bg-white shadow-2xl border-l border-gray-200">
          <SheetHeader className="border-b border-gray-100 pb-3 mb-4">
            <SheetTitle className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Views - {pageType === "proposals" ? "Proposals" : "Opportunities"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="h-[calc(100vh-100px)] overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 border border-gray-200 rounded-lg p-1 mb-4">
                <TabsTrigger 
                  value="saved" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium py-2"
                >
                  SAVED VIEWS
                </TabsTrigger>
                <TabsTrigger 
                  value="add" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium py-2"
                >
                  {getTabTitle()}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="saved" className="h-full mt-0 overflow-hidden">
                  <SavedViewsTab 
                    savedViews={savedViews}
                    onLoadView={handleLoadView}
                    onDeleteView={handleDeleteView}
                    onUpdateView={handleUpdateView}
                    onSaveAsView={handleSaveAsView}
                    onEditView={handleEditView}
                  />
                </TabsContent>
                
                <TabsContent value="add" className="h-full mt-0 overflow-hidden">
                  <AddViewTab 
                    columnOrder={columnOrder}
                    onSaveView={handleSaveView}
                    onViewSaved={handleViewSaved}
                    saveAsViewData={saveAsViewData}
                    editViewData={editViewData}
                    onClearSaveAsData={() => setSaveAsViewData(null)}
                    onClearEditData={handleClearEditData}
                    onCloseSidebar={onClose}
                    pageType={pageType}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog - Only for proposals */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        viewName={viewToDelete?.NameOfView || ''}
      />
    </>
  );
};

export default ViewsSidebar;
