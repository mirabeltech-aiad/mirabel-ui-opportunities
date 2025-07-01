
const API_BASE_URL = 'https://tech.magazinemanager.biz/';

// IMPORTANT: Replace this with your fresh JWT token from your authentication system
// Please get a new token from https://tech.magazinemanager.biz/ and replace the value below
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjIzIiwiTG9nZ2VkSW5TaXRlQ2xpZW50SUQiOiI1IiwiTG9nZ2VkSW5TaXRlQ3VsdHVyZVVJIjoiZW4tVVMiLCJEYXRlVGltZSI6IjcvMS8yMDI1IDk6MDY6NDcgQU0iLCJMb2dnZWRJblNpdGVDdXJyZW5jeVN5bWJvbCI6IiQiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoidGVjaCIsIkxvZ2dlZEluU2l0ZVRpbWVBZGQiOlsiMCIsIjAiXSwiU291cmNlIjoiVE1NIiwiRW1haWwiOiJzYUBtYWdhemluZW1hbmFnZXIuY29tIiwiSXNBUElVc2VyIjoiRmFsc2UiLCJuYmYiOjE3NTEzNjA4MDcsImV4cCI6MTk3MjExMjgwNywiaWF0IjoxNzUxMzYwODA3LCJpc3MiOiJNYWdhemluZU1hbmFnZXIiLCJhdWQiOiIqIn0.8UvRE9oH8-lNc_vpyhdciSLh5lvSDZYJ64dQExxRbcs';

export const userId = 23;

class HttpClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authToken = AUTH_TOKEN;
  }

  async request(endpoint, options = {}) {
    // Ensure proper URL construction
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${this.baseURL}${cleanEndpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      
      if (this.authToken === 'YOUR_FRESH_JWT_TOKEN_HERE') {
        throw new Error('Please replace YOUR_FRESH_JWT_TOKEN_HERE with a valid JWT token from your authentication system');
      }
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication token expired. Please update the token in httpClient.js');
          throw new Error(`Authentication failed: Token expired (status: ${response.status})`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${cleanEndpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new HttpClient();
