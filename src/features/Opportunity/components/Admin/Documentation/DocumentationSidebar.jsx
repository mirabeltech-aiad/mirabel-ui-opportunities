
import React from "react";
import { Card, CardContent } from "@OpportunityComponents/ui/card";
import { FileText } from "lucide-react";

/**
 * Sidebar component for displaying documentation file list
 * Extracted from DocumentationTab for better organization
 */
const DocumentationSidebar = ({ documentationFiles, activeDoc, onDocumentSelect }) => {
  return (
    <div className="w-1/3 border-r bg-gray-50 p-4">
      <h3 className="font-medium mb-4">Documentation Files</h3>
      <div className="space-y-0.5">
        {documentationFiles.map((doc) => (
          <Card 
            key={doc.id}
            className={`cursor-pointer transition-colors ${
              activeDoc === doc.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-white'
            }`}
            onClick={() => onDocumentSelect(doc.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{doc.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      doc.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="text-xs text-gray-400">{doc.lastUpdated}</span>
                  </div>
                </div>
                <FileText className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentationSidebar;
