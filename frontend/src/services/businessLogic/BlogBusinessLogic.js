import { 
  DEFAULT_FILTERS, 
  DEFAULT_PAGINATION,
  BLOG_CONSTANTS 
} from '../../types/blogTypes';
import { blogApi } from '../api/blogApi';

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
      const response = await blogApi.fetchBlogPosts(filters, pagination);
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
      const response = await blogApi.fetchFilterOptions();
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
      const response = await blogApi.fetchBlogStats();
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

  /**
   * Handle like toggle for a blog post
   * @param {number} postId
   * @param {boolean} isAuthenticated
   * @param {Function} navigate
   * @returns {Promise<import('../../types/blogTypes').ApiResponse<import('../../types/blogTypes').LikeToggleResult>>}
   */
  static async handleLikeToggle(postId, isAuthenticated, navigate) {
    if (!isAuthenticated) {
      navigate('/login');
      return {
        success: false,
        data: null,
        error: 'Beğenmek için giriş yapmalısınız'
      };
    }

    try {
      const response = await blogApi.toggleLike(postId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('BlogBusinessLogic: Error toggling like:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Beğenme işlemi sırasında bir hata oluştu'
      };
    }
  }

  /**
   * Handle view record for a blog post
   * @param {number} postId
   * @returns {Promise<import('../../types/blogTypes').ApiResponse<import('../../types/blogTypes').ViewRecordResult>>}
   */
  static async handleViewRecord(postId) {
    try {
      const response = await blogApi.recordView(postId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('BlogBusinessLogic: Error recording view:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Görüntüleme kaydetme sırasında bir hata oluştu'
      };
    }
  }

  /**
   * Update post like status in the posts array
   * @param {import('../../types/blogTypes').BlogPost[]} posts
   * @param {number} postId
   * @param {import('../../types/blogTypes').LikeToggleResult} likeResult
   * @returns {import('../../types/blogTypes').BlogPost[]}
   */
  static updatePostLikeStatus(posts, postId, likeResult) {
    if (!likeResult) return posts;
    
    return posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: likeResult.is_liked,
            like_count: likeResult.like_count
          }
        : post
    );
  }

  /**
   * Update post view count in the posts array
   * @param {import('../../types/blogTypes').BlogPost[]} posts
   * @param {number} postId
   * @returns {import('../../types/blogTypes').BlogPost[]}
   */
  static updatePostViewCount(posts, postId) {
    return posts.map(post => 
      post.id === postId 
        ? { ...post, view_count: post.view_count + 1 }
        : post
    );
  }
}
