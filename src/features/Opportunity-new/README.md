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

The components use the existing API services from the legacy folder:
- `opportunitiesService.js` for opportunities data
- `proposalsApi.js` for proposals data

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

## Next Steps

1. Test with real API data
2. Implement Grid and Kanban views
3. Add sorting and advanced filtering
4. Implement add/edit functionality
5. Add export capabilities