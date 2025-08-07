interface DocumentItem {
  id: string;
  title: string;
  type: 'api' | 'guide' | 'reference' | 'changelog' | 'readme' | 'context' | 'architecture';
  lastUpdated: string;
  size: string;
  description: string;
  content: string;
  category: 'core' | 'technical' | 'api' | 'guides';
}

export const documentsData: DocumentItem[] = [
  {
    id: 'readme',
    title: 'README.md',
    type: 'readme',
    category: 'core',
    lastUpdated: '2024-06-02',
    size: '12KB',
    description: 'Project overview, setup instructions, and technology stack',
    content: `# Microservice Administration Platform

A comprehensive React-based administration platform for managing three-tier microservice architectures with enterprise-grade tools and monitoring capabilities.

## Features

### Current Features
- **Admin Dashboard**: Complete overview of microservice health and metrics
- **Service Monitoring**: Real-time status monitoring for all microservices
- **Authentication Management**: API key generation and permission management
- **Edit Mode System**: Administrative editing capabilities with toggle controls
- **Help System**: Contextual help tooltips and instruction management
- **Documentation Library**: Comprehensive documentation viewer and search

### Key Components
- **Editable Select Fields**: Dynamic dropdown editing with admin controls
- **Floating Label Inputs**: Enhanced form inputs with smooth animations
- **Help Tooltips**: Context-sensitive help system
- **Service Status Monitoring**: Real-time health checks and alerts

## Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and developer experience
- **Vite**: Fast build tool and development server

### UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
- **Lucide React**: Modern icon library
- **Radix UI**: Primitive components for accessibility

### State Management
- **React Context**: Global state for Edit Mode and Help systems
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation

### Development Tools
- **Vitest**: Modern testing framework
- **ESLint**: Code linting and quality
- **TypeScript**: Static type checking

## Installation and Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start development server: \`npm run dev\`
4. Open http://localhost:5173

### Build for Production
\`\`\`bash
npm run build
npm run preview
\`\`\`

## Architecture Overview

### Component Structure
\`\`\`
src/
├── pages/           # Page components
├── components/      # Reusable components
├── contexts/        # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── types/          # TypeScript type definitions
\`\`\`

### Key Patterns
- **Provider Pattern**: Global state management with React Context
- **Compound Components**: Complex UI components with multiple parts
- **Custom Hooks**: Reusable stateful logic
- **Type-First Development**: Comprehensive TypeScript usage

## API Documentation

### Current Data Patterns
- Mock data for development and testing
- RESTful API design patterns
- Type-safe interfaces for all data structures

### Future Integration
- Microservice API endpoints
- Authentication and authorization
- Real-time data updates

## Deployment

### Lovable Platform
This project is designed for deployment on the Lovable platform:
1. Push changes to your Lovable project
2. Use the Publish button in the Lovable interface
3. Configure custom domain if needed (paid plans)

### Manual Deployment
For other platforms:
\`\`\`bash
npm run build
# Deploy the dist/ folder to your hosting provider
\`\`\`

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow React best practices
- Keep components small and focused (50 lines or less)
- Use Tailwind CSS for styling

### Component Guidelines
- Create new files for each component
- Use proper TypeScript interfaces
- Include prop documentation
- Follow accessibility guidelines

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request

## License

This project is proprietary and confidential.`
  },
  {
    id: 'context',
    title: 'context.md',
    type: 'context',
    category: 'core',
    lastUpdated: '2024-06-02',
    size: '8KB',
    description: 'Detailed project context for AI understanding and development',
    content: `# Project Context for AI Development

## Project Overview
This is a React-based administration platform for managing three-tier microservice architectures. The application serves as a central control panel for system administrators to monitor, configure, and manage distributed microservices.

## Architecture Patterns

### Component Architecture
- **Page Components**: Top-level route components (Index.tsx)
- **Feature Components**: Business logic components (AdminDashboard, SettingsPage)
- **UI Components**: Reusable interface elements (EditableSelect, HelpTooltip)
- **Context Providers**: Global state management (EditModeContext, HelpContext)

### State Management Patterns
- **Edit Mode**: Global toggle for administrative editing capabilities
- **Help System**: Contextual help with editable instructions
- **Local State**: Component-specific state for forms and UI interactions

### Design Patterns Used
1. **Provider Pattern**: Global state with React Context
2. **Compound Components**: Complex components with multiple parts
3. **Render Props**: Flexible component composition
4. **Custom Hooks**: Reusable stateful logic

## Component Inventory and Relationships

### Core Pages
- **Index.tsx** (35 lines): Main application shell with navigation
  - Manages active tab state
  - Renders appropriate page components
  - Provides layout structure

### Major Components
- **Navigation.tsx** (150 lines): Main navigation bar
  - Global search functionality
  - Edit mode toggle in dropdown
  - Command palette (Cmd+K)
  - Responsive navigation items

- **AdminDashboard.tsx** (45 lines): Dashboard overview
  - Service status overview
  - Quick action buttons
  - Metrics display

- **SettingsPage.tsx** (85 lines): Application settings
  - Edit mode configuration
  - System preferences
  - Includes EditableSelectDemo

### Specialized Components
- **EditableSelect.tsx** (175 lines): Dynamic dropdown with editing
  - Shows edit icon when Edit Mode enabled
  - Inline option editing and management
  - Type-safe option handling

- **DocumentationViewer.tsx** (235 lines): Documentation library
  - File browser with search
  - Document preview
  - Type-based categorization

- **HelpManagement.tsx** (110 lines): Help system administration
  - Edit help instructions
  - Manage contextual tooltips
  - Field-specific help content

### Context Systems
- **EditModeContext**: Global edit mode state
  - Toggle administrative editing
  - Used by EditableSelect and settings
  - Provider wraps entire application

- **HelpContext**: Help system management
  - Store help instructions per field
  - Update help content dynamically
  - Field ID-based help retrieval

## Current Feature Status

### Implemented Features ✅
- Complete navigation system with search
- Edit mode toggle functionality
- Editable select components with admin controls
- Help tooltip system with management interface
- Documentation viewer with categorization
- Settings page with edit mode controls
- Responsive design with Tailwind CSS

### In Development 🚧
- Service monitoring dashboard
- API key management
- Real-time status updates
- Authentication system integration

### Planned Features 📋
- Backend API integration
- Real microservice monitoring
- User authentication and roles
- Advanced analytics dashboard
- Notification system

## Development Guidelines and Constraints

### Component Size Guidelines
- Keep components under 50 lines when possible
- Split large components (DocumentationViewer at 235 lines needs refactoring)
- Create focused, single-responsibility components

### Code Quality Standards
- Use TypeScript for all new code
- Implement proper error handling
- Follow React best practices
- Maintain accessibility standards

### Styling Conventions
- Use Tailwind CSS exclusively
- Follow shadcn/ui design system
- Implement responsive design patterns
- Use semantic color classes

### State Management Rules
- Use Context for global state only
- Keep local state in components
- Implement proper state cleanup
- Use custom hooks for complex logic

### File Organization
- One component per file
- Co-locate related components
- Use descriptive file names
- Maintain consistent import order

## Performance Considerations
- Lazy load large components
- Implement proper memoization
- Optimize re-renders with React.memo
- Use efficient state updates

## Current Technical Debt
1. **DocumentationViewer.tsx**: Too large (235 lines), needs refactoring
2. **Navigation.tsx**: Complex component, could be split
3. **Missing test coverage**: Need component tests
4. **Type definitions**: Some implicit any types need explicit typing

## Development Environment
- **Build Tool**: Vite for fast development
- **Package Manager**: npm/yarn
- **Testing**: Vitest framework
- **Linting**: ESLint with TypeScript rules
- **Deployment**: Lovable platform`
  },
  {
    id: 'changelog',
    title: 'CHANGELOG.md',
    type: 'changelog',
    category: 'technical',
    lastUpdated: '2024-06-02',
    size: '4KB',
    description: 'Version history, changes, and migration guides',
    content: `# Changelog

All notable changes to the Microservice Administration Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-02

### Added - Initial Release
- **Core Navigation System**
  - Responsive navigation bar with gradient design
  - Global search functionality with Command+K shortcut
  - Command palette for quick navigation
  - Settings dropdown with edit mode toggle

- **Edit Mode System**
  - Global edit mode toggle functionality
  - EditModeContext for state management
  - Visual indicators for edit-enabled fields
  - Administrative editing capabilities

- **Help System**
  - Contextual help tooltips for form fields
  - HelpContext for centralized help management
  - HelpManagement component for editing help content
  - Field-specific help instructions with IDs

- **Admin Dashboard**
  - Service monitoring overview
  - Quick action buttons
  - System metrics display
  - Responsive grid layout

- **Settings Management**
  - Centralized settings page
  - Edit mode configuration interface
  - System preference controls
  - Demo components for feature testing

- **Documentation System**
  - Documentation viewer with search functionality
  - Multiple document type support (API, guides, reference, changelog)
  - Document categorization and filtering
  - Preview functionality with syntax highlighting

- **Component Library**
  - EditableSelect: Dynamic dropdowns with admin editing
  - FloatingLabelInput: Enhanced form inputs
  - HelpTooltip: Contextual help components
  - FieldWithHelp: Form fields with integrated help

### Technical Implementation
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling approach
- **shadcn/ui**: High-quality component library integration
- **TanStack Query**: Server state management (prepared for future API integration)
- **Vite**: Fast development and build tooling

### Architecture Decisions
- Provider pattern for global state management
- Component composition for complex UI elements
- Custom hooks for reusable stateful logic
- Type-first development approach
- Responsive design with mobile-first approach

## [Unreleased]

### Planned for v1.1.0
- **Service Monitoring**
  - Real-time service health monitoring
  - Service status dashboard
  - Alert system for service failures
  - Performance metrics tracking

- **API Integration**
  - Backend API connection
  - Authentication system
  - Real-time data updates
  - Error handling and retry logic

- **User Management**
  - User authentication
  - Role-based access control
  - User profile management
  - Permission system

### Planned for v1.2.0
- **Advanced Analytics**
  - Service performance analytics
  - Usage statistics
  - Custom dashboard creation
  - Data export functionality

- **Notification System**
  - Real-time notifications
  - Email alerts
  - Notification preferences
  - Alert management

## Migration Guides

### From v0.x to v1.0.0
This is the initial release, no migration needed.

### Future Migrations
Migration guides will be provided for breaking changes in future versions.

## Breaking Changes

### v1.0.0
- Initial release, no breaking changes

## Bug Fixes

### v1.0.0
- Initial release, baseline functionality established

## Performance Improvements

### v1.0.0
- Implemented React.memo for component optimization
- Efficient re-rendering with proper dependency arrays
- Lazy loading patterns for large components
- Optimized bundle size with tree shaking

## Security Updates

### v1.0.0
- Secure TypeScript implementation
- Proper prop validation
- XSS prevention through React's built-in protections
- Prepared for secure API integration

## Development Notes

### Code Quality
- ESLint configuration for consistent code style
- TypeScript strict mode enabled
- Component testing framework setup
- Continuous integration preparation

### Documentation
- Comprehensive component documentation
- TypeScript interface documentation
- Development guidelines established
- Architecture decision records

---

**Note**: This changelog will be updated with each release. For detailed commit history, refer to the project's version control system.`
  },
  {
    id: 'architecture',
    title: 'ARCHITECTURE.md',
    type: 'architecture',
    category: 'technical',
    lastUpdated: '2024-06-02',
    size: '15KB',
    description: 'System architecture overview, component hierarchy, and design patterns',
    content: `# System Architecture

## Overview

The Microservice Administration Platform is built using a modern React architecture designed for scalability, maintainability, and developer experience. The application follows a three-tier architecture pattern with clear separation of concerns.

## Architecture Layers

### 1. Presentation Layer (UI Components)
- **shadcn/ui Components**: Base UI primitives and styled components
- **Custom Components**: Application-specific components with business logic
- **Layout Components**: Navigation, page structure, and responsive layouts

### 2. Business Logic Layer (Application State)
- **React Context**: Global state management for cross-cutting concerns
- **Custom Hooks**: Reusable stateful logic and API interactions
- **Component State**: Local state for UI interactions and form handling

### 3. Data Layer (Future Integration)
- **TanStack Query**: Server state management and caching
- **Mock Data**: Development-time data structures
- **Type Definitions**: TypeScript interfaces for data contracts

## Component Hierarchy

\`\`\`
App.tsx
├── Providers
│   ├── QueryClientProvider
│   ├── TooltipProvider
│   ├── EditModeProvider
│   └── HelpProvider
└── Router
    └── Index.tsx (Main Page)
        ├── Navigation.tsx
        │   ├── Search functionality
        │   ├── Command palette
        │   └── Settings dropdown
        └── Active Tab Content
            ├── AdminDashboard.tsx
            │   ├── DashboardOverview
            │   ├── DashboardMetrics
            │   ├── ServiceStatusList
            │   ├── DatabaseStatus
            │   └── QuickActions
            ├── SettingsPage.tsx
            │   ├── EditableSelectDemo
            │   └── Configuration options
            ├── HelpGuide.tsx
            │   └── HelpManagement
            └── DocumentationViewer.tsx
                ├── Document browser
                ├── Search interface
                └── Document preview
\`\`\`

## Design Patterns

### 1. Provider Pattern
**Implementation**: Global state management using React Context

\`\`\`typescript
// Edit Mode Context
const EditModeContext = createContext<{
  isEditMode: boolean;
  toggleEditMode: () => void;
}>()

// Help Context
const HelpContext = createContext<{
  helpInstructions: Record<string, string>;
  updateHelpInstruction: (fieldId: string, instruction: string) => void;
}>()
\`\`\`

**Benefits**:
- Centralized state management
- Avoid prop drilling
- Clean component composition

### 2. Compound Components
**Implementation**: Complex components with multiple related parts

\`\`\`typescript
// EditableSelect with integrated editing
<EditableSelect
  options={options}
  value={value}
  onChange={setValue}
  canEdit={isEditMode}
  onEditOptions={handleEditOptions}
/>
\`\`\`

**Benefits**:
- Encapsulated complexity
- Flexible composition
- Clear component contracts

### 3. Custom Hooks Pattern
**Implementation**: Reusable stateful logic

\`\`\`typescript
// Edit Mode Hook
const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) throw new Error('useEditMode must be used within EditModeProvider');
  return context;
};

// Help Hook
const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) throw new Error('useHelp must be used within HelpProvider');
  return context;
};
\`\`\`

**Benefits**:
- Reusable logic
- Clean component separation
- Testable business logic

### 4. Render Props Pattern
**Implementation**: Flexible component composition

\`\`\`typescript
// HelpTooltip with render prop for content
<HelpTooltip
  fieldId="username"
  render={(instruction) => (
    <div className="help-content">{instruction}</div>
  )}
/>
\`\`\`

## Data Flow Patterns

### 1. Unidirectional Data Flow
- State flows down through props
- Events flow up through callbacks
- Context provides global state access

### 2. State Management Strategy

**Global State (Context)**:
- Edit mode toggle
- Help instructions
- User preferences

**Local State (Component)**:
- Form inputs
- UI interactions
- Temporary state

**Server State (Future)**:
- API data caching
- Real-time updates
- Background synchronization

## File Organization

\`\`\`
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui base components
│   ├── dashboard/      # Dashboard-specific components
│   └── *.tsx           # Application components
├── contexts/           # React Context providers
│   ├── EditModeContext.tsx
│   └── HelpContext.tsx
├── hooks/              # Custom React hooks
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/                # Utility functions
│   └── utils.ts
├── pages/              # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
└── types/              # TypeScript definitions
\`\`\`

## Component Design Principles

### 1. Single Responsibility
Each component has one clear purpose:
- \`EditableSelect\`: Dropdown with editing capabilities
- \`HelpTooltip\`: Contextual help display
- \`FloatingLabelInput\`: Enhanced form input

### 2. Composition over Inheritance
Components are composed rather than extended:
- \`FieldWithHelp\` = \`Input\` + \`HelpTooltip\`
- \`EditableSelect\` = \`Select\` + \`EditingInterface\`

### 3. Props Interface Design
Clear, typed interfaces for all components:

\`\`\`typescript
interface EditableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  canEdit?: boolean;
  onEditOptions?: (options: Option[]) => void;
  placeholder?: string;
}
\`\`\`

## Performance Considerations

### 1. Component Optimization
- React.memo for pure components
- useMemo for expensive calculations
- useCallback for stable function references

### 2. Bundle Optimization
- Tree shaking with ES modules
- Lazy loading for large components
- Code splitting at route level

### 3. Rendering Optimization
- Minimize re-renders with proper dependencies
- Efficient state updates
- Avoid inline object/function creation

## Styling Architecture

### 1. Tailwind CSS Utility-First
- Consistent spacing and sizing
- Responsive design patterns
- Component-scoped styling

### 2. Design System Integration
- shadcn/ui component library
- Consistent color palette
- Standardized component variants

### 3. Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Adaptive component behavior

## Error Handling Strategy

### 1. Component Level
- Error boundaries for component trees
- Graceful degradation for failed features
- User-friendly error messages

### 2. Context Level
- Safe context access with error checking
- Default fallbacks for missing providers

### 3. TypeScript Safety
- Strict type checking
- Interface validation
- Compile-time error prevention

## Security Considerations

### 1. XSS Prevention
- React's built-in protection
- Sanitized user inputs
- Safe dynamic content rendering

### 2. Type Safety
- Strict TypeScript configuration
- Interface validation
- Prop type checking

### 3. Future API Security
- Authentication token management
- HTTPS-only communication
- Input validation and sanitization

## Scalability Patterns

### 1. Feature-Based Organization
Components organized by feature domains:
- Dashboard components
- Authentication components
- Settings components

### 2. Shared Component Library
Reusable components for consistency:
- Form inputs
- Layout components
- Utility components

### 3. Context Segregation
Separate contexts for different concerns:
- Edit mode state
- Help system state
- User authentication (future)

## Testing Strategy

### 1. Component Testing
- Unit tests for individual components
- Integration tests for component groups
- Visual regression testing

### 2. Hook Testing
- Custom hook testing with React Testing Library
- Context provider testing
- State management testing

### 3. End-to-End Testing
- User flow testing
- Feature integration testing
- Cross-browser compatibility

## Development Workflow

### 1. Component Development
1. Define TypeScript interfaces
2. Implement component logic
3. Add styling with Tailwind
4. Write tests
5. Document usage

### 2. Feature Development
1. Plan component hierarchy
2. Create necessary contexts/hooks
3. Implement components
4. Integrate with existing features
5. Update documentation

### 3. Refactoring Guidelines
- Monitor component size (target: <50 lines)
- Extract reusable logic to hooks
- Split large components into smaller ones
- Maintain backward compatibility

## Future Architecture Considerations

### 1. State Management Evolution
- Consider Redux Toolkit for complex state
- Implement state persistence
- Add state devtools integration

### 2. Performance Monitoring
- Add performance metrics
- Implement lazy loading
- Monitor bundle size

### 3. Backend Integration
- API layer architecture
- Real-time data synchronization
- Offline capability

---

This architecture document should be updated as the system evolves and new patterns are introduced.`
  },
  {
    id: '1',
    title: 'API Reference',
    type: 'api',
    category: 'api',
    lastUpdated: '2024-01-15',
    size: '45KB',
    description: 'Complete API documentation for all microservices',
    content: `# API Reference

## Authentication
All API requests require authentication using Bearer tokens.

\`\`\`
Authorization: Bearer <your-token>
\`\`\`

## Endpoints

### User Service
- GET /api/users - Get all users
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Auth Service  
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- POST /api/auth/refresh - Refresh token`
  },
  {
    id: '2',
    title: 'Deployment Guide',
    type: 'guide',
    category: 'guides',
    lastUpdated: '2024-01-14',
    size: '28KB',
    description: 'Step-by-step deployment instructions',
    content: `# Deployment Guide

## Prerequisites
- Docker and Docker Compose
- MSSQL Server 2019+
- Node.js 18+

## Environment Setup
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Configure environment variables
4. Run migrations: \`npm run migrate\`

## Docker Deployment
\`\`\`bash
docker-compose up -d
\`\`\``
  },
  {
    id: '3',
    title: 'Configuration Reference',
    type: 'reference',
    category: 'guides',
    lastUpdated: '2024-01-13',
    size: '32KB',
    description: 'Configuration options and environment variables',
    content: `# Configuration Reference

## Environment Variables

### Database Configuration
- DB_HOST - Database host (default: localhost)
- DB_PORT - Database port (default: 1433)
- DB_NAME - Database name
- DB_USER - Database username
- DB_PASSWORD - Database password

### Service Configuration
- PORT - Service port (default: 3000)
- NODE_ENV - Environment (development/production)
- LOG_LEVEL - Logging level (debug/info/warn/error)`
  },
  {
    id: '4',
    title: 'Changelog v2.1.0',
    type: 'changelog',
    category: 'technical',
    lastUpdated: '2024-01-12',
    size: '15KB',
    description: 'Recent updates and bug fixes',
    content: `# Changelog v2.1.0

## Added
- New authentication middleware
- Enhanced error handling
- Performance monitoring dashboard
- Docker support for all services

## Fixed
- Memory leak in user service
- Race condition in payment processing
- Database connection pooling issues

## Changed
- Updated to Node.js 18
- Improved API response times
- Enhanced security headers`
  }
];

export type { DocumentItem };
