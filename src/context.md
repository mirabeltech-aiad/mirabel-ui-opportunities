# Mirabel UI Project Documentation

## Project Overview
Mirabel UI is a modern React application built with Vite, utilizing React Query for data management, ShadCN UI components, and a robust theming system. The project follows a feature-based architecture with clear separation of concerns.

### Key Architectural Decisions
- **Feature-First Organization**: Each feature is self-contained with its own components, hooks, and services
- **Type-Safe Development**: Zod schemas for runtime type checking and validation
- **Performance-Focused**: Code splitting, lazy loading, and efficient data fetching patterns
- **Developer Experience**: Comprehensive error boundaries, development tools, and clear documentation

## Tech Stack & Dependencies

### Core Framework
- **React 18**: Latest version with concurrent features and automatic batching
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Type-safe development (via jsconfig.json)

### State Management
- **React Query v5**: Server state management with:
  - Automatic background refetching
  - Optimistic updates
  - Infinite scrolling support
  - Prefetching capabilities
- **Context API**: Global state management for:
  - Theme preferences
  - User settings
  - Application-wide configurations

### UI & Styling
- **ShadCN UI**: Component library built on:
  - Radix UI primitives for accessibility
  - Tailwind CSS for styling
  - Custom theming support
- **Tailwind CSS v4**: Utility-first CSS framework
- **Lucide React**: Icon library integration
- **Sonner**: Toast notifications

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Form validation integration

### Routing & Navigation
- **React Router v6**: Client-side routing with:
  - Nested routes
  - Route guards
  - Dynamic imports
  - Layout patterns

### API & Data Fetching
- **Axios**: HTTP client with:
  - Request/response interceptors
  - Error handling
  - Request cancellation
- **React Query**: Data fetching with:
  - Automatic caching
  - Background updates
  - Error handling
  - Loading states

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
│   ├── shared/    # Common components (buttons, inputs, etc.)
│   ├── layout/    # Layout components (header, sidebar, etc.)
│   └── ui/        # ShadCN UI components
├── config/         # Configuration files
│   ├── api.js     # API configuration
│   └── constants.js # Application constants
├── features/       # Feature-specific components and logic
│   ├── feature1/  # feature
│   │   ├── components/    # Feature-specific components
│   │   ├── context/      # Context and state management
│   │   ├── hooks/        # Custom hooks
│   │   ├── helpers/      # Helper functions and constants
│   │   ├── services/     # API services
│   │   └── index.jsx     # Feature entry point
├── feature2/       # Feature-specific components and logic
│   ├── feature1/  #feature
│   │   ├── components/    # Feature-specific components
│   │   ├── context/      # Context and state management
│   │   ├── hooks/        # Custom hooks
│   │   ├── helpers/      # Helper functions and constants
│   │   ├── services/     # API services
│   │   └── index.jsx        # Other features following 
├── hooks/          # Custom React hooks
│   ├── useAuth.js # Authentication hook
│   └── useTheme.js # Theme management hook
├── lib/           # Utility libraries and helpers
│   ├── utils.js   # General utilities
│   └── validators.js # Validation helpers
├── pages/         # Page components
│   ├── Welcome.jsx
│   └── SiteWideSettingsPage.jsx
├── routers/       # Routing configuration
│   ├── routes.jsx # Route definitions
│   └── routeTree.js # Route tree structure
├── services/      # API services and data fetching
│   ├── api.js     # API client setup
│   └── endpoints/ # API endpoint definitions
├── store/         # Global state management
│   ├── GlobalContext.jsx
│   └── ThemeProvider.jsx
└── styles/        # Global styles and Tailwind configuration
    ├── index.css  # Global styles
    └── tailwind.css # Tailwind imports
```

## API Integration

### React Query Setup
```javascript
// main.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
```

### API Service Pattern
```javascript
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// services/endpoints/auth.js
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  // ... other auth endpoints
};
```

## Component Architecture

### ShadCN UI Integration
Components are built using a consistent pattern:
```javascript
// components/ui/button.jsx
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";

export const Button = ({ className, ...props }) => {
  return (
    <ShadcnButton
      className={cn("custom-styles", className)}
      {...props}
    />
  );
};
```

### Component Categories
1. **Shared Components** (`components/shared/`)
   - Error boundaries with fallback UI
   - Loading states with skeleton screens
   - Common UI elements with consistent styling

2. **Layout Components** (`components/layout/`)
   - Main layout with responsive design
   - Navigation with active state handling
   - Sidebar with collapsible sections

3. **Feature Components** (`features/`)
   - Domain-specific components
   - Business logic encapsulation
   - Feature-specific hooks and utilities

## Theming System

### Theme Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        // ... other color definitions
      }
    }
  }
};
```

### Theme Provider Implementation
```javascript
// components/theme/ThemeProvider.jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Routing Structure

### Route Configuration
```javascript
// routers/routeTree.js
export const routes = [
  {
    path: '/',
    component: lazy(() => import('../pages/Welcome')),
    children: []
  },
  {
    path: '/sitewidesettings',
    component: lazy(() => import('../pages/SiteWideSettingsPage'))
  }
];
```

### Route Protection Pattern
```javascript
// routers/ProtectedRoute.jsx
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```

## Global State Management

### Context Providers
1. **GlobalProvider**
```javascript
// store/GlobalContext.jsx
export const GlobalProvider = ({ children }) => {
  const [clientVars, setClientVars] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('MMClientVars')) || null;
    } catch {
      return null;
    }
  });

  const value = useMemo(() => ({
    clientVars,
    setClientVars: (newVars) => {
      setClientVars(newVars);
      localStorage.setItem('MMClientVars', JSON.stringify(newVars));
    }
  }), [clientVars]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
```

## Development Workflow

### Available Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Development Tools
- **React Query DevTools**: Available in development mode
- **Error Boundary**: Graceful error handling with fallback UI
- **Strict Mode**: Development-time checks for potential issues
- **ESLint**: Code quality and style enforcement

## Best Practices

### Code Organization
- Feature-based architecture for scalability
- Clear separation of concerns
- Reusable component patterns
- Type-safe development with Zod

### Performance Considerations
- Code splitting through lazy loading
- React Query for efficient data fetching
- Optimized bundle size
- Suspense for loading states

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Additional Resources
- [React Query Documentation](https://tanstack.com/query/latest)
- [ShadCN UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Zod Documentation](https://zod.dev)

## Cursor AI Integration

### Auto-Update Mechanism
The context.md file is designed to be automatically updated by Cursor AI when changes are made to the codebase. This ensures that the documentation stays in sync with the actual implementation.

### Update Triggers
The following actions will trigger automatic updates to context.md:
1. **File Changes**: When Cursor AI modifies any file in the project
2. **New Files**: When new files or directories are added
3. **Dependency Updates**: When package.json is modified
4. **Configuration Changes**: When config files (vite.config.js, tailwind.config.js, etc.) are updated

### Update Process
1. Cursor AI analyzes the changes made to the codebase
2. Updates relevant sections of context.md
3. Maintains consistency with existing documentation
4. Preserves manual documentation while updating automated sections

### Sections That Auto-Update
- Project Structure (when files/directories change)
- Tech Stack (when dependencies change)
- API Integration (when services or endpoints change)
- Component Architecture (when components are added/modified)
- Routing Structure (when routes change)
- Global State Management (when context providers change)

### Manual Override
While most sections auto-update, some sections can be manually maintained:
- Project Overview
- Key Architectural Decisions
- Best Practices
- Getting Started Guide
- Additional Resources

### Version Control
- Changes to context.md are tracked in version control
- Each auto-update includes a reference to the triggering change
- Manual modifications are preserved in git history

# SiteWide Defaults Feature Documentation

## Feature Purpose
The SiteWide Defaults feature is responsible for managing global settings that affect the entire application. It provides a centralized location for administrators to configure system-wide behaviors and feature toggles across different modules like Ad Management, Account Receivables, Production, etc.

## Directory Structure

### `/components/`
- **FeatureSettings.jsx**: The main UI component that renders the settings interface. Uses ShadCN UI components (Card, Tabs, Switch, etc.) to present settings organized by categories with appropriate toggle controls and input fields.

### `/context/`
- **Context.js**: Defines the React context object and a custom hook (`useFeatureSettings`) for accessing the feature settings throughout the application.
- **FeatureSettingsProvider.jsx**: Context provider that manages the state, API data fetching, and actions for manipulating settings.
- **Reducer.js**: Contains reducer logic to handle state updates through defined actions.
- **Actions.js**: Defines action types used by the reducer.
- **initialState.js**: Defines the default state structure with initial values for all settings.

### `/hooks/`
- **useDashboard.js**: Custom hook for accessing dashboard-related data.
- **useSiteWideList.js**: Custom hook that uses React Query to fetch the list of sitewide settings from the API.

### `/helpers/`
- **constants.helper.js**: Contains constant values used across the feature, like tab definitions for the settings UI.

### `/services/`
- **sitewideService.js**: Defines API service functions for fetching and updating sitewide settings using Axios.

### `/index.jsx`
- Entry point for the feature that renders the FeatureSettingsProvider and main FeatureSettings component.

## Tools & Libraries Used

- **ShadCN UI**: Used for UI components like Card, Tabs, Switch, Button, etc. to provide a consistent design experience.
- **React Query**: Used with Axios for data fetching and caching (visible in useSiteWideList.js).
- **React Context API**: Used with a reducer pattern for state management within the feature.
- **Axios**: For API communication with backend services.

## Feature Integration

The feature is integrated into the application through its `index.jsx` file, which renders the main `SiteWideDefaultsPage` component. This component wraps the `FeatureSettings` UI inside the `FeatureSettingsProvider` to ensure all child components have access to the settings state and actions.

When loaded, the feature:
1. Fetches current settings from the backend using React Query and Axios
2. Initializes context with data or falls back to default values
3. Renders the tabbed interface that allows administrators to view and modify settings
4. Provides actions to toggle, update, and save settings

## Assumptions & Dependencies

- Requires access to a REST API endpoint at `/services/Admin/SiteSettings/All`
- Assumes the global axiosInstance from `@/services/axiosInstance` is configured correctly
- Depends on ShadCN UI components from `@/components/ui/`
- Assumes only administrators have access to this feature

## State Structure & Key Actions

### State Structure
The state is organized into sections representing different areas of the application:
- adManagement: Settings for ad-related functionality
- accountReceivable: Settings for billing and financial operations
- production: Settings for production capabilities
- contact: Settings for contact management
- customerPortal: Settings for customer portal features
- userSettings: Settings for user access and restrictions
- communications: Settings for communication features
- googleCalendar: Settings for calendar integration
- helpdesk: Settings for support functions
- mediaMailKit: Settings for media assets

### Key Actions
- **TOGGLE_SETTING**: Toggles boolean settings on/off
- **UPDATE_SETTING**: Updates setting values with new input
- **LOAD_SETTINGS**: Initializes state with data from API
- **SET_NEW_SUPPLIER**: Updates new supplier input field
- **ADD_SUPPLIER**: Adds a supplier to the list
- **REMOVE_SUPPLIER**: Removes a supplier from the list
- **UPDATE_INVENTORY**: Updates inventory-related settings
