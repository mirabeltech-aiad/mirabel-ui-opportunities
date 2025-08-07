/**
 * @fileoverview Page Layout - Enhanced page layout with integrated navigation
 * 
 * Provides a comprehensive page layout system with breadcrumbs, page headers,
 * error boundaries, and integration with the page registry.
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouteUtils, usePageSEO } from '../../lib/navigation/routeIntegration';
import { FeatureErrorBoundary } from '../error-boundaries';
import PageBreadcrumbs from '../navigation/PageBreadcrumbs';
import { OceanTitle, OceanButton } from '../ui/design-system';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBreadcrumbs?: boolean;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  layout?: 'default' | 'fullwidth' | 'sidebar' | 'minimal';
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  showBreadcrumbs = true,
  showBackButton = false,
  showRefreshButton = false,
  actions,
  className,
  contentClassName,
  headerClassName,
  layout = 'default',
  loading = false,
  error = null,
  onRefresh
}) => {
  const { currentPage, goBack } = useRouteUtils();
  const { updatePageMeta } = usePageSEO();

  const pageTitle = title || currentPage?.title || currentPage?.name;
  const pageDescription = description || currentPage?.description;

  // Update page meta information
  useEffect(() => {
    if (currentPage) {
      updatePageMeta(currentPage);
    }
  }, [currentPage, updatePageMeta]);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'fullwidth':
        return 'w-full';
      case 'sidebar':
        return 'max-w-none';
      case 'minimal':
        return 'max-w-4xl mx-auto px-4';
      default:
        return 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
    }
  };

  const getContentClasses = () => {
    const baseClasses = 'py-8';
    return cn(baseClasses, getLayoutClasses(), contentClassName);
  };

  return (
    <FeatureErrorBoundary featureName="Page Layout">
      {/* SEO Head Tags */}
      {currentPage && (
        <Helmet>
          <title>{currentPage.seoTitle || `${pageTitle} - Your App`}</title>
          <meta 
            name="description" 
            content={currentPage.seoDescription || pageDescription} 
          />
        </Helmet>
      )}

      <div className={cn('min-h-screen bg-gray-50', className)}>
        {/* Page Header */}
        {(pageTitle || showBreadcrumbs || showBackButton || actions) && (
          <header className={cn('bg-white border-b border-gray-200', headerClassName)}>
            <div className={getLayoutClasses()}>
              <div className="py-6">
                {/* Breadcrumbs */}
                {showBreadcrumbs && (
                  <div className="mb-4">
                    <PageBreadcrumbs />
                  </div>
                )}

                {/* Page Header Content */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Back Button and Title */}
                    <div className="flex items-center gap-4 mb-2">
                      {showBackButton && (
                        <OceanButton
                          variant="outline"
                          size="sm"
                          onClick={goBack}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </OceanButton>
                      )}
                      
                      {pageTitle && (
                        <OceanTitle level={1} className="flex-1">
                          {pageTitle}
                        </OceanTitle>
                      )}
                    </div>

                    {/* Description */}
                    {pageDescription && (
                      <p className="text-gray-600 max-w-2xl">
                        {pageDescription}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {(actions || showRefreshButton) && (
                    <div className="flex items-center gap-2 ml-4">
                      {showRefreshButton && onRefresh && (
                        <OceanButton
                          variant="outline"
                          size="sm"
                          onClick={onRefresh}
                          disabled={loading}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                          Refresh
                        </OceanButton>
                      )}
                      {actions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={getContentClasses()}>
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <p className="text-lg font-medium">Something went wrong</p>
                <p className="text-sm text-gray-600">{error.message}</p>
              </div>
              {onRefresh && (
                <OceanButton onClick={onRefresh} variant="outline">
                  Try Again
                </OceanButton>
              )}
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </FeatureErrorBoundary>
  );
};

export default PageLayout;