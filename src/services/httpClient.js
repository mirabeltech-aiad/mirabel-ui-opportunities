import { getSessionValue } from '../utils/sessionHelpers';
import { isTokenValid } from '../utils/authHelpers';
import { getCurrentUserId } from '../utils/userUtils';

export const apiCall = (
  endpoint,
  method = "GET",
  data = {},
  headers = {},
  cache = "no-cache",
  mode = "cors",
  options = {},
  apiOptions = false,
  dynamicBaseURL
) => {
  let baseURL, domain, token;

  if (process.env.NODE_ENV === "development") {
    let TokenDetails = localStorage.getItem("TokenData");
    if (TokenDetails) {
      TokenDetails = JSON.parse(TokenDetails)
      baseURL = `https://${TokenDetails?.mainurl || new URL(import.meta.env.REACT_APP_API_BASE_URL || "https://tech.magazinemanager.biz").hostname}`;
      domain = `${TokenDetails?.subdomain || new URL(import.meta.env.REACT_APP_API_BASE_URL || "https://tech.magazinemanager.biz").hostname.split('.')[0]}`;
    }
    else {
      baseURL = import.meta.env.REACT_APP_API_BASE_URL || "https://tech.magazinemanager.biz";
      const urlObj = new URL(baseURL);
      domain = urlObj.hostname.split('.')[0];
    }
    token = TokenDetails?.Token || getSessionValue("Token") || ""; // If TokenDetails.Token isn't working, use session token


  } else if (process.env.NODE_ENV === "test") {
    baseURL = "";
  } else {
    baseURL = "";
    domain = getSessionValue("Domain") || window.location.hostname;
      token = getSessionValue("Token");
  }

  // Ensure proper URL construction with slash handling
  const baseUrlToUse = dynamicBaseURL ? dynamicBaseURL : baseURL;
  let fullUrl;

  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    // Endpoint is a full URL
    fullUrl = endpoint;
  } else if (endpoint.startsWith('/')) {
    // Endpoint starts with slash, ensure baseURL doesn't end with slash
    fullUrl = baseUrlToUse.replace(/\/$/, '') + endpoint;
  } else {
    // Endpoint doesn't start with slash, ensure baseURL ends with slash
    fullUrl = baseUrlToUse.replace(/\/$/, '') + '/' + endpoint;
  }

  // Debug logging for URL construction
  if (import.meta.env.DEV) {
    console.log('🔗 URL Construction:', {
      baseURL: baseUrlToUse,
      endpoint: endpoint,
      fullUrl: fullUrl
    });
  }

  let _headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    domain,
    Authorization: token ? `Bearer ${token}` : '',
  });

  Object.keys(headers).forEach((key) => {
    _headers.append(key, headers[key]);
  });

  let request = {};

  if (method !== "GET") {
    request = new Request(fullUrl, {
      method: method,
      mode: mode,
      cache: cache,
      headers: _headers,
      body: JSON.stringify(data),
    });
  } else {
    request = new Request(fullUrl, {
      method: method,
      mode: mode,
      cache: cache,
      headers: _headers,
    });
  }

  return fetch(request, options)
    .then((res) => {
      if (!res.ok) {
        console.log("Response is not  OK", res);
        let ErrorID = "";
        res
          .clone()
          .json()
          .then((response) => {
            ErrorID = response.ErrorID;
            if (ErrorID) {
              console.error("API Error ID:", ErrorID);
              return;
            }
          })
          .catch(() => {
            // Ignore JSON parsing errors for non-JSON responses
          });

        if (res.status === 301) {
          window.location.href = "/sessionout";
          return Promise.reject(res);
        } else if (res.status === 401) {
          var promise = new Promise(function (resolve, reject) {
            //generating access token using refresh token when refresh token expiry or invalid
            // Use web method for token refresh (not CP product)
            generateTokenWithOutPassingRefreshToken(
              {
                endpoint,
                method,
                data,
                headers,
                cache,
                mode,
                options,
                apiOptions,
              },
              resolve,
              reject
            );
          });
          return promise;
        } else if (res.status === 403) {
          return Promise.reject(res);
        }
      }
      return res.json();
    })
    .catch((error) => {
      if (error.name === "Abort Error" || error.name === "AbortError") {
        return;
      }

      console.log("API call Error : ", error);
      if (apiOptions) {
        if (error.status === 403) {
          const element = document.querySelector(apiOptions);
          if (element) {
            element.innerHTML = '<div>You don\'t have access to this contact!!!</div>';
          }
        }
      }
      throw new Error(error.status === 403 ? "Access Denied" : (error.message || " Network request failed"));
    });
};

export const webMethodCall = (
  endpoint,
  method = "GET",
  data = {},
  headers = {},
  cache = "no-cache",
  mode = "cors",
  options = {}
) => {
  if (process.env.NODE_ENV === "development") {
    const promise = new Promise(async (resolve) => {
      const { promises, getValue, devURL } = await import(
        "../utils/developmentHelper"
      );
      const dataToPost = {
        isReactCall: true,
        datajson: data,
        requestId: getValue(),
        url: endpoint.startsWith("http") ? endpoint : devURL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint),
        methodType: method,
      };
      const mmdeviframe = document.querySelector("#mmdeviframe");
      if (mmdeviframe) {
        mmdeviframe.contentWindow.postMessage(dataToPost, "*");
        promises[dataToPost.requestId] = resolve;
      }
    });
    return promise;
  } else {
    const fullUrl = endpoint;
    let _headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    Object.keys(headers).forEach((key) => {
      _headers.append(key, headers[key]);
    });
    let request = {};

    if (method !== "GET") {
      request = new Request(fullUrl, {
        method: method,
        mode: mode,
        cache: cache,
        headers: _headers,
        body: JSON.stringify(data),
      });
    } else {
      request = new Request(fullUrl, {
        method: method,
        mode: mode,
        cache: cache,
        headers: _headers,
      });
    }
    return fetch(request, options)
      .then((res) => {
        if (!res.ok) {
          console.log("Response is not  OK");
          if (res.status === 301) {
            window.location.href = "/sessionout";
          }
          return Promise.reject(res);
        }
        return res.json();
      })
      .catch((error) => {
        if (error.name === "Abort Error") {
          return;
        }
        console.log("API call Error : ", error);
        throw new Error(error.message || " Network request failed");
      });
  }
};

// Token refresh using web method (like mirabel.mm.ui)
const generateTokenWithOutPassingRefreshToken = (params, resolve, reject) => {
  webMethodCall(
    "/intranet/Members/Home/Home.aspx/GenerateTokenByRefreshToken",
    "POST"
  )
    .then((resp) => {
      if (resp.d.Status === 200) {
        var MMClientVars = JSON.parse(
          window.localStorage.getItem("MMClientVars")
        );
        MMClientVars.Token = resp.d.Data.AccessToken;
        MMClientVars.UserId = 23;
        window.localStorage.setItem(
          "MMClientVars",
          JSON.stringify(MMClientVars)
        );
        resolve(
          apiCall(
            params.endpoint,
            params.method,
            params.data,
            params.headers,
            params.cache,
            params.mode,
            params.options,
            params.apiOptions
          )
        );
      }
    })
    .catch((error) => {
      console.log("error while adding call:" + error);
      if (window.location.pathname.startsWith(`/ui60/ce/`)) {
        reject(error);
      }
    });
};

// Class-based wrapper for backward compatibility
class HttpClient {
  constructor() {
    this.updateConfiguration();
  }

  updateConfiguration() {
    this.baseURL = getSessionValue("Host") || window.location.origin;
    this.domain = getSessionValue("Domain") || window.location.hostname;
    this.authToken = getSessionValue("Token") || '';
  }

  getCurrentToken() {
    return getSessionValue("Token") || '';
  }

  getCurrentUserId() {
    return getCurrentUserId();
  }

  async request(endpoint, options = {}) {
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body) : {};
    const headers = options.headers || {};
    const cache = options.cache || "no-cache";
    const mode = options.mode || "cors";

    return apiCall(endpoint, method, data, headers, cache, mode, options);
  }

  async get(endpoint, params = {}, headers = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    const cache = options.cache || "no-cache";
    const mode = options.mode || "cors";

    return apiCall(url, 'GET', {}, headers, cache, mode, options);
  }

  async post(endpoint, data = {}, headers = {}, options = {}) {
    const cache = options.cache || "no-cache";
    const mode = options.mode || "cors";

    return apiCall(endpoint, 'POST', data, headers, cache, mode, options);
  }

  async put(endpoint, data = {}, headers = {}, options = {}) {
    const cache = options.cache || "no-cache";
    const mode = options.mode || "cors";

    return apiCall(endpoint, 'PUT', data, headers, cache, mode, options);
  }

  async delete(endpoint, headers = {}, options = {}) {
    const cache = options.cache || "no-cache";
    const mode = options.mode || "cors";

    return apiCall(endpoint, 'DELETE', {}, headers, cache, mode, options);
  }

  getBaseURL() {
    this.updateConfiguration();
    return this.baseURL;
  }

  getDomain() {
    this.updateConfiguration();
    return this.domain;
  }

  isAuthenticated() {
    const token = this.getCurrentToken();
    return token && isTokenValid(token);
  }

  // Convenience methods that explicitly show token usage
  async getWithToken(endpoint, params = {}, additionalHeaders = {}) {
    const token = this.getCurrentToken();
    console.log(`Making GET request to: ${endpoint} with token: ${token ? 'Present' : 'Missing'}`);

    return this.get(endpoint, params, additionalHeaders);
  }

  async postWithToken(endpoint, data = {}, additionalHeaders = {}) {
    const token = this.getCurrentToken();
    console.log(`Making POST request to: ${endpoint} with token: ${token ? 'Present' : 'Missing'}`);

    return this.post(endpoint, data, additionalHeaders);
  }

  // Debug method to show current configuration
  getDebugInfo() {
    return {
      baseURL: this.getBaseURL(),
      domain: this.getDomain(),
      hasToken: !!this.getCurrentToken(),
      tokenLength: this.getCurrentToken()?.length || 0,
      userId: this.getCurrentUserId(),
      isAuthenticated: this.isAuthenticated()
    };
  }
}

// Create singleton instance
const httpClientInstance = new HttpClient();

// Export for backward compatibility
export default httpClientInstance;
export const getUserId = getCurrentUserId;
export const userId = getCurrentUserId();

// Debug utilities for authentication testing
if (typeof window !== 'undefined') {
  window.debugAuth = {
    quickDebug: async () => {
      const { quickSessionDebug } = await import('../utils/sessionHelpers');
      return quickSessionDebug();
    },

    testAuthBehavior: async () => {
      const { debugAuthenticationBehavior } = await import('../utils/sessionHelpers');
      return debugAuthenticationBehavior();
    },

    checkEnvironment: () => {
      return import('../utils/developmentHelper').then(({ isDevelopmentMode }) => {
        const isDev = isDevelopmentMode();
        console.log('🌍 Environment Check Result:', {
          isDevelopmentMode: isDev,
          hostname: window.location.hostname,
          environment: isDev ? 'DEVELOPMENT' : 'PRODUCTION/STAGING',
          behaviorExpected: isDev ? 'Dev helpers, no login redirect' : 'Login redirect if no session'
        });
        return { isDevelopmentMode: isDev, environment: isDev ? 'development' : 'production' };
      });
    },

    simulateNoSession: async () => {
      console.log('🚫 SIMULATING NO SESSION TEST');
      const originalSession = localStorage.getItem('MMClientVars');
      localStorage.removeItem('MMClientVars');

      const { checkAuthenticationStatus, shouldRedirectToLogin } = await import('../utils/sessionHelpers');
      const { isDevelopmentMode } = await import('../utils/developmentHelper');

      const isDev = isDevelopmentMode();
      const authStatus = checkAuthenticationStatus();
      const shouldRedirect = shouldRedirectToLogin();

      console.log('Results without session:');
      console.log('- Environment:', isDev ? 'DEVELOPMENT' : 'PRODUCTION/STAGING');
      console.log('- Should redirect:', shouldRedirect);
      console.log('- Auth status:', authStatus);
      console.log('- Expected behavior:', isDev ? 'Set dev session' : 'Redirect to login');
      console.log('- Actual behavior:', isDev ? (authStatus.authenticated ? 'CORRECT' : 'ERROR') : (shouldRedirect ? 'CORRECT' : 'ERROR'));

      // Restore session
      if (originalSession) {
        localStorage.setItem('MMClientVars', originalSession);
        console.log('✅ Session restored');
      }

      return {
        environment: isDev ? 'development' : 'production',
        shouldRedirect,
        authStatus,
        behaviorCorrect: isDev ? authStatus.authenticated : shouldRedirect
      };
    },

    forceProductionTest: async () => {
      console.log('🏭 FORCE PRODUCTION BEHAVIOR TEST');
      console.log('This temporarily simulates production environment for testing');

      // Temporarily override environment detection
      const originalHostname = window.location.hostname;

      // Mock a production hostname
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'myapp.mirabeltechnologies.com'
      });

      const { shouldRedirectToLogin, checkAuthenticationStatus } = await import('../utils/sessionHelpers');
      const { isDevelopmentMode } = await import('../utils/developmentHelper');

      const isDev = isDevelopmentMode();
      const shouldRedirect = shouldRedirectToLogin();
      const authStatus = checkAuthenticationStatus();

      console.log('Forced Production Test Results:');
      console.log('- Mocked hostname:', window.location.hostname);
      console.log('- isDevelopmentMode:', isDev);
      console.log('- shouldRedirectToLogin:', shouldRedirect);
      console.log('- checkAuthenticationStatus:', authStatus);
      console.log('- Expected: Should be treated as production');

      // Restore original hostname
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: originalHostname
      });

      console.log('✅ Hostname restored to:', window.location.hostname);

      return {
        wasTreatedAsProduction: !isDev,
        shouldRedirect,
        testPassed: !isDev
      };
    },

    quickFix: async () => {
      console.log('🔧 QUICK FIX: Attempting to fix common session issues');

      const { shouldRedirectToLogin } = await import('../utils/sessionHelpers');

      try {
        const session = JSON.parse(localStorage.getItem('MMClientVars') || '{}');
        let fixesApplied = [];

        // Fix 1: Add IsAuthenticated field if missing but we have essential auth data
        if (!session.IsAuthenticated && session.Email && session.Token && session.UserID) {
          console.log('🔧 Fix 1: Adding missing IsAuthenticated field');
          session.IsAuthenticated = true;
          fixesApplied.push('Added IsAuthenticated=true');
        }

        // Fix 2: Fix ClientID mismatch
        const sessionStorageClientID = sessionStorage.getItem('ClientID');
        if (session.ClientID && session.ClientID !== sessionStorageClientID) {
          console.log('🔧 Fix 2: Fixing ClientID mismatch');
          sessionStorage.setItem('ClientID', session.ClientID);
          fixesApplied.push('Fixed ClientID mismatch');
        }

        // Fix 3: Save updated session
        if (fixesApplied.length > 0) {
          localStorage.setItem('MMClientVars', JSON.stringify(session));
          console.log('✅ Applied fixes:', fixesApplied);

          // Test if the fix worked
          const shouldRedirect = shouldRedirectToLogin();
          console.log('🧪 Test after fix - shouldRedirectToLogin():', shouldRedirect);

          if (!shouldRedirect) {
            console.log('🎉 SUCCESS: Session is now valid!');
            return { success: true, fixes: fixesApplied };
          } else {
            console.log('⚠️ PARTIAL: Fixes applied but still need to check validation');
            return { success: false, fixes: fixesApplied, message: 'Applied fixes but validation still failing' };
          }
        } else {
          console.log('ℹ️ No fixes needed - session appears valid');
          return { success: true, fixes: [], message: 'No fixes needed' };
        }
      } catch (e) {
        console.error('❌ Error applying quick fix:', e);
        return { success: false, error: e.message };
      }
    },

    // Advanced fix for specific cases
    forceValidSession: async (sessionData) => {
      console.log('🔧 FORCE VALID SESSION: Setting session with provided data');

      const { shouldRedirectToLogin } = await import('../utils/sessionHelpers');

      // Ensure IsAuthenticated is set
      if (!sessionData.IsAuthenticated) {
        sessionData.IsAuthenticated = true;
      }

      try {
        localStorage.setItem('MMClientVars', JSON.stringify(sessionData));
        if (sessionData.ClientID) {
          sessionStorage.setItem('ClientID', sessionData.ClientID);
        }

        console.log('✅ Session forced to valid state');
        const shouldRedirect = shouldRedirectToLogin();
        console.log('🧪 Test after force - shouldRedirectToLogin():', shouldRedirect);

        return { success: !shouldRedirect, shouldRedirect };
      } catch (e) {
        console.error('❌ Error forcing valid session:', e);
        return { success: false, error: e.message };
      }
    },

    // Show session in readable format for debugging
    showSession: () => {
      console.log('🔍 Debug: Current session state');
      console.log('MMClientVars:', localStorage.getItem('MMClientVars'));
      console.log('SessionStorage ClientID:', sessionStorage.getItem('ClientID'));

      try {
        const session = JSON.parse(localStorage.getItem('MMClientVars') || '{}');
        console.log('📊 Parsed session analysis:');
        console.log('- IsAuthenticated:', session.IsAuthenticated, `(${typeof session.IsAuthenticated})`);
        console.log('- Email:', session.Email ? '✅ Present' : '❌ Missing');
        console.log('- Token:', session.Token ? `✅ Present (${session.Token.length} chars)` : '❌ Missing');
        console.log('- UserID:', session.UserID ? '✅ Present' : '❌ Missing');
        console.log('- ClientID:', session.ClientID ? '✅ Present' : '❌ Missing');
        return session;
      } catch (e) {
        console.error('Error parsing session:', e);
        return null;
      }
    }
  };

  console.log('🛠️ Authentication Debug Utilities Available:');
  console.log('- window.debugAuth.quickDebug() - ⚡ QUICK session analysis (START HERE)');
  console.log('- window.debugAuth.quickFix() - 🔧 AUTO-FIX common session issues');
  console.log('- window.debugAuth.showSession() - 📊 Show current session data');
  console.log('- window.debugAuth.testAuthBehavior() - Complete authentication test');
  console.log('- window.debugAuth.checkEnvironment() - Check environment detection');
  console.log('- window.debugAuth.simulateNoSession() - Test behavior without session');
  console.log('- window.debugAuth.forceProductionTest() - Force test production behavior');
}
