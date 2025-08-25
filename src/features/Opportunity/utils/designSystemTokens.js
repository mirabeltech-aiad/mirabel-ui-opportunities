
// Design System Tokens - Single source of truth for all styling
// Based on the comprehensive design system guidelines

export const oceanTheme = {
  // Primary Ocean Theme Colors
  primary: {
    50: '#f0f9ff',   // ocean-50
    100: '#e0f2fe',  // ocean-100 - Light Ocean (supporting elements)
    200: '#bae6fd',  // ocean-200
    300: '#7dd3fc',  // ocean-300
    400: '#38bdf8',  // ocean-400 - Accent/highlights
    500: '#0ea5e9',  // ocean-500 - Interactive elements (buttons, search, back)
    600: '#0284c7',  // ocean-600 - Main actions, headers, branding
    700: '#0369a1',  // ocean-700 - Axis text, readable text
    800: '#075985',  // ocean-800 - Title styling standard (ALL titles)
    900: '#0c4a6e',  // ocean-900 - Deep navy for gradients
  },
  
  // Secondary Colors
  secondary: {
    light: '#e0f2fe', // Light Ocean - supporting elements
    accent: '#38bdf8', // Bright Ocean - calls-to-action
    destructive: '#ef4444', // Standard Red - errors and dangerous actions
  },

  // Background Colors
  backgrounds: {
    tableHeaders: 'bg-gray-50', // Table headers (#f9fafb)
    cardBackgrounds: 'bg-gray-50', // Card containers
    tabContainer: 'bg-blue-50', // Tab bar container (#eff6ff)
    cardLarge: 'bg-white', // Large cards - always white
    cardMedium: 'bg-gray-50', // Medium cards - light gray
    cardSmall: 'bg-gray-50', // Small cards - light grays or pastels
  },

  // Typography Standards
  typography: {
    // Title Standards - Ocean Blue 800 for ALL titles
    titleColor: 'text-ocean-800', // Charts, dashboards, pages, navigation
    titleColorHex: '#075985', // For direct CSS usage
    
    // Interactive Standards - Ocean Blue 500
    interactiveColor: 'text-ocean-500', 
    interactiveColorHex: '#0ea5e9',
    
    // Dashboard Metric Cards - Specific typography rules
    cardTitleColor: 'text-black', // Always black for card titles
    cardTitleColorHex: '#000000',
  },

  // Gradients
  gradients: {
    ocean: 'bg-ocean-gradient', // 135deg from #0c4a6e to #38bdf8
    navigation: 'bg-ocean-gradient', // Navigation bars
    activeTab: 'bg-ocean-gradient', // Active tab states
  },

  // Button Styling Standards
  buttons: {
    // All interactive buttons use Ocean 500
    interactive: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    back: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    search: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    filter: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    primary: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
  },

  // Component Rounding (4-Level System)
  rounding: {
    primary: 'rounded-lg',    // 10px - Primary actions, main containers, hero elements
    secondary: 'rounded-md',  // 6px - Form controls, content containers, tabs
    minimal: 'rounded-sm',    // 2px - Table controls, micro-interactions
    circular: 'rounded-full', // Circular elements, badges, avatars, pills
  },

  // Navigation Design
  navigation: {
    background: 'bg-ocean-gradient',
    height: 'h-14', // 56px standard height
    // Active state styling
    activeText: 'text-white',
    activeBackground: 'bg-white/20',
    // Inactive state styling
    inactiveText: 'text-blue-100',
    inactiveBackground: 'transparent',
    // Hover states
    hoverBackground: 'bg-white/10',
    hoverText: 'text-white',
    // Transitions
    transition: 'transition-colors duration-200',
    borderRadius: 'rounded-sm',
  },

  // Table Design Standards
  table: {
    // Row and cell styling
    rowHeight: 'py-2.5', // 10px top/bottom padding
    headerHeight: 'h-11', // 44px fixed height
    fontSize: 'text-sm', // 14px default
    hoverState: 'hover:bg-gray-50',
    // Header styling
    headerBackground: 'bg-gray-50',
    headerText: 'text-muted-foreground',
    // Column management
    minColumnWidth: '80px',
    resizeCursor: 'cursor-col-resize',
  },

  // Card System Guidelines
  cards: {
    // Default enhanced style
    defaultShadow: 'shadow-md hover:shadow-lg',
    defaultTransition: 'transition-shadow duration-200',
    defaultBorder: 'border border-gray-200',
    // Hover effects
    hoverGlow: 'hover:shadow-lg hover:shadow-ocean-500/20',
    hoverLift: 'hover:-translate-y-1',
    // Backgrounds by size
    largeBackground: 'bg-white',
    mediumBackground: 'bg-gray-50',
    smallBackground: 'bg-gray-50',
  },
};

// Metric Card Colors (Dashboard specific)
export const metricCardColors = {
  // Main metric numbers - solid colors
  service: 'text-purple-600',     // Service metrics
  connection: 'text-green-600',   // Connection/health metrics
  activity: 'text-blue-600',      // Activity/request metrics
  time: 'text-rose-600',          // Time/uptime metrics
  
  // Subtitle colors - complementary lighter pastels
  serviceSubtitle: 'text-purple-300',
  connectionSubtitle: 'text-green-300',
  activitySubtitle: 'text-blue-300',
  timeSubtitle: 'text-rose-300',
  
  // Card title color - always black
  cardTitle: 'text-black',
};

// Icon Colors (Semantic System)
export const iconColors = {
  // Primary semantic colors
  building: 'text-indigo-500',     // Building/Company
  financial: 'text-emerald-600',   // Money/Financial
  user: 'text-purple-500',         // User/People
  calendar: 'text-orange-500',     // Calendar/Date
  status: 'text-blue-500',         // Status/State
  general: 'text-gray-500',        // General/Default
  
  // Pastel alternatives for softer appearance
  buildingPastel: 'text-indigo-300',
  financialPastel: 'text-emerald-300',
  userPastel: 'text-purple-300',
  calendarPastel: 'text-orange-300',
  statusPastel: 'text-blue-300',
  generalPastel: 'text-gray-300',
  
  // Icon sizing rules
  default: 'h-4 w-4',      // Medium - default size
  small: 'h-3 w-3',        // Small cards
  large: 'h-5 w-5',        // Large cards
};

// Badge System (Status & Stage "Pill Buttons")
export const badgeColors = {
  // Semantic status colors
  positive: {
    background: 'bg-green-500',
    text: 'text-white',
    border: 'border-green-500',
    variants: ['Won', 'Closed Won', 'Success', 'Active', 'Approved'],
  },
  negative: {
    background: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-500',
    variants: ['Lost', 'Closed Lost', 'Failed', 'Rejected', 'Cancelled'],
  },
  neutral: {
    background: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-500',
    variants: ['Open', 'Discovery', 'Active', 'In Progress', 'Pending'],
  },
  warning: {
    background: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-500',
    variants: ['1st Demo', 'Negotiation', 'Review', 'Attention Needed'],
  },
  milestone: {
    background: 'bg-purple-500',
    text: 'text-white',
    border: 'border-purple-500',
    variants: ['Proposal', 'Contract', 'Final Review', 'Key Milestone'],
  },
  // Alternative badge styles
  neutralOutline: {
    background: 'bg-white',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  activeLight: {
    background: 'bg-blue-300',
    text: 'text-gray-800',
    border: 'border-blue-300',
  },
};

// Acceptable Pastel Colors for Cards
export const pastelColors = {
  backgrounds: [
    'bg-violet-50',    // Soft Lavender (#f3f0ff)
    'bg-green-50',     // Light Mint (#f0fdf4)
    'bg-orange-50',    // Pale Peach (#fef7ed)
    'bg-sky-50',       // Soft Sky (#f0f9ff)
    'bg-pink-50',      // Gentle Rose (#fdf2f8)
    'bg-yellow-50',    // Light Cream (#fffbeb)
    'bg-slate-50',     // Pale Sage (#f6f7f4)
    'bg-blue-50',      // Soft Periwinkle (#f1f5f9)
  ],
  text: [
    'text-violet-300',
    'text-green-300',
    'text-orange-300',
    'text-sky-300',
    'text-pink-300',
    'text-yellow-300',
    'text-slate-300',
    'text-blue-300',
  ],
};

// Chart Colors - Enhanced for Data Visualization
export const chartColors = {
  // Primary colors for main data series
  primary: [
    '#10b981', // emerald-500 - positive metrics, growth, success
    '#3b82f6', // blue-500 - neutral data, general metrics
    '#8b5cf6', // purple-500 - engagement, activity metrics
    '#f43f5e', // rose-500 - alerts, important metrics
    '#f59e0b', // amber-500 - warnings, pending states
    '#6366f1', // indigo-500 - secondary metrics
  ],
  
  // Pastel colors for supporting data or backgrounds
  pastels: [
    '#6ee7b7', // emerald-300 - light green complement
    '#93c5fd', // blue-300 - light blue complement
    '#c4b5fd', // purple-300 - light purple complement
    '#fda4af', // rose-300 - light pink complement
    '#fcd34d', // amber-300 - light yellow complement
    '#a5b4fc', // indigo-300 - light indigo complement
  ],
  
  // Chart infrastructure colors
  titles: '#075985',     // ocean-800 for ALL chart titles
  gridLines: '#e5e7eb',  // gray-200 for grid lines
  axisText: '#0369a1',   // ocean-700 for axis text
  axisLines: '#e5e7eb',  // gray-200 for axis lines (optional)
  
  // Interactive elements
  hover: {
    // Darken original colors by 10-15% on hover
    emerald: '#059669',   // emerald-600
    blue: '#2563eb',      // blue-600
    purple: '#7c3aed',    // purple-600
    rose: '#e11d48',      // rose-600
    amber: '#d97706',     // amber-600
    indigo: '#4f46e5',    // indigo-600
  },
  
  // Selection states
  selection: {
    glow: 'shadow-lg',
    border: '2px solid',
  },
  
  // Data point styling
  dataPoints: {
    radius: {
      line: '3-4px',      // Line chart points
      scatter: '2-3px',   // Scatter plots
    },
    stroke: '#ffffff',    // White stroke for visibility
    activeRadius: '+1-2px', // Increase on hover
  },
  
  // Forbidden colors
  forbidden: [
    '#000000', // Pure black
    '#ffffff', // Pure white on white backgrounds
    '#1f2937', // Dark grays darker than gray-700
  ],
  
  // Legend styling
  legend: {
    textColor: '#0369a1',  // ocean-700
    iconSize: '8x8px',     // Small squares or circles
    spacing: 'adequate',   // Touch accessibility
  },
};

// Interactive Effects & Animations
export const interactiveEffects = {
  // Preferred effects
  primaryEffect: 'hover-glow',     // Smooth and subtle glow
  secondaryEffects: ['hover-lift', 'press-effect', 'hover-slide'],
  animationDuration: '200-300ms',  // Smooth transitions
  
  // Shadow hierarchy
  shadows: {
    subtle: 'shadow-sm',
    smallModern: 'shadow-md',
    mediumModern: 'shadow-lg',
    largeModern: 'shadow-xl',
    extraLargeModern: 'shadow-2xl',
  },
  
  // Hover glow effect
  hoverGlow: 'hover:shadow-lg hover:shadow-ocean-500/20 transition-shadow duration-200',
  hoverLift: 'hover:-translate-y-1 transition-transform duration-200',
  pressEffect: 'active:scale-95 transition-transform duration-100',
};

// Avatar System (for Assigned Representatives)
export const avatarSystem = {
  // Avatar styling
  circular: 'rounded-full',
  sizes: {
    small: 'w-6 h-6 text-xs',
    medium: 'w-8 h-8 text-sm',
    large: 'w-10 h-10 text-base',
  },
  
  // Color generation for consistent rep colors
  colorPalette: [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-orange-500 text-white',
    'bg-red-500 text-white',
    'bg-indigo-500 text-white',
    'bg-pink-500 text-white',
    'bg-teal-500 text-white',
    'bg-yellow-500 text-black',
    'bg-cyan-500 text-white',
  ],
  
  // Initials display
  fontWeight: 'font-medium',
  textAlign: 'text-center',
  flexCenter: 'flex items-center justify-center',
};

// Utility Functions - Enhanced
export const getOceanColor = (shade = 600) => oceanTheme.primary[shade];
export const getTitleColor = () => oceanTheme.typography.titleColor;
export const getTitleColorHex = () => oceanTheme.typography.titleColorHex;
export const getInteractiveButton = () => oceanTheme.buttons.interactive;
export const getCardBackground = () => oceanTheme.backgrounds.cardBackgrounds;

// Badge utility functions
export const getBadgeVariant = (status) => {
  const statusLower = status.toLowerCase();
  
  // Check each badge type for matching variants
  for (const [key, config] of Object.entries(badgeColors)) {
    if (config.variants && config.variants.some(variant => 
      variant.toLowerCase().includes(statusLower) || statusLower.includes(variant.toLowerCase())
    )) {
      return key;
    }
  }
  
  // Default to neutral if no match found
  return 'neutral';
};

// Avatar color utility function
export const getAvatarColor = (name) => {
  if (!name) return avatarSystem.colorPalette[0];
  
  // Generate consistent color based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % avatarSystem.colorPalette.length;
  return avatarSystem.colorPalette[index];
};

// Chart color utility functions
export const getChartColor = (index, type = 'primary') => {
  const colors = chartColors[type] || chartColors.primary;
  return colors[index % colors.length];
};

export const getHoverColor = (baseColor) => {
  const colorMap = {
    '#10b981': chartColors.hover.emerald,
    '#3b82f6': chartColors.hover.blue,
    '#8b5cf6': chartColors.hover.purple,
    '#f43f5e': chartColors.hover.rose,
    '#f59e0b': chartColors.hover.amber,
    '#6366f1': chartColors.hover.indigo,
  };
  
  return colorMap[baseColor] || baseColor;
};
