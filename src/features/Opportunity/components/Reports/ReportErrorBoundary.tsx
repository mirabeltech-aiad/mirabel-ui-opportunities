
import React from 'react';
import ErrorBoundary from '../../../../components/ui/ErrorBoundary';
import { toast } from '@/features/Opportunity/hooks/use-toast';

/**
 * Specialized error boundary for report sections with enhanced error handling
 * and user feedback through toast notifications.
 * 
 * @component
 * @example
 * ```tsx
 * <ReportErrorBoundary sectionName="Sales Analytics">
 *   <SalesAnalyticsComponent />
 * </ReportErrorBoundary>
 * ```
 */
interface ReportErrorBoundaryProps {
  /** React children to be wrapped by the error boundary */
  children: React.ReactNode;
  /** Name of the report section for error identification and user messaging */
  sectionName: string;
}

/**
 * ReportErrorBoundary provides section-specific error handling for report components.
 * It wraps report sections to catch errors, display user-friendly messages via toasts,
 * and log detailed error information for debugging.
 * 
 * Features:
 * - Toast notifications for user feedback
 * - Detailed console logging for debugging
 * - Section-specific error identification
 * - Graceful fallback UI through base ErrorBoundary
 * 
 * @param props - Component props
 * @param props.children - React components to protect with error boundary
 * @param props.sectionName - Descriptive name used in error messages and logging
 * @returns JSX element with error boundary protection
 */
const ReportErrorBoundary: React.FC<ReportErrorBoundaryProps> = ({ 
  children, 
  sectionName 
}) => {
  /**
   * Error handler that displays toast notification and logs detailed error info
   * @param error - The caught error object
   */
  const handleError = (error: Error) => {
    toast({
      title: "Report Section Error",
      description: `There was an issue loading the ${sectionName} section.`,
      variant: "destructive"
    });
    
    // Log detailed error for debugging
    console.error(`Error in ${sectionName} report section:`, error);
  };

  return (
    <ErrorBoundary 
      fallbackTitle={`Error in ${sectionName}`}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ReportErrorBoundary;
