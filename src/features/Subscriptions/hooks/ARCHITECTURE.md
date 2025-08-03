
# System Architecture Overview

Comprehensive documentation of the Advanced Analytics Dashboard Platform architecture, focusing on custom hooks patterns, component hierarchy, and system design principles.

## 🏗️ Architectural Philosophy

### Core Principles
- **Separation of Concerns** - UI logic separated from business logic
- **Reusability** - Components and hooks designed for maximum reuse
- **Performance** - Optimized for minimal re-renders and fast loading
- **Maintainability** - Clear structure with predictable patterns
- **Scalability** - Architecture supports growth and feature addition

### Architecture Layers
1. **Presentation Layer** - React components and UI elements
2. **Business Logic Layer** - Custom hooks and state management
3. **Data Layer** - API services and data fetching
4. **Infrastructure Layer** - Build tools, routing, and configuration

## 🏭 Custom Hooks Architecture (v1.1.0)

### Design Pattern Benefits
- **Testability** - Business logic can be tested independently
- **Reusability** - Hooks can be shared across multiple components
- **Maintainability** - Logic changes isolated to hooks
- **Performance** - Optimized caching and state management

### Hook Categories

#### Data Management Hooks
**Purpose**: Handle API calls, caching, and data transformation

```typescript
// Data fetching pattern
export const useAnalyticsData = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsService.getAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Multi-endpoint orchestration (moved to features/analytics/hooks)
// See: src/features/analytics/hooks/useAnalyticsDataOrchestrator.ts
  const segmentsQuery = useBehavioralSegments();
  
  return {
    overview: overviewQuery,
    demographics: demographicsQuery,
    segments: segmentsQuery,
    isLoading: overviewQuery.isLoading || demographicsQuery.isLoading,
    hasError: overviewQuery.error || demographicsQuery.error
  };
};
```

#### State Management Hooks
**Purpose**: Handle complex state logic and user interactions

```typescript
// Filter state management
export const useProductFilterLogic = (props: FilterLogicProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  
  const hasActiveFilters = useMemo(() => {
    return !props.isAllProductsSelected || 
           !props.isAllBusinessUnitsSelected ||
           selectedPeriod !== 'last_30_days' ||
           Boolean(props.dateRange?.startDate);
  }, [props.isAllProductsSelected, props.isAllBusinessUnitsSelected, 
      selectedPeriod, props.dateRange]);
  
  const handleClearAll = useCallback(() => {
    setSelectedPeriod('last_30_days');
    props.clearSelection();
    props.onDateRangeChange?.(undefined, undefined);
  }, [props.clearSelection, props.onDateRangeChange]);
  
  return {
    selectedPeriod,
    hasActiveFilters,
    handleClearAll,
    handlePeriodChange: setSelectedPeriod
  };
};
```

#### UI State Hooks
**Purpose**: Manage component-specific UI state and interactions

```typescript
// Table management hook
export const useTableColumnManager = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState(initialColumns);
  const [columnOrder, setColumnOrder] = useLocalStorage('columnOrder', []);
  const [columnWidths, setColumnWidths] = useLocalStorage('columnWidths', {});
  
  const reorderColumns = useCallback((dragIndex: number, dropIndex: number) => {
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(dragIndex, 1);
    newColumns.splice(dropIndex, 0, draggedColumn);
    setColumns(newColumns);
  }, [columns]);
  
  return {
    columns,
    reorderColumns,
    resizeColumn,
    toggleColumn,
    resetColumns
  };
};
```

## 📊 Data Flow Architecture

### Data Flow Patterns

#### Unidirectional Data Flow
```
API Services → Custom Hooks → Components → User Interface
     ↑              ↓              ↓
User Actions → Event Handlers → State Updates
```

#### State Management Flow
```
Global Context → Filter State → Data Queries → Component Props
     ↓                ↓              ↓              ↓
User Interactions → Filter Updates → Query Refetch → UI Re-render
```

### Context Providers Architecture

#### ProductFilterContext
**Purpose**: Global filter state management across components

```typescript
interface ProductFilterContextType {
  // Product management
  products: Product[];
  selectedProducts: string[];
  isAllProductsSelected: boolean;
  toggleProduct: (productId: string) => void;
  selectAllProducts: () => void;
  
  // Business unit management
  businessUnits: BusinessUnit[];
  selectedBusinessUnits: string[];
  isAllBusinessUnitsSelected: boolean;
  toggleBusinessUnit: (unitId: string) => void;
  selectAllBusinessUnits: () => void;
  
  // General actions
  clearSelection: () => void;
}
```

**Provider Structure**:
```typescript
export const ProductFilterProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState<string[]>([]);
  
  // Business logic implementation
  const contextValue = useMemo(() => ({
    // ... all context values
  }), [selectedProducts, selectedBusinessUnits, products, businessUnits]);
  
  return (
    <ProductFilterContext.Provider value={contextValue}>
      {children}
    </ProductFilterContext.Provider>
  );
};
```

## 🎯 Component Hierarchy

### Page-Level Architecture
```
App
├── Navigation
├── Router
│   ├── AnalyticsDashboard
│   │   ├── AnalyticsDashboardContent
│   │   │   ├── AnalyticsFilters
│   │   │   ├── AnalyticsTabNavigation
│   │   │   └── TabsContent
│   │   │       ├── AnalyticsOverviewCards
│   │   │       ├── SubscriberDemographics
│   │   │       └── ...other analytics components
│   │   └── ScrollToTopButton
│   ├── CirculationDashboard
│   └── Reports
└── Providers
    ├── ProductFilterProvider
    ├── HelpContextProvider
    └── QueryClient
```

### Component Composition Patterns

#### Container/Presenter Pattern
```typescript
// Container Component (Logic)
const AnalyticsContainer = () => {
  const { data, isLoading, error } = useAnalyticsData();
  const { filters, updateFilter } = useFilterLogic();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorBoundary error={error} />;
  
  return (
    <AnalyticsPresenter 
      data={data} 
      filters={filters}
      onFilterChange={updateFilter}
    />
  );
};

// Presenter Component (UI)
const AnalyticsPresenter = ({ data, filters, onFilterChange }) => {
  return (
    <div className="analytics-dashboard">
      <AnalyticsFilters filters={filters} onChange={onFilterChange} />
      <AnalyticsCards data={data} />
      <AnalyticsCharts data={data} />
    </div>
  );
};
```

#### Compound Component Pattern
```typescript
// Compound component with sub-components
const Card = ({ children, className }) => (
  <div className={cn("card-base", className)}>
    {children}
  </div>
);

Card.Header = ({ children }) => (
  <div className="card-header">{children}</div>
);

Card.Title = ({ children }) => (
  <h3 className="card-title">{children}</h3>
);

Card.Content = ({ children }) => (
  <div className="card-content">{children}</div>
);

// Usage
<Card>
  <Card.Header>
    <Card.Title>Analytics Overview</Card.Title>
  </Card.Header>
  <Card.Content>
    {/* Card content */}
  </Card.Content>
</Card>
```

## 🚀 Performance Architecture

### Optimization Strategies

#### Code Splitting Architecture
```typescript
// Route-based code splitting
const AnalyticsDashboard = lazy(() => 
  import('../pages/AnalyticsDashboard').then(module => ({
    default: module.AnalyticsDashboardPage
  }))
);

// Component-based code splitting
const LazyAnalyticsChart = lazy(() =>
  import('./AnalyticsChart')
);

// Feature-based code splitting
const LazyReportsSection = lazy(() =>
  import('../components/reports').then(module => ({
    default: module.ReportsDirectory
  }))
);
```

#### Caching Strategy
```typescript
// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      }
    }
  }
});

// Hook-level caching
export const useAnalyticsData = (filters) => {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsService.getAnalytics(filters),
    select: (data) => transformAnalyticsData(data), // Data transformation
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(filters) // Conditional fetching
  });
};
```

#### Memoization Architecture
```typescript
// Component memoization strategy
const OptimizedAnalyticsCard = React.memo(
  ({ title, value, trend, onClick }) => {
    const formattedValue = useMemo(() => 
      formatCurrency(value), [value]
    );
    
    const handleClick = useCallback(() => {
      onClick?.(title, value);
    }, [onClick, title, value]);
    
    return (
      <Card onClick={handleClick}>
        <CardTitle>{title}</CardTitle>
        <CardValue>{formattedValue}</CardValue>
        <TrendIndicator trend={trend} />
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for optimization
    return prevProps.value === nextProps.value &&
           prevProps.trend === nextProps.trend;
  }
);
```

## 🔗 Integration Patterns

### API Integration Architecture
```typescript
// Service layer abstraction
class AnalyticsService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  async getAnalyticsOverview(filters?: AnalyticsFilters): Promise<AnalyticsOverview> {
    const response = await this.apiClient.get('/analytics/overview', {
      params: filters
    });
    return transformAnalyticsOverview(response.data);
  }
  
  async getSubscriberDemographics(filters?: DemographicFilters): Promise<Demographics> {
    const response = await this.apiClient.get('/analytics/demographics', {
      params: filters
    });
    return transformDemographics(response.data);
  }
}

// Hook integration
export const useAnalyticsOverview = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ['analytics', 'overview', filters],
    queryFn: () => analyticsService.getAnalyticsOverview(filters),
    staleTime: 5 * 60 * 1000
  });
};
```

### Event Handling Architecture
```typescript
// Event aggregation pattern
export const useAnalyticsEvents = () => {
  const trackFilterChange = useCallback((filterType: string, value: any) => {
    analyticsService.trackEvent('filter_change', {
      filterType,
      value,
      timestamp: Date.now()
    });
  }, []);
  
  const trackChartInteraction = useCallback((chartType: string, action: string) => {
    analyticsService.trackEvent('chart_interaction', {
      chartType,
      action,
      timestamp: Date.now()
    });
  }, []);
  
  return {
    trackFilterChange,
    trackChartInteraction
  };
};
```

## 🛡️ Error Handling Architecture

### Error Boundary Strategy
```typescript
// Global error boundary
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Global error caught:', error, errorInfo);
    // Send to error reporting service
    errorReportingService.captureException(error, {
      contexts: { errorInfo }
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

// Hook-level error handling
export const useAnalyticsData = (filters) => {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsService.getAnalytics(filters),
    onError: (error) => {
      console.error('Analytics data fetch failed:', error);
      toast.error('Failed to load analytics data');
    },
    retry: (failureCount, error) => {
      if (error.status === 401) {
        // Redirect to login
        window.location.href = '/login';
        return false;
      }
      return failureCount < 3;
    }
  });
};
```

## 🔐 Security Architecture

### Data Validation Strategy
```typescript
// Input validation with Zod
const analyticsFiltersSchema = z.object({
  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional()
  }).optional(),
  productIds: z.array(z.string()).optional(),
  businessUnitIds: z.array(z.string()).optional()
});

// Hook with validation
export const useAnalyticsData = (filters: AnalyticsFilters) => {
  const validatedFilters = useMemo(() => {
    try {
      return analyticsFiltersSchema.parse(filters);
    } catch (error) {
      console.warn('Invalid filters provided:', error);
      return {};
    }
  }, [filters]);
  
  return useQuery({
    queryKey: ['analytics', validatedFilters],
    queryFn: () => analyticsService.getAnalytics(validatedFilters)
  });
};
```

### Authentication Integration
```typescript
// Auth context integration
export const useAuthenticatedQuery = (queryKey, queryFn, options = {}) => {
  const { isAuthenticated, token } = useAuth();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      return queryFn();
    },
    enabled: isAuthenticated,
    ...options
  });
};
```

## 📈 Scalability Considerations

### Modular Architecture
- **Feature Modules** - Self-contained feature directories
- **Shared Components** - Reusable UI component library
- **Service Layer** - Abstracted API interactions
- **Hook Library** - Reusable business logic hooks

### Bundle Optimization
- **Tree Shaking** - Eliminate unused code
- **Code Splitting** - Load components on demand
- **Dynamic Imports** - Runtime module loading
- **Asset Optimization** - Optimized images and fonts

### Development Workflow
- **Component Isolation** - Storybook for component development
- **Testing Strategy** - Unit, integration, and E2E testing
- **Documentation** - Living documentation with examples
- **Type Safety** - Comprehensive TypeScript coverage

This architecture documentation provides a comprehensive overview of the system design principles, patterns, and implementation strategies used in the Advanced Analytics Dashboard Platform. The custom hooks pattern introduced in v1.1.0 provides a solid foundation for scalable, maintainable, and performant React applications.
