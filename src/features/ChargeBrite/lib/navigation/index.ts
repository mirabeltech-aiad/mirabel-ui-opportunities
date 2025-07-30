/**
 * @fileoverview Navigation System Exports
 * 
 * Centralized exports for the navigation and page system.
 */

// Page Registry
export { 
  pageRegistry, 
  createPageConfig,
  type PageMetadata,
  type PageConfig,
  type BreadcrumbItem
} from './pageRegistry';

// Route Integration
export {
  useRouteUtils,
  useRouteGuard,
  usePageSEO,
  createPermissionGuard,
  createAuthGuard,
  loadPageComponent,
  type RouteGuard
} from './routeIntegration';

// Page Registration
export {
  registerCorePages,
  getRegisteredRoutes,
  getPageNavigationItems
} from './pageRegistration';