# Opportunity Feature Documentation

## Overview
The Opportunity feature is a comprehensive CRM module that manages sales opportunities, proposals, and related business processes. It provides multiple views (table, card, kanban), advanced search capabilities, and extensive customization options.

## Feature Structure

```
src/features/Opportunity/
├── components/           # UI Components
│   ├── views/           # View-related components
│   ├── ui/              # Reusable UI components
│   ├── table/           # Table-specific components
│   ├── search/          # Search functionality
│   ├── proposal/        # Proposal-related components
│   ├── navbar/          # Navigation components
│   ├── kanban/          # Kanban view components
│   ├── StyleCustomizer/ # Styling customization
│   ├── Settings/        # Settings components
│   ├── Reports/         # Reporting components
│   ├── ProposalsAdvancedSearch/ # Advanced proposal search
│   ├── EditOpportunity/ # Opportunity editing
│   ├── EditProposal/    # Proposal editing
│   ├── CompanySidebar/  # Company information sidebar
│   ├── CustomFields/    # Custom field management
│   ├── EditMode/        # Edit mode components
│   ├── CodeExporter/    # Code export functionality
│   ├── AdvancedSearch/  # Advanced search components
│   ├── Admin/           # Administrative components
│   ├── AddOpportunity/  # Add opportunity components
│   ├── shared/          # Shared components
│   └── layout/          # Layout components
├── utils/               # Utility functions
├── types/               # Type definitions (TypeScript - not used in JS project)
├── constants/           # Constants and options
├── contexts/            # React contexts
├── data/                # Mock data and generators
├── reports/             # Reporting functionality
├── proposals/           # Proposal management
├── opportunities/       # Opportunity management
└── features/            # Feature-specific subdirectories
```

## Core Components

### Main Views
- **OpportunitiesTable.jsx** - Main table view for opportunities
- **OpportunityCardView.jsx** - Card-based view for opportunities
- **KanbanView.jsx** - Kanban board view
- **SplitScreenView.jsx** - Split screen layout
- **ViewToggle.jsx** - View switching component

### Proposal Components
- **ProposalsTable.jsx** - Table view for proposals
- **ProposalCardView.jsx** - Card view for proposals
- **ProposalKanbanView.jsx** - Kanban view for proposals
- **ProposalSplitScreenView.jsx** - Split screen for proposals

### Navigation & Layout
- **MainNavbar.jsx** - Main navigation bar
- **CompanySidebar.jsx** - Company information sidebar
- **SettingsPanel.jsx** - Settings panel component

### Search & Filtering
- **AdvancedSearch/** - Advanced search functionality
- **ProposalsAdvancedSearch/** - Advanced proposal search
- **ActiveFiltersDisplay.jsx** - Active filters display

### Forms & Editing
- **AddOpportunity/** - Add opportunity forms
- **EditOpportunity/** - Edit opportunity forms
- **EditProposal/** - Edit proposal forms

### Statistics & Analytics
- **OpportunityStatsCards.jsx** - Opportunity statistics
- **ProposalStatsCards.jsx** - Proposal statistics
- **Reports/** - Reporting components

### Customization
- **ColorCustomizer.jsx** - Color customization
- **StyleCustomizer/** - Style customization
- **CustomFields/** - Custom field management

### Administrative
- **Admin/** - Administrative components
- **Settings/** - Settings components

## Context Providers

### SearchContext.jsx
Manages search state and filters across the opportunity feature.

**Key Features:**
- Active filters management
- Search query state
- Filter persistence

**Usage:**
```jsx
import { useSearch } from "@/features/Opportunity/contexts/SearchContext";

const { activeFilters, setActiveFilters } = useSearch();
```

### EditModeContext.tsx
Manages edit mode state for opportunity editing.

**Key Features:**
- Edit mode toggling
- Form state management
- Validation state

## Constants

### opportunityOptions.js
Contains opportunity-related constants and options.

**Key Constants:**
- `UserId` - Current user ID
- `IsAdmin` - Admin status check
- Opportunity status options
- Probability options
- Assignment options

### proposalOptions.js
Contains proposal-related constants and options.

**Key Constants:**
- Proposal status options
- Approval states
- Proposal types

## Utility Functions

### columnMapping.js
Maps API columns to table columns and manages column configuration.

**Key Functions:**
- `mapApiColumnsToTableColumns()` - Maps API response to table columns
- `getDefaultColumnOrder()` - Returns default column order
- `dynamicColumnMapper()` - Dynamic column mapping

### formValidation.js
Form validation utilities for opportunity and proposal forms.

**Key Functions:**
- Field validation rules
- Custom validation logic
- Error message handling

### styleManager.js
Manages styling and theme customization.

**Key Functions:**
- Style application
- Theme management
- Custom styling rules

### pipelineMetrics.js
Calculates and manages pipeline metrics and analytics.

**Key Functions:**
- Pipeline calculations
- Conversion metrics
- Performance analytics

## Data Management

### Mock Data
- **mockData.js** - Basic mock data
- **mockActivities.js** - Activity mock data
- **mockProposals.js** - Proposal mock data

### Data Generators
Located in `data/generators/` for creating test data.

## API Integration

The feature integrates with various API endpoints:

### Opportunities
- GET `/opportunities` - Fetch opportunities
- POST `/opportunities` - Create opportunity
- PUT `/opportunities/:id` - Update opportunity
- DELETE `/opportunities/:id` - Delete opportunity

### Proposals
- GET `/proposals` - Fetch proposals
- POST `/proposals` - Create proposal
- PUT `/proposals/:id` - Update proposal

### Search
- POST `/advanced-search` - Advanced search
- GET `/saved-views` - Saved search views

### Reports
- GET `/reports/opportunities` - Opportunity reports
- GET `/reports/proposals` - Proposal reports

## State Management

### Global State
- Uses React Context API for global state
- SearchContext for search state
- EditModeContext for edit mode

### Local State
- Component-specific state using useState
- Form state using React Hook Form
- API state management with custom hooks

## Routing Integration

The feature integrates with the main application routing:

### Main Routes
- `/opportunities` - Main opportunities page
- `/add-opportunity` - Add opportunity page
- `/edit-opportunity/:id` - Edit opportunity page
- `/proposals` - Proposals page
- `/edit-proposal/:id` - Edit proposal page
- `/advanced-search` - Advanced search page
- `/reports` - Reports page
- `/admin` - Admin page
- `/settings` - Settings page

## Dependencies

### Internal Dependencies
- `@/components/ui/*` - ShadCN UI components
- `@/hooks/useApiData` - API data hook
- `@/services/apiService` - API service
- `@/lib/utils` - Utility functions

### External Dependencies
- `react-router-dom` - Routing
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation
- `axios` - HTTP client
- `lucide-react` - Icons
- `date-fns` - Date utilities

## Usage Patterns

### Component Structure
```jsx
// Example component structure
import { useState, useEffect } from 'react';
import { useSearch } from '@/features/Opportunity/contexts/SearchContext';
import { OPPORTUNITY_OPTIONS } from '@/features/Opportunity/constants/opportunityOptions';

export const OpportunityComponent = ({ className, ...props }) => {
  const { activeFilters } = useSearch();
  const [data, setData] = useState(null);
  
  // Component logic
  
  return (
    <div className={className}>
      {/* Component content */}
    </div>
  );
};
```

### Form Handling
```jsx
// Example form handling
import { useForm } from 'react-hook-form';
import { formValidation } from '@/features/Opportunity/utils/formValidation';

export const OpportunityForm = () => {
  const form = useForm({
    resolver: formValidation.opportunityResolver,
    defaultValues: {
      // Default values
    }
  });
  
  // Form logic
};
```

### API Integration
```jsx
// Example API integration
import { useApiData } from '@/hooks/useApiData';

export const OpportunityList = () => {
  const { opportunities, isLoading, error, refetchData } = useApiData();
  
  // Component logic using API data
};
```

## Error Handling

### Error Boundaries
- Component-level error boundaries
- API error handling
- Form validation errors

### Loading States
- Skeleton loaders
- Loading spinners
- Progressive loading

## Performance Considerations

### Code Splitting
- Lazy loading of components
- Route-based code splitting
- Dynamic imports for heavy components

### Optimization
- Memoization of expensive calculations
- Debounced search inputs
- Virtualized lists for large datasets

## Testing Strategy

### Unit Tests
- Component testing
- Utility function testing
- Hook testing

### Integration Tests
- API integration testing
- Form submission testing
- User flow testing

## Accessibility

### ARIA Labels
- Proper labeling for screen readers
- Keyboard navigation support
- Focus management

### Semantic HTML
- Proper heading structure
- Semantic form elements
- Descriptive alt text

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox
- Modern JavaScript APIs

## Future Enhancements

### Planned Features
- Real-time updates
- Advanced analytics
- Mobile optimization
- Offline support
- Advanced reporting

### Technical Debt
- Remove unused TypeScript files
- Consolidate duplicate components
- Improve error handling
- Optimize bundle size
- Enhance performance

## Maintenance Notes

### Code Quality
- Follow JavaScript-only policy
- Use PropTypes for validation
- Maintain consistent naming conventions
- Document complex logic

### File Organization
- Keep related files together
- Use clear directory structure
- Maintain separation of concerns
- Regular cleanup of unused files 