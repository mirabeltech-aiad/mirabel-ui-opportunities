
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Mail, X } from "lucide-react";

interface TableActionsPanelProps {
  selectedCount: number;
  onExport: () => void;
  onBatchUpdate: () => void;
  onSendEmail: () => void;
  onClear?: () => void;
}

const TableActionsPanel: React.FC<TableActionsPanelProps> = ({
  selectedCount,
  onExport,
  onBatchUpdate,
  onSendEmail,
  onClear
}) => {
  return (
    <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="blue" className="bg-ocean-100 text-ocean-800">
            {selectedCount} selected
          </Badge>
          <span className="text-sm text-ocean-700">
            Perform actions on selected proposals
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ocean-secondary" 
            size="sm" 
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant="ocean-secondary" 
            size="sm" 
            onClick={onBatchUpdate}
          >
            <Edit className="h-4 w-4 mr-2" />
            Batch Update
          </Button>
          
          <Button 
            variant="ocean" 
            size="sm" 
            onClick={onSendEmail}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          {onClear && (
            <Button 
              variant="ocean-ghost" 
              size="icon-sm" 
              onClick={onClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableActionsPanel;
