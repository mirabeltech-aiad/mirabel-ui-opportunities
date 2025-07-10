# Home Feature

## Overview
The Home feature is a comprehensive post-login page that provides a modern tab navigation system with integrated help functionality. It serves as the main interface after users authenticate through the login.aspx page.

## Architecture

### Core Components
- **HomeProvider**: Context provider managing global state for tabs, help system, authentication, and dashboard management
- **TabNavigation**: Main navigation component with draggable tabs and content area
- **Navbar**: Top navigation bar with ocean blue theme, search, and user menu
- **HelpSystem**: Draggable help button and comprehensive help panel
- **TabContent**: Dynamic content renderer for different tab types
- **IframeContainer**: Reusable iframe component for loading dashboard and menu URLs
- **DashboardTab**: Special tab component with dropdown for dashboard selection

### State Management
The feature uses React Context with useReducer for state management:
- Tab state (creation, removal, reordering, persistence)
- Help system state (visibility, position)
- Authentication state (session management)
- **Navigation state** (dynamic menu loading, API integration)

### Tab System Features
- **Dynamic Tab Creation**: Support for React components, iframes, and custom content
- **Drag & Drop Reordering**: Using react-beautiful-dnd
- **Persistence**: Tabs saved to localStorage
- **Overflow Handling**: Dropdown menu for excess tabs
- **Lazy Loading**: Components loaded on demand

### Help System Features
- **Draggable Help Button**: Fixed position, draggable to any screen location
- **8 Help Options**: 2x4 grid layout with icons and descriptions
- **JIRA Integration**: Ticket creation form with project selection
- **Contact Forms**: Consultant contact and support forms

### Dashboard & Iframe Integration
- **Dynamic Dashboard Loading**: API-driven dashboard selection with dropdown interface
- **IframeContainer**: Common reusable component for loading external URLs
- **Base Domain Integration**: Automatic URL construction with `https://smoke-feature13.magazinemanager.com`
- **Error Handling**: Loading states, error recovery, and retry functionality
- **External Link Support**: Open in new tab and refresh capabilities
- **Dynamic Navigation Integration**: Real-time menu loading from API with hierarchical structure

## Key Features

### 1. Navigation System
- Ocean blue themed navbar with gradient background
- Command palette (Cmd+K) integration
- **Dynamic API-driven navigation** with real-time menu loading
- User account dropdown with session management
- Responsive design for all screen sizes
- **Loading states** with spinner for menu initialization

### 2. Tab Management
- **Dashboard Tab**: Special tab with dropdown for API-driven dashboard selection
  - Fetches dashboards from `/services/User/Dashboards/false`
  - Shows selected dashboard name in tab
  - Loads dashboard URL in iframe when selected
  - Falls back to default dashboard content when no selection
- **New Tab**: Placeholder for creating new tabs
- **Opportunity Form**: Basic opportunity creation form
- **Reports**: Analytics and reporting interface
- **Settings**: User preferences and configuration
- **Custom Tabs**: Support for any React component or iframe

### 3. Help Integration
- **Help Button**: Ocean blue (#0284c7) with white border, draggable
- **Help Panel**: Modal with 8 help options in 2x4 grid
- **JIRA Ticket Form**: Complete ticket creation with validation
- **Contact Forms**: Consultant and support contact forms
- **External Links**: Documentation, chat, training, portal access

### 4. Authentication Features
- Session management and persistence
- Multi-tab communication
- Token handling
- Session conflict resolution

### 5. Dynamic Navigation Features
- **API Integration**: Real-time menu loading from `/services/admin/navigations/users/1/0`
- **Bearer Token Authentication**: Secure API access with JWT token
- **Hierarchical Menu Structure**: Parent-child menu relationships with proper sorting
- **Loading States**: Visual feedback during menu initialization
- **Icon Support**: Menu items with optional icons and badges
- **URL Processing**: Automatic full URL construction for relative paths
- **Error Handling**: Graceful fallback for API failures

## Styling

### Ocean Theme
- **Primary Gradient**: `linear-gradient(135deg, #0c4a6e 0%, #0369a1 25%, #0284c7 50%, #0ea5e9 75%, #38bdf8 100%)`
- **Color Palette**: 11 shades from ocean-50 to ocean-950
- **Consistent Spacing**: Using Tailwind CSS spacing system
- **Responsive Design**: Mobile-first approach

### Custom Colors
```css
ocean: {
  50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 
  300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9',
  600: '#0284c7', 700: '#0369a1', 800: '#075985', 
  900: '#0c4a6e', 950: '#082f49'
}
```

## Usage

### Basic Setup
```jsx
import Home from '@/features/Home';

// In your app routing
<Route path="/home" element={<Home />} />
```

### Adding New Tabs
```jsx
const { actions } = useHome();

// Add component tab
actions.addTab({
  title: 'My Component',
  component: 'MyComponent',
  type: 'component',
  icon: '📄'
});

// Add iframe tab
actions.addTab({
  title: 'External Site',
  url: 'https://example.com',
  type: 'iframe',
  icon: '🌐'
});
```

### Help System Integration
```jsx
const { actions } = useHome();

// Toggle help panel
actions.toggleHelp();

// Set help button position
actions.setHelpPosition({ x: 100, y: 100 });
```

### Dashboard & Iframe Usage
```jsx
// IframeContainer component (reusable for dashboards and menus)
import IframeContainer from '@/features/Homepage/components/IframeContainer';

// Basic usage
<IframeContainer 
  url="/ui/User/AnalyticsDashboard?Id=123"
  title="Sales Dashboard"
  className="h-full"
/>

// With event handlers
<IframeContainer 
  url="/DashBoard.aspx?ISMKM=1"
  title="Audience Dashboard"
  onLoad={() => console.log('Loaded')}
  onError={() => console.log('Error')}
/>

// Dashboard state management
const { selectedDashboard, dashboards, actions } = useHome();

// Set selected dashboard
actions.setSelectedDashboard(dashboardObject);

// Access dashboard data
console.log(selectedDashboard.DashBoardName); // "Sales Dashboard"
console.log(selectedDashboard.URL); // "/ui/User/AnalyticsDashboard?Id=123"
```

### Dynamic Navigation Integration Pattern
```jsx
// Navigation service usage
import navigationService from '../services/navigationService';

// Fetch navigation data
const menus = await navigationService.fetchNavigationData(userId, siteId);

// Get full URL for menu items
const fullUrl = navigationService.getFullUrl(menuItem.url);

// In Navbar component
const { navigationMenus, navigationLoading } = useHome();

// Render dynamic menus with loading state
{navigationLoading ? (
  <Loader2 className="h-4 w-4 animate-spin" />
) : (
  navigationMenus.map(menu => (
    <DropdownMenu key={menu.id}>
      {/* Menu content */}
    </DropdownMenu>
  ))
)}
```

### Navigation API Response Structure
```json
{
  "content": {
    "List": [
      {
        "ID": 1,
        "ParentID": -1,
        "Caption": "Management",
        "URL": "",
        "SortOrder": 8,
        "IsAdmin": true,
        "IsNewWindow": false,
        "IsVisible": false,
        "Icon": "",
        "ToolTip": ""
      }
    ]
  }
}
```

## File Structure
```
src/features/Homepage/
├── index.jsx                    # Main entry point
├── context.md                  # This documentation
├── contexts/
│   └── HomeContext.jsx         # State management with dashboard & navigation integration
├── services/
│   ├── dashboardService.js     # Dashboard API integration
│   └── navigationService.js    # Navigation API integration
├── components/
│   ├── TabNavigation.jsx       # Main navigation
│   ├── Navbar.jsx             # Top navigation bar with dynamic menus
│   ├── TabContent.jsx         # Content renderer
│   ├── IframeContainer.jsx    # Reusable iframe component
│   ├── DashboardTab.jsx       # Dashboard tab with dropdown
│   ├── HelpSystem.jsx         # Help system
│   ├── JiraTicketForm.jsx     # JIRA integration
│   ├── ContactConsultantForm.jsx # Contact form
│   ├── Dashboard.jsx          # Dashboard with iframe integration
│   ├── NewTab.jsx             # New tab placeholder
│   ├── OpportunityForm.jsx    # Opportunity form
│   ├── Reports.jsx            # Reports interface
│   └── Settings.jsx           # Settings interface
└── styles/
    └── ocean-theme.css        # Ocean theme styles
```

## Dependencies
- **react-beautiful-dnd**: Drag and drop functionality
- **lucide-react**: Icon library
- **@/components/ui**: Shadcn/ui components
- **@/features/Opportunity/hooks/use-toast**: Toast notifications

## Browser Support
- Modern browsers with ES6+ support
- LocalStorage for tab persistence
- Drag and drop API support

## Performance Considerations
- Lazy loading of tab components
- Debounced localStorage updates
- Optimized re-renders with React.memo
- Efficient drag and drop with react-beautiful-dnd

## Security
- XSS protection for iframe content
- Input validation on forms
- Secure session management
- CSRF protection for API calls

## Accessibility
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management
- High contrast support 