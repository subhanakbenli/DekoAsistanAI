import blogService from '../blogService';
import { BlogErrorHandler } from './BlogErrorHandler';

/**
 * Blog Business Logic - Handles complex blog operations
 * Separates business logic from UI components
 */
export class BlogBusinessLogic {
  
  /**
   * Handle like toggle with authentication check
   * @param {number} postId - Blog post ID
   * @param {boolean} isAuthenticated - User authentication status
   * @param {Function} navigate - Navigation function
   * @returns {Promise<Object|null>} Like result or null if authentication required
   */
  static async handleLikeToggle(postId, isAuthenticated, navigate) {
    // Authentication guard
    if (!isAuthenticated) {
      navigate('/login');
      return null;
    }

    try {
      const result = await blogService.toggleLike(postId);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        success: false,
        error: BlogErrorHandler.handleLikeError(error)
      };
    }
  }

  /**
   * Handle view recording
   * @param {number} postId - Blog post ID
   * @returns {Promise<Object>} View recording result
   */
  static async handleViewRecord(postId) {
    try {
      await blogService.recordView(postId);
      return {
        success: true,
        increment: 1
      };
    } catch (error) {
      console.error('Error recording view:', error);
      return {
        success: false,
        error: BlogErrorHandler.handleViewError(error)
      };
    }
  }

  /**
   * Fetch blog posts with error handling
   * @param {Object} filters - Filter parameters
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise<Object>} Fetch result
   */
  static async fetchBlogPosts(filters, pagination) {
    try {
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const posts = await blogService.getPublishedPosts(queryParams);
      
      return {
        success: true,
        data: posts
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return {
        success: false,
        error: BlogErrorHandler.handleFetchError(error),
        data: []
      };
    }
  }

  /**
   * Fetch filter options
   * @returns {Promise<Object>} Filter options result
   */
  static async fetchFilterOptions() {
    try {
      const options = await blogService.getBlogFilters();
      return {
        success: true,
        data: options
      };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      return {
        success: false,
        data: {
          room_types: [],
          design_styles: [],
          sort_options: []
        }
      };
    }
  }

  /**
   * Fetch blog statistics
   * @returns {Promise<Object>} Blog stats result
   */
  static async fetchBlogStats() {
    try {
      const stats = await blogService.getBlogStats();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  /**
   * Update post in posts array after like toggle
   * @param {Array} posts - Current posts array
   * @param {number} postId - Post ID to update
   * @param {Object} likeResult - Like operation result
   * @returns {Array} Updated posts array
   */
  static updatePostLikeStatus(posts, postId, likeResult) {
    return posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: likeResult.data.is_liked, 
            like_count: likeResult.data.like_count 
          }
        : post
    );
  }

  /**
   * Update post view count in posts array
   * @param {Array} posts - Current posts array
   * @param {number} postId - Post ID to update
   * @returns {Array} Updated posts array
   */
  static updatePostViewCount(posts, postId) {
    return posts.map(post => 
      post.id === postId 
        ? { ...post, view_count: post.view_count + 1 }
        : post
    );
  }

  /**
   * Check if filters are active
   * @param {Object} filters - Filter object
   * @returns {boolean} True if any filter is active
   */
  static hasActiveFilters(filters) {
    return !!(filters.room_type || filters.design_style || filters.search);
  }

  /**
   * Create default filter state
   * @returns {Object} Default filters
   */
  static createDefaultFilters() {
    return {
      room_type: '',
      design_style: '',
      search: '',
      sort_by: 'newest'
    };
  }

  /**
   * Create default pagination state
   * @returns {Object} Default pagination
   */
  static createDefaultPagination() {
    return {
      page: 1,
      limit: 12,
      total: 0
    };
  }
}
