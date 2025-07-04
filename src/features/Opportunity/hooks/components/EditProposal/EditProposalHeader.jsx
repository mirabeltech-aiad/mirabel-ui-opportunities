
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X } from "lucide-react";

const EditProposalHeader = ({ proposalId, onCancel, onSave }) => {
  return (
    <div className="bg-gray-100 text-gray-800 p-3 flex-shrink-0 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-600 hover:bg-gray-200"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold">Edit Proposal</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-gray-600 hover:bg-gray-200"
            size="sm"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="gap-2 bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white"
            size="sm"
          >
            <Save className="h-3 w-3" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProposalHeader;
