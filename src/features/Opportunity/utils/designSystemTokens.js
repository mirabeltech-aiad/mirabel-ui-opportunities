
// Design System Tokens - Single source of truth for all styling
// Based on the knowledge base design system guidelines

export const oceanTheme = {
  // Primary Ocean Theme Colors
  primary: {
    50: '#f0f9ff',   // ocean-50
    100: '#e0f2fe',  // ocean-100
    200: '#bae6fd',  // ocean-200
    300: '#7dd3fc',  // ocean-300
    400: '#38bdf8',  // ocean-400 - Accent/highlights
    500: '#0ea5e9',  // ocean-500 - Interactive elements
    600: '#0284c7',  // ocean-600 - Main actions, headers, branding
    700: '#0369a1',  // ocean-700
    800: '#075985',  // ocean-800 - Title styling standard
    900: '#0c4a6e',  // ocean-900
  },
  
  // Secondary Colors
  secondary: {
    light: '#e0f2fe', // Light Ocean - supporting elements
    accent: '#38bdf8', // Bright Ocean - calls-to-action
    destructive: '#ef4444', // Standard Red - errors
  },

  // Background Colors
  backgrounds: {
    tableHeaders: 'gray-50', // Table headers
    cardBackgrounds: 'gray-50', // Card containers
    tabContainer: 'blue-50', // Tab bar container
  },

  // Typography
  typography: {
    titleColor: 'text-ocean-800', // All titles, headers, chart labels
    interactiveColor: 'text-ocean-500', // Interactive elements
    cardTitleColor: 'text-black', // Dashboard metric card titles
  },

  // Gradients
  gradients: {
    ocean: 'bg-ocean-gradient', // Navigation and active states
    search: 'search-gradient', // Search backgrounds
  },

  // Button Styling
  buttons: {
    interactive: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    back: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    search: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
  },

  // Component Rounding (4-Level System)
  rounding: {
    primary: 'rounded-lg',    // 10px - Primary actions, main containers
    secondary: 'rounded-md',  // 6px - Form controls, content containers, tabs
    minimal: 'rounded-sm',    // 2px - Table controls, micro-interactions
    circular: 'rounded-full', // Circular elements, badges, avatars
  },

  // Navigation
  navigation: {
    background: 'bg-ocean-gradient',
    height: 'h-14',
    activeText: 'text-white',
    inactiveText: 'text-blue-100',
    activeBackground: 'bg-white/20',
    hoverBackground: 'bg-white/10',
  },
};

// Metric Card Colors (Dashboard specific)
export const metricCardColors = {
  service: 'text-purple-600',     // Service metrics
  connection: 'text-green-600',   // Connection/health metrics
  activity: 'text-blue-600',      // Activity/request metrics
  time: 'text-rose-600',          // Time/uptime metrics
  
  // Subtitle colors (complementary pastels)
  serviceSubtitle: 'text-purple-300',
  connectionSubtitle: 'text-green-300',
  activitySubtitle: 'text-blue-300',
  timeSubtitle: 'text-rose-300',
};

// Icon Colors (Semantic System)
export const iconColors = {
  building: 'text-indigo-500',
  financial: 'text-emerald-600',
  user: 'text-purple-500',
  calendar: 'text-orange-500',
  status: 'text-blue-500',
  general: 'text-gray-500',
};

// Chart Colors
export const chartColors = {
  primary: [
    '#10b981', // emerald-500 - positive metrics, growth, success
    '#3b82f6', // blue-500 - neutral data, general metrics
    '#8b5cf6', // purple-500 - engagement, activity metrics
    '#f43f5e', // rose-500 - alerts, important metrics
    '#f59e0b', // amber-500 - warnings, pending states
    '#6366f1', // indigo-500 - secondary metrics
  ],
  pastels: [
    '#6ee7b7', // emerald-300 - light green complement
    '#93c5fd', // blue-300 - light blue complement
    '#c4b5fd', // purple-300 - light purple complement
    '#fda4af', // rose-300 - light pink complement
    '#fcd34d', // amber-300 - light yellow complement
    '#a5b4fc', // indigo-300 - light indigo complement
  ],
  titles: '#075985', // ocean-800 for all chart titles
  gridLines: '#e5e7eb', // gray-200 for grid lines
  axisText: '#0369a1', // ocean-700 for axis text
};

// Export utility functions
export const getOceanColor = (shade = 600) => oceanTheme.primary[shade];
export const getTitleColor = () => oceanTheme.typography.titleColor;
export const getInteractiveButton = () => oceanTheme.buttons.interactive;
export const getCardBackground = () => oceanTheme.backgrounds.cardBackgrounds;
