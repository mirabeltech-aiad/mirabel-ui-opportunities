# Profile Menu Functionality

This document describes the implemented functionality for the profile menu in the React Navbar component.

## Overview

The profile menu has been migrated from the legacy Home.aspx system to React, maintaining the same functionality and user experience.

## Menu Items

### Welcome
- **Type**: Information display
- **Functionality**: Shows user's full name
- **Permissions**: None required

### My Account
- **Type**: Navigation
- **Functionality**: Opens user account management page in a new tab
- **URL**: `/ui/users/account`
- **Permissions**: None required

### Refresh
- **Type**: Action
- **Functionality**: Refreshes the current active tab
  - For dashboard: Reloads navigation and dashboard data
  - For iframe tabs: Reloads the iframe content
- **Keyboard Shortcut**: F5
- **Permissions**: None required

### Print
- **Type**: Action
- **Functionality**: Prints the current active tab content
  - For dashboard: Prints the dashboard content
  - For iframe tabs: Prints the iframe content
- **Permissions**: None required

### User Setup
- **Type**: Navigation
- **Functionality**: Opens user management page in a new tab
- **URL**: `/ui/users/list`
- **Permissions**: `canManageUsers` required

### Nav Bar Setup
- **Type**: Navigation
- **Functionality**: Opens navigation setup page in a new tab
- **URL**: `/intranet/Members/Admin/NavigationSetup.aspx`
- **Permissions**: `canManageNavigation` required

### Website Setup
- **Type**: Navigation
- **Functionality**: Opens website setup page in a new tab
- **URL**: `/ui/websitesetup`
- **Permissions**: `canManageWebsite` required

### Logout
- **Type**: Action
- **Functionality**: Logs out the user with confirmation dialog
- **Permissions**: None required

## Technical Implementation

### Components
- **Navbar.jsx**: Main component containing the profile menu
- **iframeService.js**: Service for iframe operations (refresh, print)
- **userService.js**: Service for user-related API calls

### Key Features
1. **Permission-based visibility**: Admin menu items are only shown if user has appropriate permissions
2. **Iframe support**: Proper handling of iframe tabs for refresh and print operations
3. **Keyboard shortcuts**: F5 for refresh functionality
4. **Toast notifications**: User feedback for all actions
5. **Confirmation dialogs**: Logout confirmation for better UX

### API Endpoints
The following API endpoints have been added to support the functionality:

#### User Management
- `API_USER_ACCOUNT_GET`: Get current user account
- `API_USER_ACCOUNT_UPDATE`: Update current user account
- `API_USER_LIST_GET`: Get list of users (admin)
- `API_USER_CREATE`: Create new user (admin)
- `API_USER_UPDATE`: Update user (admin)
- `API_USER_DELETE`: Delete user (admin)

#### Navigation Setup
- `API_NAVIGATION_SETUP_GET`: Get navigation setup
- `API_NAVIGATION_SETUP_UPDATE`: Update navigation setup

#### Website Setup
- `API_WEBSITE_SETUP_GET`: Get website setup
- `API_WEBSITE_SETUP_UPDATE`: Update website setup

## Usage

### Basic Usage
```jsx
// The profile menu is automatically rendered in the Navbar component
// No additional setup required
```

### Permission Checking
```jsx
// Permissions are automatically loaded when the component mounts
// Admin menu items are conditionally rendered based on permissions
```

### Customization
To customize the profile menu:

1. **Add new menu items**: Modify the `profileMenus` array in `Navbar.jsx`
2. **Add new permissions**: Update the `userPermissions` state and permission checks
3. **Customize styling**: Modify the CSS classes in the component

## Migration Notes

### From Legacy System
- **Legacy Handler**: `addNewTabToHomePanelWithTabletCheck()` → React tab management
- **Legacy Handler**: `refreshTab()` → React iframe refresh service
- **Legacy Handler**: `printActiveTab()` → React iframe print service
- **Legacy Handler**: `doUserLogout()` → React auth logout

### Key Differences
1. **Permission-based rendering**: Admin items are hidden if user lacks permissions
2. **Enhanced UX**: Toast notifications and confirmation dialogs
3. **Better error handling**: Graceful fallbacks for iframe operations
4. **Keyboard shortcuts**: F5 refresh support

## Testing

### Manual Testing
1. **Welcome**: Verify user name is displayed correctly
2. **My Account**: Click and verify new tab opens
3. **Refresh**: Click and verify current tab refreshes
4. **Print**: Click and verify print dialog opens
5. **Admin items**: Verify visibility based on permissions
6. **Logout**: Click and verify confirmation dialog and logout process
7. **F5**: Press F5 and verify refresh functionality

### Automated Testing
- Unit tests for iframe service functions
- Integration tests for permission-based rendering
- E2E tests for complete user workflows

## Future Enhancements

1. **Enhanced print functionality**: Better iframe content extraction
2. **Bulk operations**: Select multiple tabs for refresh/print
3. **Custom shortcuts**: User-configurable keyboard shortcuts
4. **Activity logging**: Track user actions for audit purposes
5. **Offline support**: Handle network disconnections gracefully 