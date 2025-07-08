import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { NavigationConfig, NavigationConfigContextType, NavigationMenu, MenuItem } from '../types/navigation.types';

// Default navigation configuration
const defaultConfig: NavigationConfig = {
  menus: {},
  version: '1.0.0',
  lastModified: new Date().toISOString()
};

const NavigationConfigContext = createContext<NavigationConfigContextType | undefined>(undefined);

interface NavigationConfigProviderProps {
  children: ReactNode;
}

export const NavigationConfigProvider: React.FC<NavigationConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<NavigationConfig>(defaultConfig);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('navigation_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse navigation config:', error);
      }
    }
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem('navigation_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: NavigationConfig) => {
    setConfig({
      ...newConfig,
      lastModified: new Date().toISOString()
    });
  };

  const updateMenu = (menuId: string, menu: NavigationMenu) => {
    setConfig(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [menuId]: menu
      },
      lastModified: new Date().toISOString()
    }));
  };

  const updateMenuItem = (menuId: string, itemId: string, item: MenuItem) => {
    setConfig(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [menuId]: {
          ...prev.menus[menuId],
          items: prev.menus[menuId].items.map(i => 
            i.id === itemId ? item : i
          )
        }
      },
      lastModified: new Date().toISOString()
    }));
  };

  const addMenu = (menu: NavigationMenu) => {
    setConfig(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [menu.id]: menu
      },
      lastModified: new Date().toISOString()
    }));
  };

  const removeMenu = (menuId: string) => {
    setConfig(prev => {
      const { [menuId]: removed, ...remainingMenus } = prev.menus;
      return {
        ...prev,
        menus: remainingMenus,
        lastModified: new Date().toISOString()
      };
    });
  };

  const addMenuItem = (menuId: string, item: MenuItem) => {
    setConfig(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [menuId]: {
          ...prev.menus[menuId],
          items: [...prev.menus[menuId].items, item]
        }
      },
      lastModified: new Date().toISOString()
    }));
  };

  const removeMenuItem = (menuId: string, itemId: string) => {
    setConfig(prev => ({
      ...prev,
      menus: {
        ...prev.menus,
        [menuId]: {
          ...prev.menus[menuId],
          items: prev.menus[menuId].items.filter(i => i.id !== itemId)
        }
      },
      lastModified: new Date().toISOString()
    }));
  };

  const reorderMenus = (sourceIndex: number, destinationIndex: number) => {
    const menuIds = Object.keys(config.menus);
    const [movedId] = menuIds.splice(sourceIndex, 1);
    menuIds.splice(destinationIndex, 0, movedId);
    
    const reorderedMenus: { [key: string]: NavigationMenu } = {};
    menuIds.forEach((id, index) => {
      reorderedMenus[id] = {
        ...config.menus[id],
        position: index
      };
    });

    setConfig(prev => ({
      ...prev,
      menus: reorderedMenus,
      lastModified: new Date().toISOString()
    }));
  };

  const reorderMenuItems = (menuId: string, sourceIndex: number, destinationIndex: number) => {
    setConfig(prev => {
      const menu = prev.menus[menuId];
      const items = [...menu.items];
      const [movedItem] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, movedItem);
      
      // Update positions
      const reorderedItems = items.map((item, index) => ({
        ...item,
        position: index
      }));

      return {
        ...prev,
        menus: {
          ...prev.menus,
          [menuId]: {
            ...menu,
            items: reorderedItems
          }
        },
        lastModified: new Date().toISOString()
      };
    });
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
  };

  const exportConfig = () => {
    return JSON.stringify(config, null, 2);
  };

  const importConfig = (configJson: string): boolean => {
    try {
      const imported = JSON.parse(configJson);
      setConfig({
        ...imported,
        lastModified: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  };

  const value: NavigationConfigContextType = {
    config,
    updateConfig,
    updateMenu,
    updateMenuItem,
    addMenu,
    removeMenu,
    addMenuItem,
    removeMenuItem,
    reorderMenus,
    reorderMenuItems,
    resetToDefaults,
    exportConfig,
    importConfig
  };

  return (
    <NavigationConfigContext.Provider value={value}>
      {children}
    </NavigationConfigContext.Provider>
  );
};

export const useNavigationConfig = (): NavigationConfigContextType => {
  const context = useContext(NavigationConfigContext);
  if (context === undefined) {
    throw new Error('useNavigationConfig must be used within a NavigationConfigProvider');
  }
  return context;
};