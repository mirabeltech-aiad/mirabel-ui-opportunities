
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, X, CheckCircle2, Plus } from "lucide-react";
import ColumnSelector from "./ColumnSelector";
import { colorTokens } from "@/styles/designTokens";

const AddViewTab = ({ columnOrder, onSaveView }) => {
  const [viewName, setViewName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isPublicView, setIsPublicView] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const selectedColumnsWithLabels = useMemo(() => {
    return selectedColumns.map(columnId => 
      columnOrder.find(col => col.id === columnId)
    ).filter(Boolean);
  }, [selectedColumns, columnOrder]);

  const handleColumnToggle = (columnId) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSave = () => {
    if (viewName.trim() && selectedColumns.length > 0) {
      onSaveView(viewName.trim(), selectedColumns);
      setViewName("");
      setSelectedColumns([]);
    }
  };

  const handlePublicViewChange = (checked) => {
    setIsPublicView(checked === true);
  };

  return (
    <div className="space-y-4">
      {showInstructions && (
        <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4 relative">
          <button
            onClick={() => setShowInstructions(false)}
            className="absolute top-3 right-3 text-ocean-600 hover:text-ocean-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-8">
            <Info className="h-5 w-5 text-ocean-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <h4 className="font-medium text-ocean-800">How to Create a Custom View</h4>
              <ul className="text-sm text-ocean-700 space-y-1">
                <li>1. Enter a descriptive name for your view</li>
                <li>2. Use the column selector below to choose columns</li>
                <li>3. Browse by category to find specific fields</li>
                <li>4. Click Save to create your custom view</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-ocean-800">Save with Selected Columns</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="publicView"
              checked={isPublicView}
              onCheckedChange={handlePublicViewChange}
            />
            <Label htmlFor="publicView" className="text-sm text-ocean-700">Public View</Label>
          </div>
        </div>
        
        <Input
          placeholder="Enter view name"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
          className="border-ocean-200 focus:border-ocean-500"
        />
        
        <Button
          onClick={handleSave}
          disabled={!viewName.trim() || selectedColumns.length === 0}
          className="w-full bg-ocean-500 hover:bg-ocean-600 text-white border-ocean-500"
        >
          Save View ({selectedColumns.length} columns selected)
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-ocean-600" />
        <span className="text-sm font-medium text-ocean-800">
          {selectedColumns.length} of {columnOrder.length} columns selected
        </span>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-ocean-700">Selected Columns</Label>
        <div className="min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
          {selectedColumnsWithLabels.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {selectedColumnsWithLabels.map((column, index) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between p-1.5 bg-ocean-50 border border-ocean-200 rounded cursor-pointer hover:bg-ocean-100 transition-colors"
                  onClick={() => handleColumnToggle(column.id)}
                >
                  <span className="text-xs font-medium text-ocean-800 flex-1">
                    {index + 1}. {column.label}
                  </span>
                  <X className="h-3 w-3 text-ocean-600" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No columns selected</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ColumnSelector
        columnOrder={columnOrder}
        selectedColumns={selectedColumns}
        onColumnToggle={handleColumnToggle}
      />
    </div>
  );
};

export default AddViewTab;
