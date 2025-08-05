# Tab Refresh Issue Fix

## Problem Description

When switching between tabs in the application, iframe content was being refreshed/reloaded every time, causing:
- Loss of user progress in forms
- Resetting of scroll positions
- Unnecessary network requests
- Poor user experience

## Root Cause Analysis

The issue was caused by **React component remounting** when switching tabs:

1. **TabContent.jsx** was conditionally rendering components based on `activeTab.component`
2. When switching tabs, React would completely unmount the previous component and mount the new one
3. This caused iframes to be destroyed and recreated, triggering a full page reload
4. The `Dashboard` component was also conditionally rendering `IframeContainer`, causing additional remounting

## Solution Implemented

### 1. **Preserve All Tab Content** (`TabContent.jsx`)
- Changed from conditional rendering to rendering all tabs simultaneously
- Use CSS `display: block/hidden` to show/hide tabs instead of unmounting
- Added `useMemo` to prevent unnecessary re-renders of tab content
- Each tab content is preserved in the DOM and only visibility changes

### 2. **Optimize Dashboard Component** (`Dashboard.jsx`)
- Added `useMemo` to preserve `IframeContainer` instances
- Use dashboard ID as key to maintain iframe state across dashboard switches
- Prevent unnecessary re-renders when dashboard data changes

### 3. **Memoize Components** (`IframeContainer.jsx`, `TabNavigation.jsx`)
- Wrapped components with `React.memo()` to prevent unnecessary re-renders
- Added proper `displayName` for debugging
- Added lifecycle logging to track component behavior

### 4. **Enhanced Debugging**
- Added console logs to track component lifecycle
- Monitor when components are mounted/unmounted
- Track tab switching behavior

## Key Changes Made

### TabContent.jsx
```javascript
// Before: Conditional rendering (causes remounting)
const renderContent = () => {
  switch (activeTab.component) {
    case 'Dashboard':
      return <Dashboard />;
    // ...
  }
};

// After: Preserve all content, show/hide with CSS
const tabContents = useMemo(() => {
  const contentMap = {};
  tabs.forEach(tab => {
    // Build all tab content once
    contentMap[tab.id] = <ComponentForTab />;
  });
  return contentMap;
}, [tabs]);

// Render all tabs, show only active one
{tabs.map(tab => (
  <div key={tab.id} className={`h-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}>
    {tabContents[tab.id]}
  </div>
))}
```

### Dashboard.jsx
```javascript
// Before: Direct conditional rendering
if (selectedDashboard && selectedDashboard.URL) {
  return <IframeContainer url={selectedDashboard.URL} />;
}

// After: Memoized iframe content
const iframeContent = useMemo(() => {
  if (selectedDashboard && selectedDashboard.URL) {
    return (
      <IframeContainer 
        url={selectedDashboard.URL}
        key={selectedDashboard.ID} // Preserve state
      />
    );
  }
  return null;
}, [selectedDashboard?.ID, selectedDashboard?.URL]);
```

### IframeContainer.jsx
```javascript
// Before: Regular component
const IframeContainer = ({ url, title, ... }) => {
  // Component logic
};

// After: Memoized component
const IframeContainer = memo(({ url, title, ... }) => {
  // Component logic with lifecycle tracking
});

IframeContainer.displayName = 'IframeContainer';
```

## Benefits

1. **No More Page Refreshes**: Iframe content is preserved when switching tabs
2. **Better Performance**: Reduced unnecessary re-renders and network requests
3. **Improved UX**: User progress is maintained across tab switches
4. **Memory Efficient**: Components are properly memoized
5. **Debugging**: Added logging to track component behavior

## Testing

To verify the fix works:

1. Open multiple tabs with iframe content
2. Switch between tabs rapidly
3. Check browser console for debug logs
4. Verify that iframe content doesn't reload
5. Confirm scroll positions and form data are preserved

## Debug Logs

The following console logs help track the behavior:
- `🔄 TabContent: Active tab changed to: [tabId]`
- `🔄 TabContent: Rebuilding tab contents for [count] tabs`
- `🔄 IframeContainer: Mounted for [title] with URL: [url]`
- `🔄 IframeContainer: Loaded [title]`
- `🔄 IframeContainer: Unmounted for [title]`

## Future Considerations

1. **Memory Management**: Monitor memory usage with many preserved tabs
2. **Lazy Loading**: Consider lazy loading for very heavy iframe content
3. **Tab Limits**: Implement maximum tab limits to prevent performance issues
4. **Cleanup**: Add cleanup mechanisms for unused iframe content 