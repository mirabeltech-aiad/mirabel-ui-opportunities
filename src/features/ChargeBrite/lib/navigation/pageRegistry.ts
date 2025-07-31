/**
 * @fileoverview Page Registry - Centralized page management and routing
 * 
 * Provides a registry system for pages with metadata, routing information,
 * and integration with the navigation system.
 */

import { ComponentType, lazy } from 'react';
import { LucideIcon } from 'lucide-react';

// Page metadata interface
export interface PageMetadata {
  id: string;
  name: string;
  title: string;
  description: string;
  route: string;
  icon?: LucideIcon;
  category: string;
  permissions?: string[];
  isPublic?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

export interface PageConfig extends PageMetadata {
  component: ComponentType<any>;
  layout?: 'default' | 'fullwidth' | 'sidebar' | 'minimal';
  preload?: boolean;
}

// Page registry class
class PageRegistry {
  private pages = new Map<string, PageConfig>();
  private routes = new Map<string, PageConfig>();
  private subscribers: Array<(pages: PageConfig[]) => void> = [];

  /**
   * Register a page in the registry
   */
  register(pageConfig: PageConfig): void {
    // Check if page already exists
    if (this.pages.has(pageConfig.id)) {
      console.warn(`Page with ID ${pageConfig.id} already exists. Skipping registration.`);
      return;
    }

    // Check if route already exists
    if (this.routes.has(pageConfig.route)) {
      console.warn(`Page with route ${pageConfig.route} already exists. Skipping registration.`);
      return;
    }

    this.pages.set(pageConfig.id, pageConfig);
    this.routes.set(pageConfig.route, pageConfig);
    this.notifySubscribers();
  }

  /**
   * Unregister a page from the registry
   */
  unregister(pageId: string): void {
    const page = this.pages.get(pageId);
    if (page) {
      this.pages.delete(pageId);
      this.routes.delete(page.route);
      this.notifySubscribers();
    }
  }

  /**
   * Get page by ID
   */
  getPage(pageId: string): PageConfig | undefined {
    return this.pages.get(pageId);
  }

  /**
   * Get page by route
   */
  getPageByRoute(route: string): PageConfig | undefined {
    return this.routes.get(route);
  }

  /**
   * Get all registered pages
   */
  getPages(): PageConfig[] {
    return Array.from(this.pages.values());
  }

  /**
   * Get pages by category
   */
  getPagesByCategory(category: string): PageConfig[] {
    return this.getPages().filter(page => page.category === category);
  }

  /**
   * Get all routes for React Router
   */
  getRoutes(): Array<{ path: string; page: PageConfig }> {
    return Array.from(this.routes.entries()).map(([path, page]) => ({
      path,
      page
    }));
  }

  /**
   * Subscribe to page registry changes
   */
  subscribe(callback: (pages: PageConfig[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Check if user has permission to access page
   */
  hasPermission(pageId: string, userPermissions: string[] = []): boolean {
    const page = this.getPage(pageId);
    if (!page) return false;
    
    if (page.isPublic) return true;
    if (!page.permissions || page.permissions.length === 0) return true;
    
    return page.permissions.some(permission => 
      userPermissions.includes(permission)
    );
  }

  /**
   * Get navigation items for pages
   */
  getNavigationItems(): Array<{
    id: string;
    name: string;
    route: string;
    icon?: LucideIcon;
    category: string;
    permissions?: string[];
  }> {
    return this.getPages().map(page => ({
      id: page.id,
      name: page.name,
      route: page.route,
      icon: page.icon,
      category: page.category,
      permissions: page.permissions
    }));
  }

  private notifySubscribers(): void {
    const pages = this.getPages();
    this.subscribers.forEach(callback => callback(pages));
  }
}

// Create global registry instance
export const pageRegistry = new PageRegistry();

// Helper function to create page configurations
export const createPageConfig = (
  metadata: PageMetadata,
  component: ComponentType<any>,
  options: {
    layout?: PageConfig['layout'];
    preload?: boolean;
  } = {}
): PageConfig => ({
  ...metadata,
  component,
  layout: options.layout || 'default',
  preload: options.preload || false
});