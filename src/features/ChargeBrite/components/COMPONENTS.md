
# Component Library Documentation

Comprehensive documentation of all UI components, custom hooks, and patterns used in the Advanced Analytics Dashboard Platform.

## 🏗️ Architecture Overview

### Component Hierarchy
- **Page Components** - Top-level route components
- **Feature Components** - Business logic containers
- **UI Components** - Reusable interface elements
- **Layout Components** - Structural elements

### Design Patterns
- **Custom Hooks Pattern** - Business logic extraction
- **View Renderer Pattern** - Separate rendering logic
- **Provider Pattern** - Global state management
- **Composition Pattern** - Flexible component composition

## 📊 Analytics Components

### AnalyticsDashboardContent
**Location**: `src/components/analytics/AnalyticsDashboardContent.tsx`
**Purpose**: Main analytics dashboard container with tabbed navigation

```typescript
interface AnalyticsDashboardContentProps {
  // No props - manages internal state
}
```

**Features**:
- Tabbed navigation between analytics sections
- Integrated filter system
- Mock data management
- Lazy loading of content sections

**Usage**:
```tsx
<AnalyticsDashboardContent />
```

### AnalyticsFilters
**Location**: `src/components/analytics/AnalyticsFilters.tsx`
**Purpose**: Connected filter bar for analytics data filtering

```typescript
interface AnalyticsFiltersProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
}
```

**Features**:
- Connected filter bar design
- Period selection with 22+ options
- Product and business unit filtering
- Custom date range picker
- Clear all functionality

### AnalyticsOverviewCards
**Location**: `src/components/analytics/AnalyticsOverviewCards.tsx`
**Purpose**: Key metrics display cards

```typescript
interface AnalyticsOverviewCardsProps {
  overview: AnalyticsOverview;
}
```

**Usage**:
```tsx
<AnalyticsOverviewCards overview={analyticsData} />
```

## 🎯 Filter System Components

### FilterHeader
**Location**: `src/components/filters/FilterHeader.tsx`
**Purpose**: Visual filter icon header section

**Features**:
- Filter icon display
- Consistent styling with connected bar
- 60px minimum width for balanced layout

### PeriodFilter
**Location**: `src/components/filters/PeriodFilter.tsx`
**Purpose**: Period selection dropdown with categorized options

```typescript
interface PeriodFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}
```

**Period Categories**:
- **Recent**: Yesterday, Last 7/14/30 Days
- **Calendar**: This/Last Week/Month/Quarter/Year
- **Extended**: Last 3/6/12 Months, Last 2 Years
- **Special**: All Time

### ProductsFilterSection
**Location**: `src/components/filters/ProductsFilterSection.tsx`
**Purpose**: Multi-select product filtering with badge display

```typescript
interface ProductsFilterSectionProps {
  products: Product[];
  selectedProducts: string[];
  isAllProductsSelected: boolean;
  toggleProduct: (productId: string) => void;
  selectAllProducts: () => void;
}
```

**Features**:
- Badge display with first 2 products shown
- "+X more" indicator for additional selections
- Dropdown with select all functionality

### DateRangeFilterSection
**Location**: `src/components/filters/DateRangeFilterSection.tsx`
**Purpose**: Custom date range picker with calendar interface

```typescript
interface DateRangeFilterSectionProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
}
```

## 🎨 UI Components

### Card System
**Location**: `src/components/ui/card.tsx`
**Purpose**: Flexible card container system

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

**Variants**:
- **Default**: White background with subtle shadow
- **Enhanced**: Stronger shadows with hover effects
- **Ocean Theme**: Ocean color integration

**Usage**:
```tsx
<Card className="p-6">
  <CardHeader>
    <CardTitle>Analytics Overview</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Button System
**Location**: `src/components/ui/button.tsx`
**Purpose**: Consistent button styling with variants

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
```

**Ocean Theme Integration**:
- **Primary**: `bg-ocean-500 hover:bg-ocean-600`
- **Secondary**: `bg-ocean-100 text-ocean-800`
- **Outline**: `border-ocean-500 text-ocean-500`

### Badge System
**Location**: `src/components/ui/badge.tsx`
**Purpose**: Status and category indicators

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

**Design System Colors**:
- **Green**: Positive outcomes (Won, Active)
- **Red**: Negative outcomes (Lost, Inactive)
- **Blue**: Informational states (Open, Processing)
- **Purple**: Key milestones (Proposal, Review)

## 📋 Table Components

### Enhanced Table System
**Location**: `src/components/ui/enhanced-table.tsx`
**Purpose**: Advanced table with sorting, filtering, and column management

**Features**:
- **Drag-and-Drop Reordering**: Column reordering with visual feedback
- **Resizable Columns**: Drag column borders to resize
- **Click-to-Sort**: Ascending/descending sort with visual indicators
- **Persistent Settings**: LocalStorage for column order and widths

**Styling Standards**:
- **Row Height**: `py-2.5` (10px top/bottom padding)
- **Header Height**: `h-11` (44px fixed height)
- **Font Size**: `text-sm` (14px)
- **Hover State**: `hover:bg-gray-50`

### Table Filter Controls
**Purpose**: Connected filter bar for table controls

**Components**:
- **Connected Filter Bar**: Grouped filter controls
- **Connected Table Control Bar**: Table-specific controls
- **Icon-Based Controls**: Refresh, Settings, Sort, View toggles

**Control Icons**:
- Refresh button (RefreshCw)
- Settings button (Settings)
- Sort icon (ArrowUpDown)
- Table view (Table)
- Card view (Grid)

## 🎭 Layout Components

### Navigation
**Location**: `src/components/Navigation.tsx`
**Purpose**: Main application navigation

**Features**:
- **Ocean Gradient Background**: Beautiful blue gradient
- **Height**: `h-14` (56px) for optimal click targets
- **Active States**: White text with `bg-white/20` highlight
- **Responsive**: Collapsible on mobile devices

**Navigation Structure**:
- **Logo Section**: Left-aligned branding
- **Navigation Links**: Center-positioned primary nav
- **Secondary Actions**: Right-aligned settings and user actions

### Tab Navigation
**Purpose**: Tabbed interface for content sections

**Design Standards**:
- **Container Background**: `bg-blue-50`
- **Inactive Tabs**: `text-muted-foreground`
- **Active Tab**: Ocean gradient background with white text
- **Responsive**: Stacked layout on mobile

## 🎣 Custom Hooks Integration

### Data Fetching Hooks

#### useAnalyticsData
**Location**: `src/hooks/useAnalyticsData.ts`
**Purpose**: Analytics data fetching and state management

```typescript
export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getOverview,
    staleTime: 5 * 60 * 1000,
  });
};
```

#### useSubscriptionData
**Location**: `src/hooks/useSubscriptionData.ts`
**Purpose**: Subscription data with filtering support

```typescript
export const useSubscriptions = (filters?: SubscriptionFilters) => {
  const queryKey = ['subscriptions', filters];
  return useQuery({
    queryKey,
    queryFn: () => subscriptionService.getSubscriptions(filters),
  });
};
```

### UI State Hooks

#### useProductFilterLogic
**Location**: `src/components/filters/useProductFilterLogic.ts`
**Purpose**: Filter state coordination and active filter detection

```typescript
interface FilterLogicProps {
  isAllProductsSelected: boolean;
  isAllBusinessUnitsSelected: boolean;
  dateRange?: DateRange;
  onDateRangeChange?: (start?: Date, end?: Date) => void;
  clearSelection: () => void;
}
```

**Features**:
- Period selection management
- Active filter detection
- Clear all functionality
- Date range coordination

#### useTableColumnManager
**Location**: `src/hooks/useTableColumnManager.tsx`
**Purpose**: Dynamic table column management

```typescript
export const useTableColumnManager = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState(initialColumns);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  
  return {
    columns,
    reorderColumns,
    resizeColumn,
    toggleColumn,
    resetColumns
  };
};
```

## 🎨 Styling Patterns

### Ocean Theme Implementation

#### Color Usage Guidelines
```css
/* Primary Actions */
.primary-action {
  @apply bg-ocean-600 hover:bg-ocean-700 text-white;
}

/* Interactive Elements */
.interactive-element {
  @apply bg-ocean-500 hover:bg-ocean-600 border-ocean-500;
}

/* Titles and Headers */
.section-title {
  @apply text-ocean-800 font-bold;
}

/* Supporting Elements */
.supporting-background {
  @apply bg-ocean-100 text-ocean-800;
}
```

#### Card Styling Patterns
```typescript
// Large cards - Pure white backgrounds
const largeCardStyles = "bg-white shadow-sm border border-gray-200";

// Medium cards - Light gray backgrounds
const mediumCardStyles = "bg-gray-50 shadow-sm border border-gray-200";

// Dashboard metric cards
const metricCardStyles = cn(
  "bg-white p-6 rounded-lg shadow-sm",
  "hover:shadow-md transition-shadow duration-200"
);
```

### Dashboard Metric Typography
```typescript
// Title text - Always black
const titleStyles = "text-black font-semibold";

// Metric numbers - Solid colors
const metricStyles = {
  service: "text-purple-600",
  connection: "text-green-600", 
  activity: "text-blue-600",
  time: "text-rose-600"
};

// Subtitle text - Complementary pastels
const subtitleStyles = {
  service: "text-purple-300",
  connection: "text-green-300",
  activity: "text-blue-300", 
  time: "text-rose-300"
};
```

### Responsive Design Patterns
```typescript
// Grid layouts with breakpoint progression
const responsiveGrid = cn(
  "grid grid-cols-1",           // Mobile: Single column
  "md:grid-cols-2",             // Tablet: Two columns
  "lg:grid-cols-3",             // Desktop: Three columns
  "xl:grid-cols-4",             // Large: Four columns
  "gap-6"
);

// Navigation responsive behavior
const navStyles = cn(
  "flex items-center justify-between",
  "px-4 py-3",                  // Mobile padding
  "lg:px-6 lg:py-4",            // Desktop padding
  "bg-ocean-gradient"
);
```

## 🚀 Performance Optimizations

### Lazy Loading Implementation
```typescript
// Component lazy loading
const LazyAnalyticsChart = React.lazy(() => 
  import('./AnalyticsChart').then(module => ({ 
    default: module.AnalyticsChart 
  }))
);

// Usage with Suspense
<Suspense fallback={<Skeleton className="h-64" />}>
  <LazyAnalyticsChart data={chartData} />
</Suspense>
```

### Memoization Patterns
```typescript
// Component memoization
const AnalyticsCard = React.memo<AnalyticsCardProps>(({ title, value }) => {
  const formattedValue = useMemo(() => 
    formatCurrency(value), [value]
  );
  
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardContent>{formattedValue}</CardContent>
    </Card>
  );
});

// Hook memoization
const useOptimizedData = (filters: Filters) => {
  return useMemo(() => 
    processAnalyticsData(rawData, filters), 
    [rawData, filters]
  );
};
```

## 🧪 Component Testing Patterns

### Component Testing
```typescript
describe('AnalyticsCard', () => {
  it('renders title and formatted value', () => {
    render(
      <AnalyticsCard title="Revenue" value={1250000} />
    );
    
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,250,000')).toBeInTheDocument();
  });
  
  it('handles click interactions', () => {
    const handleClick = jest.fn();
    render(
      <AnalyticsCard 
        title="Revenue" 
        value={1250000} 
        onClick={handleClick} 
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Testing
```typescript
describe('useAnalyticsData', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useAnalyticsData());
    expect(result.current.isLoading).toBe(true);
  });
  
  it('handles successful data fetch', async () => {
    mockApiSuccess(mockAnalyticsData);
    const { result } = renderHook(() => useAnalyticsData());
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockAnalyticsData);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

## 📖 Usage Examples

### Creating a New Analytics Component
```typescript
// 1. Create the component with proper typing
interface NewAnalyticsComponentProps {
  data: AnalyticsData;
  onUpdate?: (data: AnalyticsData) => void;
}

// 2. Extract business logic to custom hook
const useNewAnalyticsLogic = (data: AnalyticsData) => {
  const processedData = useMemo(() => 
    processAnalyticsData(data), [data]
  );
  
  return { processedData };
};

// 3. Create the component
const NewAnalyticsComponent: React.FC<NewAnalyticsComponentProps> = ({ 
  data, 
  onUpdate 
}) => {
  const { processedData } = useNewAnalyticsLogic(data);
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-ocean-800">
          Analytics Component
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
};
```

### Integrating with Filter System
```typescript
// 1. Use ProductFilterContext for global state
const { selectedProducts, selectedBusinessUnits } = useProductFilter();

// 2. Create filtered data query
const { data: filteredData } = useAnalyticsData({
  products: selectedProducts,
  businessUnits: selectedBusinessUnits
});

// 3. Handle loading and error states
if (isLoading) return <Skeleton className="h-64" />;
if (error) return <ErrorBoundary error={error} />;
```

This component library documentation provides comprehensive guidance for understanding, using, and extending the components in the Advanced Analytics Dashboard Platform. Follow these patterns for consistent, maintainable component development.
