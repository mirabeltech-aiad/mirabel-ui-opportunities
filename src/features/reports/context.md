# Reports Feature Documentation

## Purpose and Overview

The Reports feature provides a comprehensive interface for browsing, searching, and managing various business reports. It includes functionality for:

- Displaying reports in a card-based grid layout
- Filtering reports by categories (All, Favorites, Revenue Reports, etc.)
- Searching reports by title, description, or tags
- Starring/favoriting reports for quick access with real-time API updates
- Responsive design that works across different screen sizes

## Folder Structure

```
src/features/reports/
├── components/          # UI components specific to reports
│   ├── ReportsDirectory.jsx    # Main container component
│   ├── ReportCard.jsx         # Individual report card display
│   ├── SearchBar.jsx          # Search input component
│   ├── TabNavigation.jsx      # Category filter tabs
│   └── index.js              # Component exports
├── context/             # State management
│   ├── Context.js            # Defines the React context and useReportsContext hook
│   ├── ReportsProvider.jsx   # Context provider with React Query integration
│   ├── actions.js            # Action creators and types
│   ├── reducer.js            # State reducer function
│   ├── initialState.js       # Initial state definition
│   └── index.js              # Context exports
├── hooks/               # Custom hooks
│   ├── useService.js         # React Query hooks for API calls
│   └── index.js              # Hook exports
├── helpers/             # Utility functions
│   ├── constants.js          # Feature-specific constants
│   ├── formatters.js         # Data formatting utilities
│   └── reportsData.js        # Static reports data
├── services/            # API integration
│   └── reportsApi.js         # API service functions
├── context.md           # This documentation file
└── index.jsx            # Feature entry point
```

## Component and API Usage

### Main Components

#### ReportsDirectory
The main container component that orchestrates the entire reports interface:
```jsx
import ReportsFeature from '@/features/reports';

// Usage
<ReportsFeature />
```

#### ReportCard
Individual report display component with star toggle functionality:
```jsx
import { ReportCard } from '@/features/reports/components';

<ReportCard 
  report={reportObject} 
  onToggleStar={handleToggleStar}
  isUpdatingStar={isUpdatingStar}
/>
```

#### SearchBar
Search input component:
```jsx
import { SearchBar } from '@/features/reports/components';

<SearchBar 
  searchQuery={query} 
  setSearchQuery={setQuery} 
/>
```

#### TabNavigation
Category filter component:
```jsx
import { TabNavigation } from '@/features/reports/components';

<TabNavigation 
  categories={categoriesArray}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  tabCounts={countsObject}
/>
```

### Custom Hooks

#### useReportsDashboard
React Query hook for fetching reports data:
```jsx
import { useReportsDashboard } from '@/features/reports/hooks';

const { data, isLoading, error } = useReportsDashboard();
```

#### useUpdateReportStar
React Query mutation hook for updating report star status:
```jsx
import { useUpdateReportStar, prepareStarTogglePayload } from '@/features/reports/hooks';

const { mutate: updateStarStatus, isPending: isUpdatingStar } = useUpdateReportStar();

// Usage
const payload = prepareStarTogglePayload(report, true);
updateStarStatus(payload);
```

#### useReportsContext
Main hook for reports state management:
```jsx
import { useReportsContext } from '@/features/reports/context';

const {
  reports,
  filteredReports,
  activeTab,
  searchQuery,
  tabCounts,
  loading,
  error,
  isUpdatingStar,
  setActiveTab,
  setSearchQuery,
  toggleStar,
  setReports
} = useReportsContext();
```

### API Services

The reports feature includes API service functions for backend integration:

```jsx
import { getReportsDashboard, postReportsDashboard } from '@/features/reports/services/reportsApi';

// Fetch all reports (handled by useReportsDashboard hook)
const reports = await getReportsDashboard();

// Update report star status (handled by useUpdateReportStar hook)
const payload = {
  Id: "6853cef435ccddee84d6e20c",
  Icon: "📊",
  Title: "Churn by Cohort",
  Description: "Analyze customer retention and churn patterns...",
  Tags: ["cohort", "churn"],
  Category: ["All", "Performance Reports"],
  RoutePath: "/reports/churn-cohort",
  IsStarred: true,
  IsAdmin: true,
  UserId: 1,
  ModifiedTitle: "Test Churn by Cohort",
  CreatedDate: "2025-06-19T08:12:15.104+0000",
  ModifiedDate: null,
  IsMaster: false,
  SortOrder: 12
};
await postReportsDashboard(payload);
```

## State Logic and Explanation

### Context Architecture

The reports feature uses React Context API for state management with React Query for data fetching:

1. **ReportsProvider**: The context provider that wraps the feature and manages state, API hooks, and actions.
2. **Context.js**: Defines the `ReportsContext` object and the `useReportsContext` hook.
3. **useReportsDashboard**: React Query hook for API data fetching.
4. **useUpdateReportStar**: React Query mutation hook for star status updates.
5. **reportsReducer**: Handles state updates based on actions.
6. **Actions**: Define state update operations.
7. **Initial State**: Defines the default state structure.

### State Structure

```javascript
{
  reports: [],           // All reports data
  filteredReports: [],   // Currently filtered/displayed reports (computed)
  activeTab: 'All',      // Active category filter
  searchQuery: '',       // Current search query
  loading: false,        // Loading state for async operations
  error: null,          // Error state
  tabCounts: {},        // Computed counts for each category
  isUpdatingStar: false // Loading state for star updates
}
```

### Available Actions

- `SET_REPORTS`: Set the complete reports array
- `SET_FILTERED_REPORTS`: Set filtered reports (computed automatically)
- `SET_ACTIVE_TAB`: Change active category filter
- `SET_SEARCH_QUERY`: Update search query
- `TOGGLE_STAR`: Toggle favorite status of a report
- `SET_LOADING`: Set loading state
- `SET_ERROR`: Set error state

### Star Toggle Functionality

The star toggle feature includes:

1. **Optimistic Updates**: UI updates immediately for better UX
2. **API Integration**: Makes POST request to update star status
3. **Error Handling**: Reverts optimistic update if API call fails
4. **Loading States**: Shows spinner during API calls
5. **Cache Invalidation**: Refreshes data after successful updates

### Filtering Logic

Reports are filtered in real-time based on:

1. **Category Filter**: 
   - "All": Shows all reports
   - "Favorites": Shows only starred reports
   - Other categories: Shows reports matching the category

2. **Search Filter**: 
   - Searches in report title, description, and tags
   - Case-insensitive matching
   - Applied after category filtering

### Data Flow

1. **API Layer**: 
   - `useReportsDashboard` hook fetches data using React Query
   - `useUpdateReportStar` hook handles star status updates
2. **Context Layer**: `ReportsProvider` consumes the hooks and manages state via the reducer.
3. **State Updates**: All state changes go through the reducer.
4. **Computed Values**: `filteredReports` and `tabCounts` are computed using `useMemo`.
5. **Component Usage**: Components get state and actions from `useReportsContext`.

## Dependencies

### Internal Dependencies
- `@/components/ui/*`: ShadCN UI components
- `@/lib/utils`: Utility functions
- `@/config/*`: Application configuration

### External Dependencies
- `react`: Core React functionality
- `prop-types`: Runtime prop validation
- `lucide-react`: Icon components
- `@tanstack/react-query`: Data fetching and caching

### Features Used
- React Context API for state management
- React Query for data fetching and caching
- React hooks (useState, useEffect, useMemo, useReducer)
- PropTypes for component prop validation
- CSS classes with Tailwind CSS
- Responsive grid layout
- Search and filtering functionality
- Optimistic updates for better UX

## Usage Example

```jsx
// Basic usage - just import and use
import ReportsFeature from '@/features/reports';

// Or use the context directly in custom components
import { useReportsContext } from '@/features/reports/context';

const MyComponent = () => {
  const { reports, setActiveTab, toggleStar, isUpdatingStar } = useReportsContext();
  // ... component logic
};

// Or use the API hooks directly if needed
import { useReportsDashboard, useUpdateReportStar } from '@/features/reports/hooks';

const MyApiComponent = () => {
  const { data, isLoading, error } = useReportsDashboard();
  const { mutate: updateStar } = useUpdateReportStar();
  // ... component logic
};
```
