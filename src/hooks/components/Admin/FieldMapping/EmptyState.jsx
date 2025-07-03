
import { Card, CardContent } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Database, RefreshCw } from "lucide-react";

/**
 * EmptyState Component
 * 
 * Displays when no platform fields have been loaded for field mapping.
 * Provides a clear call-to-action for users to load platform fields
 * and begin the mapping process.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLoadPlatformFields - Callback to trigger platform field loading
 * @param {boolean} props.isLoadingFields - Whether fields are currently being loaded
 * 
 * @returns {JSX.Element} Empty state card with load action
 * 
 * @example
 * <EmptyState 
 *   onLoadPlatformFields={handleLoadFields} 
 *   isLoadingFields={false} 
 * />
 * 
 * @description
 * This component is part of the field mapping workflow and appears when:
 * - No platform has been connected yet
 * - Platform connection exists but fields haven't been synced
 * - Field loading failed and needs to be retried
 */
const EmptyState = ({ onLoadPlatformFields, isLoadingFields }) => {
  return (
    <Card>
      <CardContent className="text-center py-6">
        {/* Visual indicator for empty state */}
        <Database className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        
        {/* Primary message */}
        <h3 className="text-base font-medium mb-2">No Platform Fields Loaded</h3>
        
        {/* Supporting description */}
        <p className="text-sm text-gray-500 mb-3">
          Load fields from your platform to start mapping
        </p>
        
        {/* Action button with loading state */}
        <Button 
          onClick={onLoadPlatformFields} 
          disabled={isLoadingFields} 
          size="sm"
        >
          <RefreshCw className={`h-3 w-3 mr-2 ${isLoadingFields ? 'animate-spin' : ''}`} />
          Load Platform Fields
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
