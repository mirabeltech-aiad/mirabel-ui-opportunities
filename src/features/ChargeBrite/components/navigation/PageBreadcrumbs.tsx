/**
 * @fileoverview Page Breadcrumbs - Navigation breadcrumb component
 * 
 * Displays breadcrumb navigation based on current route and page metadata.
 * Integrates with the page registry for automatic breadcrumb generation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useRouteUtils } from '../../lib/navigation/routeIntegration';
import { cn } from '../../lib/utils';

interface PageBreadcrumbsProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({
  className,
  showHome = true,
  maxItems = 5,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />
}) => {
  const { getBreadcrumbs } = useRouteUtils();
  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  // Limit breadcrumbs if maxItems is set
  const displayBreadcrumbs = breadcrumbs.length > maxItems
    ? [
        breadcrumbs[0],
        { label: '...', route: undefined },
        ...breadcrumbs.slice(-maxItems + 2)
      ]
    : breadcrumbs;

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {displayBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = crumb.label === '...';
          const isHome = index === 0 && showHome;

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mx-2">{separator}</span>
              )}
              
              {isEllipsis ? (
                <span className="text-muted-foreground">...</span>
              ) : isLast ? (
                <span 
                  className="font-medium text-foreground truncate max-w-[200px]"
                  title={crumb.label}
                >
                  {isHome ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="sr-only">{crumb.label}</span>
                    </span>
                  ) : (
                    crumb.label
                  )}
                </span>
              ) : crumb.route ? (
                <Link
                  to={crumb.route}
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                  title={crumb.label}
                >
                  {isHome ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="sr-only">{crumb.label}</span>
                    </span>
                  ) : (
                    crumb.label
                  )}
                </Link>
              ) : (
                <span 
                  className="truncate max-w-[200px]"
                  title={crumb.label}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PageBreadcrumbs;