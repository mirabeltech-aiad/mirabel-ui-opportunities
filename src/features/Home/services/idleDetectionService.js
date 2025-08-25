import { IDLE_CONFIG, STORAGE_KEYS } from '@/utils/constants';

// Default idle timeout (1 minute)
export const DEFAULT_IDLE_TIMEOUT = IDLE_CONFIG.THREE_HOURS;

/**
 * Get user's idle detection preferences
 * @returns {object} User preferences for idle detection
 */
export const getIdleDetectionPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (stored) {
      const preferences = JSON.parse(stored);
      return {
        enabled: preferences.idleDetection?.enabled ?? true,
        timeout: preferences.idleDetection?.timeout ?? DEFAULT_IDLE_TIMEOUT,
      };
    }
  } catch (error) {
    console.warn('Failed to parse idle detection preferences:', error);
  }

  // Return default preferences
  return {
    enabled: true,
    timeout: DEFAULT_IDLE_TIMEOUT,
  };
};

