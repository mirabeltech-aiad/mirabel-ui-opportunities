
import React, { useEffect } from 'react';
import { oceanTheme, metricCardColors, iconColors, chartColors, badgeColors, pastelColors, interactiveEffects, avatarSystem, getBadgeVariant, getAvatarColor, getChartColor, getHoverColor } from '@OpportunityUtils/designSystemTokens';

/**
 * Custom hook to ensure design system tokens are applied consistently
 * Comprehensive design system based on Ocean theme with full token support
 */
export const useDesignSystem = () => {
  React.useEffect(() => {
    // Apply design system tokens to CSS custom properties
    const root = document.documentElement;
    
    // Set ocean theme colors as CSS variables
    Object.entries(oceanTheme.primary).forEach(([key, value]) => {
      root.style.setProperty(`--ocean-${key}`, value);
    });
    
    // Set title color standard - Ocean Blue 800 for ALL titles
    root.style.setProperty('--title-color', oceanTheme.typography.titleColorHex);
    
    // Set interactive color standard - Ocean Blue 500 for interactive elements
    root.style.setProperty('--interactive-color', oceanTheme.typography.interactiveColorHex);
    
    // Set card title color - Always black for dashboard metric cards
    root.style.setProperty('--card-title-color', oceanTheme.typography.cardTitleColorHex);
    
    console.log('Design system tokens applied from comprehensive guidelines');
  }, []);

  return {
    // Core design tokens
    oceanTheme,
    metricCardColors,
    iconColors,
    chartColors,
    badgeColors,
    pastelColors,
    interactiveEffects,
    avatarSystem,
    
    // Title Standards - Ocean Blue 800 for ALL titles
    getTitleClass: () => oceanTheme.typography.titleColor,
    getTitleColorHex: () => oceanTheme.typography.titleColorHex,
    
    // Interactive Standards - Ocean Blue 500 for buttons, search, back
    getInteractiveButtonClass: () => oceanTheme.buttons.interactive,
    getBackButtonClass: () => oceanTheme.buttons.back,
    getSearchButtonClass: () => oceanTheme.buttons.search,
    getFilterButtonClass: () => oceanTheme.buttons.filter,
    getPrimaryButtonClass: () => oceanTheme.buttons.primary,
    
    // Background Standards
    getCardBackgroundClass: (size = 'medium') => {
      switch(size) {
        case 'large': return oceanTheme.backgrounds.cardLarge;
        case 'small': return oceanTheme.backgrounds.cardSmall;
        default: return oceanTheme.backgrounds.cardMedium;
      }
    },
    getTableHeaderClass: () => oceanTheme.backgrounds.tableHeaders,
    getTabContainerClass: () => oceanTheme.backgrounds.tabContainer,
    
    // Navigation Standards
    getOceanGradientClass: () => oceanTheme.gradients.ocean,
    getNavigationClass: () => oceanTheme.navigation.background,
    getNavigationHeight: () => oceanTheme.navigation.height,
    
    // Rounding Standards (4-Level System)
    getPrimaryRoundingClass: () => oceanTheme.rounding.primary,     // rounded-lg
    getSecondaryRoundingClass: () => oceanTheme.rounding.secondary, // rounded-md
    getMinimalRoundingClass: () => oceanTheme.rounding.minimal,     // rounded-sm
    getCircularRoundingClass: () => oceanTheme.rounding.circular,   // rounded-full
    
    // Table Standards
    getTableRowHeight: () => oceanTheme.table.rowHeight,
    getTableHeaderHeight: () => oceanTheme.table.headerHeight,
    getTableFontSize: () => oceanTheme.table.fontSize,
    getTableHoverState: () => oceanTheme.table.hoverState,
    getTableHeaderBackground: () => oceanTheme.table.headerBackground,
    getTableHeaderText: () => oceanTheme.table.headerText,
    
    // Card Standards
    getCardShadow: () => oceanTheme.cards.defaultShadow,
    getCardTransition: () => oceanTheme.cards.defaultTransition,
    getCardBorder: () => oceanTheme.cards.defaultBorder,
    getHoverGlow: () => oceanTheme.cards.hoverGlow,
    getHoverLift: () => oceanTheme.cards.hoverLift,
    
    // Interactive Effects
    getHoverGlowEffect: () => interactiveEffects.hoverGlow,
    getHoverLiftEffect: () => interactiveEffects.hoverLift,
    getPressEffect: () => interactiveEffects.pressEffect,
    
    // Icon Standards
    getIconSize: (size = 'default') => iconColors[size] || iconColors.default,
    getIconColor: (type = 'general') => iconColors[type] || iconColors.general,
    getIconColorPastel: (type = 'general') => iconColors[`${type}Pastel`] || iconColors.generalPastel,
    
    // Badge & Avatar Utilities
    getBadgeVariant,
    getAvatarColor,
    
    // Chart Utilities
    getChartColor,
    getHoverColor,
    getChartTitleColor: () => chartColors.titles,
    getChartGridColor: () => chartColors.gridLines,
    getChartAxisColor: () => chartColors.axisText,
    
    // Pastel Colors
    getPastelBackground: (index = 0) => pastelColors.backgrounds[index % pastelColors.backgrounds.length],
    getPastelText: (index = 0) => pastelColors.text[index % pastelColors.text.length],
    
    // Utility Functions
    applyDesignTokens: () => {
      // Force re-application of design tokens
      const root = document.documentElement;
      Object.entries(oceanTheme.primary).forEach(([key, value]) => {
        root.style.setProperty(`--ocean-${key}`, value);
      });
    },
  };
};
