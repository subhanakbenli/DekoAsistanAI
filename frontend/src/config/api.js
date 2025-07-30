import { ApiConstants, EnvironmentConfig } from '../constants';

/**
 * API Configuration - Centralized API settings
 * @deprecated - Use ApiConstants and EnvironmentConfig from constants instead
 * 
 * This file is kept for backward compatibility.
 * New code should import from '../constants'
 */
export const API_CONFIG = {
  BASE_URL: EnvironmentConfig.getBaseUrl(),
  ENDPOINTS: {
    TEST: ApiConstants.ENDPOINTS.HEALTH.CHECK,
    DESIGN: ApiConstants.ENDPOINTS.DESIGN.CREATE
  }
};

// Modern export
export default {
  ...API_CONFIG,
  // Expose new constants for gradual migration
  CONSTANTS: ApiConstants,
  ENVIRONMENT: EnvironmentConfig
};
