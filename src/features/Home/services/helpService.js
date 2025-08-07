import { getSessionValue } from '../../../utils/sessionHelpers';

/**
 * Help service for constructing help URLs with session parameters
 * Matches the backend logic: {HelpSiteURL}?t={Token}&uid={RepID}&a=mm
 */
export const helpService = {
  /**
   * Get the help site URL based on environment
   * @returns {string} The help site URL
   */
  getHelpSiteURL: () => {
    // Use environment variable if available, otherwise fallback to production
    return import.meta.env.REACT_APP_HELP_SITE_URL || 'https://help.mirabeltechnologies.com';
  },

  /**
   * Construct the complete help URL with session parameters
   * Matches backend logic: btnHelp.HRef = $"{Connection.HelpSiteURL}?t={SessionManager.Token}&uid={SessionManager.RepID}&a=mm"
   * @returns {string} The complete help URL with parameters
   */
  getHelpURL: () => {
    const helpSiteURL = helpService.getHelpSiteURL();
    const token = getSessionValue('Token') || '';
    const userId = getSessionValue('UserID') || '';
    
    // Construct URL exactly like backend: {HelpSiteURL}?t={Token}&uid={RepID}&a=mm
    const helpURL = `${helpSiteURL}?t=${encodeURIComponent(token)}&uid=${encodeURIComponent(userId)}&a=mm`;
    
    console.log('🔗 Help URL constructed:', {
      helpSiteURL,
      hasToken: !!token,
      userId,
      finalURL: helpURL
    });
    
    return helpURL;
  },

  /**
   * Open help in new tab (matches original behavior)
   */
  openHelp: () => {
    const helpURL = helpService.getHelpURL();
    window.open(helpURL, '_blank');
  }
}; 