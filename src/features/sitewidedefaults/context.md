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
- **useService.js**: Custom hook that uses React Query to fetch the list of sitewide settings from the API.

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