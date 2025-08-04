/**
 * Configuration Index
 * Central export point for all configuration modules
 * 
 * @description
 * This file provides a unified interface for all application configurations.
 * It exports API configurations, constants, and other settings.
 * 
 * @version 2.0.0
 * @author DekoAsistan Team
 */

// Export all API configurations
export * from './api';

// Re-export for convenience
export { default as ApiConfig } from './api';
