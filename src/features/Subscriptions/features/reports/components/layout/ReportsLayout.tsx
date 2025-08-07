/**
 * @fileoverview Reports Layout Component
 * 
 * Provides the main layout structure for the reports feature.
 * Includes header, navigation, and content areas with consistent spacing.
 * 
 * @example
 * ```tsx
 * <ReportsLayout>
 *   <ReportsDirectory />
 * </ReportsLayout>
 * ```
 */

import React from 'react';
import { ReportsErrorBoundary } from '../common';

interface ReportsLayoutProps {
  /** Content to render within the layout */
  children: React.ReactNode;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional sidebar content */
  sidebar?: React.ReactNode;
  /** Custom className for the main container */
  className?: string;
}

/**
 * Main layout component for the reports feature
 */
const ReportsLayout: React.FC<ReportsLayoutProps> = ({
  children,
  header,
  sidebar,
  className = ''
}) => {
  return (
    <ReportsErrorBoundary>
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        {/* Header Section */}
        {header && (
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {sidebar ? (
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className="w-64 flex-shrink-0">
                <div className="sticky top-8">
                  {sidebar}
                </div>
              </aside>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          ) : (
            // Full width content
            <div className="w-full">
              {children}
            </div>
          )}
        </main>
      </div>
    </ReportsErrorBoundary>
  );
};

export default ReportsLayout;