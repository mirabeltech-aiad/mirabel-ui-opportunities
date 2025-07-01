
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";

const AddOpportunityHeader = ({ onCancel, onSave, isSaving }) => {
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
            <h1 className="text-lg font-bold">
              Add New Opportunity
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
        </div>
      </div>
    </div>
  );
};

export default AddOpportunityHeader;
