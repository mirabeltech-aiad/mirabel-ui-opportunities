
/**
 * Utility functions for documentation content
 * Extracted from DocumentationTab for better organization
 */

export const getContributingContent = () => {
  return `# Contributing Guidelines

This document provides guidelines for contributing to the Opportunities Pipeline Management System.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Basic understanding of React, TypeScript, and Tailwind CSS
- Familiarity with shadcn/ui component library

## 📋 Code Style Guidelines

### Component Creation Standards
- **File Naming**: Use PascalCase for components
- **Size Limit**: Keep components under 100 lines when possible
- **Single Responsibility**: Each component should have one clear purpose
- **TypeScript First**: Use TypeScript for all new components

### Naming Conventions
- **Components**: PascalCase (OpportunityCard)
- **Functions**: camelCase (handleSubmit)
- **Variables**: camelCase (selectedItems)
- **Constants**: UPPER_SNAKE_CASE (API_ENDPOINTS)

## 🎨 Styling Guidelines

### Tailwind CSS Standards
- Use utility classes extensively
- Follow the custom color scheme defined in tailwind.config.ts
- Use custom component classes from @layer components
- Maintain responsive design patterns

### Color Scheme Consistency
- Primary: #1a4d80 (Navy Blue)
- Secondary: #4fb3ff (Sky Blue)
- Accent: #e0e0e0 (Light Grey)

## 🧩 Component Guidelines

### Creating New Components
1. Create focused, single-purpose components
2. Use TypeScript interfaces for props
3. Include JSDoc comments for complex logic
4. Add unit tests for business logic

## 🧪 Testing Requirements

### Unit Tests
- Test business logic and utility functions
- Use Vitest with React Testing Library
- Aim for 80%+ coverage on critical paths

## 📝 Documentation Standards

### JSDoc Comments
Always document complex functions with proper JSDoc syntax.

## 🚦 Pull Request Process

### Before Submitting
1. Run all tests: npm run test
2. Check TypeScript: tsc --noEmit
3. Lint code: npm run lint
4. Test build: npm run build

---

For complete guidelines, see the full CONTRIBUTING.md file in the project root.`;
};

export const getDeploymentContent = () => {
  return `# Deployment Guide

This document provides comprehensive instructions for deploying the Opportunities Pipeline Management System across different environments and platforms.

## 🚀 Quick Deployment Options

### Lovable Platform (Recommended for Development)
The fastest way to deploy is using Lovable's built-in deployment:

1. **Click the "Publish" button** in the Lovable editor
2. **Configure your domain** (custom domains require paid plan)
3. **Deploy instantly** - your app will be live at yourproject.lovable.app

### Production Deployment
For production environments, we recommend static hosting with CDN support.

## 📋 Prerequisites

### Development Environment
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git for version control

### Production Environment
- Static hosting service (Vercel, Netlify, AWS S3, etc.)
- CDN for optimal performance
- Custom domain (optional)
- SSL certificate (usually provided by hosting service)

## 🛠 Build Process

### Local Development Build
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:5173
\`\`\`

### Production Build
\`\`\`bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Build output will be in /dist folder
\`\`\`

## 🌐 Hosting Platforms

### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set up automatic deployments from GitHub
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
\`\`\`

### Environment Variables
Create environment-specific configuration for different deployment targets.

### Security Considerations
- Never commit .env files with sensitive data
- Use hosting platform environment variable management
- Enable HTTPS for all production deployments

### Performance Optimization
- Enable gzip/brotli compression
- Set proper cache headers
- Use HTTP/2 for improved performance

### Troubleshooting
Common deployment issues and their solutions are documented in the full DEPLOYMENT.md file.

---

For complete deployment instructions, see the full DEPLOYMENT.md file in the project root.`;
};

export const getApiContent = () => {
  return `# API Documentation

This document provides comprehensive API documentation for the Opportunities Pipeline Management System, including endpoints, schemas, authentication patterns, and integration guidelines.

## 🔗 API Overview

### Base Configuration
- **Development**: \`http://localhost:3000/api\`
- **Production**: \`https://api.yourcompany.com\`
- **API Version**: \`v1\`
- **Content Type**: \`application/json\`
- **Authentication**: Bearer Token (JWT)

### Response Format
All API responses follow a consistent structure:

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}
\`\`\`

## 🔐 Authentication

### JWT Token Structure
\`\`\`typescript
interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'manager' | 'sales_rep';
  permissions: string[];
  exp: number;
  iat: number;
}
\`\`\`

### Login Endpoint
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "securePassword123"
}
\`\`\`

## 🎯 Opportunities API

### Get All Opportunities
\`\`\`http
GET /api/opportunities
Authorization: Bearer <token>

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- status: string (Open|Closed|Won|Lost|Draft)
- stage: string
- assignedRep: string
- search: string
- sortBy: string (name|company|amount|createdDate)
- sortOrder: string (asc|desc)
\`\`\`

### Create Opportunity
\`\`\`http
POST /api/opportunities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Business Opportunity",
  "company": "Target Company Ltd",
  "stage": "1st Demo",
  "amount": 25000,
  "projCloseDate": "2025-07-15",
  "source": "Website",
  "leadSource": "Organic Search",
  "leadType": "Inbound",
  "assignedRep": "Jane Smith"
}
\`\`\`

---

For complete API documentation, see the full API.md file in the project root.`;
};

export const getTestingContent = () => {
  return `# Testing Guidelines

This document provides comprehensive testing guidelines for the Opportunities Pipeline Management System, covering testing strategies, patterns, and coverage requirements.

## 🧪 Testing Philosophy

### Our Testing Approach
- **Test-Driven Development (TDD)**: Write tests before implementation when possible
- **Behavior-Driven Testing**: Focus on user behavior and business requirements
- **Pyramid Strategy**: Unit tests (70%) > Integration tests (20%) > E2E tests (10%)
- **Fast Feedback**: Tests should run quickly and provide immediate feedback

### Testing Principles
- **Reliable**: Tests should be deterministic and not flaky
- **Fast**: Test suite should complete in under 30 seconds
- **Isolated**: Tests should not depend on each other
- **Maintainable**: Tests should be easy to read and update

## 🏗 Testing Stack

### Core Testing Tools
- **Vitest**: Modern test runner with Vite integration
- **React Testing Library**: Component testing with user-centric approach
- **Jest DOM**: Extended matchers for DOM testing
- **MSW**: Mock Service Worker for API mocking

## 📁 Test Organization

### Directory Structure
\`\`\`
src/
├── __tests__/                    # Global test utilities
│   ├── utils/
│   │   ├── testUtils.js          # Test helpers
│   │   ├── mockDataGenerators.js # Mock data factories
│   │   └── integrationHelpers.js # Integration test helpers
├── components/
│   ├── ComponentName/
│   │   ├── __tests__/            # Component-specific tests
│   │   │   └── ComponentName.test.jsx
│   │   └── ComponentName.jsx
\`\`\`

## 🧪 Unit Testing

### Component Testing Patterns
\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import OpportunityCard from '../OpportunityCard';

describe('OpportunityCard', () => {
  const mockOpportunity = {
    id: 1,
    name: 'Test Opportunity',
    company: 'Test Company',
    amount: 50000,
    stage: 'Discovery'
  };

  it('displays opportunity information correctly', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);
    
    expect(screen.getByText('Test Opportunity')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });
});
\`\`\`

## 📊 Test Coverage Requirements

### Coverage Targets
- **Overall Coverage**: Minimum 80%
- **Critical Business Logic**: 95%
- **Components**: 85%
- **Utility Functions**: 90%
- **Hooks**: 85%

## 🎯 Testing Best Practices

### Do's
- ✅ Test user behavior, not implementation details
- ✅ Use meaningful test descriptions
- ✅ Keep tests simple and focused
- ✅ Mock external dependencies
- ✅ Test edge cases and error scenarios

### Don'ts
- ❌ Test implementation details
- ❌ Test third-party library functionality
- ❌ Write overly complex test setups
- ❌ Ignore test failures

---

For complete testing guidelines, see the full TESTING.md file in the project root.`;
};

export const getTroubleshootingContent = () => {
  return `# Troubleshooting Guide

This document provides comprehensive troubleshooting guidance for the Opportunities Pipeline Management System, covering common issues, debug procedures, and solution patterns.

## 🚨 Common Issues

### Application Startup Issues

#### Port Already in Use
**Problem**: Development server fails to start with "Port 5173 is already in use"
**Solution**:
\`\`\`bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
\`\`\`

#### Module Not Found Errors
**Problem**: Import errors or missing module messages
**Solution**:
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if needed
npm cache clean --force
\`\`\`

### UI and Styling Issues

#### Components Not Displaying
**Problem**: Components render but appear invisible or broken
**Checklist**:
- Check Tailwind classes are applied correctly
- Verify parent container has proper height/width
- Inspect CSS conflicts in browser DevTools
- Ensure z-index layering is correct

#### Missing Icons
**Problem**: Lucide React icons not appearing
**Solution**:
\`\`\`javascript
// Verify correct import syntax
import { ChevronDown, User, Settings } from 'lucide-react';

// Check icon is properly used
<ChevronDown className="h-4 w-4" />
\`\`\`

### Data and State Issues

#### Infinite Loading States
**Problem**: Components stuck in loading state
**Solution**:
\`\`\`javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['opportunities'],
  queryFn: fetchOpportunities,
  retry: 3,
  staleTime: 5 * 60 * 1000
});

if (error) {
  console.error('Query error:', error);
  return <div>Error loading data</div>;
}
\`\`\`

#### State Not Updating
**Problem**: Component state changes don't reflect in UI
**Solution**:
\`\`\`javascript
// Bad: Direct mutation
state.items.push(newItem);

// Good: Immutable update
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));
\`\`\`

## 🔧 Debug Procedures

### Browser Developer Tools

#### Console Debugging
\`\`\`javascript
// Add strategic console logs
console.log('Component rendered with props:', props);
console.log('State updated:', newState);
console.error('API call failed:', error);

// Use debugger statements
debugger; // Execution will pause here
\`\`\`

### Performance Monitoring

#### Bundle Analysis
\`\`\`bash
# Analyze bundle size
npm run build
npm install -g bundlephobia
bundlephobia analyze package.json
\`\`\`

## 🛠 Solution Patterns

### Error Boundary Implementation
\`\`\`javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
\`\`\`

---

For complete troubleshooting guidance, see the full TROUBLESHOOTING.md file in the project root.`;
};

export const renderDocumentContent = (docId) => {
  switch (docId) {
    case 'contributing':
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            {getContributingContent()}
          </pre>
        </div>
      );
    case 'deployment':
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            {getDeploymentContent()}
          </pre>
        </div>
      );
    case 'api':
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            {getApiContent()}
          </pre>
        </div>
      );
    case 'testing':
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            {getTestingContent()}
          </pre>
        </div>
      );
    case 'troubleshooting':
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            {getTroubleshootingContent()}
          </pre>
        </div>
      );
    default:
      return (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">This documentation file hasn't been created yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            It will be available once added to the project.
          </p>
        </div>
      );
  }
};
