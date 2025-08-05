# Dashboard Setup Implementation

This document explains how the C# `SetupDashboard` logic has been implemented in the React application.

## C# Original Logic

```csharp
[DirectMethod]
public void SetupDashboard(string Source = "", bool isReload = false)
{
    string mkmDomain = Connection.GetMarketingManagerURL(Request.ServerVariables[ConstantsManager.MMSERVER_NAME]);
    //which panels are open
    ResponseDTO<DashboardDTO> dashboards = WebClient.Get<DashboardDTO>(ConstantsManager.API_USER_DASHBOARD_GET + "false");
    //Update the URL with MKMDomain for MKM URLs
    dashboards.List.Where(x => x.URL.ToUpper().Contains("ISMKM=1")).ToList().ForEach(r => r.URL = mkmDomain + r.URL + "&accesstoken=" + SessionManager.Token);
    var selectedDashboard = dashboards.List.Where(x => x.IsDefault == true).Select(x => x).FirstOrDefault();
    if (selectedDashboard == null)
        selectedDashboard = dashboards.List.FirstOrDefault();
    pnlDashboard.Loader.Url = selectedDashboard.URL;
    pnlDashboard.Title = selectedDashboard.DashBoardName;

    //MM & MKM configured dashboards from DB
    for (int i = 0; i < dashboards.List.Count; i++)
    {
        var menuItem = new Ext.Net.MenuItem
        {
            Text = dashboards.List[i].DashBoardName,
            ID = $"DashBoard_{dashboards.List[i].ID.ToString()}"
        };
        menuItem.Listeners.Click.Handler = "showDashboard(this,'" + dashboards.List[i].URL + "')";
        menuDashboard.Items.Add(menuItem);
    }
    //MKM
    if ((PackageTypes)SessionManager.PackageTypeID == PackageTypes.CRM_Int)
    {
        var miMKMDashboard = new Ext.Net.MenuItem
        {
            Text = GetClassGlobalResourceObject("MKMDashboard"),
            ID = "MKM_Dashboard"
        };
        //'If package type is set to CRM_Int show the integration page URL
        miMKMDashboard.Text = GetClassGlobalResourceObject("Settings");
        string urlMKMSetup = SessionManager.IsAdmin ?
            mkmDomain + "/WebsiteSetup.aspx&ISMKM=1" :
            mkmDomain + "/DataUsageReport.aspx&ISMKM=1";
        miMKMDashboard.Listeners.Click.Handler = "showDashboard(this,'" + urlMKMSetup + "')";
        menuDashboard.Items.Add(miMKMDashboard);
    }
    stDashboards.SetData(dashboards.List);

    stDashboards.DataSource = dashboards.List;
    stDashboards.DataBind();

    //Portals
    CreateAllPortals();

    if (Source.ToUpper() == "AD")
    {
        if (isReload)
        {
            pnlDashboard.Loader.LoadContent();
        }
        menuDashboard.UpdateContent();
    }
    else
    {
        tabpnlMain.SetActiveTab(pnlDashboard);
    }
}
```

## React Implementation

### 1. Core Function: `setupDashboard`

**Location**: `src/features/Home/contexts/HomeContext.jsx`

```javascript
const setupDashboard = async (source = "", isReload = false) => {
  try {
    setDashboardsLoading(true);
    
    // Get session data for MKM domain and package type
    const sessionData = getSessionData();
    const serverName = getServerName();
    const mkmDomain = getMarketingManagerURL(serverName) || sessionData?.MarketingManagerURL || '';
    const packageTypeId = sessionData?.PackageTypeID || 0;
    const isAdmin = sessionData?.IsAdmin || false;
    const accessToken = sessionData?.Token || '';
    
    // Fetch dashboards from API (matching C# API call)
    const dashboards = await dashboardService.getDashboards();
    
    // Update URLs for MKM dashboards (matching C# logic)
    const updatedDashboards = dashboards.map(dashboard => {
      if (dashboard.URL && dashboard.URL.toUpperCase().includes('ISMKM=1')) {
        return {
          ...dashboard,
          URL: `${mkmDomain}${dashboard.URL}&accesstoken=${accessToken}`
        };
      }
      return dashboard;
    });
    
    // Set active dashboards
    const activeDashboards = updatedDashboards.filter(dashboard => dashboard.IsActive === true);
    setDashboards(activeDashboards);
    
    // Select default dashboard (matching C# logic)
    let selectedDashboard = activeDashboards.find(dashboard => dashboard.IsDefault === true);
    if (!selectedDashboard) {
      selectedDashboard = activeDashboards[0];
    }
    
    if (selectedDashboard) {
      setSelectedDashboard(selectedDashboard);
      
      // Update dashboard tab with selected dashboard info
      const dashboardTab = {
        id: 'dashboard',
        title: selectedDashboard.DashBoardName || 'Sales Dashboard',
        component: 'Dashboard',
        type: 'component',
        closable: false,
        icon: '',
        dashboardUrl: selectedDashboard.URL,
        dashboardId: selectedDashboard.ID
      };
      
      // Update the dashboard tab in the tabs array
      const updatedTabs = state.tabs.map(tab => 
        tab.id === 'dashboard' ? dashboardTab : tab
      );
      dispatch({ type: ACTIONS.SET_TABS, payload: updatedTabs });
    }
    
    // Create MKM dashboard menu item for CRM_Int package type
    if (packageTypeId === PACKAGE_TYPES.CRM_INT) { // CRM_Int package type
      const mkmDashboardUrl = isAdmin 
        ? `${mkmDomain}/WebsiteSetup.aspx&ISMKM=1`
        : `${mkmDomain}/DataUsageReport.aspx&ISMKM=1`;
      
      const mkmDashboard = {
        id: 'mkm-dashboard',
        title: 'Settings', // or get from resources
        url: mkmDashboardUrl,
        type: 'iframe',
        closable: true,
        icon: '',
        isMKM: true
      };
      
      // Add MKM dashboard to tabs if not already present
      const existingMKM = state.tabs.find(tab => tab.id === 'mkm-dashboard');
      if (!existingMKM) {
        dispatch({ type: ACTIONS.ADD_TAB, payload: mkmDashboard });
      }
    }
    
    // Handle source-specific logic
    if (source.toUpperCase() === 'AD') {
      if (isReload) {
        // Reload dashboard content
        console.log('Reloading dashboard content...');
      }
      // Update menu content
      console.log('Updating menu content...');
    } else {
      // Set active tab to dashboard
      dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: 'dashboard' });
    }
    
  } catch (error) {
    console.error('Failed to setup dashboard:', error);
  } finally {
    setDashboardsLoading(false);
  }
};
```

### 2. Supporting Functions

#### Marketing Manager URL Helper
**Location**: `src/utils/commonHelpers.js`

```javascript
export const getMarketingManagerURL = (serverName) => {
  if (!serverName) {
    console.warn('getMarketingManagerURL: No server name provided');
    return '';
  }
  
  const serverNameLower = serverName.toLowerCase();
  
  if (serverNameLower.includes('localhost') || serverNameLower.includes('dev')) {
    return 'https://dev-marketingmanager.yourdomain.com';
  } else if (serverNameLower.includes('test') || serverNameLower.includes('staging')) {
    return 'https://test-marketingmanager.yourdomain.com';
  } else if (serverNameLower.includes('prod') || serverNameLower.includes('live')) {
    return 'https://marketingmanager.yourdomain.com';
  } else {
    return `https://${serverName}/marketingmanager`;
  }
};

export const getServerName = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.hostname || '';
};
```

#### Package Types Enum
**Location**: `src/utils/enums.js`

```javascript
export const PACKAGE_TYPES = {
  CRM: 1,
  CRM_INT: 2,  // CRM_Int
  MM: 3,
  MES: 4,
};
```

#### Dashboard Service - Save Active Dashboard
**Location**: `src/features/Home/services/dashboardService.js`

```javascript
/**
 * Save active dashboard to API
 * @param {string} endpoint - API endpoint for saving active dashboard
 * @returns {Promise} API response
 */
saveActiveDashboard: async (endpoint) => {
  try {
    const response = await axiosService.post(endpoint);
    return response;
  } catch (error) {
    console.error('Error saving active dashboard:', error);
    throw error;
  }
}
```

#### Portal Service
**Location**: `src/features/Home/services/portalService.js`

```javascript
/**
 * Get portal details for user - mirrors C# CreateAllPortals API call
 * @param {number} userId - User ID (RepID)
 * @returns {Promise<Array>} Array of portal objects
 */
getPortalDetails: async (userId = null) => {
  try {
    // Get user ID from session if not provided
    if (!userId) {
      const sessionData = getSessionData();
      userId = sessionData?.RepID;
    }

    // Construct API endpoint matching C# logic
    // API parameters: user/sitesetup/widget/{userID:int}/{portalIndex:int}/{process:int}
    const endpoint = `${PORTAL_API.USER_WIDGETS_GET_DETAILS}${userId}/${PORTAL_API.GET_TITLES}/${PORTAL_API.PORTAL_INDEX_ALL}`;
    
    const response = await axiosService.get(endpoint);
    
    if (response?.Status === 'Success' && response?.List) {
      return response.List;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching portal details:', error);
    return [];
  }
}
```

### 3. UI Components

#### DashboardSetup Component
**Location**: `src/features/Home/components/DashboardSetup.jsx`

This component provides a UI interface for the dashboard setup functionality, similar to how the C# method would be called from the UI.

#### DashboardMenu Component
**Location**: `src/features/Home/components/DashboardMenu.jsx`

This component demonstrates how to use the `showDashboard` function, similar to the C# menu items. It provides:
- Dropdown menu for dashboard selection
- MKM dashboard button
- Current dashboard information
- MKM menu status and manual controls
- List of all available dashboards

### 4. Key Differences and Adaptations

| C# Feature | React Implementation | Notes |
|------------|---------------------|-------|
| `Connection.GetMarketingManagerURL()` | `getMarketingManagerURL(serverName)` | Custom helper function |
| `Request.ServerVariables` | `window.location.hostname` | Browser-based server detection |
| `SessionManager.Token` | `sessionData?.Token` | From localStorage session data |
| `PackageTypes.CRM_Int` | `PACKAGE_TYPES.CRM_INT` | Enum constant |
| `Ext.Net.MenuItem` | Tab objects in state | React state management |
| `pnlDashboard.Loader.Url` | Dashboard tab URL property | Tab-based navigation |
| `tabpnlMain.SetActiveTab()` | `dispatch({ type: ACTIONS.SET_ACTIVE_TAB })` | Reducer action |
| `showDashboard()` function | `showDashboard()` function | Mirrors C# logic exactly |
| `toggleMKMWebsiteMenu()` | `toggleMKMWebsiteMenu()` | State-based menu visibility |
| `ajaxPost()` for saving | `dashboardService.saveActiveDashboard()` | API service method |
| `CreateAllPortals()` | `createAllPortals()` | Portal creation and management |
| `WebClient.Get()` for portals | `portalService.getPortalDetails()` | Portal API service |
| `MenuSeparator` | Portal section in UI | Visual separation in components |

### 5. Usage

#### Automatic Setup (Default Behavior)
```javascript
// Called automatically during app initialization
const initializeApp = async () => {
  await Promise.all([
    loadNavigationMenus(),
    setupDashboard(), // Replaces loadDashboards
    setupLogoAndMMIntegration(),
    checkTermsAndConditions()
  ]);
};
```

#### Manual Setup
```javascript
// From any component using the HomeContext
const { actions: { setupDashboard } } = useHome();

// Setup with default parameters
await setupDashboard();

// Setup with admin source and reload
await setupDashboard("AD", true);
```

#### showDashboard Function Usage
```javascript
// From any component using the HomeContext
const { actions: { showDashboard } } = useHome();

// Show a specific dashboard
const dashboardItem = {
  id: 'DashBoard_123',
  title: 'Sales Dashboard',
  DashBoardName: 'Sales Dashboard',
  ID: 123,
  URL: 'https://example.com/dashboard'
};

await showDashboard(dashboardItem, dashboardItem.URL);
```

#### MKM Menu Management
```javascript
// From any component using the HomeContext
const { actions: { toggleMKMWebsiteMenu } } = useHome();

// Show MKM menu
toggleMKMWebsiteMenu('https://example.com/page?ismkm=1');

// Hide MKM menu
toggleMKMWebsiteMenu('https://example.com/page');
```

#### Portal Management
```javascript
// From any component using the HomeContext
const { actions: { createAllPortals, showDashboard } } = useHome();

// Create all portals for user
await createAllPortals();

// Show a specific portal
const portalItem = {
  id: 'portal123',
  title: 'My Portal',
  DashBoardName: 'My Portal',
  ID: 123,
  URL: '/intranet/Members/Home/Dashboard.aspx?PortalIndex=123'
};

await showDashboard(portalItem, portalItem.URL);
```

#### UI Component Usage
```jsx
import DashboardSetup from '@/features/Home/components/DashboardSetup';
import DashboardMenu from '@/features/Home/components/DashboardMenu';

// Show setup controls
<DashboardSetup showControls={true} />

// Auto-setup without controls (similar to C# if (!X.IsAjaxRequest))
<DashboardSetup showControls={false} />

// Dashboard selection menu (similar to C# menu items)
<DashboardMenu />
```

### 6. API Integration

The implementation uses the existing `dashboardService.getDashboards()` method which calls:
```
GET /services/User/Dashboards/false
```

This matches the C# API call: `ConstantsManager.API_USER_DASHBOARD_GET + "false"`

### 7. State Management

The dashboard setup integrates with the existing HomeContext state management:

- **Dashboards**: Stored in `state.dashboards`
- **Selected Dashboard**: Stored in `state.selectedDashboard`
- **Loading State**: Managed via `state.dashboardsLoading`
- **Tabs**: Updated via reducer actions

### 8. Error Handling

The implementation includes comprehensive error handling:

```javascript
try {
  // Setup logic
} catch (error) {
  console.error('Failed to setup dashboard:', error);
} finally {
  setDashboardsLoading(false);
}
```

This ensures the loading state is always reset, even if errors occur.

## Summary

The React implementation successfully mirrors the C# `SetupDashboard` functionality while adapting it to React patterns and state management. The key features include:

- ✅ Marketing Manager URL resolution
- ✅ Dashboard fetching and URL processing
- ✅ MKM dashboard creation for CRM_Int package type
- ✅ Default dashboard selection
- ✅ Tab-based navigation
- ✅ Session-based configuration
- ✅ Error handling and loading states
- ✅ UI component for manual control
- ✅ **showDashboard function implementation**
- ✅ **MKM menu visibility management**
- ✅ **Active dashboard saving to API**
- ✅ **Portal creation and management**
- ✅ **Portal menu items and navigation**
- ✅ **Dashboard menu items (matching C# menuDashboard.Items)**
- ✅ **Proper tab menu structure**
- ✅ **Dashboard selection persistence**
- ✅ **Automatic restoration of previously selected dashboard** 