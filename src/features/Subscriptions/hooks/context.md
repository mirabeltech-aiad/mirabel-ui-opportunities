
# Project Context for AI Development

Comprehensive project context documentation for AI-assisted development, including component relationships, architecture patterns, development guidelines, and current feature status.

## 🚀 Project Overview

### Advanced Analytics Dashboard Platform
A sophisticated React-based analytics platform designed for newspaper publishers and media companies to analyze circulation data, subscriber behavior, revenue metrics, and operational performance.

**Current Version**: v1.1.0 - Custom Hooks Architecture
**Technology Stack**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query
**Architecture Pattern**: Custom Hooks + Component Separation
**Design System**: Ocean Theme with comprehensive color palette

## 🏗️ Architecture Context

### Current State (v1.1.0)
The platform underwent major architectural refactoring to implement the custom hooks pattern, separating business logic from UI components.

#### Key Architectural Decisions
1. **Business Logic Extraction** - All data fetching and state management moved to custom hooks
2. **Component Size Optimization** - Maximum 50 lines per component enforced
3. **Performance Focus** - Lazy loading, memoization, and optimized re-rendering
4. **Design System Integration** - Ocean theme consistently applied across all components

#### Component Hierarchy
```
App Layer
├── Providers (ProductFilterProvider, HelpContext)
├── Navigation (Ocean gradient theme)
├── Pages (Analytics, Circulation, Reports)
│   ├── Dashboard Content Components
│   ├── Filter Systems (Connected filter bars)
│   └── Feature-Specific Components
└── Shared UI Components (Cards, Buttons, Tables)
```

### Custom Hooks System

#### Data Management Hooks
- `useAnalyticsData` - Analytics metrics and insights
- `useSubscriptionData` - Subscription lifecycle management  
- `useRevenueData` - Financial performance analytics
- `useCirculationData` - Circulation metrics and trends
- `useCostAnalytics` - Cost analysis and optimization

#### State Management Hooks
- `useProductFilterLogic` - Filter state coordination
- `useTableColumnManager` - Dynamic table management
- `useAnalyticsDataOrchestrator` - Multi-endpoint data coordination (moved to features/analytics/hooks)
- `useApiOrchestration` - Optimized API call timing

#### UI Enhancement Hooks
- `useResponsiveDesign` - Screen size handling
- `usePerformanceTracking` - Performance monitoring
- `useLocalStorage` - Persistent settings

## 🎨 Design System Context

### Ocean Theme Implementation
The platform uses a comprehensive ocean-themed design system built around blue tones.

#### Core Color Usage
- **Primary Actions**: ocean-600 (#0284c7) - Save buttons, main CTAs
- **Interactive Elements**: ocean-500 (#0ea5e9) - Buttons, controls
- **Headers/Titles**: ocean-800 (#075985) - All section titles and headers
- **Supporting Elements**: ocean-100 (#e0f2fe) - Background accents

#### Component Styling Standards
- **Large Cards**: Pure white backgrounds with hover glow effects
- **Medium Cards**: Light gray (gray-50) backgrounds
- **Dashboard Metrics**: Black titles with solid color numbers
- **Connected Filters**: Seamless border integration

#### Responsive Design
- **Mobile First**: All components designed for mobile, enhanced for desktop
- **Touch Targets**: Minimum 44px for interactive elements
- **Grid Systems**: 1/2/3/4 column progression across breakpoints

## 📊 Feature Implementation Status

### Completed Features (v1.1.0)

#### Analytics Dashboard
- ✅ Analytics overview with key metrics
- ✅ Subscriber demographics analysis
- ✅ Behavioral segmentation charts
- ✅ Churn prediction modeling
- ✅ Lifetime value calculations
- ✅ Cost analytics overview
- ✅ Connected filter system integration

#### Circulation Management
- ✅ Circulation overview dashboard
- ✅ Interactive trends charts with lazy loading
- ✅ Growth metrics tracking
- ✅ Geographic distribution maps
- ✅ Subscription lifecycle visualization
- ✅ Revenue analytics integration

#### Filter System
- ✅ Connected filter bar design
- ✅ Period selection (22+ options across 4 categories)
- ✅ Product multi-select with badge display
- ✅ Business unit filtering
- ✅ Custom date range picker
- ✅ Clear all functionality
- ✅ Real-time data coordination

#### Reports System
- ✅ 40+ predefined report types
- ✅ Category-based organization
- ✅ Search and filtering capabilities
- ✅ Mock data integration
- ✅ Report card components

### In Progress Features

#### Enhanced Analytics
- 🔄 Real-time data streaming (WebSocket integration planned)
- 🔄 Advanced filtering with query builder
- 🔄 Export functionality (PDF/CSV with charts)
- 🔄 Collaborative features (shared dashboards)

#### Performance Optimizations
- 🔄 Progressive Web App capabilities
- 🔄 Offline support and caching
- 🔄 Advanced lazy loading strategies
- 🔄 Bundle size optimization

### Planned Features (Future Versions)

#### v1.2.0 - Advanced Analytics
- 📋 AI-powered insights and recommendations
- 📋 Machine learning integration
- 📋 Advanced query builder
- 📋 Real-time collaboration features

#### v1.3.0 - Enterprise Features
- 📋 Multi-tenant architecture
- 📋 Role-based access control
- 📋 White-label customization
- 📋 Third-party integrations

## 🔧 Development Patterns

### Component Creation Guidelines

#### Standard Component Structure
```typescript
// 1. Imports and types
import React from 'react';
import { ComponentProps } from './types';
import { useComponentLogic } from './hooks/useComponentLogic';

// 2. Component definition (max 50 lines)
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  const { state, handlers } = useComponentLogic({ prop1, prop2 });
  
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};

export default Component;
```

#### Custom Hook Pattern
```typescript
// Business logic extraction
export const useComponentLogic = (props: ComponentProps) => {
  const [state, setState] = useState(initialState);
  
  const handleAction = useCallback(() => {
    // Business logic here
  }, [dependencies]);
  
  const computedValue = useMemo(() => {
    return expensiveCalculation(state);
  }, [state]);
  
  return {
    state,
    handlers: { handleAction },
    computed: { computedValue }
  };
};
```

### Data Fetching Patterns

#### Standard Query Hook
```typescript
export const useFeatureData = (filters?: FeatureFilters) => {
  return useQuery({
    queryKey: ['feature', filters],
    queryFn: () => featureService.getData(filters),
    staleTime: 5 * 60 * 1000,    // 5 minutes
    cacheTime: 10 * 60 * 1000,   // 10 minutes
    enabled: Boolean(filters)     // Conditional execution
  });
};
```

#### Orchestrated Data Loading
```typescript
export const useFeatureDataOrchestrator = () => {
  const overviewQuery = useFeatureOverview();
  const detailsQuery = useFeatureDetails();
  const analyticsQuery = useFeatureAnalytics();
  
  return {
    overview: overviewQuery,
    details: detailsQuery,
    analytics: analyticsQuery,
    isLoading: overviewQuery.isLoading || detailsQuery.isLoading,
    hasError: overviewQuery.error || detailsQuery.error
  };
};
```

## 🎯 Component Relationships

### Filter System Integration
The filter system is deeply integrated across all dashboard sections:

```
ProductFilterContext (Global State)
├── AnalyticsFilters (Analytics Dashboard)
├── CirculationFilters (Circulation Dashboard) 
├── ReportsFilters (Reports Section)
└── Individual Components
    ├── PeriodFilter (Period selection)
    ├── ProductsFilterSection (Product filtering)
    ├── BusinessUnitsFilterSection (Unit filtering)
    └── DateRangeFilterSection (Custom dates)
```

### Data Flow Relationships
```
Service Layer → Custom Hooks → Components → UI
     ↑              ↓              ↓       ↓
Context State → Filter Logic → Data Queries → Rendered Output
```

### Lazy Loading Strategy
```
Page Component
├── Immediate Load (Critical UI)
├── Deferred Load (Secondary content)
└── On-Demand Load (Heavy charts/tables)
    ├── React.lazy() components
    ├── Intersection Observer hooks
    └── Suspense boundaries with skeletons
```

## 🚨 Common Development Scenarios

### Adding a New Analytics Component
1. **Create Hook First**: Extract business logic to custom hook
2. **Component Structure**: Follow 50-line maximum guideline
3. **Filter Integration**: Connect to ProductFilterContext if needed
4. **Styling**: Use ocean theme colors consistently
5. **Performance**: Implement lazy loading if heavy
6. **Testing**: Write hook tests separately from component tests

### Implementing New Filter Types
1. **Filter Section Component**: Create dedicated filter section
2. **Context Integration**: Add to ProductFilterContext
3. **Logic Hook**: Create useFilterLogic hook for coordination
4. **Connected Design**: Maintain visual connection with filter bar
5. **Persistence**: Consider localStorage for user preferences

### Adding New Dashboard Sections
1. **Page Component**: Create main dashboard container
2. **Content Components**: Break into focused sub-components
3. **Navigation Integration**: Add tab to navigation system
4. **Filter System**: Implement section-specific filters
5. **Data Orchestration**: Create orchestrator hook for multiple endpoints

## 📈 Performance Considerations

### Current Optimizations
- **Lazy Loading**: Route and component-based code splitting
- **Memoization**: React.memo, useMemo, useCallback usage
- **Query Optimization**: TanStack Query with proper caching
- **Bundle Optimization**: Tree shaking and dynamic imports

### Performance Metrics (v1.1.0)
- Initial Load Time: ~1.9 seconds (40% improvement from v1.0.0)
- Re-render Count: ~60 per filter change (60% reduction)
- Bundle Size: 2.1MB compressed (25% reduction)
- Time to Interactive: ~2.4 seconds (42% improvement)

### Performance Guidelines
1. **Component Size**: Keep components under 50 lines
2. **Hook Extraction**: Move complex logic to custom hooks
3. **Lazy Loading**: Use React.lazy for heavy components
4. **Memoization**: Memoize expensive calculations and stable references
5. **Query Optimization**: Use proper stale times and cache management

## 🧪 Testing Strategy

### Current Testing Approach
- **Hook Testing**: Business logic tested independently
- **Component Testing**: UI behavior and rendering
- **Integration Testing**: Filter coordination and data flow
- **Performance Testing**: Bundle size and render performance

### Testing Patterns
```typescript
// Hook testing
describe('useAnalyticsData', () => {
  it('should handle loading states', () => {
    const { result } = renderHook(() => useAnalyticsData());
    expect(result.current.isLoading).toBe(true);
  });
});

// Component testing  
describe('AnalyticsCard', () => {
  it('should render with proper styling', () => {
    render(<AnalyticsCard title="Test" value={1000} />);
    expect(screen.getByText('Test')).toHaveClass('text-ocean-800');
  });
});
```

## 🔮 AI Development Guidelines

### When Contributing to This Project

#### Understand Current Patterns
1. **Review Architecture**: Understand custom hooks separation
2. **Follow Styling**: Use ocean theme colors consistently
3. **Component Size**: Respect 50-line maximum guideline
4. **Performance**: Consider lazy loading and memoization
5. **Filter Integration**: Connect to existing filter systems

#### Common Tasks and Approaches
1. **New Components**: Create hook first, then component
2. **Styling Issues**: Use established design tokens
3. **Performance Problems**: Check for missing memoization
4. **Filter Issues**: Verify context integration
5. **Data Problems**: Check hook implementation and caching

#### Code Quality Standards
1. **TypeScript**: Strict mode with proper interfaces
2. **Naming**: Descriptive, consistent naming conventions
3. **Documentation**: JSDoc comments for complex logic
4. **Testing**: Write tests for both hooks and components
5. **Accessibility**: Ensure WCAG compliance

### Project-Specific Considerations
- **Ocean Theme**: Always use ocean color palette
- **Filter Coordination**: Maintain real-time filter synchronization
- **Performance**: Prioritize loading speed and responsiveness
- **Mobile Experience**: Ensure touch-friendly interactions
- **Component Isolation**: Keep components focused and reusable

This project context provides comprehensive guidance for AI-assisted development, ensuring consistency with established patterns, architecture decisions, and quality standards.
