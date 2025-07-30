
/**
 * Module Registry - Core system for managing application modules
 * Provides dynamic module loading and registration capabilities
 */

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  route: string;
  icon?: string;
  component: React.ComponentType;
  permissions?: string[];
  dependencies?: string[];
  category?: 'analytics' | 'management' | 'reporting' | 'admin';
  enabled?: boolean;
}

export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  tags?: string[];
  lastUpdated?: string;
}

class ModuleRegistry {
  private modules: Map<string, ModuleConfig> = new Map();
  private loadedModules: Set<string> = new Set();
  private listeners: Array<(modules: ModuleConfig[]) => void> = [];

  /**
   * Register a new module
   */
  register(config: ModuleConfig): void {
    // Validate module configuration
    this.validateModule(config);
    
    // Check dependencies
    this.checkDependencies(config);
    
    this.modules.set(config.id, config);
    
    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Get all registered modules
   */
  getModules(): ModuleConfig[] {
    return Array.from(this.modules.values()).filter(module => module.enabled !== false);
  }

  /**
   * Get modules by category
   */
  getModulesByCategory(category: ModuleConfig['category']): ModuleConfig[] {
    return this.getModules().filter(module => module.category === category);
  }

  /**
   * Get module by ID
   */
  getModule(id: string): ModuleConfig | undefined {
    return this.modules.get(id);
  }

  /**
   * Check if module is loaded
   */
  isModuleLoaded(id: string): boolean {
    return this.loadedModules.has(id);
  }

  /**
   * Mark module as loaded
   */
  markAsLoaded(id: string): void {
    this.loadedModules.add(id);
  }

  /**
   * Subscribe to module changes
   */
  subscribe(listener: (modules: ModuleConfig[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private validateModule(config: ModuleConfig): void {
    if (!config.id || !config.name || !config.component) {
      throw new Error('Module must have id, name, and component');
    }
    
    if (this.modules.has(config.id)) {
      throw new Error(`Module with ID ${config.id} already exists`);
    }
  }

  private checkDependencies(config: ModuleConfig): void {
    if (config.dependencies) {
      for (const dep of config.dependencies) {
        if (!this.modules.has(dep)) {
          console.warn(`Module ${config.id} depends on ${dep} which is not registered`);
        }
      }
    }
  }

  private notifyListeners(): void {
    const modules = this.getModules();
    this.listeners.forEach(listener => listener(modules));
  }
}

export const moduleRegistry = new ModuleRegistry();
