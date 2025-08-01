/**
 * Blog Type Definitions with JSDoc
 * Provides type safety and better developer experience
 */

/**
 * @typedef {Object} BlogPost
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} design_id
 * @property {number} author_id
 * @property {string} author_name
 * @property {string} [author_avatar]
 * @property {string} [featured_image]
 * @property {string[]} tags
 * @property {string} category
 * @property {number} like_count
 * @property {number} view_count
 * @property {number} comment_count
 * @property {boolean} is_liked
 * @property {boolean} is_featured
 * @property {boolean} allow_comments
 * @property {string} published_at
 * @property {string} created_at
 * @property {string} updated_at
 * @property {BlogPostMetadata} [metadata]
 */

/**
 * @typedef {Object} BlogPostMetadata
 * @property {Object} [roomDimensions]
 * @property {number} roomDimensions.width
 * @property {number} roomDimensions.length
 * @property {number} roomDimensions.height
 * @property {string} [designStyle]
 * @property {string} [roomType]
 * @property {any} [colorPalette]
 * @property {any} [productCategories]
 * @property {any} [doorWindow]
 */

/**
 * @typedef {Object} BlogFilters
 * @property {string} room_type
 * @property {string} design_style
 * @property {string} search
 * @property {string} sort_by
 */

/**
 * @typedef {Object} FilterOption
 * @property {string} value
 * @property {string} label
 * @property {number} [count]
 */

/**
 * @typedef {Object} FilterOptions
 * @property {FilterOption[]} room_types
 * @property {FilterOption[]} design_styles
 * @property {FilterOption[]} sort_options
 */

/**
 * @typedef {Object} BlogPagination
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 */

/**
 * @typedef {Object} BlogStats
 * @property {number} total_posts
 * @property {number} total_likes
 * @property {number} total_views
 * @property {number} total_comments
 * @property {Array<{room_type: string, count: number}>} popular_room_types
 * @property {Array<{design_style: string, count: number}>} popular_design_styles
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} data
 * @property {string} [error]
 */

/**
 * @typedef {Object} BlogPostsResponse
 * @property {BlogPost[]} posts
 * @property {Object} pagination
 * @property {number} pagination.current_page
 * @property {number} pagination.total_pages
 * @property {number} pagination.total_items
 * @property {number} pagination.items_per_page
 */

/**
 * @typedef {Object} LikeToggleResult
 * @property {boolean} is_liked
 * @property {number} like_count
 */

/**
 * @typedef {Object} ViewRecordResult
 * @property {number} view_count
 */

/**
 * @typedef {Object} BlogError
 * @property {'NETWORK'|'AUTH'|'VALIDATION'|'SERVER'|'UNKNOWN'} type
 * @property {string} message
 * @property {string|number} [code]
 * @property {boolean} retryable
 */

// Constants
export const BLOG_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  SEARCH_DEBOUNCE_MS: 300,
  VIEW_RECORD_DELAY_MS: 1000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000
};

/**
 * @typedef {'newest'|'oldest'|'most_liked'|'most_viewed'} SortOption
 */

/**
 * @typedef {'salon'|'yatak'|'çocuk'|'mutfak'|'banyo'|'yemek'|'çalışma'|'misafir'} RoomType
 */

/**
 * @typedef {'modern'|'minimal'|'klasik'|'endüstriyel'|'skandinav'|'vintage'} DesignStyle
 */

// Default values
export const DEFAULT_FILTERS = {
  room_type: '',
  design_style: '',
  search: '',
  sort_by: 'newest'
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
  total: 0
};

export const DEFAULT_FILTER_OPTIONS = {
  room_types: [],
  design_styles: [],
  sort_options: []
};
