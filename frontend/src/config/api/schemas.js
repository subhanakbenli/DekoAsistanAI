/**
 * API Request/Response Schemas
 * Type definitions and validation schemas for all API operations
 * 
 * @description
 * This file contains standardized data structures for API requests and responses.
 * Helps maintain consistency and provides clear documentation for developers.
 * 
 * @version 2.0.0
 * @author DekoAsistan Team
 */

/**
 * Authentication Schemas
 */
export const AUTH_SCHEMAS = {
  // Registration request body
  REGISTER_REQUEST: {
    email: 'string', // User email address
    username: 'string', // Username (usually same as email)
    password: 'string', // User password (min 8 chars)
    first_name: 'string', // User first name
    last_name: 'string' // User last name
  },

  // Login request body (FormData)
  LOGIN_REQUEST: {
    username: 'string', // Email used as username
    password: 'string' // User password
  },

  // Profile update request body
  PROFILE_UPDATE_REQUEST: {
    first_name: 'string?', // Optional: User first name
    last_name: 'string?', // Optional: User last name
    email: 'string?', // Optional: New email
    avatar_url: 'string?', // Optional: Profile picture URL
    bio: 'string?' // Optional: User biography
  },

  // Standard auth response
  AUTH_RESPONSE: {
    access_token: 'string', // JWT access token
    token_type: 'string', // Usually "bearer"
    user: {
      id: 'number',
      email: 'string',
      first_name: 'string',
      last_name: 'string',
      is_active: 'boolean',
      created_at: 'string'
    }
  }
};

/**
 * Design Schemas
 */
export const DESIGN_SCHEMAS = {
  // Design creation request body
  CREATE_REQUEST: {
    room_type: 'string', // Type of room (e.g., 'living_room', 'bedroom')
    design_style: 'string', // Design style (e.g., 'modern', 'classic')
    notes: 'string', // Additional user notes and requirements
    connection_id: 'string?', // Optional: WebSocket connection ID
    width: 'number?', // Optional: Room width in cm
    length: 'number?', // Optional: Room length in cm
    height: 'number?', // Optional: Room height in cm
    price: 'number?', // Optional: Budget constraint
    color_info: {
      dominantColor: 'string', // Primary color preference
      colorName: 'string', // Human-readable color name
      colorPalette: 'array' // Array of color codes
    },
    product_categories: {
      type: 'string', // 'categories' or 'custom'
      products: 'array', // Array of product objects
      description: 'string' // Custom description for products
    }
  },

  // Design response structure
  DESIGN_RESPONSE: {
    design_id: 'string',
    status: 'string', // 'completed', 'processing', 'failed'
    result: {
      room_description: 'string',
      design_explanation: 'string',
      color_scheme: 'object',
      products: 'array',
      mood_board_url: 'string'
    },
    created_at: 'string',
    updated_at: 'string'
  },

  // Design history response
  HISTORY_RESPONSE: {
    designs: 'array', // Array of design objects
    total_count: 'number',
    page: 'number',
    limit: 'number'
  }
};

/**
 * Blog Schemas
 */
export const BLOG_SCHEMAS = {
  // Blog posts query parameters
  POSTS_QUERY_PARAMS: {
    room_type: 'string?', // Optional: Filter by room type
    design_style: 'string?', // Optional: Filter by design style
    search: 'string?', // Optional: Search term
    sort_by: 'string?', // Optional: Sort criteria
    page: 'number', // Page number (default: 1)
    limit: 'number' // Items per page (default: 12)
  },

  // Blog posts response
  POSTS_RESPONSE: {
    posts: 'array', // Array of blog post objects
    total_count: 'number',
    current_page: 'number',
    total_pages: 'number',
    has_next: 'boolean',
    has_prev: 'boolean'
  },

  // Single blog post structure
  BLOG_POST: {
    id: 'number',
    title: 'string',
    content: 'string',
    image_url: 'string',
    author: 'object',
    created_at: 'string',
    updated_at: 'string',
    view_count: 'number',
    like_count: 'number',
    room_type: 'string',
    design_style: 'string',
    tags: 'array'
  },

  // Publish design to blog request
  PUBLISH_REQUEST: {
    title: 'string?', // Optional: Custom title
    description: 'string?', // Optional: Custom description
    tags: 'array?', // Optional: Custom tags
    is_public: 'boolean', // Whether post is public
    allow_comments: 'boolean' // Whether comments are allowed
  }
};

/**
 * Favorites Schemas
 */
export const FAVORITE_SCHEMAS = {
  // User favorites response
  USER_FAVORITES_RESPONSE: {
    favorite_designs: 'array', // Array of favorite design objects
    favorite_products: 'array', // Array of favorite product objects
    total_designs: 'number',
    total_products: 'number'
  },

  // Add product to favorites request
  ADD_PRODUCT_REQUEST: {
    product_id: 'string',
    product_name: 'string',
    product_url: 'string',
    image_url: 'string',
    price: 'number?',
    category: 'string?'
  },

  // Favorite action response
  FAVORITE_RESPONSE: {
    success: 'boolean',
    message: 'string',
    favorite_id: 'string?'
  }
};

/**
 * Common API Response Wrappers
 */
export const COMMON_SCHEMAS = {
  // Standard success response
  SUCCESS_RESPONSE: {
    success: 'boolean',
    message: 'string',
    data: 'any'
  },

  // Standard error response
  ERROR_RESPONSE: {
    success: 'boolean',
    error: 'string',
    error_code: 'string?',
    details: 'object?'
  },

  // Pagination metadata
  PAGINATION: {
    page: 'number',
    limit: 'number',
    total_count: 'number',
    total_pages: 'number',
    has_next: 'boolean',
    has_prev: 'boolean'
  }
};

/**
 * Request validation helper
 * @param {object} data - Data to validate
 * @param {object} schema - Schema to validate against
 * @returns {object} Validation result
 */
export const validateRequestData = (data, schema) => {
  const errors = [];
  const warnings = [];

  for (const [key, type] in Object.entries(schema)) {
    const isOptional = type.endsWith('?');
    const expectedType = isOptional ? type.slice(0, -1) : type;
    const value = data[key];

    if (!isOptional && (value === undefined || value === null)) {
      errors.push(`Required field '${key}' is missing`);
      continue;
    }

    if (value !== undefined && value !== null) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== expectedType) {
        warnings.push(`Field '${key}' expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * All schemas combined for easy access
 */
export const ALL_SCHEMAS = {
  AUTH: AUTH_SCHEMAS,
  DESIGN: DESIGN_SCHEMAS,
  BLOG: BLOG_SCHEMAS,
  FAVORITES: FAVORITE_SCHEMAS,
  COMMON: COMMON_SCHEMAS
};

export default ALL_SCHEMAS;
