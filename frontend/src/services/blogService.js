import { BaseService } from './BaseService';
import { BLOG_ENDPOINTS, BLOG_SCHEMAS } from '../config/api';

/**
 * Blog Service - Handles blog-related API operations
 * Manages design publishing to blog functionality
 */
class BlogService extends BaseService {
  constructor() {
    super();
    this.endpoints = BLOG_ENDPOINTS;
    this.schemas = BLOG_SCHEMAS;
  }
  /**
   * Get published blog posts with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of published blog posts
   */
  getPublishedPosts = async (options = {}) => {
    try {
      const response = await this.api.get(this.endpoints.POSTS, { params: options });
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
      const response = await this.api.get(this.endpoints.FILTER_OPTIONS);
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
      const response = await this.api.get(this.endpoints.STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw error;
    }
  }

  // Note: recordView method has been removed as view recording is no longer needed

  /**
   * Record design detail view - Placeholder method
   * @param {string} designId - Design ID
   * @returns {Promise<void>} 
   * @deprecated This method is deprecated and returns immediately
   */
  recordDesignDetailView = async (designId) => {
    // This method is deprecated - view recording is no longer needed
    // Return immediately without making any API calls
    return Promise.resolve();
  }

  /**
   * Check if design is already published to blog
   * @param {string} designId - Design ID to check
   * @returns {Promise<boolean>} True if design is published
   */
  isDesignPublished = async (designId) => {
    try {
      const response = await this.api.get(`${this.endpoints.PUBLISH_STATUS}/${designId}/published-status`);
      return response.data.is_published || false;
    } catch (error) {
      console.warn('Error checking design publish status:', error);
      return false;
    }
  }

  /**
   * Check publish status with detailed information
   * @param {string} designId - Design ID to check
   * @returns {Promise<Object>} Publish status details
   */
  checkPublishStatus = async (designId) => {
    try {
      const response = await this.api.get(`${this.endpoints.CHECK_PUBLISH_STATUS}/${designId}`);
      return response;
    } catch (error) {
      console.error('Error checking publish status:', error);
      throw error;
    }
  }

  /**
   * Check publish status (public endpoint - no auth required)
   * @param {string} designId - Design ID to check
   * @returns {Promise<Object>} Publish status details
   */
  checkPublishStatusPublic = async (designId) => {
    try {
      const response = await this.api.get(`${this.endpoints.CHECK_PUBLISH_STATUS_PUBLIC}/${designId}`);
      return response;
    } catch (error) {
      console.warn('Error checking publish status (public):', error);
      // Return safe default for public endpoint
      return {
        data: {
          is_published: false,
          blog_post_id: null
        }
      };
    }
  }

  /**
   * Publish design to blog - Optimized version
   * Only sends design ID and publish options, backend fetches design data
   * @param {string} designId - Design ID to publish
   * @param {Object} publishOptions - Publish options (allowComments, isPublic, etc.)
   * @returns {Promise<Object>} Published blog post
   */
  publishDesignToBlog = async (designId, publishOptions = {}) => {
    try {
      const response = await this.api.post(`${this.endpoints.PUBLISH_DESIGN}/${designId}/publish`, publishOptions);
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
