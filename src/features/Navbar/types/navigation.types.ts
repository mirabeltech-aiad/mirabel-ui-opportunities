export interface Badge {
  type: 'new' | 'beta' | 'priority' | 'special';
  text?: string;
  color?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  component?: string;
  url?: string;
  iframeUrl?: string;
  visible: boolean;
  position: number;
  badges: Badge[];
  parentId?: string;
  children?: MenuItem[];
}

export interface NavigationMenu {
  id: string;
  name: string;
  position: number;
  visible: boolean;
  items: MenuItem[];
}

export interface NavigationConfig {
  menus: {
    [menuId: string]: NavigationMenu;
  };
  version: string;
  lastModified: string;
}

export interface NavigationConfigContextType {
  config: NavigationConfig;
  updateConfig: (config: NavigationConfig) => void;
  updateMenu: (menuId: string, menu: NavigationMenu) => void;
  updateMenuItem: (menuId: string, itemId: string, item: MenuItem) => void;
  addMenu: (menu: NavigationMenu) => void;
  removeMenu: (menuId: string) => void;
  addMenuItem: (menuId: string, item: MenuItem) => void;
  removeMenuItem: (menuId: string, itemId: string) => void;
  reorderMenus: (sourceIndex: number, destinationIndex: number) => void;
  reorderMenuItems: (menuId: string, sourceIndex: number, destinationIndex: number) => void;
  resetToDefaults: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;
}