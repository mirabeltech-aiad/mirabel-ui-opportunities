import axiosInstance from './axiosInstance';

class AxiosService {
  constructor(instance = axiosInstance) {
    this.instance = instance;
  }

  async get(url, config = {}) {
    return this.instance.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.instance.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.instance.delete(url, config);
  }

  /**
   * Axios-based webMethodCall, mimicking the fetch-based implementation
   */
  async webMethodCall(
    endpoint,
    method = 'GET',
    data = {},
    headers = {},
    options = {}
  ) {
    // if (process.env.NODE_ENV === 'development') {
    //   throw new Error('webMethodCall iframe logic not implemented for axios in development');
    // }
    try {
      const config = {
        url: endpoint,
        method: method.toLowerCase(),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        ...options,
      };
      if (method.toUpperCase()  !== 'GET') {
        config.data = data;
      } else {
        config.params = data;
      }
      const response = await this.instance.request(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 301) {
          window.location.href = '/sessionout';
        }
        throw error.response;
      }
      throw error;
    }
  }

}

export default new AxiosService(); 