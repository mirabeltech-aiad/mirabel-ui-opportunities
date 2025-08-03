
/**
 * Comprehensive Design Tokens System
 * Based on Ocean Theme with complete styling guidelines
 */

// ===== CORE COLOR PALETTE =====

export const coreColors = {
  // Ocean Theme - Primary Color System
  ocean: {
    50: '#f0f9ff',   // Light backgrounds, subtle accents
    100: '#e0f2fe',  // Secondary backgrounds, light containers
    200: '#bae6fd',  // Grid lines, borders, light interactive states
    300: '#7dd3fc',  // Subtle highlights, disabled states
    400: '#38bdf8',  // Accent color, bright highlights
    500: '#0ea5e9',  // Interactive elements (buttons, controls)
    600: '#0284c7',  // Primary brand color, main actions
    700: '#0369a1',  // Axis text, secondary text
    800: '#075985',  // Titles, headers, chart titles
    900: '#0c4a6e',  // Deep accents, high contrast text
    950: '#082f49'   // Maximum contrast, important text
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',    // Emerald 500 - positive outcomes
    warning: '#f59e0b',    // Amber 500 - caution, pending states
    error: '#ef4444',      // Red 500 - errors, destructive actions
    info: '#3b82f6',       // Blue 500 - informational content
    neutral: '#6b7280'     // Gray 500 - default states
  },

  // Chart Color Palette
  chart: {
    primary: {
      emerald: '#10b981',  // Growth, success metrics
      blue: '#3b82f6',     // General data, neutral metrics
      purple: '#8b5cf6',   // Engagement, activity metrics
      rose: '#f43f5e',     // Alerts, important metrics
      amber: '#f59e0b',    // Warnings, pending states
      indigo: '#6366f1'    // Secondary metrics
    },
    pastels: {
      mint: '#6ee7b7',      // Emerald 300 - light green complement
      sky: '#93c5fd',       // Blue 300 - light blue complement
      lavender: '#c4b5fd',  // Purple 300 - light purple complement
      blush: '#fda4af',     // Rose 300 - light pink complement
      cream: '#fcd34d',     // Amber 300 - light yellow complement
      periwinkle: '#a5b4fc' // Indigo 300 - light indigo complement
    }
  },

  // Background Colors
  backgrounds: {
    white: '#ffffff',
    gray50: '#f9fafb',    // Table headers, card backgrounds
    gray100: '#f3f4f6',   // Subtle containers
    neutral50: '#f5f5f4', // Container backgrounds
    hover: '#f9fafb'      // Hover states
  },

  // Acceptable Pastel Colors for Cards
  cardPastels: {
    softLavender: '#f3f0ff',
    lightMint: '#f0fdf4',
    palePeach: '#fef7ed',
    softSky: '#f0f9ff',
    gentleRose: '#fdf2f8',
    lightCream: '#fffbeb',
    paleSage: '#f6f7f4',
    softPeriwinkle: '#f1f5f9'
  }
} as const;

// ===== TYPOGRAPHY TOKENS =====

export const typography = {
  // Title Standards - All use Ocean 800
  titles: {
    color: coreColors.ocean[800],
    className: 'text-ocean-800',
    sizes: {
      h1: 'text-3xl font-bold',
      h2: 'text-2xl font-bold',
      h3: 'text-xl font-semibold',
      h4: 'text-lg font-semibold',
      h5: 'text-base font-medium',
      h6: 'text-sm font-medium'
    }
  },

  // Interactive Element Colors
  interactive: {
    primary: {
      background: coreColors.ocean[500],
      hover: coreColors.ocean[600],
      border: coreColors.ocean[500],
      className: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500'
    },
    secondary: {
      background: coreColors.ocean[100],
      text: coreColors.ocean[800],
      hover: coreColors.ocean[200],
      className: 'bg-ocean-100 text-ocean-800 hover:bg-ocean-200'
    }
  },

  // Dashboard Metric Card Typography
  dashboardMetrics: {
    titleColor: '#000000',           // Always black for card titles
    serviceMetrics: '#7c3aed',       // Purple 600
    connectionMetrics: '#059669',    // Green 600
    activityMetrics: '#2563eb',      // Blue 600
    timeMetrics: '#e11d48',         // Rose 600
    // Darker pastel complements for subtitles (better readability)
    servicePastel: '#a855f7',       // Purple 500 (darker than 300)
    connectionPastel: '#10b981',    // Green 500 (darker than 300)
    activityPastel: '#3b82f6',      // Blue 500 (darker than 300)
    timePastel: '#f43f5e'           // Rose 500 (darker than 300)
  },

  // Table Typography
  table: {
    fontSize: '14px',        // text-sm
    headerHeight: '44px',    // h-11
    cellPadding: '10px',     // py-2.5
    headerBackground: coreColors.backgrounds.gray50,
    headerTextColor: 'text-muted-foreground',
    hoverState: 'hover:bg-gray-50'
  }
} as const;

// ===== SPACING & LAYOUT TOKENS =====

export const spacing = {
  // Border Radius Hierarchy (4-Level System)
  borderRadius: {
    lg: '10px',      // Primary actions, main containers, hero elements
    md: '6px',       // Form controls, secondary elements, content containers, tabs
    sm: '2px',       // Table controls, micro-interactions, minimal UI elements
    full: '9999px'   // Circular elements, badges, avatars, pills
  },

  // Shadow Hierarchy
  shadows: {
    subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    small: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    extraLarge: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },

  // Icon Sizing Rules
  iconSizes: {
    small: '12px',    // h-3 w-3
    medium: '16px',   // h-4 w-4 - Default size
    large: '20px'     // h-5 w-5
  },

  // Padding & Margins
  padding: {
    card: {
      small: '12px',    // p-3
      medium: '16px',   // p-4
      large: '24px'     // p-6
    },
    button: {
      small: '6px 12px',    // px-3 py-1.5
      medium: '8px 16px',   // px-4 py-2
      large: '12px 24px'    // px-6 py-3
    }
  }
} as const;

// ===== COMPONENT TOKENS =====

export const components = {
  // Navigation Design
  navigation: {
    background: 'bg-ocean-gradient',
    height: '56px',              // h-14
    textColors: {
      active: 'text-white',
      inactive: 'text-blue-100'
    },
    backgrounds: {
      active: 'bg-white/20',
      hover: 'bg-white/10'
    },
    borderRadius: spacing.borderRadius.sm
  },

  // Tab Bar Design
  tabBar: {
    containerBackground: '#eff6ff',    // bg-blue-50
    inactiveText: 'text-muted-foreground',
    activeBackground: 'bg-ocean-gradient',
    activeText: 'text-white'
  },

  // Card System by Size
  cards: {
    large: {
      background: coreColors.backgrounds.white,
      shadow: spacing.shadows.small,
      hoverShadow: spacing.shadows.medium,
      padding: spacing.padding.card.large,
      borderRadius: spacing.borderRadius.lg
    },
    medium: {
      background: coreColors.backgrounds.gray50,
      shadow: spacing.shadows.subtle,
      padding: spacing.padding.card.medium,
      borderRadius: spacing.borderRadius.md
    },
    small: {
      background: coreColors.backgrounds.gray50,
      shadow: spacing.shadows.subtle,
      padding: spacing.padding.card.small,
      borderRadius: spacing.borderRadius.sm
    }
  },

  // Button Variants
  buttons: {
    primary: {
      background: coreColors.ocean[500],
      hover: coreColors.ocean[600],
      text: coreColors.backgrounds.white,
      border: coreColors.ocean[500],
      borderRadius: spacing.borderRadius.md
    },
    secondary: {
      background: coreColors.ocean[100],
      hover: coreColors.ocean[200],
      text: coreColors.ocean[800],
      border: coreColors.ocean[200],
      borderRadius: spacing.borderRadius.md
    },
    outline: {
      background: 'transparent',
      hover: coreColors.ocean[50],
      text: coreColors.ocean[500],
      border: coreColors.ocean[500],
      borderRadius: spacing.borderRadius.md
    }
  },

  // Form Controls
  forms: {
    input: {
      borderRadius: spacing.borderRadius.md,
      focusBorder: coreColors.ocean[500],
      padding: '8px 12px'
    },
    floatingLabel: {
      focusBorder: coreColors.ocean[500],
      labelColor: coreColors.ocean[600],
      borderRadius: spacing.borderRadius.md
    }
  },

  // Chart Configuration
  charts: {
    titleColor: coreColors.ocean[800],
    gridColor: '#e5e7eb',           // Gray 200
    axisTextColor: coreColors.ocean[700],
    tooltipBackground: coreColors.backgrounds.white,
    tooltipShadow: spacing.shadows.large,
    pointRadius: '3px',
    strokeWidth: '2px'
  }
} as const;

// ===== ICON & BADGE TOKENS =====

export const iconSystem = {
  // Icon Color System
  colors: {
    building: '#6366f1',     // Indigo 500
    financial: '#059669',    // Emerald 600
    user: '#7c3aed',         // Purple 500
    calendar: '#ea580c',     // Orange 500
    status: '#2563eb',       // Blue 500
    default: '#6b7280'       // Gray 500
  },

  // Badge Color Variants
  badges: {
    neutral: {
      border: '#c7d2fe',     // Indigo 200
      text: '#3730a3',       // Indigo 700
      className: 'border-indigo-200 text-indigo-700'
    },
    success: {
      background: '#10b981', // Green 500
      text: '#ffffff',
      className: 'bg-green-500 text-white'
    },
    error: {
      background: '#ef4444', // Red 500
      text: '#ffffff',
      className: 'bg-red-500 text-white'
    },
    active: {
      background: '#93c5fd', // Blue 300
      text: '#1f2937',       // Gray 800
      className: 'bg-blue-300 text-gray-800'
    }
  }
} as const;

// ===== UTILITY FUNCTIONS =====

export const tokenUtils = {
  // Get pastel color by index
  getPastelColor: (index: number): string => {
    const pastels = Object.values(coreColors.cardPastels);
    return pastels[index % pastels.length];
  },

  // Get chart color by index
  getChartColor: (index: number, isPastel = false): string => {
    const colors = isPastel 
      ? Object.values(coreColors.chart.pastels)
      : Object.values(coreColors.chart.primary);
    return colors[index % colors.length];
  },

  // Generate consistent avatar color
  generateAvatarColor: (name: string): string => {
    const colors = Object.values(coreColors.chart.primary);
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  // Get dashboard metric color by type
  getDashboardMetricColor: (type: 'service' | 'connection' | 'activity' | 'time'): string => {
    const colorMap = {
      service: typography.dashboardMetrics.serviceMetrics,
      connection: typography.dashboardMetrics.connectionMetrics,
      activity: typography.dashboardMetrics.activityMetrics,
      time: typography.dashboardMetrics.timeMetrics
    };
    return colorMap[type];
  },

  // Get dashboard metric pastel by type - now returns darker pastels
  getDashboardMetricPastel: (type: 'service' | 'connection' | 'activity' | 'time'): string => {
    const pastelMap = {
      service: typography.dashboardMetrics.servicePastel,
      connection: typography.dashboardMetrics.connectionPastel,
      activity: typography.dashboardMetrics.activityPastel,
      time: typography.dashboardMetrics.timePastel
    };
    return pastelMap[type];
  },

  // Get icon color by semantic type
  getIconColor: (type: 'building' | 'financial' | 'user' | 'calendar' | 'status' | 'default'): string => {
    return iconSystem.colors[type];
  },

  // Get badge variant classes
  getBadgeVariant: (variant: 'neutral' | 'success' | 'error' | 'active'): string => {
    return iconSystem.badges[variant].className;
  },

  // Get card configuration by size
  getCardConfig: (size: 'large' | 'medium' | 'small') => {
    return components.cards[size];
  },

  // Get button configuration by variant
  getButtonConfig: (variant: 'primary' | 'secondary' | 'outline') => {
    return components.buttons[variant];
  }
} as const;

// ===== CSS CUSTOM PROPERTIES =====

export const cssCustomProperties = {
  '--ocean-primary': coreColors.ocean[600],
  '--ocean-secondary': coreColors.ocean[100],
  '--ocean-accent': coreColors.ocean[400],
  '--ocean-title': coreColors.ocean[800],
  '--ocean-interactive': coreColors.ocean[500],
  '--ocean-text': coreColors.ocean[700],
  '--background-white': coreColors.backgrounds.white,
  '--background-gray-50': coreColors.backgrounds.gray50,
  '--shadow-card': spacing.shadows.small,
  '--shadow-card-hover': spacing.shadows.medium,
  '--radius-lg': spacing.borderRadius.lg,
  '--radius-md': spacing.borderRadius.md,
  '--radius-sm': spacing.borderRadius.sm,
  '--title-black': typography.dashboardMetrics.titleColor,
  '--service-color': typography.dashboardMetrics.serviceMetrics,
  '--connection-color': typography.dashboardMetrics.connectionMetrics,
  '--activity-color': typography.dashboardMetrics.activityMetrics,
  '--time-color': typography.dashboardMetrics.timeMetrics
} as const;

// ===== EXPORTS =====

export default {
  colors: coreColors,
  typography,
  spacing,
  components,
  icons: iconSystem,
  utils: tokenUtils,
  cssVars: cssCustomProperties
} as const;

// Type exports for TypeScript
export type ColorToken = keyof typeof coreColors.ocean;
export type SemanticColor = keyof typeof coreColors.semantic;
export type ChartColor = keyof typeof coreColors.chart.primary;
export type IconType = keyof typeof iconSystem.colors;
export type BadgeVariant = keyof typeof iconSystem.badges;
export type CardSize = keyof typeof components.cards;
export type ButtonVariant = keyof typeof components.buttons;
export type DashboardMetricType = 'service' | 'connection' | 'activity' | 'time';
