/**
 * Window Helper Utilities
 * Functions to check window accessibility for cross-frame communication
 */

/**
 * Checks if window.top is accessible
 * Used by Feature apps to determine if they can communicate with the Shell app
 * @returns {boolean} True if window.top is accessible, false otherwise
 */
export const isWindowTopAccessible = () => {
  try {
    // Try to access window.top and a property on it
    if (window.top && window.top !== window) {
      // Try to access a property to test if it's really accessible
      window.top.location.href;
      return true;
    }
    return false;
  } catch (error) {
    // If we get a security error, window.top is not accessible
    return false;
  }
};

/**
 * Safely gets window.top if accessible
 * @returns {Window|null} window.top if accessible, null otherwise
 */
export const getTopWindow = () => {
  if (isWindowTopAccessible()) {
    return window.top;
  }
  return null;
}; 