# Mirabel UI Project Documentation

> **Important Note**: This project uses TypeScript exclusively for better type safety and developer experience. All code examples and implementations should be in TypeScript (.ts/.tsx files).

### TypeScript-First Policy
- All new code must be written in TypeScript (.ts/.tsx files)
- Use proper TypeScript type annotations and interfaces
- Leverage TypeScript's strict mode for maximum type safety
- Use TypeScript configuration files (tsconfig.json)
- Prefer TypeScript types over JSDoc comments
- Use TypeScript for compile-time type checking and validation
- Follow TypeScript best practices for type safety
- Use ESLint with TypeScript rules for code quality
- Gradually migrate existing JavaScript files to TypeScript

## Project Overview
Mirabel UI is a modern React application built with Vite, utilizing React Query for data management, ShadCN UI components, and a robust theming system. The project follows a feature-based architecture with clear separation of concerns.

### Key Architectural Decisions
- **Feature-First Organization**: Each feature is self-contained with its own components, hooks, and services
- **Performance-Focused**: Code splitting, lazy loading, and efficient data fetching patterns
- **Developer Experience**: Comprehensive error boundaries, development tools, and clear documentation

## Tech Stack & Dependencies

### Core Framework
- **React 18**: Latest version with concurrent features and automatic batching
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Modern type-safe JavaScript with strict type checking

### State Management
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
│   ├── feature1/  # feature name
│   │   ├── components/    # Feature-specific components
│   │   ├── context/      # Context and state management
│   │   ├── hooks/        # Custom hooks
│   │   ├── helpers/      # Helper functions and constants
│   │   ├── services/     # API services
│   │   ├── context.md    # Feature documentation
│   │   └── index.jsx     # Feature entry point
│   ├── feature2/  # feature name
│   │   ├── components/    # Feature-specific components
│   │   ├── context/      # Context and state management
│   │   ├── hooks/        # Custom hooks
│   │   ├── helpers/      # Helper functions and constants
│   │   ├── services/     # API services
│   │   ├── context.md    # Feature documentation
│   │   └── index.jsx     # Feature entry point
│   └── [feature]/        # Other features following same structure
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
├── store/         # Global state management - useContext always be global 
│   ├── GlobalContext.jsx
│   └── ThemeProvider.jsx
└── styles/        # Global styles and Tailwind configuration
    ├── index.css  # Global styles
    └── tailwind.css # Tailwind imports
```

## Important Feature Development Guidelines

### 1. Feature Structure
When creating a new feature, follow this structure:
```
features/
└── [feature]/
    ├── components/     # Feature-specific UI components
    │   ├── MainComponent.jsx    # Primary component for the feature
    │   ├── SubComponent.jsx     # Supporting components
    │   └── index.js            # Component exports
    │
    ├── context/       # State management and context
    │   ├── Context.js          # Context definition and provider
    │   ├── Actions.js          # Action types and creators
    │   ├── Reducer.js          # State update logic
    │   ├── initialState.js     # Default state values
    │   └── index.js           # Context exports
    │
    ├── hooks/         # Custom React hooks
    │   ├── useFeatureData.js   # Data fetching hooks
    │   ├── useFeatureState.js  # State management hooks
    │   └── index.js           # Hook exports
    │
    ├── helpers/       # Utility functions and constants
    │   ├── constants.js        # Feature-specific constants
    │   ├── formatters.js       # Data formatting utilities
    │   └── validators.js       # Validation functions
    │
    ├── services/      # API integration
    │   ├── api.js             # API service functions
    │   ├── endpoints.js        # API endpoint definitions
    │   └── transformers.js     # Data transformation logic
    │
    ├── context.md     # Feature documentation
    │   - Purpose and overview
    │   - Directory structure
    │   - Component documentation
    │   - State management details
    │   - API integration
    │   - Dependencies
    │
    └── index.jsx      # Feature entry point
        - Exports main components
        - Sets up providers
        - Handles routing
```

Each directory serves a specific purpose:

1. **components/**: Contains all UI components specific to the feature
   - Main components handle the primary feature functionality
   - Sub-components break down complex UI into manageable pieces
   - Each component should be focused on a single responsibility
   - Use ShadCN UI components for consistent styling

2. **context/**: Manages feature-specific state
   - Context.js defines the React context and provider
   - Actions.js contains all possible state modifications
   - Reducer.js implements state update logic
   - initialState.js provides default values
   - Follows a reducer pattern for predictable state updates

3. **hooks/**: Custom React hooks for feature logic
   - Data fetching hooks using Axios
   - State management hooks for context access
   - Form handling hooks for complex forms
   - Each hook should be focused on a single concern
   - Example structure:
     ```javascript
     // hooks/useFeatureData.js
     import { useState, useEffect } from 'react';
     import { featureService } from '../services/api';

     export const useFeatureData = () => {
       const [data, setData] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
         const fetchData = async () => {
           try {
             setLoading(true);
             const response = await featureService.getData();
             setData(response.data);
           } catch (err) {
             setError(err);
           } finally {
             setLoading(false);
           }
         };

         fetchData();
       }, []);

       return { data, loading, error };
     };
     ```

4. **helpers/**: Utility functions and constants
   - Constants for feature-specific values
   - Formatters for data transformation
   - Validators for input validation
   - Pure functions with no side effects

5. **services/**: API integration layer
   - API service functions using Axios
   - Endpoint definitions and configurations
   - Data transformation between API and UI
   - Error handling and response processing

6. **context.md**: Feature documentation
   - Clear explanation of feature purpose
   - Detailed directory structure
   - Component usage and props
   - State management patterns
   - API integration details
   - Dependencies and assumptions

7. **Index.jsx**: Feature entry point
   - Exports main components
   - Sets up necessary providers
   - Handles routing configuration
   - Initializes feature state

### 2. Component Conventions
- Use functional components with hooks
- Follow ShadCN UI component patterns
- Implement proper error boundaries
- Include loading states
- Use proper prop validation

Example component structure:
```jsx
// features/[feature]/components/FeatureComponent.jsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const FeatureComponent = ({ className, ...props }) => {
  return (
    <div className={cn("feature-container", className)}>
      {/* Component content */}
    </div>
  );
};
```

### 3. API Integration Pattern
Use Axios for data fetching with custom hooks:

```jsx
// features/[feature]/services/api.js
import { api } from "@/services/api";

export const featureService = {
  getData: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  },
  postData: async (data) => {
    const response = await api.post('/endpoint', data);
    return response.data;
  }
};

// features/[feature]/hooks/useFeatureData.js
import { useState, useEffect } from "react";
import { featureService } from "../services/api";

export const useFeatureData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await featureService.getData();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
```

### 4. State Management
- Use Context API for global UI state
- Keep feature-specific state local
- Use custom hooks for API state management

Example context pattern:
```jsx
// features/[feature]/context/FeatureContext.jsx
import { createContext, useContext, useState } from "react";

const FeatureContext = createContext(undefined);

export const FeatureProvider = ({ children }) => {
  // ... state and logic

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};
```

### 5. Form Handling
Use React Hook Form:

```jsx
// features/[feature]/components/FeatureForm.jsx
import { useForm } from "react-hook-form";

export const FeatureForm = () => {
  const form = useForm({
    // ... form configuration
  });
  
  // ... form implementation
};
```

### 6. Theming Integration
Follow the project's theming system:

```jsx
// features/[feature]/components/FeatureComponent.jsx
import { cn } from "@/lib/utils";

export const FeatureComponent = ({ className }) => {
  return (
    <div className={cn(
      "bg-background text-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      className
    )}>
      {/* Component content */}
    </div>
  );
};
```

### 7. Error Handling
Implement proper error boundaries and error states:

```jsx
// features/[feature]/components/ErrorBoundary.jsx
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export const FeatureErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset logic
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
```

### 8. Loading States
Use consistent loading patterns:

```jsx
// features/[feature]/components/LoadingState.jsx
import { Skeleton } from "@/components/ui/skeleton";

export const FeatureLoadingState = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
};
```

## Integration Checklist
When generating a new feature, ensure:

1. ✅ Follows the project's folder structure
2. ✅ Uses functional components with hooks
3. ✅ Implements proper error handling
4. ✅ Includes loading states
5. ✅ Uses Axios for data fetching
6. ✅ Follows ShadCN UI component patterns
7. ✅ Implements proper form handling
8. ✅ Uses the project's theming system
9. ✅ Includes proper prop validation
10. ✅ Follows the project's naming conventions

## Naming Conventions
- Components: PascalCase (e.g., `FeatureComponent.jsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useFeatureData.js`)
- Utilities: camelCase (e.g., `featureUtils.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `FEATURE_CONSTANTS.js`)

## Best Practices
1. Keep components small and focused
2. Use proper prop validation
3. Implement proper error handling
4. Include loading states
5. Follow accessibility guidelines
6. Use proper semantic HTML
7. Implement proper form handling
8. Use proper state management with Context API
9. Follow the project's theming system
10. Include proper documentation

## Testing Guidelines

### Project Test Organization
```
src/
├── __tests__/                  # Global tests (optional)
├── assets/                    # Static assets
├── components/                # Reusable UI components
│   ├── shared/               # Common components
│   │   └── Button.test.jsx   # Example test
│   ├── layout/               # Layout components
│   │   └── Header.test.jsx
│   └── ui/                   # ShadCN UI components
├── config/                    # Config files
├── features/                  # Feature-specific logic
│   ├── feature1/
│   │   ├── components/
│   │   │   └── Card.test.jsx
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── helpers/
│   │   ├── services/
│   │   └── index.jsx
│   └── feature2/
│       ├── components/
│       │   └── Table.test.jsx
│       ├── context/
│       ├── hooks/
│       ├── helpers/
│       ├── services/
│       └── index.jsx
├── hooks/                     # Global hooks
│   └── useAuth.test.js
├── lib/                       # Utilities
│   └── utils.test.js
├── pages/                     # Page-level components
│   └── Welcome.test.jsx
├── routers/                   # Route configurations
├── services/                  # API services
├── store/                     # Global state providers
├── styles/                    # Global styling
└── test/                      # Global test setup (e.g., setup.js)
```

### Testing Guidelines

#### 1. Test File Organization
- Place test files next to the files they test (e.g., `Component.jsx` and `Component.test.jsx`)
- Use `.test.jsx` or `.test.js` extension for test files
- Group related tests in `__tests__` directories when needed

#### 2. Test Types
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows
- **Snapshot Tests**: Test UI components for unexpected changes

#### 3. Test Structure with RTL and Vitest
```jsx
// Example component test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### 4. Testing Utilities

##### React Testing Library (RTL)
RTL provides a set of utilities to test React components in a way that resembles how users interact with your app.

###### Common RTL Queries
```jsx
import { render, screen } from '@testing-library/react';

// By Role (Recommended)
screen.getByRole('button', { name: 'Submit' });
screen.getByRole('textbox', { name: 'Username' });
screen.getByRole('link', { name: 'Learn more' });

// By Label Text
screen.getByLabelText('Username');
screen.getByLabelText('Password');

// By Placeholder Text
screen.getByPlaceholderText('Enter your email');

// By Text Content
screen.getByText('Welcome back');
screen.getByText(/welcome back/i); // Case insensitive

// By Test ID (Last resort)
screen.getByTestId('submit-button');
```

###### Common RTL Actions
```jsx
import { render, screen, fireEvent } from '@testing-library/react';

// Click
fireEvent.click(screen.getByRole('button'));

// Type
fireEvent.change(screen.getByRole('textbox'), {
  target: { value: 'new value' }
});

// Submit
fireEvent.submit(screen.getByRole('form'));

// Focus/Blur
fireEvent.focus(screen.getByRole('textbox'));
fireEvent.blur(screen.getByRole('textbox'));
```

###### RTL Best Practices
1. Use role-based queries first
2. Test from a user's perspective
3. Avoid testing implementation details
4. Use accessible queries
5. Test user interactions, not component internals

###### Example RTL Component Test
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with user credentials', () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // Assert the form was submitted with correct data
    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });

  it('shows validation errors for empty fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // Check for error messages
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
```

##### Vitest
- Test runner and assertion library
- Provides mocking capabilities
- Supports async testing
- Includes coverage reporting

#### 5. Mocking with Vitest
```jsx
// Example API mock
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: mockData })),
    post: vi.fn(() => Promise.resolve({ data: mockResponse }))
  }
}));
```

#### 6. Test Setup
```javascript
// test/setup.js
import { vi } from 'vitest';

// Global mocks
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' })
}));

// Global test environment setup
beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
});
```

#### 7. Vitest Configuration
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/setup.js',
      ]
    }
  }
});
```

#### 8. Test Coverage
- Run tests with coverage: `npm run test:coverage`
- Minimum coverage requirements:
  - Statements: 80%
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%

#### 9. Best Practices
1. Test behavior, not implementation
2. Use meaningful test descriptions
3. Keep tests focused and isolated
4. Use proper setup and teardown
5. Mock external dependencies
6. Test error cases
7. Use proper assertions
8. Maintain test readability
9. Follow AAA pattern (Arrange, Act, Assert)
10. Keep tests fast and reliable

#### 10. Common Test Patterns
```jsx
// Testing hooks with RTL and Vitest
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';
import { describe, it, expect } from 'vitest';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});

// Testing context with RTL and Vitest
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { describe, it, expect } from 'vitest';

describe('ThemeProvider', () => {
  it('provides theme context', () => {
    render(
      <ThemeProvider>
        <ThemedComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
```

## Documentation Requirements
1. Include proper JSDoc comments
2. Document component props
3. Document hooks
4. Document utilities
5. Document constants
6. Document API integration
7. Document state management
8. Document form handling
9. Document theming usage
10. Document error handling patterns

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
5. **Feature Changes**: When feature files or structure is modified

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

### Feature Documentation
Each feature has its own `context.md` file that is automatically maintained:

1. **Feature Context Structure**
   - Feature purpose and overview
   - Directory structure
   - Component documentation
   - State management details
   - API integration
   - Dependencies and assumptions

2. **Auto-Update Triggers for Feature Context**
   - New component additions
   - State management changes
   - API endpoint modifications
   - Configuration updates
   - Dependency changes

3. **Feature Context Maintenance**
   - Automatically updates when feature files change
   - Preserves manual documentation sections
   - Maintains consistency with main context.md
   - Tracks feature-specific dependencies
   - Documents feature-specific patterns

4. **Integration with Main Context**
   - Feature context files are referenced in main context.md
   - Changes in feature context trigger main context updates
   - Maintains cross-referencing between features
   - Ensures documentation consistency

### Manual Override
While most sections auto-update, some sections can be manually maintained:
- Project Overview
- Key Architectural Decisions
- Best Practices
- Getting Started Guide
- Additional Resources
- Feature-specific documentation in feature context.md files

### Version Control
- Changes to context.md are tracked in version control
- Each auto-update includes a reference to the triggering change
- Manual modifications are preserved in git history
- Feature context.md changes are tracked separately
