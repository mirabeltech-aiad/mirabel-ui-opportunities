
import React, { useEffect } from 'react';
import { oceanTheme, metricCardColors, iconColors, chartColors } from '@OpportunityUtils/designSystemTokens';

/**
 * Custom hook to ensure design system tokens are applied consistently
 * Replaces default styling with knowledge base design system
 */
export const useDesignSystem = () => {
  useEffect(() => {
    // Apply design system tokens to CSS custom properties
    const root = document.documentElement;
    
    // Set ocean theme colors as CSS variables
    Object.entries(oceanTheme.primary).forEach(([key, value]) => {
      root.style.setProperty(`--ocean-${key}`, value);
    });
    
    // Set title color standard
    root.style.setProperty('--title-color', '#075985'); // ocean-800
    
    // Set interactive color standard
    root.style.setProperty('--interactive-color', '#0ea5e9'); // ocean-500
    
    console.log('Design system tokens applied from knowledge base');
  }, []);

  return {
    oceanTheme,
    metricCardColors,
    iconColors,
    chartColors,
    // Utility functions for common patterns
    getTitleClass: () => 'text-ocean-800',
    getInteractiveButtonClass: () => 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500',
    getCardBackgroundClass: () => 'bg-gray-50',
    getTableHeaderClass: () => 'bg-gray-50',
    getTabContainerClass: () => 'bg-blue-50',
    getOceanGradientClass: () => 'bg-ocean-gradient',
    getPrimaryRoundingClass: () => 'rounded-lg',
    getSecondaryRoundingClass: () => 'rounded-md',
  };
};
