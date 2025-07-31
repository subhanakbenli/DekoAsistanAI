import { BaseService } from './BaseService';

/**
 * Blog Service - Handles blog-related API operations
 * Manages design publishing to blog functionality
 */
class BlogService extends BaseService {
  constructor() {
    super('/blog');
  }

  /**
   * Publish a design to blog
   * @param {string} designId - Design ID to publish
   * @param {Object} publishData - Additional publish data
   * @returns {Promise<Object>} Published blog post data
   */
  async publishDesignToBlog(designId, publishData = {}) {
    try {
      const response = await this.apiCall({
        method: 'POST',
        endpoint: `/favorites/designs/${designId}/publish`,
        data: {
          ...publishData,
          publishedAt: new Date().toISOString()
        }
      });

      return response;
    } catch (error) {
      console.error('Error publishing design to blog:', error);
      throw error;
    }
  }

  /**
   * Get published blog posts
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of published blog posts
   */
  async getPublishedPosts(options = {}) {
    try {
      const response = await this.apiCall({
        method: 'GET',
        endpoint: '/published',
        params: options
      });

      return response;
    } catch (error) {
      console.error('Error fetching published posts:', error);
      throw error;
    }
  }

  /**
   * Get blog post by ID
   * @param {string} postId - Blog post ID
   * @returns {Promise<Object>} Blog post data
   */
  async getBlogPost(postId) {
    try {
      const response = await this.apiCall({
        method: 'GET',
        endpoint: `/posts/${postId}`
      });

      return response;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  /**
   * Update blog post
   * @param {string} postId - Blog post ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated blog post
   */
  async updateBlogPost(postId, updateData) {
    try {
      const response = await this.apiCall({
        method: 'PUT',
        endpoint: `/posts/${postId}`,
        data: updateData
      });

      return response;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete blog post
   * @param {string} postId - Blog post ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteBlogPost(postId) {
    try {
      const response = await this.apiCall({
        method: 'DELETE',
        endpoint: `/posts/${postId}`
      });

      return response;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Check if design is already published
   * @param {string} designId - Design ID to check
   * @returns {Promise<boolean>} Whether design is published
   */
  async isDesignPublished(designId) {
    try {
      const response = await this.apiCall({
        method: 'GET',
        endpoint: `/designs/${designId}/published-status`
      });

      return response.isPublished || false;
    } catch (error) {
      console.error('Error checking design published status:', error);
      return false;
    }
  }

  /**
   * Get blog statistics
   * @returns {Promise<Object>} Blog statistics
   */
  async getBlogStats() {
    try {
      const response = await this.apiCall({
        method: 'GET',
        endpoint: '/stats'
      });

      return response;
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const blogService = new BlogService();
export default blogService;
