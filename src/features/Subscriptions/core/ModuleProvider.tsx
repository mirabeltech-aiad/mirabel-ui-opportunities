
/**
 * Module Provider - Central provider for module system
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { moduleRegistry, ModuleConfig } from './ModuleRegistry';
import { PerformanceAnalytics } from '../utils/performanceAnalytics';

interface ModuleContextType {
  modules: ModuleConfig[];
  loadedModules: string[];
  loadModule: (moduleId: string) => Promise<void>;
  unloadModule: (moduleId: string) => void;
  isModuleLoaded: (moduleId: string) => boolean;
  getModulesByCategory: (category: string) => ModuleConfig[];
  registerModule: (config: ModuleConfig) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule must be used within ModuleProvider');
  }
  return context;
};

interface ModuleProviderProps {
  children: React.ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [loadedModules, setLoadedModules] = useState<string[]>([]);

  useEffect(() => {
    PerformanceAnalytics.startMeasurement('Module system initialization');
    
    // Subscribe to module registry changes
    const unsubscribe = moduleRegistry.subscribe((newModules) => {
      setModules(newModules);
      PerformanceAnalytics.markStep(`Loaded ${newModules.length} modules`);
    });

    // Initial load
    setModules(moduleRegistry.getModules());
    
    PerformanceAnalytics.endMeasurement('Module system initialization');
    
    return unsubscribe;
  }, []);

  const loadModule = async (moduleId: string): Promise<void> => {
    if (loadedModules.includes(moduleId)) {
      return;
    }

    PerformanceAnalytics.startMeasurement(`Loading module: ${moduleId}`);
    
    try {
      // Mark as loaded
      moduleRegistry.markAsLoaded(moduleId);
      setLoadedModules(prev => [...prev, moduleId]);
      
      PerformanceAnalytics.endMeasurement(`Loading module: ${moduleId}`);
    } catch (error) {
      PerformanceAnalytics.endMeasurement(`Loading module: ${moduleId}`);
      console.error(`Failed to load module: ${moduleId}`, error);
      throw error;
    }
  };

  const unloadModule = (moduleId: string) => {
    setLoadedModules(prev => prev.filter(id => id !== moduleId));
  };

  const isModuleLoaded = (moduleId: string): boolean => {
    return loadedModules.includes(moduleId);
  };

  const getModulesByCategory = (category: string): ModuleConfig[] => {
    return modules.filter(module => module.category === category);
  };

  const registerModule = (config: ModuleConfig) => {
    moduleRegistry.register(config);
  };

  const value: ModuleContextType = {
    modules,
    loadedModules,
    loadModule,
    unloadModule,
    isModuleLoaded,
    getModulesByCategory,
    registerModule
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};
