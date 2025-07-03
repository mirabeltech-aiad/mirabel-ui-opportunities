
import React from 'react';
import { Button } from "@OpportunityComponents/ui/button";
import { FileText, Edit, Mail, Printer, Download } from "lucide-react";

const TableActionsPanel = ({ selectedCount, onExport, onBatchUpdate, onSendEmail, onPrint, onDownloadFiles }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-gray-700 border-gray-300"
          onClick={onExport}
        >
          <FileText className="h-4 w-4 text-green-600" />
          Export
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-gray-700 border-gray-300"
          onClick={onBatchUpdate}
        >
          <Edit className="h-4 w-4 text-blue-600" />
          Batch Update
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-gray-700 border-gray-300"
          onClick={onSendEmail}
        >
          <Mail className="h-4 w-4 text-purple-600" />
          Send Email
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-gray-700 border-gray-300"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 text-orange-600" />
          Print
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-gray-700 border-gray-300"
          onClick={onDownloadFiles}
        >
          <Download className="h-4 w-4 text-indigo-600" />
          Download Files
        </Button>
      </div>
    </div>
  );
};

export default TableActionsPanel;
