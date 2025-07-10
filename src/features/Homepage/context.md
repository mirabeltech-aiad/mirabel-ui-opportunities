# Home Feature

## Overview
The Home feature is a comprehensive post-login page that provides a modern tab navigation system with integrated help functionality. It serves as the main interface after users authenticate through the login.aspx page.

## Architecture

### Core Components
- **HomeProvider**: Context provider managing global state for tabs, help system, and authentication
- **TabNavigation**: Main navigation component with draggable tabs and content area
- **Navbar**: Top navigation bar with ocean blue theme, search, and user menu
- **HelpSystem**: Draggable help button and comprehensive help panel
- **TabContent**: Dynamic content renderer for different tab types

### State Management
The feature uses React Context with useReducer for state management:
- Tab state (creation, removal, reordering, persistence)
- Help system state (visibility, position)
- Authentication state (session management)

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

## Key Features

### 1. Navigation System
- Ocean blue themed navbar with gradient background
- Command palette (Cmd+K) integration
- Dynamic menu with quick actions
- User account dropdown with session management
- Responsive design for all screen sizes

### 2. Tab Management
- **Dashboard**: Default tab with welcome message and quick actions
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

## File Structure
```
src/features/Home/
├── index.jsx                 # Main entry point
├── context.md               # This documentation
├── contexts/
│   └── HomeContext.jsx      # State management
├── components/
│   ├── TabNavigation.jsx    # Main navigation
│   ├── Navbar.jsx          # Top navigation bar
│   ├── TabContent.jsx      # Content renderer
│   ├── HelpSystem.jsx      # Help system
│   ├── JiraTicketForm.jsx  # JIRA integration
│   ├── ContactConsultantForm.jsx # Contact form
│   ├── Dashboard.jsx       # Default dashboard
│   ├── NewTab.jsx          # New tab placeholder
│   ├── OpportunityForm.jsx # Opportunity form
│   ├── Reports.jsx         # Reports interface
│   └── Settings.jsx        # Settings interface
└── styles/
    └── ocean-theme.css     # Ocean theme styles
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