# Home Feature - Modern React Tab Navigation System

A comprehensive React application featuring a modern tab navigation system with integrated help functionality, designed as a post-login page for the Mirabel Manager application.

## 🚀 Quick Start

### 1. Import the Feature
```jsx
import Home from '@/features/Home';
```

### 2. Add to Your Routes
```jsx
// In your router configuration
<Route path="/home" element={<Home />} />
```

### 3. Include Ocean Theme CSS
```jsx
// In your main App.jsx or index.js
import '@/styles/ocean-theme.css';
```

## ✨ Key Features

### 🗂️ Tab Navigation System
- **Dynamic Tab Creation**: Add React components, iframes, or custom content
- **Drag & Drop Reordering**: Intuitive tab management
- **Persistence**: Tabs saved across browser sessions
- **Overflow Handling**: Dropdown menu for excess tabs
- **Lazy Loading**: Components loaded on demand

### 🆘 Help Integration
- **Draggable Help Button**: Ocean blue button, draggable to any position
- **8 Help Options**: Comprehensive help panel with 2x4 grid layout
- **JIRA Integration**: Complete ticket creation form
- **Contact Forms**: Consultant and support contact forms

### 🎨 Ocean Theme
- **Beautiful Gradients**: Ocean blue theme throughout
- **Responsive Design**: Works on all screen sizes
- **Consistent Styling**: Professional appearance

## 📋 Available Components

### Core Components
- `TabNavigation` - Main navigation with draggable tabs
- `Navbar` - Top navigation bar with search and user menu
- `HelpSystem` - Draggable help button and panel
- `Dashboard` - Default welcome page with quick actions

### Tab Content Components
- `NewTab` - Placeholder for creating new tabs
- `OpportunityForm` - Basic opportunity creation form
- `Reports` - Analytics and reporting interface
- `Settings` - User preferences and configuration

### Help Components
- `JiraTicketForm` - JIRA ticket creation with validation
- `ContactConsultantForm` - Consultant contact form

## 🔧 Usage Examples

### Adding New Tabs
```jsx
import { useHome } from '@/features/Home/contexts/HomeContext';

const MyComponent = () => {
  const { actions } = useHome();

  const addComponentTab = () => {
    actions.addTab({
      title: 'My Component',
      component: 'MyComponent',
      type: 'component',
      icon: '📄'
    });
  };

  const addIframeTab = () => {
    actions.addTab({
      title: 'External Site',
      url: 'https://example.com',
      type: 'iframe',
      icon: '🌐'
    });
  };

  return (
    <div>
      <button onClick={addComponentTab}>Add Component Tab</button>
      <button onClick={addIframeTab}>Add Iframe Tab</button>
    </div>
  );
};
```

### Help System Integration
```jsx
const { actions } = useHome();

// Toggle help panel
actions.toggleHelp();

// Set help button position
actions.setHelpPosition({ x: 100, y: 100 });
```

### Custom Tab Content
```jsx
// Create a custom component for tab content
const MyCustomTab = () => {
  return (
    <div className="p-6">
      <h1>My Custom Tab Content</h1>
      <p>This is a custom React component as tab content.</p>
    </div>
  );
};

// Add it as a tab
actions.addTab({
  title: 'Custom Tab',
  component: 'MyCustomTab',
  type: 'component',
  icon: '⚛️'
});
```

## 🎨 Styling

### Ocean Theme Colors
```css
/* Available ocean color classes */
.bg-ocean-50, .bg-ocean-100, .bg-ocean-200, /* ... */
.text-ocean-600, .text-ocean-700, /* ... */
.border-ocean-300, .border-ocean-400, /* ... */

/* Ocean gradients */
.bg-ocean-gradient
.bg-ocean-gradient-reverse
.bg-ocean-gradient-radial
```

### Custom Styling
```jsx
// Apply ocean theme to your components
<div className="bg-ocean-gradient text-white p-6 rounded-lg">
  <h1>Ocean Themed Content</h1>
</div>

// Use ocean colors for buttons
<button className="bg-ocean-600 hover:bg-ocean-700 text-white">
  Ocean Button
</button>
```

## 🔌 Dependencies

### Required Dependencies
```json
{
  "react-beautiful-dnd": "^13.1.1",
  "lucide-react": "^0.263.1"
}
```

### UI Components
The feature uses shadcn/ui components:
- Button, Card, Input, Label, Textarea
- Select, Switch, Badge
- DropdownMenu, Toaster

## 📱 Responsive Design

The Home feature is fully responsive:
- **Mobile**: Stacked layout with collapsible navigation
- **Tablet**: Side-by-side layout with optimized spacing
- **Desktop**: Full layout with all features visible

## 🔒 Security Features

- XSS protection for iframe content
- Input validation on all forms
- Secure session management
- CSRF protection for API calls

## ♿ Accessibility

- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management
- High contrast support

## 🚀 Performance

- Lazy loading of tab components
- Debounced localStorage updates
- Optimized re-renders
- Efficient drag and drop

## 📝 Browser Support

- Modern browsers with ES6+ support
- LocalStorage for tab persistence
- Drag and drop API support
- CSS Grid and Flexbox support

## 🤝 Contributing

When adding new features to the Home component:

1. Follow the existing file structure
2. Use the ocean theme colors
3. Implement responsive design
4. Add proper accessibility features
5. Include error handling
6. Write documentation

## 📄 License

This feature is part of the Mirabel Manager application. 