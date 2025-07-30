# Reports Feature

## Overview

The Reports feature provides comprehensive reporting capabilities for both media and SaaS business models. It includes subscription analytics, revenue tracking, performance metrics, and compliance reporting.

## Architecture

This feature follows the enhanced project structure guidelines for agent-readable code with modular organization and clear separation of concerns.

## Components

### Directory Components
- `ReportsHeader` - Main header with metrics and actions
- `ReportCard` - Individual report card display
- `ReportsDirectory` - Report listing and categorization

### Filter Components  
- `ReportsFilterBar` - Primary filter interface
- Connected filter dropdowns for status, business units, and products

## Services

### API Integration
- Report data fetching from Supabase
- Business model filtering
- Report template management
- Report generation and scheduling

## Types

### Core Types
- `Report` - Basic report structure
- `ReportWithBusinessModel` - Extended report with business model filtering
- `ReportTemplate` - Database report template structure

### API Types
- API request/response interfaces
- Filter parameters
- Pagination types

## Hooks

### Data Management
- `useReportsFiltering` - Report filtering and search logic
- `useFilteredReports` - Database report fetching with business model filtering

## Utils

### Business Logic
- `businessModelFilters` - Report filtering by business model
- Report categorization and grouping
- Data transformation utilities

## Usage

```tsx
import { ReportsDirectory } from '@/features/reports';

function App() {
  return (
    <ReportsDirectory />
  );
}
```

## Business Model Support

### Media Companies
- Circulation reports
- Audit compliance tracking
- Subscription analytics
- Geographic distribution

### SaaS Companies  
- Usage metrics
- Customer analytics
- Revenue tracking
- Performance monitoring

## Testing

- Component tests co-located with components
- Hook tests with custom hooks
- Service tests with API integration
- Integration tests at feature level

## Dependencies

- React Query for data fetching
- Supabase for backend integration
- Recharts for data visualization
- Lucide React for icons