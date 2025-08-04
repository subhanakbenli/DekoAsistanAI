/**
 * API Configuration Index
 * Central export point for all API configuration modules
 * 
 * @description
 * This file provides a single import point for all API-related configurations,
 * schemas, and endpoints. Follows the barrel export pattern for clean imports.
 * 
 * @version 2.0.0
 * @author DekoAsistan Team
 */

// Export all endpoint configurations
export {
  AUTH_ENDPOINTS,
  DESIGN_ENDPOINTS,
  BLOG_ENDPOINTS,
  FAVORITE_ENDPOINTS,
  HEALTH_ENDPOINTS,
  WEBSOCKET_ENDPOINTS,
  UPLOAD_ENDPOINTS,
  ALL_ENDPOINTS,
  buildEndpoint,
  isValidEndpoint
} from './endpoints';

// Export all API schemas
export {
  AUTH_SCHEMAS,
  DESIGN_SCHEMAS,
  BLOG_SCHEMAS,
  FAVORITE_SCHEMAS,
  COMMON_SCHEMAS,
  ALL_SCHEMAS,
  validateRequestData
} from './schemas';

// Export all API configuration
export {
  apiConfig,
  HTTP_STATUS,
  TIMEOUTS,
  RETRY_CONFIG,
  DEFAULT_HEADERS,
  CACHE_CONFIG,
  RATE_LIMIT_CONFIG,
  ApiConfig
} from './config';

// Re-export for backward compatibility
export { default as ApiEndpoints } from './endpoints';
export { default as ApiSchemas } from './schemas';
export { default as ApiConfigDefaults } from './config';
