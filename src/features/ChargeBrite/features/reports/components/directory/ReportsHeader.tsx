/**
 * @fileoverview Reports Directory Header Component
 * 
 * Header component for the reports directory providing title, subtitle,
 * business model indicators, error display, and refresh functionality.
 * 
 * @author Reports Team
 * @since 1.0.0
 */

import React from 'react';
import { OceanTitle, OceanButton, SemanticBadge } from '@/components/ui/design-system';
import { Building2, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { BusinessModel } from '@/contexts/BusinessModelContext';

/**
 * Props interface for ReportsHeader component
 * 
 * @interface ReportsHeaderProps
 */
interface ReportsHeaderProps {
  /** Total number of available reports */
  totalReports: number;
  /** Number of reports after filtering (optional) */
  filteredCount?: number;
  /** Current business model context (Media or SaaS) */
  businessModel: BusinessModel;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message if any occurred during data fetching */
  error?: string | null;
  /** Callback function to refresh reports data */
  onRefresh: () => void;
}

/**
 * Reports Directory Header Component
 * 
 * Provides the main header interface for the reports directory including:
 * - Page title and description
 * - Report count display with filtering status
 * - Business model indicator badge
 * - Refresh functionality with loading states
 * - Error display with user-friendly messaging
 * 
 * Business Model Integration:
 * - Displays different icons and colors for Media vs SaaS modes
 * - Shows appropriate business model badge
 * - Adapts content and filtering based on current business context
 * 
 * Interactive Features:
 * - Refresh button with loading animation
 * - Error alerts with actionable messaging
 * - Responsive layout for different screen sizes
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * function ReportsPage() {
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [error, setError] = useState(null);
 *   
 *   return (
 *     <ReportsHeader
 *       totalReports={150}
 *       filteredCount={45}
 *       businessModel="media"
 *       isLoading={isLoading}
 *       error={error}
 *       onRefresh={() => {
 *         setIsLoading(true);
 *         // Refresh logic
 *       }}
 *     />
 *   );
 * }
 * 
 * // With error handling
 * function ReportsPageWithError() {
 *   return (
 *     <ReportsHeader
 *       totalReports={0}
 *       businessModel="saas"
 *       isLoading={false}
 *       error="Failed to fetch reports from server"
 *       onRefresh={handleRetry}
 *     />
 *   );
 * }
 * ```
 * 
 * @param {ReportsHeaderProps} props - Component props
 * @returns {JSX.Element} Reports directory header with all interactive elements
 */
const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  totalReports,
  filteredCount,
  businessModel,
  isLoading,
  error,
  onRefresh
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <OceanTitle level={1} className="mb-2">Reports Directory</OceanTitle>
          <p className="text-muted-foreground">
            Comprehensive analytics and business intelligence reports
            {filteredCount !== undefined && filteredCount !== totalReports && (
              <span className="ml-2 text-sm">
                (Showing {filteredCount} of {totalReports} reports)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {businessModel === 'saas' ? (
              <>
                <Zap className="h-4 w-4 text-purple-600" />
                <SemanticBadge variant="active" className="bg-purple-500">
                  SaaS Mode
                </SemanticBadge>
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 text-ocean-600" />
                <SemanticBadge variant="active" className="bg-ocean-500">
                  Media Mode
                </SemanticBadge>
              </>
            )}
          </div>
          <OceanButton 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </OceanButton>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Error loading reports: {error}</span>
        </div>
      )}
    </div>
  );
};

export default ReportsHeader;