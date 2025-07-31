// Hook exports - Centralized hook management

// Composed hooks
export { useRoomDesign } from './useRoomDesign';
export { useFavorites } from './useFavorites';

// New feature hooks
export { useColorPalette } from './useColorPalette';
export { useProductCategories } from './useProductCategories';
export { useDoorWindow } from './useDoorWindow';
export { useShareToBlog } from './useShareToBlog';

// Specialized hooks
export { default as useWebSocket } from './useWebSocket';
export { default as useFormState } from './useFormState';
export { default as useDesignSubmission } from './useDesignSubmission';

// Legacy hooks (for backward compatibility)
export { useRoomDesign as useRoomDesignLegacy } from './useRoomDesign_backup';
