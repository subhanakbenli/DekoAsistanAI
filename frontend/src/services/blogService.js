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
      const response = await this.api.get('/blog/designs', { params: options });
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
      const response = await this.api.get('/blog/filters');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog filters:', error);
      throw error;
    }
  }

  /**
   * Toggle like for a blog post
   * @param {number} blogPostId - Blog post ID
   * @returns {Promise<Object>} Like toggle result
   */
  toggleLike = async (blogPostId) => {
    try {
      const response = await this.api.post(`/blog/designs/${blogPostId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  /**
   * Record a view for a blog post
   * @param {number} blogPostId - Blog post ID
   * @returns {Promise<Object>} View record result
   */
  recordView = async (blogPostId) => {
    try {
      const response = await this.api.post(`/blog/designs/${blogPostId}/view`);
      return response.data;
    } catch (error) {
      console.error('Error recording view:', error);
      throw error;
    }
  }

  /**
   * Publish a design to blog
   * @param {string} designId - Design ID to publish
   * @param {Object} publishData - Additional publish data
   * @returns {Promise<Object>} Published blog post data
   */
  publishDesignToBlog = async (designId, publishData = {}) => {
    try {
      const response = await this.api.post(`/blog/designs/${designId}/publish`, {
        ...publishData,
        allow_comments: publishData.allow_comments !== false,
        is_featured: publishData.is_featured || false
      });
      
      return response.data;
    } catch (error) {
      console.error('Error publishing design to blog:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by ID
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Blog post data
   */
  getBlogPost = async (postId) => {
    try {
      const response = await this.api.get(`/blog/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

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
}

// Export singleton instance
const blogService = new BlogService();
export default blogService;
