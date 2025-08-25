
// Admin-related type definitions
export interface ComponentInfo {
  name: string;
  size: number;
  complexity: 'low' | 'medium' | 'high';
  status: 'healthy' | 'needs-attention' | 'needs-refactor';
  path?: string;
  dependencies?: string[];
  lastModified?: string;
}

export interface ComponentCategory {
  name: string;
  count: number;
  avgSize: number;
  health: 'excellent' | 'good' | 'needs-attention' | 'poor';
  components: ComponentInfo[];
}

export interface ComponentInventoryStats {
  totalComponents: number;
  totalLOC: number;
  avgComponentSize: number;
  largeComponents: number;
  mediumComponents: number;
  smallComponents: number;
}

export interface AdminTabProps {
  className?: string;
}

export type FilterType = 'all' | 'large' | 'needs-attention' | 'healthy';
export type HealthStatus = ComponentCategory['health'];
export type ComponentStatus = ComponentInfo['status'];
export type ComponentComplexity = ComponentInfo['complexity'];
