# Navbar Feature Documentation

## Overview
The Navbar feature provides a comprehensive navigation system with enhanced dashboard management that replicates the SetupDashboard logic from the original .NET application. This feature includes tab management, dashboard processing with token authentication, Marketing Manager URL handling, and automatic session data transformation.

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

## Session Data Transformation

### Overview
The system now includes automatic transformation of complex API responses into a simplified, flattened format that's stored in localStorage as `MMnewclientvars`.

### Transformation Process

#### Input Format (API Response)
Complex nested structure from `/services/admin/common/SessionDetailsGet`:
```javascript
{
  "data": {
    "content": {
      "Status": "Success",
      "UserId": 1,
      "ClientId": 10007,
      "AuthenticationInfo": {
        "Claims": {
          "LoggedInUserID": 1,
          "Domain": "smoke-feature13",
          // ... other claims
        }
      },
      "SessionDetails": {
        "UserName": "sa@magazinemanager.com",
        "Token": {
          "AccessToken": "eyJhbGci...",
          "AccessTokenExpiredTime": "2025-08-15T04:22:21.637"
        },
        "ClientsDetails": [{
          "ClientInformation": {
            "ClientID": 10007,
            "Name": "Mirabel Development...",
            "ClientAddress": "smoke-feature13.magazinemanager.com"
          },
          "DataPackDetails": {
            "PackageTypeID": 1,
            "IsMKMEnabled": true
          }
        }]
      }
    }
  }
}
```

#### Output Format (Transformed)
Flattened structure stored in localStorage:
```javascript
{
  "UserID": 1,
  "Email": "sa@magazinemanager.com",
  "IsAdmin": true,
  "IsAuthenticated": true,
  "Token": "eyJhbGci...",
  "IsSA": "true",
  "UserName": "Administrator System",
  "ClientID": "10007",
  "Host": "smoke-feature13.magazinemanager.com",
  "Domain": "smoke-feature13",
  "PackageTypeID": "1",
  "ProductType": "10178",
  "IsMKMEnabled": "True",
  "CompanyName": "Mirabel Development...",
  // ... other fields
}
```

### Data Mapping Logic

#### Key Transformations
1. **User Information**
   - `UserId` → `UserID`
   - `SessionDetails.UserName` → `Email`
   - Admin detection based on email pattern

2. **Authentication**
   - `SessionDetails.Token.AccessToken` → `Token`
   - `SessionDetails.Token.AccessTokenExpiredTime` → `AccessTokenTimeOut`
   - Auto-set `IsAuthenticated: true`

3. **Client Information**
   - `ClientId` → `ClientID`
   - `ClientInformation.Name` → `CompanyName`
   - `ClientInformation.ClientAddress` → `Host`
   - `Claims.Domain` → `Domain`

4. **Package Information**
   - `DataPackDetails.PackageTypeID` → `PackageTypeID` and `ProductType`
   - `DataPackDetails.IsMKMEnabled` → `IsMKMEnabled`

#### Admin Detection Logic
```javascript
const isAdmin = email.toLowerCase().includes('sa@') || 
                email.toLowerCase().includes('admin');
```

### Storage Strategy

#### Dual Storage System
1. **Primary**: `MMnewclientvars` - New transformed format
2. **Compatibility**: `MMClientVars` - Updated for backward compatibility

#### Session Data Retrieval
The dashboard service uses a fallback mechanism:
```javascript
const getSessionData = (key) => {
  // 1. Try MMnewclientvars first
  const newData = localStorage.getItem('MMnewclientvars');
  if (newData && JSON.parse(newData)[key]) {
    return JSON.parse(newData)[key];
  }
  
  // 2. Fallback to MMClientVars
  return getSessionValue(key);
};
```

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
- Production: Constructs domain from session data (`Host` or `Domain`)
- Fallback: Uses default domain configuration

#### Dashboard URL Processing
- **MKM URLs**: Automatically prefixed with domain and appended with access token
- **Regular URLs**: Ensured to have proper domain prefix
- **Token Handling**: Secure parameter encoding and URL construction

### Package Type Logic

#### CRM_Int Package Handling
When `PackageTypeID` matches `CRM_Int`, `10178`, or `1`:
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
- **Token Handling**: Uses transformed session data from `MMnewclientvars`
- **Development Mode**: Supports development session values

### Storage Integration
- **localStorage**: Dual storage system (`MMnewclientvars` + `MMClientVars`)
- **sessionStorage**: Cross-tab validation and state management
- **Automatic Transformation**: API responses automatically transformed before storage

### API Integration
- **Axios Service**: Uses configured HTTP client for dashboard API calls
- **Session Transformation**: Automatic transformation of session details API responses
- **Error Handling**: Comprehensive error handling with fallback data
- **Response Processing**: Handles multiple API response structures

## Usage Examples

### Session Data Transformation
```javascript
import { navigationService } from './services/navigationService';

// Load and transform session data
const sessionData = await navigationService.loadSessionDetails();
// Automatically transforms complex API response and stores in localStorage

// Access transformed data
const userEmail = sessionData.Email;
const isAdmin = sessionData.IsAdmin;
const token = sessionData.Token;
```

### Dashboard Setup with Transformed Data
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

### Session Data Updates
```javascript
import { navigationService } from './services/navigationService';

// Update session data
const updatedData = navigationService.updateSessionData({
  IsAdmin: true,
  CompanyName: 'Updated Company Name'
});
// Updates both MMnewclientvars and MMClientVars
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
The system provides comprehensive logging:
- 🔄 Session data transformation
- 📊 Raw API responses
- ✅ Storage operations
- 🔧 Dashboard setup initialization
- 📍 Domain resolution
- 🔑 Token handling
- 🎯 Dashboard selection
- 🔗 URL processing

### Development Mode Features
- **Mock Data**: Automatic fallback to test data
- **Domain Override**: Uses development domain configuration
- **Session Simulation**: Works with development session values
- **Error Simulation**: Graceful handling of API failures
- **Transformation Logging**: Detailed logs of data transformation process

### Debugging Utilities
```javascript
// Available in console during development
devHelper.checkSession()     // Check current session
devHelper.initSession()      // Force initialize session
devHelper.clearSession()     // Clear session data

// Navigation service utilities
navigationService.getSessionDetails()  // Get transformed session data
navigationService.updateSessionData()  // Update session data
```

## Error Handling

### Fallback Mechanisms
1. **API Failure**: Falls back to hardcoded dashboard list
2. **Token Missing**: Continues without token (for public dashboards)
3. **Domain Resolution**: Uses configured default domain
4. **Dashboard Selection**: Falls back to first available dashboard
5. **Data Transformation**: Returns fallback data structure on transformation errors

### Error Logging
All errors are logged with descriptive messages and context:
```javascript
console.error('❌ Error in setupDashboard:', error);
console.error('❌ Error transforming session data:', error);
```

## Performance Considerations

### Optimization Features
- **Single API Call**: Session transformation happens once during initial load
- **Cached Transformations**: Transformed data cached in localStorage
- **Dual Storage**: Maintains compatibility while optimizing access
- **Lazy Loading**: Tab content is loaded only when needed
- **Memory Management**: Proper cleanup of event listeners and state

### Caching Strategy
- **Session Data**: Cached in dual localStorage format for quick access
- **Dashboard List**: Processed once and reused
- **Tab State**: Persisted across browser sessions
- **Transformation Cache**: Avoids repeated API calls

## Security Features

### Token Handling
- **Secure Encoding**: Proper URL encoding of access tokens
- **Development Safety**: Mock tokens for development environment
- **Cross-tab Security**: Session validation across browser tabs
- **Token Extraction**: Secure extraction from complex API responses

### URL Processing
- **Domain Validation**: Ensures URLs use correct domain
- **Parameter Safety**: Secure parameter appending
- **Fallback Security**: Safe defaults for missing data

### Data Transformation Security
- **Input Validation**: Safe parsing of complex API responses
- **Error Handling**: Secure fallback data on transformation errors
- **Key Mapping**: Secure extraction of sensitive data like tokens

## Future Enhancements

### Planned Features
1. **Real-time Dashboard Updates**: WebSocket integration for live updates
2. **Dashboard Customization**: User-configurable dashboard layouts
3. **Advanced Filtering**: Dashboard filtering by category/type
4. **Performance Metrics**: Dashboard loading time monitoring
5. **Enhanced Transformation**: More sophisticated data mapping rules

### Migration Notes
- This implementation maintains 100% compatibility with the original .NET SetupDashboard method
- All original features are preserved and enhanced
- Session management integrates seamlessly with existing authentication
- API responses are automatically transformed to expected data structures
- Dual storage system ensures backward compatibility

## Dependencies

### Internal Dependencies
- `AuthContext`: User authentication and session management
- `sessionHelpers`: Session data retrieval and management (fallback)
- `AxiosService`: HTTP client for API requests
- `developmentHelper`: Development mode utilities
- `navigationService`: Session data transformation and storage

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

### Session API
- **Endpoint**: `/services/admin/common/SessionDetailsGet`
- **Method**: GET
- **Response**: Complex nested session data
- **Processing**: Automatic transformation to flattened format

### Session Data Sources
- **New Format**: localStorage `MMnewclientvars` (transformed)
- **Legacy Format**: localStorage `MMClientVars` (backward compatibility)
- **Token**: Extracted from `SessionDetails.Token.AccessToken`
- **Domain**: Extracted from `Claims.Domain` or `ClientInformation.ClientAddress`
- **Package Type**: Extracted from `DataPackDetails.PackageTypeID`
- **Admin Status**: Derived from email pattern matching 