import { useEffect, useRef, useCallback, useState } from 'react';
import { logout } from '@/utils/authHelpers';
import { getIdleDetectionPreferences } from '../services/idleDetectionService';

/**
 * Enhanced idle detection hook with warning functionality
 * @param {number} customTimeout - Custom timeout override (optional)
 * @param {boolean} customEnabled - Custom enabled override (optional)
 * @returns {object} Object containing idle state, warning state, and control functions
 */
export const useIdleDetectionWithWarning = (customTimeout = null, customEnabled = null) => {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  // Get user preferences
  const preferences = getIdleDetectionPreferences();
  const enabled = customEnabled !== null ? customEnabled : preferences.enabled;
  const timeout = customTimeout || preferences.timeout;
  const warningTime = 30000; // 30 seconds warning by default

  // Reset the idle timer
  const resetIdleTimer = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning if it was showing
    setShowWarning(false);

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingTime(timeout - warningTime);
      
      // Start countdown for remaining time
      const countdownInterval = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime <= 0) {
            clearInterval(countdownInterval);
          }
          return newTime;
        });
      }, 1000);
      
    }, timeout - warningTime);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      setShowWarning(false);
      
      // Logout user after idle timeout
      console.log('🕐 Idle detection: User inactive for', timeout / 1000, 'seconds, logging out...');
      logout();
    }, timeout);

    // Update last activity timestamp
    lastActivityRef.current = Date.now();
  }, [enabled, timeout, warningTime]);

  // Handle user activity events
  const handleUserActivity = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Extend session (called when user clicks "Extend Session" in warning)
  const extendSession = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Close warning modal (called when user clicks "Logout Now")
  const closeWarning = useCallback(() => {
    setShowWarning(false);
    logout();
  }, []);

  // Initialize idle detection
  useEffect(() => {
    if (!enabled) return;

    // Set initial timer
    resetIdleTimer();

    // Add event listeners for THIS TAB ONLY
    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
      'wheel'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Tab visibility change - pause/resume based on THIS tab
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // This tab is hidden, pause its idle detection
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
        setShowWarning(false);
      } else {
        // This tab is visible again, check if it was idle
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity > timeout) {
          // Tab was idle while hidden, logout immediately
          console.log('🚨 Tab was idle while hidden, logging out...');
          logout();
        } else {
          // Resume idle detection
          resetIdleTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, handleUserActivity, resetIdleTimer, timeout]);

  return {
    showWarning,
    remainingTime,
    extendSession,
    closeWarning,
    enabled,
    timeout,
    warningTime
  };
}; 