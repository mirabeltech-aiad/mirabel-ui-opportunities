/**
 * Session Helper Functions
 * Manages user session data in localStorage
 */

// Session storage key for MMClientVars (matching legacy ASP.NET pattern)
const SESSION_STORAGE_KEY = 'MMClientVars';

/**
 * Get session data from localStorage
 * @returns {object|null} Parsed session data or null if not found
 */
export const getSessionData = () => {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

/**
 * Set complete session data to localStorage
 * @param {object} sessionData - Session data object to store
 */
export const setSessionData = (sessionData) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error setting session data:', error);
  }
};

/**
 * Get specific session value by key
 * @param {string} key - Key to retrieve
 * @returns {any} Session value or null if not found
 */
export const getSessionValue = (key) => {
  const sessionData = getSessionData();
  return sessionData ? sessionData[key] : null;
};

/**
 * Set specific session value by key
 * @param {string} key - Key to set
 * @param {any} value - Value to set
 */
export const setSessionValue = (key, value) => {
  const sessionData = getSessionData() || {};
  sessionData[key] = value;
  setSessionData(sessionData);
};

/**
 * Remove specific session value by key
 * @param {string} key - Key to remove
 */
export const removeSessionValue = (key) => {
  const sessionData = getSessionData();
  if (sessionData && sessionData[key] !== undefined) {
    delete sessionData[key];
    setSessionData(sessionData);
  }
};

/**
 * Clear all session data
 */
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * Reset session data (alias for clearSession)
 */
export const resetSession = clearSession;

/**
 * Get user information from session
 * @returns {object|null} User info object or null
 */
export const getUserInfo = () => {
  debugger;
  const sessionData = getSessionData();
  if (!sessionData) return null;

  return {
    userId: sessionData.UserID || sessionData.userId,
    userID: sessionData.UserID || sessionData.userId, // Support both formats
    email: sessionData.Email || sessionData.email,
    fullName: sessionData.FullName || sessionData.fullName,
    userName: sessionData.UserName || sessionData.userName,
    sessionId: sessionData.SessionID || sessionData.sessionId,
    isAdmin: sessionData.IsAdmin || sessionData.isAdmin || false,
    isSA: sessionData.IsSA || sessionData.isSA || false,
    companyId: sessionData.CompanyID || sessionData.companyId,
    repId: sessionData.RepID || sessionData.repId,
    jobFunctionId: sessionData.JobFunctionID || sessionData.jobFunctionId,
    permissions: sessionData.Permissions || sessionData.permissions || []
  };
};

/**
 * Set user information in session
 * @param {object} userInfo - User info object to store
 */
export const setUserInfo = (userInfo) => {
  const sessionData = getSessionData() || {};
  
  // Map user info to session format (keeping legacy naming)
  sessionData.UserID = userInfo.userId || userInfo.UserID;
  sessionData.Email = userInfo.email || userInfo.Email;
  sessionData.FullName = userInfo.fullName || userInfo.FullName;
  sessionData.UserName = userInfo.userName || userInfo.UserName;
  sessionData.SessionID = userInfo.sessionId || userInfo.SessionID;
  sessionData.IsAdmin = userInfo.isAdmin || userInfo.IsAdmin || false;
  sessionData.IsSA = userInfo.isSA || userInfo.IsSA || false;
  sessionData.CompanyID = userInfo.companyId || userInfo.CompanyID;
  sessionData.RepID = userInfo.repId || userInfo.RepID;
  sessionData.JobFunctionID = userInfo.jobFunctionId || userInfo.JobFunctionID;
  sessionData.Permissions = userInfo.permissions || userInfo.Permissions || [];
  
  setSessionData(sessionData);
};

/**
 * Check if user session is valid
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = () => {
  const sessionData = getSessionData();
  const sessionId = sessionData?.SessionID;
  const email = sessionData?.Email;
  
  return !!(sessionId && email);
};

/**
 * Get current user ID from session
 * @returns {string|number|null} User ID or null if not found
 */
export const getCurrentUserId = () => {
  const userInfo = getUserInfo();
  return userInfo?.userId || userInfo?.UserID || null;
};

/**
 * Get current user email from session
 * @returns {string|null} User email or null if not found
 */
export const getCurrentUserEmail = () => {
  const userInfo = getUserInfo();
  return userInfo?.email || userInfo?.Email || null;
};

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin
 */
export const isCurrentUserAdmin = () => {
  const userInfo = getUserInfo();
  return !!(userInfo?.isAdmin || userInfo?.IsAdmin || userInfo?.isSA || userInfo?.IsSA);
};

/**
 * Check if session is active (alias for isSessionValid)
 * @returns {boolean} True if session is active
 */
export const isActiveSession = () => {
  return isSessionValid();
};

/**
 * Check if two sessions are the same
 * @param {object} session1 - First session data
 * @param {object} session2 - Second session data
 * @returns {boolean} True if sessions are the same
 */
export const isSameSession = (session1, session2) => {
  if (!session1 || !session2) return false;
  
  const sessionId1 = session1.SessionID || session1.sessionId;
  const sessionId2 = session2.SessionID || session2.sessionId;
  const userId1 = session1.UserID || session1.userId;
  const userId2 = session2.UserID || session2.userId;
  
  return sessionId1 === sessionId2 && userId1 === userId2;
};

/**
 * Set client session data (for legacy compatibility)
 * @param {object} clientSessionData - Client session data to set
 */
export const setClientSession = (clientSessionData) => {
  if (!clientSessionData) return;
  
  // Convert client session to standard session format
  const sessionData = {
    SessionID: clientSessionData.SessionID || clientSessionData.sessionId,
    UserID: clientSessionData.UserID || clientSessionData.userId,
    Email: clientSessionData.Email || clientSessionData.email,
    FullName: clientSessionData.FullName || clientSessionData.fullName,
    UserName: clientSessionData.UserName || clientSessionData.userName,
    IsAdmin: clientSessionData.IsAdmin || clientSessionData.isAdmin || false,
    IsSA: clientSessionData.IsSA || clientSessionData.isSA || false,
    CompanyID: clientSessionData.CompanyID || clientSessionData.companyId,
    RepID: clientSessionData.RepID || clientSessionData.repId,
    JobFunctionID: clientSessionData.JobFunctionID || clientSessionData.jobFunctionId,
    Permissions: clientSessionData.Permissions || clientSessionData.permissions || []
  };
  
  setSessionData(sessionData);
};