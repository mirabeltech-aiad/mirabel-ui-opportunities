
import React, { useState, useEffect } from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Label } from "@OpportunityComponents/ui/label";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import { Info, X, CheckCircle2, Plus, Edit } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@OpportunityComponents/ui/accordion";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import { useAvailableColumns } from "@/hooks/useAvailableColumns";
import apiService from "@/services/apiService";
import { proposalService } from "@/services/proposalService";
import { userId } from "@/services/httpClient";
import Loader from "@/features/Opportunity/components/ui/loader";

const AddViewTab = ({ 
  columnOrder, 
  onSaveView, 
  onViewSaved, 
  saveAsViewData, 
  editViewData,
  onClearSaveAsData, 
  onClearEditData,
  onCloseSidebar,
  pageType = "opportunities"
}) => {
  const [viewName, setViewName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isPublicView, setIsPublicView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showInstructions, setShowInstructions] = useState(() => {
    const saved = localStorage.getItem('hideViewInstructions');
    return saved !== 'true';
  });

  // Use API for both opportunities and proposals
  const shouldUseApi = true;
  const { availableColumns, columnsByGroup, isLoading, error } = useAvailableColumns(shouldUseApi, pageType);

  // Handle Save As data population
  useEffect(() => {
    if (saveAsViewData && availableColumns.length > 0) {
      console.log('Populating Save As data:', saveAsViewData);
      
      // Set view name with "Copy of" prefix
      setViewName(`Copy of ${saveAsViewData.originalViewName}`);
      
      // Parse the visible columns and find matching available columns
      if (saveAsViewData.visibleColumns) {
        const columnNames = saveAsViewData.visibleColumns
          .split(',')
          .map(col => col.trim().replace(/^\[|\]$/g, '')) // Remove brackets
          .filter(col => col && col !== '');
        
        console.log('Parsed column names:', columnNames);
        
        // Find matching columns from available columns
        const matchingColumns = availableColumns.filter(availableCol => {
          return columnNames.some(colName => 
            availableCol.DBName === colName || 
            availableCol.DisplayName === colName ||
            availableCol.DisplayName.toLowerCase() === colName.toLowerCase()
          );
        });
        
        console.log('Matching columns found:', matchingColumns);
        setSelectedColumns(matchingColumns);
      }
    }
  }, [saveAsViewData, availableColumns]);

  // Handle Edit data population
  useEffect(() => {
    if (editViewData && availableColumns.length > 0) {
      console.log('Populating Edit data:', editViewData);
      
      // Set view name
      setViewName(editViewData.viewName);
      setIsPublicView(editViewData.isPublicView);
      
      // Parse the visible columns and find matching available columns
      if (editViewData.visibleColumns) {
        const columnNames = editViewData.visibleColumns
          .split(',')
          .map(col => col.trim().replace(/^\[|\]$/g, '')) // Remove brackets
          .filter(col => col && col !== '');
        
        console.log('Edit mode - Parsed column names:', columnNames);
        
        // Find matching columns from available columns
        const matchingColumns = availableColumns.filter(availableCol => {
          return columnNames.some(colName => 
            availableCol.DBName === colName || 
            availableCol.DisplayName === colName ||
            availableCol.DisplayName.toLowerCase() === colName.toLowerCase()
          );
        });
        
        console.log('Edit mode - Matching columns found:', matchingColumns);
        setSelectedColumns(matchingColumns);
      }
    }
  }, [editViewData, availableColumns]);

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => {
      const isSelected = prev.find(col => col.ID === column.ID);
      if (isSelected) {
        return prev.filter(col => col.ID !== column.ID);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleSave = async () => {
    if (viewName.trim() && selectedColumns.length > 0) {
      setIsSaving(true);
      
      try {
        if (pageType === "proposals") {
          // For proposals, make real API call with specified payload structure
          console.log('Saving proposal view with API call:', {
            viewName: viewName.trim(),
            selectedColumns: selectedColumns.map(col => col.DBName),
            isPublicView
          });
          
          // Build the payload based on selected columns
          const fieldIDs = selectedColumns.map(col => col.ID).join(',');
          const dbColumnNames = ',' + selectedColumns.map(col => `[${col.DisplayName}]`).join(',');
          const visibleColumns = ',' + selectedColumns.map(col => col.DBName).join(',');
          
          // Calculate CustomFieldIDs - if fieldId < 0 then -1*FieldId else ""
          const customFieldIDs = selectedColumns
            .filter(col => col.ID < 0)
            .map(col => -1 * col.ID)
            .join(',');
          
          const payload = {
            CustomFieldIDs: customFieldIDs,
            DBColumnsNames: dbColumnNames,
            FieldIDs: fieldIDs,
            IsDefault: true,
            IsStandardView: false,
            NameOfView: viewName.trim(),
            PageType: 1,
            ProductType: 2, // 2 for proposals
            User: { ID: userId },
            ViewType: isPublicView ? 2 : 0, // 0 if public view checkbox is unchecked
            VisibleColumns: visibleColumns
          };

          // If editing, add the view ID
          if (editViewData) {
            payload.ID = editViewData.viewId;
          }
          
          console.log('Saving proposal view with payload:', payload);
          
          const response = editViewData 
            ? await apiService.updateView(payload)
            : await apiService.saveCustomView(payload);
          
          if (response?.content?.Status === 'Success') {
            console.log('Proposal view saved successfully');
            
            try {
              // Call APIs to refresh proposals grid after successful view save
              console.log('Refreshing proposal grid - fetching column config...');
              await proposalService.getColumnConfig();
              
              console.log('Refreshing proposal grid - searching proposals...');
              await proposalService.searchProposals({ CurPage: 1 });
              
              console.log('Proposal grid refresh completed');
            } catch (apiError) {
              console.error('Error refreshing proposal grid after view save:', apiError);
              // Continue with form reset even if API calls fail
            }
            
            // Reset form
            setViewName("");
            setSelectedColumns([]);
            setIsPublicView(false);
            
            // Clear data
            if (onClearSaveAsData) {
              onClearSaveAsData();
            }
            if (onClearEditData) {
              onClearEditData();
            }
            
            // Notify parent component
            onViewSaved?.();
            
            // Close Views Sidebar for proposals only
            if (onCloseSidebar) {
              onCloseSidebar();
            }
            
            console.log('Proposal view save completed');
          } else {
            console.error('Failed to save proposal view:', response);
          }
        } else {
          // Existing opportunities logic
          // Build the payload based on selected columns
          const fieldIDs = selectedColumns.map(col => col.ID).join(',');
          const dbColumnNames = ',' + selectedColumns.map(col => `[${col.DisplayName}]`).join(',');
          const visibleColumns = ',' + selectedColumns.map(col => col.DBName).join(',');
          
          const payload = {
            CustomFieldIDs: "",
            DBColumnsNames: dbColumnNames,
            FieldIDs: fieldIDs,
            IsDefault: false,
            IsStandardView: false,
            NameOfView: viewName.trim(),
            PageType: 1,
            ProductType: 1,
            User: { ID: 27 },
            ViewType: isPublicView ? 2 : 0, // 2 for public, 0 for custom
            VisibleColumns: visibleColumns
          };

          // If editing, add the view ID
          if (editViewData) {
            payload.ID = editViewData.viewId;
          }
          
          console.log('Saving view with payload:', payload);
          
          const response = editViewData 
            ? await apiService.updateView(payload)
            : await apiService.saveCustomView(payload);
          
          if (response?.content?.Status === 'Success') {
            console.log('View saved successfully');
            // Reset form
            setViewName("");
            setSelectedColumns([]);
            setIsPublicView(false);
            
            // Clear data
            if (onClearSaveAsData) {
              onClearSaveAsData();
            }
            if (onClearEditData) {
              onClearEditData();
            }
            
            // Notify parent component
            onViewSaved?.();
            
            // Call original onSaveView for backward compatibility
            onSaveView?.(viewName.trim(), selectedColumns.map(col => col.DBName));
          } else {
            console.error('Failed to save view:', response);
          }
        }
      } catch (error) {
        console.error('Error saving view:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDismissInstructions = (dontShowAgain = false) => {
    setShowInstructions(false);
    if (dontShowAgain) {
      localStorage.setItem('hideViewInstructions', 'true');
    }
  };

  const isColumnSelected = (column) => {
    return selectedColumns.find(col => col.ID === column.ID) !== undefined;
  };

  const handleClearData = () => {
    setViewName("");
    setSelectedColumns([]);
    setIsPublicView(false);
    if (onClearSaveAsData) {
      onClearSaveAsData();
    }
    if (onClearEditData) {
      onClearEditData();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader text="Loading available columns..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading columns: {error}
      </div>
    );
  }

  const selectedCount = selectedColumns.length;
  const totalCount = availableColumns.length;
  const isEditMode = !!editViewData;

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-4">
        {/* Edit Notice */}
        {editViewData && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 relative">
            <button
              onClick={handleClearData}
              className="absolute top-3 right-3 text-purple-600 hover:text-purple-800 transition-colors"
              title="Cancel edit"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start gap-3 pr-8">
              <Edit className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-purple-900">Editing View</h4>
                <p className="text-sm text-purple-800">
                  Editing "{editViewData.viewName}". Columns have been pre-selected based on the current view configuration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save As Notice */}
        {saveAsViewData && !editViewData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 relative">
            <button
              onClick={handleClearData}
              className="absolute top-3 right-3 text-green-600 hover:text-green-800 transition-colors"
              title="Clear Save As data"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start gap-3 pr-8">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-green-900">Creating Copy of View</h4>
                <p className="text-sm text-green-800">
                  Pre-populated with columns from "{saveAsViewData.originalViewName}". 
                  You can modify the name and adjust columns as needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Notice */}
        {pageType === "proposals" && !saveAsViewData && !editViewData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Proposal View Creation</h4>
                <p className="text-sm text-blue-800">
                  Create custom views for proposals by selecting from available columns. 
                  Views will be saved via API and appear in your saved views list.
                </p>
              </div>
            </div>
          </div>
        )}

        {showInstructions && !saveAsViewData && !editViewData && pageType === "opportunities" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
            <button
              onClick={() => handleDismissInstructions(false)}
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800 transition-colors"
              title="Close instructions"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start gap-3 pr-8">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-3">
                <h4 className="font-medium text-blue-900">How to Create a Custom View</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Enter a descriptive name for your view</li>
                  <li>2. Select columns from the categories below</li>
                  <li>3. Browse by category (Standard Fields, Opportunity Stage, etc.)</li>
                  <li>4. Click Save to create your custom view</li>
                  <li>5. Your new view will appear in the "Saved Views" section</li>
                </ul>
                
                <button
                  onClick={() => handleDismissInstructions(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  Don't show again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {isEditMode ? 'Update View with Selected Columns' : 'Save with Selected Columns'}
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publicView"
                checked={isPublicView}
                onCheckedChange={setIsPublicView}
              />
              <Label htmlFor="publicView" className="text-sm">Public View</Label>
            </div>
          </div>
          
          <Input
            placeholder={pageType === "proposals" 
              ? "Enter view name (e.g., 'Active Proposals', 'High Priority')" 
              : "Enter view name (e.g., 'My Sales Pipeline', 'Q4 Opportunities')"
            }
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            className="w-full"
          />
          
          <Button
            onClick={handleSave}
            disabled={!viewName.trim() || selectedColumns.length === 0 || isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSaving 
              ? (isEditMode ? 'Updating...' : 'Saving...') 
              : `${isEditMode ? 'Update' : 'Save'} View (${selectedColumns.length} columns selected)`
            }
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} of {totalCount} columns selected
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-blue-700">Selected Columns</Label>
          <ScrollArea className="h-48 border border-gray-200 rounded-lg p-2 bg-white">
            {selectedColumns.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {selectedColumns.map((column, index) => (
                  <div
                    key={column.ID}
                    className="flex items-center justify-between p-1.5 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleColumnToggle(column)}
                  >
                    <span className="text-xs font-medium text-blue-900 flex-1 leading-tight">
                      {index + 1}. {column.DisplayName}
                    </span>
                    <X className="h-3 w-3 text-blue-600 hover:text-blue-800 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No columns selected</p>
                  <p className="text-xs">Click columns below to add them</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-blue-700">Available Columns</Label>
          
          <Accordion type="multiple" className="w-full">
            {Object.entries(columnsByGroup).map(([groupName, columns]) => (
              <AccordionItem key={groupName} value={groupName}>
                <AccordionTrigger className="text-sm font-medium">
                  {groupName || 'Standard Fields'} ({columns.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="max-h-80">
                    <div className="grid grid-cols-2 gap-1.5 pt-2 pr-4">
                      {columns.map((column) => (
                        <div
                          key={column.ID}
                          className={`flex items-center space-x-2 p-2 border rounded cursor-pointer transition-colors ${
                            isColumnSelected(column)
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleColumnToggle(column)}
                        >
                          <Checkbox
                            checked={isColumnSelected(column)}
                            onChange={() => {}} // Handled by onClick above
                          />
                          <Label className="text-xs cursor-pointer flex-1 leading-tight">
                            {column.DisplayName}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AddViewTab;
