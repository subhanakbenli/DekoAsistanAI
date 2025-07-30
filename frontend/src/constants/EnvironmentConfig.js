/**
 * Environment Configuration - Environment-specific settings
 * Handles different configurations for development, staging, and production
 */
export class EnvironmentConfig {
  // Current environment
  static ENV = process.env.NODE_ENV || 'development';
  
  // Environment flags
  static IS_DEVELOPMENT = EnvironmentConfig.ENV === 'development';
  static IS_PRODUCTION = EnvironmentConfig.ENV === 'production';
  static IS_TEST = EnvironmentConfig.ENV === 'test';

  // API Configuration based on environment
  static getApiConfig() {
    switch (EnvironmentConfig.ENV) {
      case 'production':
        return {
          baseUrl: process.env.REACT_APP_API_URL || 'https://api.dekoasistan.com',
          wsUrl: process.env.REACT_APP_WS_URL || 'wss://api.dekoasistan.com',
          timeout: 15000
        };
      
      case 'staging':
        return {
          baseUrl: process.env.REACT_APP_API_URL || 'https://staging-api.dekoasistan.com',
          wsUrl: process.env.REACT_APP_WS_URL || 'wss://staging-api.dekoasistan.com',
          timeout: 12000
        };
      
      default: // development
        return {
          baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
          wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:8000',
          timeout: 10000
        };
    }
  }

  // Feature flags
  static FEATURES = {
    ENABLE_ANALYTICS: EnvironmentConfig.IS_PRODUCTION,
    ENABLE_DEBUG_LOGS: EnvironmentConfig.IS_DEVELOPMENT,
    ENABLE_ERROR_REPORTING: EnvironmentConfig.IS_PRODUCTION,
    ENABLE_WEBSOCKET_RECONNECT: true,
    ENABLE_AUTO_SAVE: true,
    ENABLE_DARK_MODE: true,
    ENABLE_EXPERIMENTAL_FEATURES: EnvironmentConfig.IS_DEVELOPMENT
  };

  // Debug settings
  static DEBUG = {
    ENABLED: EnvironmentConfig.IS_DEVELOPMENT,
    LOG_LEVEL: EnvironmentConfig.IS_DEVELOPMENT ? 'debug' : 'error',
    SHOW_REDUX_LOGS: EnvironmentConfig.IS_DEVELOPMENT,
    SHOW_NETWORK_LOGS: EnvironmentConfig.IS_DEVELOPMENT,
    PERFORMANCE_MONITORING: EnvironmentConfig.IS_PRODUCTION
  };

  // Storage settings
  static STORAGE = {
    PREFIX: 'dekoasistan_',
    ENCRYPTION_ENABLED: EnvironmentConfig.IS_PRODUCTION,
    CACHE_DURATION: EnvironmentConfig.IS_DEVELOPMENT ? 5 * 60 * 1000 : 30 * 60 * 1000 // 5min dev, 30min prod
  };

  // Rate limiting
  static RATE_LIMITS = {
    API_REQUESTS_PER_MINUTE: EnvironmentConfig.IS_DEVELOPMENT ? 100 : 60,
    DESIGN_GENERATIONS_PER_HOUR: EnvironmentConfig.IS_DEVELOPMENT ? 20 : 10,
    FILE_UPLOADS_PER_HOUR: 50
  };

  // Helper methods
  static getBaseUrl() {
    return EnvironmentConfig.getApiConfig().baseUrl;
  }

  static getWebSocketUrl() {
    return EnvironmentConfig.getApiConfig().wsUrl;
  }

  static getTimeout() {
    return EnvironmentConfig.getApiConfig().timeout;
  }

  static isFeatureEnabled(feature) {
    return EnvironmentConfig.FEATURES[feature] || false;
  }

  static shouldLog(level) {
    if (!EnvironmentConfig.DEBUG.ENABLED) return false;
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(EnvironmentConfig.DEBUG.LOG_LEVEL);
    const requestedLevelIndex = levels.indexOf(level);
    
    return requestedLevelIndex >= currentLevelIndex;
  }
}

export default EnvironmentConfig;
