/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions following RESTful conventions
 * 
 * @description
 * This file contains all API endpoints used throughout the application.
 * Organized by feature modules for easy maintenance and discoverability.
 * 
 * @version 2.0.0
 * @author DekoAsistan Team
 */

/**
 * Authentication endpoints
 */
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email'
};

/**
 * Design endpoints
 */
export const DESIGN_ENDPOINTS = {
  CREATE: '/design/test', // Current backend endpoint for design creation
  HISTORY: '/design/history',
  DETAIL: '/design', // GET /design/{id}
  DELETE: '/design', // DELETE /design/{id}
  UPDATE: '/design', // PUT /design/{id}
  DUPLICATE: '/design/duplicate', // POST /design/{id}/duplicate
  EXPORT: '/design/export' // POST /design/{id}/export
};

/**
 * Blog endpoints
 */
export const BLOG_ENDPOINTS = {
  POSTS: '/blog/posts',
  POST_DETAIL: '/blog/posts', // GET /blog/posts/{id}
  FILTER_OPTIONS: '/blog/filter-options',
  STATS: '/blog/stats',
  VIEW: '/blog/posts', // POST /blog/posts/{id}/view
  PUBLISH_DESIGN: '/blog/designs', // POST /blog/designs/{designId}/publish
  PUBLISH_STATUS: '/blog/designs', // GET /blog/designs/{designId}/published-status
  CHECK_PUBLISH_STATUS: '/blog/check-publish-status' // GET /blog/check-publish-status/{designId}
};

/**
 * Favorites endpoints
 */
export const FAVORITE_ENDPOINTS = {
  USER_FAVORITES: '/favorites/my-favorites',
  DESIGN_FAVORITE: '/favorites/design',
  PRODUCT_FAVORITE: '/favorites/product',
  FAVORITE_DESIGNS: '/favorites/designs',
  FAVORITE_PRODUCTS: '/favorites/products'
};

/**
 * Health check endpoints
 */
export const HEALTH_ENDPOINTS = {
  CHECK: '/health',
  STATUS: '/health/status',
  METRICS: '/health/metrics'
};

/**
 * WebSocket endpoints
 */
export const WEBSOCKET_ENDPOINTS = {
  DESIGN: '/ws/design',
  NOTIFICATIONS: '/ws/notifications',
  CHAT: '/ws/chat'
};

/**
 * File upload endpoints
 */
export const UPLOAD_ENDPOINTS = {
  IMAGE: '/upload/image',
  AVATAR: '/upload/avatar',
  DESIGN_IMAGE: '/upload/design-image'
};

/**
 * All endpoints combined for easy access
 */
export const ALL_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  DESIGN: DESIGN_ENDPOINTS,
  BLOG: BLOG_ENDPOINTS,
  FAVORITES: FAVORITE_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS,
  WEBSOCKET: WEBSOCKET_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS
};

/**
 * Helper function to build dynamic endpoints
 * @param {string} template - Endpoint template with placeholders
 * @param {object} params - Parameters to replace in template
 * @returns {string} Built endpoint
 * 
 * @example
 * buildEndpoint('/users/{userId}/posts/{postId}', { userId: 123, postId: 456 })
 * // Returns: '/users/123/posts/456'
 */
export const buildEndpoint = (template, params = {}) => {
  return Object.entries(params).reduce(
    (endpoint, [key, value]) => endpoint.replace(`{${key}}`, value),
    template
  );
};

/**
 * Endpoint validation helper
 * @param {string} endpoint - Endpoint to validate
 * @returns {boolean} Whether endpoint is valid
 */
export const isValidEndpoint = (endpoint) => {
  return typeof endpoint === 'string' && endpoint.startsWith('/');
};

export default ALL_ENDPOINTS;
