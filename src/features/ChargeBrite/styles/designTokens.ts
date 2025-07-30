
/**
 * Design Tokens - Centralized Design System
 * Based on Ocean Theme with comprehensive styling guidelines
 */

// ===== COLOR TOKENS =====

export const colorTokens = {
  // Primary Ocean Theme
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Interactive elements
    600: '#0284c7', // Primary
    700: '#0369a1',
    800: '#075985', // Titles and headers
    900: '#0c4a6e',
    950: '#082f49'
  },

  // Semantic Colors
  semantic: {
    primary: '#0284c7',      // Ocean Blue 600
    secondary: '#e0f2fe',    // Light Ocean
    accent: '#38bdf8',       // Bright Ocean
    destructive: '#ef4444',  // Standard Red
    success: '#10b981',      // Emerald 500
    warning: '#f59e0b',      // Amber 500
    info: '#3b82f6'          // Blue 500
  },

  // Background Colors
  backgrounds: {
    tableHeader: '#f9fafb',    // Gray 50
    cardBackground: '#f9fafb',  // Gray 50
    container: '#f5f5f4',      // Neutral 50
    white: '#ffffff',
    hover: '#f9fafb'           // Gray 50
  },

  // Acceptable Pastel Colors for Cards
  pastels: {
    softLavender: '#f3f0ff',
    lightMint: '#f0fdf4',
    palePeach: '#fef7ed',
    softSky: '#f0f9ff',
    gentleRose: '#fdf2f8',
    lightCream: '#fffbeb',
    paleSage: '#f6f7f4',
    softPeriwinkle: '#f1f5f9'
  },

  // Chart Colors - Primary Palette
  chartPrimary: {
    emerald: '#10b981',  // For positive metrics, growth, success
    blue: '#3b82f6',     // For neutral data, general metrics  
    purple: '#8b5cf6',   // For engagement, activity metrics
    rose: '#f43f5e',     // For alerts, important metrics
    amber: '#f59e0b',    // For warnings, pending states
    indigo: '#6366f1'    // For secondary metrics
  },

  // Chart Colors - Pastel Palette
  chartPastels: {
    softMint: '#6ee7b7',     // Emerald 300
    skyBlue: '#93c5fd',      // Blue 300
    lavender: '#c4b5fd',     // Purple 300
    blush: '#fda4af',        // Rose 300
    cream: '#fcd34d',        // Amber 300
    periwinkle: '#a5b4fc'    // Indigo 300
  },

  // Icon Color System
  iconColors: {
    building: '#6366f1',     // Indigo 500
    financial: '#059669',    // Emerald 600
    user: '#7c3aed',         // Purple 500
    calendar: '#ea580c',     // Orange 500
    status: '#2563eb',       // Blue 500
    default: '#6b7280'       // Gray 500
  },

  // Badge Color Variants
  badgeColors: {
    neutral: {
      border: '#c7d2fe',     // Indigo 200
      text: '#3730a3'        // Indigo 700
    },
    success: {
      background: '#10b981', // Green 500
      text: '#ffffff'
    },
    error: {
      background: '#ef4444', // Red 500
      text: '#ffffff'
    },
    active: {
      background: '#93c5fd', // Blue 300
      text: '#1f2937'        // Gray 800
    }
  },

  // Dashboard Metric Typography Colors
  dashboardMetrics: {
    titleText: '#000000',    // Black
    serviceMetrics: '#7c3aed',    // Purple 600
    connectionMetrics: '#059669', // Green 600
    activityMetrics: '#2563eb',   // Blue 600
    timeMetrics: '#e11d48',       // Rose 600
    // Subtitle pastels
    purplePastel: '#d8b4fe',      // Purple 300
    greenPastel: '#6ee7b7',       // Green 300
    bluePastel: '#93c5fd',        // Blue 300
    rosePastel: '#fda4af'         // Rose 300
  }
} as const;

// ===== SPACING TOKENS =====

export const spacingTokens = {
  // Field Rounding Hierarchy
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
    medium: '16px',   // h-4 w-4 - Default
    large: '20px'     // h-5 w-5
  }
} as const;

// ===== TYPOGRAPHY TOKENS =====

export const typographyTokens = {
  // Title Styling Standards
  titles: {
    color: colorTokens.ocean[800],        // Ocean Blue 800
    class: 'text-ocean-800'
  },

  // Interactive Elements
  interactive: {
    primary: {
      background: colorTokens.ocean[500],  // Ocean Blue 500
      hover: colorTokens.ocean[600],
      classes: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500'
    },
    secondary: {
      background: colorTokens.ocean[100],  // Ocean Blue 100
      text: colorTokens.ocean[800],        // Ocean Blue 800
      hover: colorTokens.ocean[200],
      classes: 'bg-ocean-100 text-ocean-800 hover:bg-ocean-200 border-ocean-200'
    }
  },

  // Table Typography
  table: {
    fontSize: '14px',           // text-sm
    headerHeight: '44px',       // h-11
    cellPadding: '10px',        // py-2.5
    headerBackground: colorTokens.backgrounds.tableHeader,
    hoverState: 'hover:bg-gray-50'
  }
} as const;

// ===== COMPONENT TOKENS =====

export const componentTokens = {
  // Navigation Design
  navigation: {
    background: 'bg-ocean-gradient',
    height: '56px',              // h-14
    activeText: 'text-white',
    activeBackground: 'bg-white/20',
    inactiveText: 'text-blue-100',
    hoverBackground: 'bg-white/10',
    borderRadius: spacingTokens.borderRadius.sm
  },

  // Tab Bar Design
  tabBar: {
    containerBackground: '#eff6ff',    // bg-blue-50
    inactiveText: 'text-muted-foreground',
    activeBackground: 'bg-ocean-gradient',
    activeText: 'text-white'
  },

  // Card System
  cards: {
    large: {
      background: colorTokens.backgrounds.white,
      shadow: spacingTokens.shadows.small,
      hover: spacingTokens.shadows.medium
    },
    medium: {
      background: colorTokens.backgrounds.cardBackground,
      shadow: spacingTokens.shadows.subtle
    },
    small: {
      background: colorTokens.backgrounds.cardBackground,
      shadow: spacingTokens.shadows.subtle
    }
  },

  // Button System - Primary & Secondary Variants
  buttons: {
    primary: {
      ocean: {
        background: colorTokens.ocean[500],
        hover: colorTokens.ocean[600],
        text: '#ffffff',
        border: colorTokens.ocean[500],
        classes: 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500'
      },
      success: {
        background: colorTokens.semantic.success,
        hover: '#059669',
        text: '#ffffff',
        border: colorTokens.semantic.success,
        classes: 'bg-green-500 text-white hover:bg-green-600 border-green-500'
      },
      warning: {
        background: colorTokens.semantic.warning,
        hover: '#d97706',
        text: '#ffffff',
        border: colorTokens.semantic.warning,
        classes: 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500'
      },
      error: {
        background: colorTokens.semantic.destructive,
        hover: '#dc2626',
        text: '#ffffff',
        border: colorTokens.semantic.destructive,
        classes: 'bg-red-500 text-white hover:bg-red-600 border-red-500'
      }
    },
    secondary: {
      ocean: {
        background: colorTokens.ocean[100],
        hover: colorTokens.ocean[200],
        text: colorTokens.ocean[800],
        border: colorTokens.ocean[200],
        classes: 'bg-ocean-100 text-ocean-800 hover:bg-ocean-200 border-ocean-200'
      },
      success: {
        background: '#dcfce7',
        hover: '#bbf7d0',
        text: '#166534',
        border: '#bbf7d0',
        classes: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
      },
      warning: {
        background: '#fef3c7',
        hover: '#fde68a',
        text: '#92400e',
        border: '#fde68a',
        classes: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200'
      },
      error: {
        background: '#fee2e2',
        hover: '#fecaca',
        text: '#991b1b',
        border: '#fecaca',
        classes: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200'
      }
    },
    outline: {
      ocean: {
        background: 'transparent',
        hover: colorTokens.ocean[50],
        text: colorTokens.ocean[500],
        border: colorTokens.ocean[500],
        classes: 'border-ocean-500 text-ocean-500 hover:bg-ocean-50 bg-transparent'
      }
    },
    ghost: {
      ocean: {
        background: 'transparent',
        hover: colorTokens.ocean[50],
        text: colorTokens.ocean[600],
        hoverText: colorTokens.ocean[700],
        classes: 'text-ocean-600 hover:bg-ocean-50 hover:text-ocean-700'
      }
    }
  },

  // FloatingLabelInput
  floatingInput: {
    focusBorder: colorTokens.ocean[500],
    labelColor: colorTokens.ocean[600],
    borderRadius: spacingTokens.borderRadius.md
  },

  // Chart Configuration
  charts: {
    titleColor: colorTokens.ocean[800],
    gridColor: '#e5e7eb',           // Gray 200
    axisTextColor: colorTokens.ocean[700],
    tooltipBackground: colorTokens.backgrounds.white,
    tooltipShadow: spacingTokens.shadows.large
  }
} as const;

// ===== UTILITY FUNCTIONS =====

export const designUtils = {
  // Get pastel color by index
  getPastelColor: (index: number): string => {
    const pastelArray = Object.values(colorTokens.pastels);
    return pastelArray[index % pastelArray.length];
  },

  // Get chart primary color by index
  getChartPrimaryColor: (index: number): string => {
    const chartArray = Object.values(colorTokens.chartPrimary);
    return chartArray[index % chartArray.length];
  },

  // Get chart pastel color by index
  getChartPastelColor: (index: number): string => {
    const pastelArray = Object.values(colorTokens.chartPastels);
    return pastelArray[index % pastelArray.length];
  },

  // Generate avatar color based on name
  generateAvatarColor: (name: string): string => {
    const colors = [
      colorTokens.chartPrimary.emerald,
      colorTokens.chartPrimary.blue,
      colorTokens.chartPrimary.purple,
      colorTokens.chartPrimary.rose,
      colorTokens.chartPrimary.amber,
      colorTokens.chartPrimary.indigo
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  },

  // Get semantic badge variant classes
  getBadgeVariant: (variant: 'neutral' | 'success' | 'error' | 'active'): string => {
    const badgeStyles = {
      neutral: `border-indigo-200 text-indigo-700`,
      success: `bg-green-500 text-white`,
      error: `bg-red-500 text-white`,
      active: `bg-blue-300 text-gray-800`
    };
    
    return badgeStyles[variant];
  },

  // Get icon color by type
  getIconColor: (type: 'building' | 'financial' | 'user' | 'calendar' | 'status' | 'default'): string => {
    return colorTokens.iconColors[type];
  },

  // Get dashboard metric color
  getDashboardMetricColor: (type: 'service' | 'connection' | 'activity' | 'time'): string => {
    const metricColors = {
      service: colorTokens.dashboardMetrics.serviceMetrics,
      connection: colorTokens.dashboardMetrics.connectionMetrics,
      activity: colorTokens.dashboardMetrics.activityMetrics,
      time: colorTokens.dashboardMetrics.timeMetrics
    };
    
    return metricColors[type];
  },

  // Get dashboard metric pastel color
  getDashboardMetricPastel: (type: 'service' | 'connection' | 'activity' | 'time'): string => {
    const pastelColors = {
      service: colorTokens.dashboardMetrics.purplePastel,
      connection: colorTokens.dashboardMetrics.greenPastel,
      activity: colorTokens.dashboardMetrics.bluePastel,
      time: colorTokens.dashboardMetrics.rosePastel
    };
    
    return pastelColors[type];
  },

  // Get button configuration by variant and type
  getButtonConfig: (variant: 'primary' | 'secondary' | 'outline' | 'ghost', type: 'ocean' | 'success' | 'warning' | 'error' = 'ocean') => {
    return componentTokens.buttons[variant][type];
  }
} as const;

// ===== CSS CUSTOM PROPERTIES EXPORT =====

export const cssVariables = {
  '--color-ocean-primary': colorTokens.ocean[600],
  '--color-ocean-secondary': colorTokens.ocean[100],
  '--color-ocean-accent': colorTokens.ocean[400],
  '--color-ocean-title': colorTokens.ocean[800],
  '--color-ocean-interactive': colorTokens.ocean[500],
  '--shadow-card': spacingTokens.shadows.small,
  '--shadow-card-hover': spacingTokens.shadows.medium,
  '--radius-primary': spacingTokens.borderRadius.lg,
  '--radius-secondary': spacingTokens.borderRadius.md,
  '--radius-minimal': spacingTokens.borderRadius.sm,
  // Button system variables
  '--button-primary-bg': colorTokens.ocean[500],
  '--button-primary-hover': colorTokens.ocean[600],
  '--button-secondary-bg': colorTokens.ocean[100],
  '--button-secondary-hover': colorTokens.ocean[200],
  '--button-secondary-text': colorTokens.ocean[800]
} as const;

// Export all tokens as default
export default {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  components: componentTokens,
  utils: designUtils,
  cssVars: cssVariables
};
