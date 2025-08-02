import { BaseService } from './BaseService';

/**
 * Blog Service - Handles blog-related API operations
 * Manages design publishing to blog functionality
 */
class BlogService extends BaseService {
  /**
   * Get published blog posts with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of published blog posts
   */
  getPublishedPosts = async (options = {}) => {
    try {
      const response = await this.api.get('/blog/posts', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching published posts:', error);
      throw error;
    }
  }

  /**
   * Get blog filters (room types, design styles, sort options)
   * @returns {Promise<Object>} Available filter options
   */
  getBlogFilters = async () => {
    try {
      const response = await this.api.get('/blog/filter-options');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog filters:', error);
      throw error;
    }
  }

  /**
   * Toggle like for a blog post - DEPRECATED
   * Replaced with favorites system
   * @deprecated Use favorite system instead
   */
  // toggleLike method removed - replaced with favorites system

  /**
   * Get blog statistics
   * @returns {Promise<Object>} Blog statistics
   */
  getBlogStats = async () => {
    try {
      const response = await this.api.get('/blog/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw error;
    }
  }

  /**
   * Record view for design detail page
   * @param {string} designId - Design ID to record view for
   * @returns {Promise<Object>} View record result
   */
  recordDesignDetailView = async (designId) => {
    try {
      const response = await this.api.post(`/blog/designs/${designId}/view`);
      return response.data;
    } catch (error) {
      console.error('Error recording design detail view:', error);
      // Don't throw error for view recording - it's not critical
      return null;
    }
  }

  /**
   * Record view for blog post
   * @param {number} postId - Post ID to record view for
   * @returns {Promise<Object>} View record result
   */
  recordView = async (postId) => {
    try {
      const response = await this.api.post(`/blog/posts/${postId}/view`);
      return response.data;
    } catch (error) {
      console.error('Error recording post view:', error);
      // Don't throw error for view recording - it's not critical
      return null;
    }
  }

  /**
   * Publish design to blog
   * @param {string} designId - Design ID to publish
   * @param {Object} blogPostData - Blog post data
   * @returns {Promise<Object>} Published blog post
   */
  publishDesignToBlog = async (designId, blogPostData) => {
    try {
      const response = await this.api.post(`/blog/designs/${designId}/publish`, blogPostData);
      return response.data;
    } catch (error) {
      console.error('Error publishing design to blog:', error);
      throw error;
    }
  }
}

// Export singleton instance
const blogService = new BlogService();
export default blogService;
