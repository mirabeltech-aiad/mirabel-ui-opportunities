
# Reports Feature Documentation

## Purpose and Overview

The Reports feature provides a comprehensive interface for browsing, searching, and managing various business reports. It includes functionality for:

- Displaying reports in a card-based grid layout
- Filtering reports by categories (All, Favorites, Revenue Reports, etc.)
- Searching reports by title, description, or tags
- Starring/favoriting reports for quick access
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
│   ├── ReportsContext.jsx     # Context provider and hook
│   ├── actions.js            # Action creators and types
│   ├── reducer.js            # State reducer function
│   ├── initialState.js       # Initial state definition
│   └── index.js              # Context exports
├── hooks/               # Custom hooks
│   ├── useReports.js         # Main reports data management hook
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
Individual report display component:
```jsx
import { ReportCard } from '@/features/reports/components';

<ReportCard 
  report={reportObject} 
  onToggleStar={handleToggleStar} 
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

#### useReports
Main hook for reports state management:
```jsx
import { useReports } from '@/features/reports/hooks';

const {
  reports,
  filteredReports,
  activeTab,
  searchQuery,
  tabCounts,
  setActiveTab,
  setSearchQuery,
  toggleStar,
  setReports
} = useReports();
```

### API Services

The reports feature includes API service functions for future backend integration:

```jsx
import { fetchReports, searchReports, toggleReportFavorite } from '@/features/reports/services/reportsApi';

// Fetch all reports
const reports = await fetchReports();

// Search reports
const results = await searchReports('renewal');

// Toggle favorite status
const updatedReport = await toggleReportFavorite(reportId, true);
```

## State Logic and Explanation

### Context Architecture

The reports feature uses React Context API for state management:

1. **ReportsContext**: Provides state and dispatch function
2. **reportsReducer**: Handles state updates based on actions
3. **Actions**: Define state update operations
4. **Initial State**: Defines the default state structure

### State Structure

```javascript
{
  reports: [],           // All reports data
  filteredReports: [],   // Currently filtered/displayed reports
  activeTab: 'All',      // Active category filter
  searchQuery: '',       // Current search query
  loading: false,        // Loading state for async operations
  error: null           // Error state
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

## Dependencies

### Internal Dependencies
- `@/components/ui/*`: ShadCN UI components
- `@/lib/utils`: Utility functions
- `@/config/*`: Application configuration

### External Dependencies
- `react`: Core React functionality
- `prop-types`: Runtime prop validation
- `lucide-react`: Icon components

### Features Used
- React Context API for state management
- React hooks (useState, useEffect, useMemo, useReducer)
- PropTypes for component prop validation
- CSS classes with Tailwind CSS
- Responsive grid layout
- Search and filtering functionality

## Usage Example

```jsx
// Basic usage - just import and use
import ReportsFeature from '@/features/reports';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ReportsFeature />
    </div>
  );
}

// Advanced usage - with custom wrapper
import { ReportsProvider } from '@/features/reports/context';
import { ReportsDirectory } from '@/features/reports/components';

function CustomReportsPage() {
  return (
    <ReportsProvider>
      <div className="custom-wrapper">
        <h1>Custom Reports Page</h1>
        <ReportsDirectory />
      </div>
    </ReportsProvider>
  );
}
```
