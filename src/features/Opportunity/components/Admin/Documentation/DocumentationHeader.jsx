
import React from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Eye, Edit, Download } from "lucide-react";

/**
 * Header component for documentation viewer with action buttons
 * Extracted from DocumentationTab for better organization
 */
const DocumentationHeader = ({ documentationFiles, activeDoc }) => {
  const currentDoc = documentationFiles.find(doc => doc.id === activeDoc);

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {currentDoc?.title}
          </h3>
          <p className="text-sm text-gray-500">
            {currentDoc?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationHeader;
