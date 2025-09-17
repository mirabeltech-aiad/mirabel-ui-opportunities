// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Default API base URL
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// You can override this in your environment by setting window.API_CONFIG
if (typeof window !== 'undefined' && window.API_CONFIG) {
  Object.assign(API_CONFIG, window.API_CONFIG);
}
