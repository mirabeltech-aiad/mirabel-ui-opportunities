
import React from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";

// Extracted header component for better organization
const EditOpportunityHeader = ({ opportunityId, onCancel, onSave, isSaving, isAddMode }) => {
  return (
    <div className="bg-gray-100 text-gray-800 p-3 flex-shrink-0 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-600 hover:bg-gray-200"
            disabled={isSaving}
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-ocean-800">
              {isAddMode ? 'Add Opportunity' : 'Edit Opportunity'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-gray-600 hover:bg-gray-200"
            size="sm"
            disabled={isSaving}
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          {/* Only show save button in edit mode, not in add mode */}
          {!isAddMode && (
            <Button
              onClick={onSave}
              className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500"
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOpportunityHeader;
