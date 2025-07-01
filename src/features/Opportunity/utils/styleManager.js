
export const applyPageStyles = (currentPath) => {
  const styleConfig = localStorage.getItem('site_style_config');
  if (!styleConfig) return;

  const config = JSON.parse(styleConfig);
  const pageOverrides = config.pageOverrides || {};

  // Remove existing page-specific styles
  const existingStyles = document.querySelectorAll('[data-page-styles]');
  existingStyles.forEach(style => style.remove());

  // Find matching page override
  const matchingOverride = Object.entries(pageOverrides).find(([path]) => {
    if (path === currentPath) return true;
    if (path.includes('*')) {
      const pattern = path.replace('*', '.*');
      return new RegExp(pattern).test(currentPath);
    }
    return false;
  });

  if (!matchingOverride) return;

  const [, override] = matchingOverride;
  
  // Create and inject page-specific styles
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-page-styles', 'true');
  
  let css = '';
  
  // Add selector-specific styles
  if (override.selectors) {
    Object.entries(override.selectors).forEach(([selector, config]) => {
      css += `${selector} { ${config.styles} }\n`;
    });
  }
  
  // Add global page CSS
  if (override.css) {
    css += override.css;
  }
  
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};

export const loadGlobalStyles = () => {
  const styleConfig = localStorage.getItem('site_style_config');
  if (!styleConfig) return;

  const config = JSON.parse(styleConfig);
  const root = document.documentElement;
  
  // Apply semantic color tokens
  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  // Apply typography tokens
  if (config.typography) {
    root.style.setProperty('--font-family', config.typography.fontFamily);
    root.style.setProperty('--font-size-base', config.typography.baseFontSize);
    root.style.setProperty('--font-weight-heading', config.typography.headingWeight);
    root.style.setProperty('--font-weight-body', config.typography.bodyWeight);
    root.style.setProperty('--line-height', config.typography.lineHeight);
  }

  // Apply spacing tokens
  if (config.spacing) {
    root.style.setProperty('--spacing-unit', config.spacing.baseUnit);
    root.style.setProperty('--container-padding', config.spacing.containerPadding);
    root.style.setProperty('--section-gap', config.spacing.sectionGap);
    root.style.setProperty('--element-gap', config.spacing.elementGap);
  }

  // Apply component tokens
  if (config.components) {
    root.style.setProperty('--button-radius', config.components.buttonRadius);
    root.style.setProperty('--card-radius', config.components.cardRadius);
    root.style.setProperty('--input-height', config.components.inputHeight);
    root.style.setProperty('--card-shadow', config.components.cardShadow);
  }
};

// Initialize styles when module loads
export const initializeDesignSystem = () => {
  // Load global styles from localStorage
  loadGlobalStyles();
  
  // Apply current page styles
  const currentPath = window.location.pathname;
  applyPageStyles(currentPath);
  
  console.log('Design system initialized with semantic tokens');
};

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeDesignSystem);
}
