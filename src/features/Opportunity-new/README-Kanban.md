# Clean Kanban Implementation

This directory contains a clean, reimplemented version of the Kanban functionality from the original opportunity feature. The implementation focuses on simplicity, maintainability, and clear separation of concerns.

## Architecture

### Components

#### `KanbanView.jsx`
- Main container component that orchestrates the entire Kanban experience
- Manages local state for opportunities
- Handles drag and drop operations
- Manages the edit panel state
- Provides refresh functionality

#### `KanbanBoard.jsx`
- Renders the drag-and-drop board using react-beautiful-dnd
- Fetches stages from the API using `useStagesDropdown`
- Groups opportunities by stage
- Handles loading and error states

#### `KanbanColumn.jsx`
- Represents a single stage column
- Shows opportunity count and total value
- Applies dynamic styling based on stage color codes
- Renders opportunity cards within the column

#### `KanbanCard.jsx`
- Individual opportunity card component
- Shows key opportunity information (name, company, amount, etc.)
- Provides edit and delete actions
- Handles drag operations

#### `EditOpportunityPanel.jsx`
- Side panel for editing opportunities
- Simple form with basic opportunity fields
- Uses the `useKanbanOpportunityForm` hook

### Hooks

#### `useKanbanOpportunityForm.ts`
- Simplified version of the opportunity form hook
- Handles loading, editing, and saving opportunity data
- Focuses only on essential fields needed for Kanban operations

### Services

#### `opportunityService.ts`
- Reuses the existing comprehensive service from the opportunity-new feature
- Provides methods for CRUD operations
- Handles API communication and data transformation

### Utilities

#### `kanbanUtils.js`
- Clean utility functions for drag and drop operations
- Handles ID generation and opportunity lookup
- Simplified compared to the original implementation

## Key Improvements

1. **Simplified State Management**: Removed complex state tracking and focused on essential functionality
2. **Clean Component Structure**: Each component has a single responsibility
3. **Better Error Handling**: Proper loading states and error messages
4. **Consistent API Usage**: Uses the shared `useStagesDropdown` hook
5. **Maintainable Code**: Clear, readable code with proper separation of concerns

## Usage

```jsx
import { KanbanView } from '@/features/opportunity-new/components/kanban';

const MyComponent = () => {
  const [opportunities, setOpportunities] = useState([]);

  const handleRefresh = () => {
    // Fetch fresh data
  };

  return (
    <KanbanView
      opportunities={opportunities}
      onRefresh={handleRefresh}
    />
  );
};
```

## API Integration

The implementation uses the same API endpoints as the original:

- **Stages**: `/services/Admin/OpportunityStages` (via `useStagesDropdown`)
- **Update Stage**: `/services/Opportunities/Field/PipelineStageID/{id}/0/{userId}/Insert`
- **Delete Opportunity**: `/services/Opportunities/{id}/{userId}`
- **Save Opportunity**: `/services/Opportunities` (POST)

## Dependencies

- `react-beautiful-dnd`: For drag and drop functionality
- `@/hooks/useSearchableDropdown`: For fetching stages
- `@/components/ui/*`: For UI components (Card, Badge, Button, etc.)
- `lucide-react`: For icons

## Demo

See `KanbanDemo.jsx` for a complete example with mock data.

## Migration Notes

When migrating from the old implementation:

1. Replace imports from `src/features/Opportunity/components/kanban/*` with `src/features/opportunity-new/components/kanban/*`
2. Update any custom props or event handlers to match the new API
3. The core functionality remains the same, but the implementation is cleaner and more maintainable