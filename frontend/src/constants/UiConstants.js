/**
 * UI Constants - User Interface related constants
 * Colors, sizes, animations, and UI-specific values
 */
export class UiConstants {
  // Color Palette
  static COLORS = {
    PRIMARY: {
      PURPLE: '#8B5CF6',
      BLUE: '#3B82F6',
      GRADIENT: 'from-purple-600 to-blue-600'
    },
    
    SECONDARY: {
      GREEN: '#10B981',
      RED: '#EF4444',
      YELLOW: '#F59E0B',
      ORANGE: '#F97316'
    },
    
    GRAY: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    
    STATUS: {
      SUCCESS: '#10B981',
      WARNING: '#F59E0B',
      ERROR: '#EF4444',
      INFO: '#3B82F6'
    }
  };

  // Animation Durations (in milliseconds)
  static ANIMATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    TRANSITION: '300ms ease-in-out',
    SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  };

  // Breakpoints
  static BREAKPOINTS = {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  };

  // Z-Index layers
  static Z_INDEX = {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    NOTIFICATION: 1080
  };

  // Common sizes
  static SIZES = {
    NAVBAR_HEIGHT: '64px',
    SIDEBAR_WIDTH: '256px',
    BUTTON_HEIGHT: {
      SMALL: '32px',
      MEDIUM: '40px',
      LARGE: '48px'
    },
    BORDER_RADIUS: {
      SMALL: '4px',
      MEDIUM: '8px',
      LARGE: '12px',
      FULL: '9999px'
    }
  };

  // Loading states
  static LOADING = {
    SPINNER_SIZE: {
      SMALL: '16px',
      MEDIUM: '24px',
      LARGE: '32px'
    },
    SKELETON_ANIMATION: 'pulse 1.5s ease-in-out infinite'
  };

  // Form validation
  static VALIDATION = {
    DEBOUNCE_DELAY: 300,
    MIN_PASSWORD_LENGTH: 8,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  };
}

export default UiConstants;
