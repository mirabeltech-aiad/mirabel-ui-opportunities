
/**
 * Module Loader - Handles dynamic loading and rendering of modules
 */

import React, { Suspense, lazy } from 'react';
import { moduleRegistry, ModuleConfig } from './ModuleRegistry';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ModuleLoaderProps {
  moduleId: string;
  fallback?: React.ComponentType;
  onError?: (error: Error) => void;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ModuleErrorBoundary extends React.Component<
  React.PropsWithChildren<{ moduleId: string; onError?: (error: Error) => void }>,
  ModuleErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ moduleId: string; onError?: (error: Error) => void }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Module ${this.props.moduleId} failed to load:`, error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Module Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 text-sm">
              Failed to load module: {this.props.moduleId}
            </p>
            {this.state.error && (
              <p className="text-red-600 text-xs mt-2 font-mono">
                {this.state.error.message}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

const DefaultModuleFallback: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  </div>
);

export const ModuleLoader: React.FC<ModuleLoaderProps> = ({
  moduleId,
  fallback: CustomFallback,
  onError
}) => {
  const module = moduleRegistry.getModule(moduleId);

  if (!module) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <p className="text-yellow-800">Module not found: {moduleId}</p>
        </CardContent>
      </Card>
    );
  }

  const FallbackComponent = CustomFallback || DefaultModuleFallback;

  return (
    <ModuleErrorBoundary moduleId={moduleId} onError={onError}>
      <Suspense fallback={<FallbackComponent />}>
        <module.component />
      </Suspense>
    </ModuleErrorBoundary>
  );
};

export default ModuleLoader;
