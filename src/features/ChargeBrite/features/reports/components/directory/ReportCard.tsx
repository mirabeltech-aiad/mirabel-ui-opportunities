/**
 * @fileoverview Report Card Component
 * 
 * Individual report display card component providing report information,
 * category badges, and selection functionality with consistent design patterns.
 * 
 * @author Reports Team
 * @since 1.0.0
 */

import React from 'react';
import { CardContent } from '../../../../components/ui/card';
import { OceanButton, DesignSystemCard, SemanticBadge } from '../../../../components/ui/design-system';

/**
 * Report data structure for card display
 * 
 * @interface Report
 */
interface Report {
  /** Unique identifier for the report */
  id: string;
  /** Display title of the report */
  title: string;
  /** Detailed description of report contents and purpose */
  description: string;
  /** Category classification for the report */
  category: string;
  /** Optional React component for rendering the report */
  component?: any;
}

/**
 * Props interface for ReportCard component
 * 
 * @interface ReportCardProps
 */
interface ReportCardProps {
  /** Report data object containing all display information */
  report: Report;
  /** Callback function triggered when report is selected */
  onSelect: (reportId: string) => void;
}

/**
 * Report Card Component
 * 
 * Displays individual report information in a card format with interactive
 * selection capabilities. Features consistent design patterns, hover effects,
 * and proper accessibility support.
 * 
 * Design Features:
 * - Large white cards with enhanced shadows and hover effects
 * - Semantic badge for category classification
 * - Full-width action button for report access
 * - Responsive layout with proper spacing
 * - Click handling for both card and button
 * 
 * Interaction Patterns:
 * - Card click triggers report selection
 * - Button click with event propagation prevention
 * - Hover effects for visual feedback
 * - Consistent button styling with ocean theme
 * 
 * Accessibility:
 * - Semantic HTML structure
 * - Keyboard navigation support
 * - Screen reader friendly content
 * - Proper focus management
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * const report = {
 *   id: 'analytics-overview',
 *   title: 'Analytics Overview',
 *   description: 'Comprehensive analytics dashboard with key metrics',
 *   category: 'Analytics',
 *   component: AnalyticsOverviewComponent
 * };
 * 
 * function ReportsList() {
 *   const handleReportSelect = (reportId: string) => {
 *     console.log('Selected report:', reportId);
 *     // Navigation or report loading logic
 *   };
 *   
 *   return (
 *     <ReportCard 
 *       report={report} 
 *       onSelect={handleReportSelect} 
 *     />
 *   );
 * }
 * 
 * // In a grid layout
 * function ReportsGrid({ reports }) {
 *   return (
 *     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *       {reports.map(report => (
 *         <ReportCard 
 *           key={report.id}
 *           report={report}
 *           onSelect={handleReportSelection}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param {ReportCardProps} props - Component props
 * @returns {JSX.Element} Interactive report card with selection capabilities
 */
const ReportCard: React.FC<ReportCardProps> = ({ report, onSelect }) => {
  return (
    <DesignSystemCard 
      size="large"
      className="h-full hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(report.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {report.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              {report.description}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <SemanticBadge variant="neutral">
                {report.category}
              </SemanticBadge>
            </div>
          </div>
        </div>
        
        <OceanButton 
          variant="primary"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(report.id);
          }}
        >
          View Report
        </OceanButton>
      </CardContent>
    </DesignSystemCard>
  );
};

export default ReportCard;