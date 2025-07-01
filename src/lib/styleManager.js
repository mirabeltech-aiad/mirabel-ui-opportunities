// Design system initialization and CSS property management
export const initializeDesignSystem = () => {
  console.log('Initializing design system...');
  
  // Apply design system tokens immediately
  const applyDesignSystemTokens = () => {
    const root = document.documentElement;
    
    // Ocean theme colors from knowledge base
    root.style.setProperty('--ocean-50', '#f0f9ff');
    root.style.setProperty('--ocean-100', '#e0f2fe');
    root.style.setProperty('--ocean-200', '#bae6fd');
    root.style.setProperty('--ocean-300', '#7dd3fc');
    root.style.setProperty('--ocean-400', '#38bdf8');
    root.style.setProperty('--ocean-500', '#0ea5e9');
    root.style.setProperty('--ocean-600', '#0284c7');
    root.style.setProperty('--ocean-700', '#0369a1');
    root.style.setProperty('--ocean-800', '#075985');
    root.style.setProperty('--ocean-900', '#0c4a6e');
    
    // Title and interactive standards from knowledge base
    root.style.setProperty('--title-color', '#075985'); // ocean-800
    root.style.setProperty('--interactive-color', '#0ea5e9'); // ocean-500
    
    console.log('Knowledge base design system tokens applied globally');
  };

  applyDesignSystemTokens();
  
  // Also initialize the feature-specific design system if it exists
  try {
    const { initializeDesignSystem: initializeFeatureDesignSystem } = require('../features/Opportunity/utils/styleManager.js');
    if (typeof initializeFeatureDesignSystem === 'function') {
      initializeFeatureDesignSystem();
    }
  } catch (error) {
    console.log('Feature-specific design system not available, using base design system only');
  }
}; 