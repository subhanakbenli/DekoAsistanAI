import { 
  DEFAULT_FILTERS, 
  DEFAULT_PAGINATION,
  BLOG_CONSTANTS 
} from '../../types/blogTypes';
import { blogService } from '../index';

/**
 * Blog Business Logic - Central business logic for blog operations
 * Handles data transformation, validation, and API interactions
 */
export class BlogBusinessLogic {
  
  /**
   * Check if any filters are currently active
   * @param {import('../../types/blogTypes').BlogFilters} filters - Current filters
   * @returns {boolean} True if any filters are active
   */
  static hasActiveFilters(filters) {
    if (!filters) return false;
    
    return (
      (filters.room_type && filters.room_type !== DEFAULT_FILTERS.room_type) ||
      (filters.design_style && filters.design_style !== DEFAULT_FILTERS.design_style) ||
      (filters.search && filters.search !== DEFAULT_FILTERS.search) ||
      (filters.sort_by && filters.sort_by !== DEFAULT_FILTERS.sort_by)
    );
  }

  /**
   * Create default filters object
   * @returns {import('../../types/blogTypes').BlogFilters}
   */
  static createDefaultFilters() {
    return { ...DEFAULT_FILTERS };
  }

  /**
   * Create default pagination object
   * @returns {import('../../types/blogTypes').BlogPagination}
   */
  static createDefaultPagination() {
    return { ...DEFAULT_PAGINATION };
  }

  /**
   * Fetch blog posts with filters and pagination
   * @param {import('../../types/blogTypes').BlogFilters} filters
   * @param {import('../../types/blogTypes').BlogPagination} pagination
   * @returns {Promise<import('../../types/blogTypes').ApiResponse<import('../../types/blogTypes').BlogPost[]>>}
   */
  static async fetchBlogPosts(filters, pagination) {
    try {
      const queryParams = { ...filters, ...pagination };
      const response = await blogService.getPublishedPosts(queryParams);
      return {
        success: true,
        data: response.posts || [],
        pagination: response.pagination
      };
    } catch (error) {
      console.error('BlogBusinessLogic: Error fetching blog posts:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Blog yazıları yüklenirken bir hata oluştu'
      };
    }
  }

  /**
   * Fetch filter options
   * @returns {Promise<import('../../types/blogTypes').ApiResponse<import('../../types/blogTypes').FilterOptions>>}
   */
  static async fetchFilterOptions() {
    try {
      const response = await blogService.getBlogFilters();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('BlogBusinessLogic: Error fetching filter options:', error);
      return {
        success: false,
        data: {
          room_types: [],
          design_styles: [],
          sort_options: []
        },
        error: error.message || 'Filtre seçenekleri yüklenirken bir hata oluştu'
      };
    }
  }

  /**
   * Fetch blog statistics
   * @returns {Promise<import('../../types/blogTypes').ApiResponse<import('../../types/blogTypes').BlogStats>>}
   */
  static async fetchBlogStats() {
    try {
      const response = await blogService.getBlogStats();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('BlogBusinessLogic: Error fetching blog stats:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Blog istatistikleri yüklenirken bir hata oluştu'
      };
    }
  }

  // Note: Like and view related methods have been removed as they are no longer needed
}
