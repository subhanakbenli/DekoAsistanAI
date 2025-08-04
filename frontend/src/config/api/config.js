/**
 * API Configuration
 * Centralized API configuration and settings
 * 
 * @description
 * This file contains all API-related configuration including base URLs,
 * timeouts, retry policies, and environment-specific settings.
 * 
 * @version 2.0.0
 * @author DekoAsistan Team
 */

/**
 * Environment detection
 */
const getEnvironment = () => {
  if (typeof window === 'undefined') return 'server';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname.includes('staging') || hostname.includes('test')) {
    return 'staging';
  } else {
    return 'production';
  }
};

/**
 * Environment-specific configurations
 */
const ENVIRONMENT_CONFIGS = {
  development: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    WS_BASE_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/api',
    BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:8000',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    LOG_LEVEL: 'debug'
  },
  staging: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://staging-api.dekoasistan.com/api',
    WS_BASE_URL: process.env.REACT_APP_WS_URL || 'wss://staging-api.dekoasistan.com/api',
    BASE_URL: process.env.REACT_APP_BASE_URL || 'https://staging-api.dekoasistan.com',
    TIMEOUT: 20000,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 2000,
    LOG_LEVEL: 'info'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://api.dekoasistan.com/api',
    WS_BASE_URL: process.env.REACT_APP_WS_URL || 'wss://api.dekoasistan.com/api',
    BASE_URL: process.env.REACT_APP_BASE_URL || 'https://api.dekoasistan.com',
    TIMEOUT: 15000,
    RETRY_ATTEMPTS: 1,
    RETRY_DELAY: 3000,
    LOG_LEVEL: 'error'
  }
};

/**
 * Get current environment configuration
 */
const getCurrentConfig = () => {
  const env = getEnvironment();
  return ENVIRONMENT_CONFIGS[env] || ENVIRONMENT_CONFIGS.development;
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  NOT_MODIFIED: 304,
  
  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

/**
 * Request timeout configurations
 */
export const TIMEOUTS = {
  DEFAULT: getCurrentConfig().TIMEOUT,
  UPLOAD: 60000, // 1 minute for file uploads
  DESIGN_GENERATION: 120000, // 2 minutes for AI design generation
  WEBSOCKET_RECONNECT: 3000,
  HEALTH_CHECK: 5000
};

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  ATTEMPTS: getCurrentConfig().RETRY_ATTEMPTS,
  DELAY: getCurrentConfig().RETRY_DELAY,
  EXPONENTIAL_BACKOFF: true,
  MAX_DELAY: 10000,
  
  // Status codes that should trigger a retry
  RETRY_STATUS_CODES: [
    HTTP_STATUS.TOO_MANY_REQUESTS,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.BAD_GATEWAY,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    HTTP_STATUS.GATEWAY_TIMEOUT
  ]
};

/**
 * Request headers configuration
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  LONG_TTL: 60 * 60 * 1000, // 1 hour
  SHORT_TTL: 30 * 1000, // 30 seconds
  
  // Endpoints that should be cached
  CACHEABLE_ENDPOINTS: [
    '/blog/filter-options',
    '/blog/stats',
    '/health'
  ]
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  // Requests per minute for different endpoint groups
  AUTH: 10,
  DESIGN: 5,
  BLOG: 30,
  FAVORITES: 20,
  DEFAULT: 15
};

/**
 * API Configuration Class
 */
export class ApiConfig {
  constructor() {
    this.config = getCurrentConfig();
    this.environment = getEnvironment();
  }

  /**
   * Get base API URL
   */
  getApiBaseUrl() {
    return this.config.API_BASE_URL;
  }

  /**
   * Get WebSocket base URL
   */
  getWsBaseUrl() {
    return this.config.WS_BASE_URL;
  }

  /**
   * Get base URL for assets
   */
  getBaseUrl() {
    return this.config.BASE_URL;
  }

  /**
   * Build full API URL
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   */
  buildApiUrl(endpoint) {
    return `${this.getApiBaseUrl()}${endpoint}`;
  }

  /**
   * Build WebSocket URL
   * @param {string} endpoint - WebSocket endpoint
   * @returns {string} Full WebSocket URL
   */
  buildWsUrl(endpoint) {
    return `${this.getWsBaseUrl()}${endpoint}`;
  }

  /**
   * Build asset URL
   * @param {string} path - Asset path
   * @returns {string} Full asset URL
   */
  buildAssetUrl(path) {
    return `${this.getBaseUrl()}${path}`;
  }

  /**
   * Get timeout for specific operation
   * @param {string} operation - Operation type
   * @returns {number} Timeout in milliseconds
   */
  getTimeout(operation = 'default') {
    return TIMEOUTS[operation.toUpperCase()] || TIMEOUTS.DEFAULT;
  }

  /**
   * Get retry configuration
   * @returns {object} Retry configuration
   */
  getRetryConfig() {
    return RETRY_CONFIG;
  }

  /**
   * Check if running in development mode
   * @returns {boolean} Is development
   */
  isDevelopment() {
    return this.environment === 'development';
  }

  /**
   * Check if running in production mode
   * @returns {boolean} Is production
   */
  isProduction() {
    return this.environment === 'production';
  }

  /**
   * Get log level for current environment
   * @returns {string} Log level
   */
  getLogLevel() {
    return this.config.LOG_LEVEL;
  }
}

// Create singleton instance
export const apiConfig = new ApiConfig();

/**
 * Export all configurations
 */
export default {
  apiConfig,
  HTTP_STATUS,
  TIMEOUTS,
  RETRY_CONFIG,
  DEFAULT_HEADERS,
  CACHE_CONFIG,
  RATE_LIMIT_CONFIG
};
