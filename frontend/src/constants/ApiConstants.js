/**
 * API Constants - Centralized API configuration
 * All API-related constants and endpoints organized in one place
 */
export class ApiConstants {
  // Base URLs
  static BASE_URL = 'http://localhost:8000';
  static API_BASE_URL = 'http://localhost:8000/api';
  static WS_BASE_URL = 'ws://localhost:8000/api';

  // API Endpoints
  static ENDPOINTS = {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      UPDATE_PROFILE: '/auth/update-profile'
    },
    
    // Design
    DESIGN: {
      CREATE: '/design',
      GET: '/design',
      BY_ID: (id) => `/design/${id}`,
      GENERATE: '/design/generate'
    },
    
    // Favorites
    FAVORITES: {
      GET: '/favorites',
      ADD: '/favorites',
      REMOVE: (id) => `/favorites/${id}`
    },
    
    // WebSocket
    WEBSOCKET: {
      CONNECT: '/ws'
    },
    
    // Health
    HEALTH: {
      CHECK: '/health'
    }
  };

  // HTTP Status Codes
  static STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  };

  // Request Timeouts (in milliseconds)
  static TIMEOUTS = {
    DEFAULT: 10000,
    UPLOAD: 30000,
    WEBSOCKET_RECONNECT: 3000
  };

  // Build full API URL
  static buildApiUrl(endpoint) {
    return `${ApiConstants.API_BASE_URL}${endpoint}`;
  }

  // Build WebSocket URL
  static buildWsUrl(endpoint) {
    return `${ApiConstants.WS_BASE_URL}${endpoint}`;
  }

  // Build full image URL
  static buildImageUrl(imagePath) {
    return `${ApiConstants.BASE_URL}${imagePath}`;
  }
}

export default ApiConstants;
