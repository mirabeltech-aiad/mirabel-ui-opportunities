# Navbar Feature Documentation

## Overview
The Navbar feature provides a comprehensive navigation system with enhanced dashboard management that replicates the SetupDashboard logic from the original .NET application. This feature includes tab management, dashboard processing with token authentication, and Marketing Manager URL handling.

## Enhanced Dashboard Logic (.NET Migration)

### SetupDashboard Implementation
The dashboard system now implements the complete SetupDashboard logic from .NET, including:

1. **Marketing Manager URL Domain Resolution**
   - Automatically determines MKM domain based on session data
   - Supports development and production environments
   - Falls back to configured default domain

2. **Dashboard URL Processing**
   - Processes MKM URLs (containing `ISMKM=1`) with domain prefixing
   - Automatically appends access tokens for authenticated requests
   - Handles both relative and absolute URLs

3. **Default Dashboard Selection**
   - Selects dashboard marked with `IsDefault: true`
   - Falls back to first available dashboard if no default exists
   - Maintains dashboard state across tab operations

4. **Package Type Handling**
   - Detects CRM_Int package type from session data
   - Adds special MKM menu items for CRM_Int packages
   - Differentiates admin vs. regular user MKM URLs

5. **Token Management**
   - Retrieves session tokens from localStorage
   - Appends tokens to MKM URLs as `accesstoken` parameter
   - Ensures secure authenticated dashboard access

## Directory Structure

```
src/features/Navbar/
├── components/
│   ├── Navbar/
│   │   ├── Navbar.tsx              # Main navbar component
│   │   ├── NavbarLogo.tsx          # Logo component
│   │   ├── NavbarMenu.tsx          # Dropdown menu system
│   │   ├── NavbarSearch.tsx        # Search functionality
│   │   └── NavbarActions.tsx       # Action buttons
│   └── TabSystem/
│       ├── TabNavigation.tsx       # Enhanced tab navigation with dashboard dropdown
│       ├── TabContent.tsx          # Tab content renderer
│       └── TabContentRenderer.tsx  # Individual tab content handling
├── context/
│   ├── TabContext.tsx              # Tab state management
│   └── NavigationConfigContext.tsx # Navigation configuration
├── hooks/
│   ├── useTabManagement.ts         # Tab manipulation hooks
│   ├── useTabPersistence.ts        # Tab state persistence
│   └── useIframeMessaging.ts       # Iframe communication
├── services/
│   ├── dashboardApi.js             # Enhanced dashboard API with .NET logic
│   └── tabStorage.ts               # Tab storage utilities
├── types/
│   └── tab.types.ts                # TypeScript type definitions
├── helpers/
│   └── constants.ts                # Default tab configurations
├── context.md                      # This documentation file
└── index.tsx                       # Feature entry point
```

## Enhanced Dashboard API Service

### Core Functions

#### `setupDashboard()`
Implements complete .NET SetupDashboard logic:

```javascript
const setup = await setupDashboard();
// Returns:
{
  dashboards: DashboardItem[],           // All processed dashboards
  processedDashboards: DashboardItem[],  // Original dashboards from API
  selectedDashboard: DashboardItem,      // Default/selected dashboard
  additionalMenuItems: DashboardItem[],  // CRM_Int specific items
  mkmDomain: string,                     // Resolved MKM domain
  packageType: string,                   // Package type from session
  isAdmin: boolean,                      // Admin status
  hasToken: boolean,                     // Token availability
  setup: {
    totalDashboards: number,
    mkmDashboards: number,               // Count of MKM processed dashboards
    defaultSelected: boolean
  }
}
```

#### `getMarketingManagerURL()`
Resolves MKM domain using session data:
- Development: Returns configured test domain
- Production: Constructs domain from session data
- Fallback: Uses default domain configuration

#### Dashboard URL Processing
- **MKM URLs**: Automatically prefixed with domain and appended with access token
- **Regular URLs**: Ensured to have proper domain prefix
- **Token Handling**: Secure parameter encoding and URL construction

### Package Type Logic

#### CRM_Int Package Handling
When `PackageTypeID` matches `CRM_Int` or `10178`:
- **Admin Users**: Adds "Settings" menu pointing to `/WebsiteSetup.aspx?ISMKM=1`
- **Regular Users**: Adds "MKM Dashboard" pointing to `/DataUsageReport.aspx?ISMKM=1`
- **Token Security**: Automatically appends access tokens to MKM URLs

## Tab Management System

### Enhanced Tab Navigation
The `TabNavigation` component provides:

1. **Dashboard Dropdown**: First tab shows current dashboard with dropdown selection
2. **Dynamic Loading**: Loads dashboard setup on component mount
3. **State Management**: Maintains current dashboard and tab states
4. **Visual Indicators**: Shows MKM and special dashboard types
5. **Error Handling**: Graceful fallback to default dashboards

### Tab Types and Properties

```typescript
interface Tab {
  id: string;
  title: string;
  type: 'fixed' | 'dynamic';
  component?: React.ComponentType | string;
  iframeUrl?: string;
  isCloseable: boolean;
  isActive: boolean;
  // Enhanced dashboard properties
  dashboardId?: string | number;
  dashboardData?: DashboardItem;
}
```

### Dashboard Item Structure

```typescript
interface DashboardItem {
  ID: string | number;
  DashBoardName: string;
  URL: string;
  IsDefault: boolean;
  isProcessedMKM?: boolean;    // Indicates MKM URL processing
  isMKMSpecial?: boolean;      // Indicates CRM_Int special item
}
```

## Integration Points

### Authentication Integration
- **Session Management**: Integrates with `AuthContext` for session data
- **Token Handling**: Uses `sessionHelpers` for token retrieval
- **Development Mode**: Supports development session values

### Storage Integration
- **localStorage**: Persists tab state and session data
- **sessionStorage**: Cross-tab validation and state management

### API Integration
- **Axios Service**: Uses configured HTTP client for dashboard API calls
- **Error Handling**: Comprehensive error handling with fallback data
- **Response Processing**: Handles multiple API response structures

## Usage Examples

### Basic Dashboard Setup
```javascript
import { setupDashboard } from './services/dashboardApi';

const loadDashboards = async () => {
  const setup = await setupDashboard();
  console.log('Dashboard setup:', setup);
  
  // Use selected dashboard
  if (setup.selectedDashboard) {
    // Dashboard URL is already processed with domain and token
    const url = setup.selectedDashboard.URL;
  }
};
```

### Dashboard Selection Handling
```javascript
const handleDashboardSelection = (dashboard) => {
  // URL is already processed by setupDashboard
  const processedUrl = dashboard.URL;
  
  // Check if it's an MKM dashboard
  if (dashboard.isProcessedMKM) {
    console.log('MKM dashboard with token');
  }
  
  // Update tab with new dashboard
  updateTab(tabId, {
    title: dashboard.DashBoardName,
    iframeUrl: processedUrl,
    dashboardData: dashboard
  });
};
```

### Package Type Detection
```javascript
// Automatic detection in setupDashboard
if (packageType === 'CRM_Int') {
  // Additional MKM menu items are automatically added
  console.log('CRM_Int package detected');
  console.log('Additional items:', setup.additionalMenuItems);
}
```

## Development and Debugging

### Console Logging
The dashboard setup provides comprehensive logging:
- 🔧 Setup initialization
- 📍 Domain resolution
- 📊 Dashboard processing
- 🔑 Token handling
- 🎯 Dashboard selection
- 🔗 URL processing

### Development Mode Features
- **Mock Data**: Automatic fallback to test data
- **Domain Override**: Uses development domain configuration
- **Session Simulation**: Works with development session values
- **Error Simulation**: Graceful handling of API failures

### Debugging Utilities
```javascript
// Available in console during development
devHelper.checkSession()     // Check current session
devHelper.initSession()      // Force initialize session
devHelper.clearSession()     // Clear session data
```

## Error Handling

### Fallback Mechanisms
1. **API Failure**: Falls back to hardcoded dashboard list
2. **Token Missing**: Continues without token (for public dashboards)
3. **Domain Resolution**: Uses configured default domain
4. **Dashboard Selection**: Falls back to first available dashboard

### Error Logging
All errors are logged with descriptive messages and context:
```javascript
console.error('❌ Error in setupDashboard:', error);
```

## Performance Considerations

### Optimization Features
- **Single API Call**: setupDashboard fetches all required data once
- **Processed URLs**: URLs are processed once and cached
- **Lazy Loading**: Tab content is loaded only when needed
- **Memory Management**: Proper cleanup of event listeners and state

### Caching Strategy
- **Session Data**: Cached in localStorage for quick access
- **Dashboard List**: Processed once and reused
- **Tab State**: Persisted across browser sessions

## Security Features

### Token Handling
- **Secure Encoding**: Proper URL encoding of access tokens
- **Development Safety**: Mock tokens for development environment
- **Cross-tab Security**: Session validation across browser tabs

### URL Processing
- **Domain Validation**: Ensures URLs use correct domain
- **Parameter Safety**: Secure parameter appending
- **Fallback Security**: Safe defaults for missing data

## Future Enhancements

### Planned Features
1. **Real-time Dashboard Updates**: WebSocket integration for live updates
2. **Dashboard Customization**: User-configurable dashboard layouts
3. **Advanced Filtering**: Dashboard filtering by category/type
4. **Performance Metrics**: Dashboard loading time monitoring

### Migration Notes
- This implementation maintains 100% compatibility with the original .NET SetupDashboard method
- All original features are preserved and enhanced
- Session management integrates seamlessly with existing authentication
- API responses are processed to match expected data structures

## Dependencies

### Internal Dependencies
- `AuthContext`: User authentication and session management
- `sessionHelpers`: Session data retrieval and management
- `AxiosService`: HTTP client for API requests
- `developmentHelper`: Development mode utilities

### External Dependencies
- `react`: Core React functionality
- `lucide-react`: Icon components
- `@/components/ui/*`: ShadCN UI components

## API Endpoints

### Dashboard API
- **Endpoint**: `/services/User/Dashboards/false`
- **Method**: GET
- **Response**: Dashboard list with metadata
- **Processing**: Automatic URL processing and token appending

### Session API Integration
- **Token Source**: localStorage `MMClientVars.Token`
- **Domain Source**: localStorage `MMClientVars.Domain`
- **Package Type**: localStorage `MMClientVars.PackageTypeID`
- **Admin Status**: localStorage `MMClientVars.IsAdmin` 