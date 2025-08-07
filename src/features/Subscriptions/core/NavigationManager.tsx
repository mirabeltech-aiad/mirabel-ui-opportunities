
/**
 * Navigation Manager - Unified navigation system that adapts to available modules
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { moduleRegistry, ModuleConfig } from './ModuleRegistry';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  route: string;
  icon?: LucideIcon;
  category?: string;
  badge?: string;
  children?: NavigationItem[];
  permissions?: string[];
}

interface NavigationContextType {
  items: NavigationItem[];
  activeItem: string | null;
  setActiveItem: (id: string) => void;
  addNavigationItem: (item: NavigationItem) => void;
  removeNavigationItem: (id: string) => void;
  getNavigationByCategory: (category: string) => NavigationItem[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Convert module config to navigation item
  const moduleToNavigationItem = (module: ModuleConfig): NavigationItem => {
    const iconName = module.icon as keyof typeof Icons;
    const IconComponent = iconName ? Icons[iconName] as LucideIcon : undefined;

    return {
      id: module.id,
      name: module.name,
      route: module.route,
      icon: IconComponent,
      category: module.category,
      permissions: module.permissions
    };
  };

  // Initialize navigation from modules
  useEffect(() => {
    const updateNavigation = (modules: ModuleConfig[]) => {
      const navigationItems = modules.map(moduleToNavigationItem);
      setItems(navigationItems);
    };

    // Initial load
    updateNavigation(moduleRegistry.getModules());

    // Subscribe to module changes
    const unsubscribe = moduleRegistry.subscribe(updateNavigation);
    return unsubscribe;
  }, []);

  // Update active item based on current route
  useEffect(() => {
    const currentItem = items.find(item => 
      location.pathname === item.route || 
      location.pathname.startsWith(item.route + '/')
    );
    
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname, items]);

  const addNavigationItem = (item: NavigationItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeNavigationItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getNavigationByCategory = (category: string) => {
    return items.filter(item => item.category === category);
  };

  const value: NavigationContextType = {
    items,
    activeItem,
    setActiveItem,
    addNavigationItem,
    removeNavigationItem,
    getNavigationByCategory
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
