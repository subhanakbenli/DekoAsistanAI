import axios from 'axios';
import { ErrorHandler } from '../utils/ErrorHandler';
import { ApiConstants, EnvironmentConfig } from '../constants';

/**
 * BaseService - Abstract base class for all API services
 * Provides common functionality for HTTP requests, authentication, and error handling
 * 
 * @abstract
 */
export class BaseService {
  constructor(baseURL = null) {
    this.baseURL = baseURL || ApiConstants.buildApiUrl('');
    this.setupAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Setup axios instance with base configuration
   * @private
   */
  setupAxiosInstance() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: EnvironmentConfig.getTimeout(),
    });
  }

  /**
   * Setup request and response interceptors
   * @private
   */
  setupInterceptors() {
    // Request interceptor - Add auth token automatically
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor - Handle common errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Get authentication token from localStorage
   * @protected
   * @returns {string|null} Authentication token
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Handle unauthorized access (401 errors)
   * @protected
   */
  handleUnauthorized() {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Standardized error handling using ErrorHandler utility
   * @protected
   * @param {Error} error - The error object
   * @returns {Error} Processed error
   */
  handleError(error) {
    return ErrorHandler.handle(error, this.constructor.name, {
      logToConsole: true,
      returnUserMessage: false
    });
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  /**
   * Get authentication headers for manual requests
   * @returns {Object} Headers object
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Make a GET request
   * @protected
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Axios config
   * @returns {Promise} Response data
   */
  async get(endpoint, config = {}) {
    const response = await this.api.get(endpoint, config);
    return response.data;
  }

  /**
   * Make a POST request
   * @protected
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}, config = {}) {
    const response = await this.api.post(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   * @protected
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} Response data
   */
  async put(endpoint, data = {}, config = {}) {
    const response = await this.api.put(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   * @protected
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Axios config
   * @returns {Promise} Response data
   */
  async delete(endpoint, config = {}) {
    const response = await this.api.delete(endpoint, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   * @protected
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} Response data
   */
  async patch(endpoint, data = {}, config = {}) {
    const response = await this.api.patch(endpoint, data, config);
    return response.data;
  }
}

export default BaseService;
