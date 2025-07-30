/**
 * Utility Classes - Centralized utility management
 * 
 * All utility classes organized in a single export file
 * following OOP principles and KISS methodology
 */

// Core utilities
export { default as ErrorHandler } from './ErrorHandler';
export { default as ValidationUtils } from './ValidationUtils';

// Domain-specific utilities
export { default as ProductUtils } from './productUtils';
export { default as RoomDesignUtils } from './roomDesignUtils';

// General purpose utilities
export { default as StringUtils } from './StringUtils';
export { default as DateUtils } from './DateUtils';
export { default as ScrollUtils } from './scrollUtils';

// Legacy exports for backward compatibility
export * from './roomDesignUtils';
export * from './scrollUtils';
export * from './productUtils';
