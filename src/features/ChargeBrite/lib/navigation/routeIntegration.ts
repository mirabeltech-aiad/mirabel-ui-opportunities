/**
 * @fileoverview Route Integration - Advanced routing utilities and integration
 * 
 * Provides utilities for dynamic routing, route guards, breadcrumbs,
 * and integration with the page registry system.
 */

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { pageRegistry, PageConfig, BreadcrumbItem } from './pageRegistry';

// Route guard types
export type RouteGuard = (page: PageConfig, userPermissions?: string[]) => {
  canAccess: boolean;
  redirectTo?: string;
  message?: string;
};

// Route utilities hook
export const useRouteUtils = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const currentPage = useMemo(() => {
    return pageRegistry.getPageByRoute(location.pathname);
  }, [location.pathname]);

  const navigateToPage = useCallback((pageId: string, options?: {
    replace?: boolean;
    state?: any;
  }) => {
    const page = pageRegistry.getPage(pageId);
    if (page) {
      navigate(page.route, options);
    }
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    if (!currentPage) return [];
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', route: '/' }
    ];

    if (currentPage.breadcrumbs) {
      breadcrumbs.push(...currentPage.breadcrumbs);
    } else {
      // Auto-generate breadcrumbs from route
      const pathSegments = location.pathname.split('/').filter(Boolean);
      pathSegments.forEach((segment, index) => {
        const route = '/' + pathSegments.slice(0, index + 1).join('/');
        const page = pageRegistry.getPageByRoute(route);
        
        if (page && page.id !== currentPage.id) {
          breadcrumbs.push({
            label: page.name,
            route: page.route
          });
        }
      });

      // Add current page
      breadcrumbs.push({
        label: currentPage.name
      });
    }

    return breadcrumbs;
  }, [currentPage, location.pathname]);

  return {
    currentPage,
    location,
    params,
    navigateToPage,
    goBack,
    getBreadcrumbs,
    isCurrentRoute: (route: string) => location.pathname === route,
    isRouteActive: (route: string) => location.pathname.startsWith(route)
  };
};

// Route guard implementations
export const createPermissionGuard = (requiredPermissions: string[]): RouteGuard => {
  return (page: PageConfig, userPermissions: string[] = []) => {
    if (page.isPublic) {
      return { canAccess: true };
    }

    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    return {
      canAccess: hasPermission,
      redirectTo: hasPermission ? undefined : '/unauthorized',
      message: hasPermission ? undefined : 'You do not have permission to access this page.'
    };
  };
};

export const createAuthGuard = (): RouteGuard => {
  return (page: PageConfig, userPermissions: string[] = []) => {
    if (page.isPublic) {
      return { canAccess: true };
    }

    // Check if user is authenticated (you'll need to implement this based on your auth system)
    const isAuthenticated = userPermissions.length > 0; // Simple check

    return {
      canAccess: isAuthenticated,
      redirectTo: isAuthenticated ? undefined : '/login',
      message: isAuthenticated ? undefined : 'Please log in to access this page.'
    };
  };
};

// Route guard hook
export const useRouteGuard = (guards: RouteGuard[] = [], userPermissions: string[] = []) => {
  const { currentPage } = useRouteUtils();

  const guardResult = useMemo(() => {
    if (!currentPage) {
      return { canAccess: false, redirectTo: '/404' };
    }

    for (const guard of guards) {
      const result = guard(currentPage, userPermissions);
      if (!result.canAccess) {
        return result;
      }
    }

    return { canAccess: true };
  }, [currentPage, guards, userPermissions]);

  return guardResult;
};

// SEO utilities
export const usePageSEO = () => {
  const { currentPage } = useRouteUtils();

  const updatePageMeta = useCallback((page?: PageConfig) => {
    const targetPage = page || currentPage;
    if (!targetPage) return;

    // Update page title
    document.title = targetPage.seoTitle || `${targetPage.title} - Your App Name`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        targetPage.seoDescription || targetPage.description
      );
    }
  }, [currentPage]);

  return {
    currentPage,
    updatePageMeta
  };
};

// Dynamic route loading utilities
export const loadPageComponent = async (pageId: string): Promise<PageConfig | null> => {
  const page = pageRegistry.getPage(pageId);
  if (!page) return null;

  // If component is already loaded, return it
  if (page.component) return page;

  // Handle lazy loading if needed
  try {
    // This would be implemented based on your lazy loading strategy
    return page;
  } catch (error) {
    console.error(`Failed to load page component for ${pageId}:`, error);
    return null;
  }
};