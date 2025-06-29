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
│   ├── ReportsProvider.jsx   # Context provider with direct service integration
│   ├── actions.js            # Action creators and types
│   ├── reducer.js            # State reducer function
│   ├── initialState.js       # Initial state definition
│   └── index.js              # Context exports
├── hooks/               # Custom hooks
│   ├── useService.js         # Custom hooks for API calls using direct services
│   └── index.js              # Hook exports
├── helpers/             # Utility functions
│   ├── constants.js          # Feature-specific constants
│   ├── formatters.js         # Data formatting utilities
│   └── reportsData.js        # Static reports data (for fallback/mock data)
├── services/            # API integration
│   ├── reportsApi.js         # Direct Axios API service functions
│   └── reportsService.js     # Service class for managing API operations
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
Custom hook for fetching reports data using direct service calls:
```jsx
import { useReportsDashboard } from '@/features/reports/hooks';

const { data, error, refetch } = useReportsDashboard();
```

#### useUpdateReportStar
Custom hook for updating report star status:
```jsx
import { useUpdateReportStar, prepareStarTogglePayload } from '@/features/reports/hooks';

const { mutate: updateStarStatus, isPending: isUpdatingStar } = useUpdateReportStar();

// Usage
const payload = prepareStarTogglePayload(report, true);
await updateStarStatus(payload);
```

#### useReorderReports
Custom hook for reordering reports:
```jsx
import { useReorderReports, prepareReorderPayload } from '@/features/reports/hooks';

const { mutate: reorderReports, isPending: isReordering } = useReorderReports();

// Usage
const payload = prepareReorderPayload(reorderedReports);
await reorderReports(payload);
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
  error,
  isUpdatingStar,
  setActiveTab,
  setSearchQuery,
  toggleStar,
  setReports
} = useReportsContext();
```

### API Services

The reports feature includes direct Axios service functions for backend integration:

#### Direct API Functions
```jsx
import { getReportsDashboard, postReportsDashboard } from '@/features/reports/services/reportsApi';

// Fetch all reports
const reports = await getReportsDashboard();

// Update report star status
const payload = {
  UserId: 1,
  ReportId: "6853cef435ccddee84d6e20c",
  ModifiedTitle: "Test Report",
  IsStarred: true,
  SortOrder: 12,
  CustomTags: ["tag1", "tag2"]
};
await postReportsDashboard(payload);
```

#### Service Class
```jsx
import { reportsService } from '@/features/reports/services/reportsService';

// Fetch reports
const reports = await reportsService.fetchReports();

// Update star status
await reportsService.updateReportStar(payload);

// Reorder reports
await reportsService.reorderReports(payload);
```

## State Logic and Explanation

### Context Architecture

The reports feature uses React Context API for state management with direct Axios service calls:

1. **ReportsProvider**: The context provider that wraps the feature and manages state, service hooks, and actions.
2. **Context.js**: Defines the `ReportsContext` object and the `useReportsContext` hook.
3. **useReportsDashboard**: Custom hook for API data fetching using direct services.
4. **useUpdateReportStar**: Custom hook for star status updates.
5. **useReorderReports**: Custom hook for report reordering.
6. **reportsService**: Service class that handles all API operations.
7. **reportsReducer**: Handles state updates based on actions.
8. **Actions**: Define state update operations.
9. **Initial State**: Defines the default state structure.

### State Structure

```javascript
{
  reports: [],           // All reports data
  filteredReports: [],   // Currently filtered/displayed reports (computed)
  activeTab: 'All',      // Active category filter
  searchQuery: '',       // Current search query
  error: null,          // Error state
  tabCounts: {},        // Computed counts for each category
  isUpdatingStar: false, // Loading state for star updates
  isReordering: false,   // Loading state for reordering
  updatingReportId: null // ID of report being updated
}
```

### Available Actions

- `SET_REPORTS`: Set the complete reports array
- `SET_FILTERED_REPORTS`: Set filtered reports (computed automatically)
- `SET_ACTIVE_TAB`: Change active category filter
- `SET_SEARCH_QUERY`: Update search query
- `TOGGLE_STAR`: Toggle favorite status of a report
- `TOGGLE_REPORT_STAR`: Optimistic update for star toggling
- `SET_LOADING`: Set loading state
- `SET_ERROR`: Set error state
- `SET_CATEGORIES`: Set available categories
- `REORDER_REPORTS`: Reorder reports in the list

### Star Toggle Functionality

The star toggle feature includes:

1. **Optimistic Updates**: UI updates immediately for better UX using `TOGGLE_REPORT_STAR` action
2. **API Integration**: Makes POST request to update star status via `reportsService`
3. **Error Handling**: Reverts optimistic update if API call fails
4. **Loading States**: Shows spinner during API calls
5. **Automatic Refetching**: Refreshes data after successful updates

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

1. **Service Layer**: 
   - `reportsService` class handles all API operations
   - Direct Axios calls without React Query wrapper
2. **Hook Layer**: Custom hooks (`useReportsDashboard`, `useUpdateReportStar`, `useReorderReports`) manage service calls and state
3. **Context Layer**: `ReportsProvider` consumes the hooks and manages state via the reducer
4. **State Updates**: All state changes go through the reducer with optimistic updates
5. **Computed Values**: `filteredReports` and `tabCounts` are computed using `useMemo`
6. **Component Usage**: Components get state and actions from `useReportsContext`

## Service Architecture

### ReportsService Class
The `reportsService` class provides a clean interface for all API operations:

```javascript
class ReportsService {
  async fetchReports()        // Fetch all reports
  async updateReportStar()    // Update star status
  async reorderReports()      // Reorder reports
  getLoadingState()          // Get current loading state
  getErrorState()            // Get current error state
}
```

### Payload Format
The API expects specific payload formats:

#### Star Toggle Payload
```javascript
{
  UserId: 1,
  ReportId: "report-id",
  ModifiedTitle: "Report Title",
  IsStarred: true,
  SortOrder: 1,
  CustomTags: ["tag1", "tag2"]
}
```

#### Reorder Payload
```javascript
[
  {
    UserId: 1,
    ReportId: "report-id-1",
    ModifiedTitle: "Report 1",
    IsStarred: false,
    SortOrder: 1,
    CustomTags: ["tag1"]
  },
  {
    UserId: 1,
    ReportId: "report-id-2",
    ModifiedTitle: "Report 2",
    IsStarred: true,
    SortOrder: 2,
    CustomTags: ["tag2"]
  }
]
```

## Dependencies

### Internal Dependencies
- `@/components/ui/*`: ShadCN UI components
- `@/lib/utils`: Utility functions
- `@/config/*`: Application configuration
- `@/services/axiosInstance`: Axios instance configuration

### External Dependencies
- `react`: Core React functionality
- `prop-types`: Runtime prop validation
- `lucide-react`: Icon components
- `axios`: HTTP client for API calls

### Features Used
- React Context API for state management
- Direct Axios service calls for data fetching
- React hooks (useState, useEffect, useMemo, useReducer, useCallback)
- PropTypes for component prop validation
- CSS classes with Tailwind CSS
- Responsive grid layout
- Search and filtering functionality
- Optimistic updates for better UX
- Manual error handling and rollback

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

// Or use the service hooks directly if needed
import { useReportsDashboard, useUpdateReportStar } from '@/features/reports/hooks';

const MyApiComponent = () => {
  const { data, error, refetch } = useReportsDashboard();
  const { mutate: updateStar } = useUpdateReportStar();
  // ... component logic
};

// Or use the service directly
import { reportsService } from '@/features/reports/services/reportsService';

const MyServiceComponent = () => {
  const handleUpdateStar = async (report) => {
    try {
      await reportsService.updateReportStar(payload);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  // ... component logic
};
```

## Migration from React Query

The reports feature has been migrated from React Query to direct Axios service calls:

### Key Changes:
1. **Removed React Query dependencies**: No more `useQuery` or `useMutation`
2. **Added direct service layer**: `reportsService` class for API operations
3. **Custom hooks**: Replaced React Query hooks with custom hooks using `useState` and `useEffect`
4. **Manual state management**: Loading states and error handling managed manually
5. **Optimistic updates**: Implemented manually in the provider
6. **Automatic refetching**: Added after successful mutations

### Benefits:
- **Simpler architecture**: No complex React Query setup
- **Direct control**: Full control over API calls and state management
- **Reduced dependencies**: Fewer external dependencies
- **Better understanding**: Clearer data flow and easier debugging
- **Same functionality**: All features maintained with improved performance
