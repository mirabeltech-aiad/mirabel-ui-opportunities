# Opportunity-new

A clean, modern implementation of Opportunities and Proposals functionality, built from scratch to replace the complex legacy code.

## Structure

```
src/features/Opportunity-new/
├── Advanced-Search/           # Advanced search functionality
│   ├── AdvancedSearch.jsx    # Main search component with tabs
│   ├── components/           # Search form components
│   └── configs/             # Search configuration files
├── SearchResults/            # Search results display
│   ├── SearchResults.jsx    # Main results component
│   ├── components/          # Result display components
│   │   ├── StatisticsCards.jsx
│   │   ├── FilterBar.jsx
│   │   └── DataTable.jsx
│   └── hooks/               # Custom hooks for data management
│       └── useSearchResults.js
└── README.md
```

## Features

### Advanced Search
- **Tabbed Interface**: Switch between Opportunities and Proposals
- **Expandable Sections**: Organized search criteria in collapsible sections
- **Multi-Select Fields**: Support for multiple selections
- **Date Range Fields**: Date range selection for time-based filtering
- **Form State Management**: Separate state for each tab

### Search Results
- **Statistics Cards**: Key metrics displayed at the top (7 cards)
- **Filter Bar**: Quick filters with dropdowns
- **Data Table**: Sortable, paginated table with action buttons
- **View Modes**: Table, Grid, and Kanban views (Grid/Kanban coming soon)
- **Pagination**: Navigate through large result sets

## API Integration

The components now use real API integration with the `opportunities/report/all` endpoint:

### Services
- **opportunitiesReportService**: Real API integration using the exact pattern from the old folder
- **advancedSearchApi**: Mock API service (to be replaced)

### Payload Structure
Uses the exact payload structure from the existing implementation:
```javascript
{
  "IDs": null,
  "CustomerID": "",
  "CustomerName": "",
  "OppName": "",
  "Type": "",
  "BusinessUnit": "",
  "Source": "",
  "Products": "",
  "LossReason": "",
  "AssignedTo": "IE=1~",
  "Arth": "",
  "SalesPresenter": null,
  "Stage": "",
  "CreatedBy": "",
  "CreatedFrom": "",
  "CreatedTo": "",
  "CloseFrom": "",
  "CloseTo": "",
  "ActualCloseFrom": "",
  "ActualCloseTo": "",
  "Status": "all",
  "UserID": 1,
  "Probability": "",
  "AdvSearch": { /* nested search parameters */ },
  "Action": null,
  "PageSize": 25,
  "CurPage": 1,
  "SortBy": "",
  "ListName": "Latest Search",
  "ViewType": 0,
  "ResultType": 1
  // ... additional fields
}
```

### Data Structure
Returns structured data with statistics, results, and pagination info:
```javascript
{
  success: true,
  results: [], // Array of opportunity records
  totalCount: 0,
  statistics: {
    totalOpportunities: 0,
    totalValue: 0,
    averageValue: 0,
    openOpportunities: 0,
    closedWon: 0,
    closedLost: 0
  },
  pageInfo: {
    currentPage: 1,
    pageSize: 25,
    totalPages: 1
  }
}
```

## Usage

### Basic Usage
```javascript
import AdvancedSearch from './features/Opportunity-new/Advanced-Search/AdvancedSearch';

// Renders both search form and results
<AdvancedSearch />
```

### Direct Results Usage
```javascript
import { SearchResults } from './features/Opportunity-new/SearchResults';

<SearchResults 
  searchType="opportunities" // or "proposals"
  searchParams={{ companyName: "Crypto.com" }}
/>
```

## Key Benefits

1. **Clean Architecture**: No duplicated code, clear separation of concerns
2. **Reusable Components**: Same components work for both Opportunities and Proposals
3. **Modern UI**: Clean, responsive design matching the provided screenshot
4. **API Integration**: Uses existing backend services
5. **Extensible**: Easy to add new features and entity types

## Development Notes

- Built with React hooks for state management
- Uses existing API services from legacy folder
- Responsive design with Tailwind CSS
- Sample data provided for development/testing
- Error handling and loading states included

## Testing

To test the real API integration:

1. Navigate to `/test-search-results` in the application
2. Check browser console for API calls and data structure
3. Verify that real data is displayed in the table
4. Check statistics cards show real calculated values
5. Test edit functionality by clicking the edit icons in the table

The TestSearchResults component automatically loads initial data on mount.

## Edit Functionality

Both SearchResults and TestSearchResults components now include edit functionality:

- **Edit Button**: Each row has an edit icon in the first column
- **Navigation**: Clicking edit navigates to `/edit-opportunity/{id}`
- **Conditional Display**: Edit button only shows for valid, non-closed opportunities
- **Status Filtering**: Edit is hidden for closed, locked, or archived records
- **Proper Integration**: Uses the same pattern as the old Opportunity folder

## Next Steps

1. ✅ **Real API Integration** - Completed with `opportunities/report/all` endpoint
2. Implement Grid and Kanban views
3. Add sorting and advanced filtering
4. Implement add/edit functionality
5. Add export capabilities
6. Connect AdvancedSearch form to the real API service