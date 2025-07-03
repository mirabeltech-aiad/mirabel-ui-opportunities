
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Badge } from "@OpportunityComponents/ui/badge";
import { RefreshCw, Database } from "lucide-react";

// Extracted for clarity - handles mapping status display and platform field loading
const MappingStatus = ({ 
  mappedCount, 
  totalFields, 
  platformFieldsCount, 
  isLoadingFields, 
  onLoadPlatformFields 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="h-4 w-4" />
          Mapping Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="blue" className="text-xs">
              {mappedCount} / {totalFields} Fields Mapped
            </Badge>
            <div className="text-xs text-gray-500">
              Platform Fields Available: {platformFieldsCount}
            </div>
          </div>
          <Button 
            onClick={onLoadPlatformFields}
            disabled={isLoadingFields}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${isLoadingFields ? 'animate-spin' : ''}`} />
            {isLoadingFields ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MappingStatus;
