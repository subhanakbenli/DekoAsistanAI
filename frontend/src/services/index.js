// Service exports - Centralized service management
export { default as BaseService } from './BaseService';
export { default as authService } from './authService';
export { default as blogService } from './blogService';
export { default as designService } from './designService';
export { default as favoriteService } from './favoriteService';

// Named exports for backward compatibility
export { authService as AuthService } from './authService';
export { blogService as BlogService } from './blogService';
export { designService as DesignService } from './designService';
export { favoriteService as FavoriteService } from './favoriteService';
