/**
 * Blog API - Handles all blog-related HTTP requests
 * Provides a clean interface for blog data operations
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Blog API class with all blog-related endpoints
 */
class BlogApi {
  /**
   * Fetch blog posts with filters and pagination
   * @param {import('../../types/blogTypes').BlogFilters} filters
   * @param {import('../../types/blogTypes').BlogPagination} pagination
   * @returns {Promise<import('../../types/blogTypes').BlogPostsResponse>}
   */
  async fetchBlogPosts(filters, pagination) {
    const params = new URLSearchParams();
    
    // Add filters to params
    if (filters.room_type) params.append('room_type', filters.room_type);
    if (filters.design_style) params.append('design_style', filters.design_style);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    
    // Add pagination to params
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    const response = await fetch(`${API_BASE_URL}/blog/posts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Fetch filter options for blog posts
   * @returns {Promise<import('../../types/blogTypes').FilterOptions>}
   */
  async fetchFilterOptions() {
    const response = await fetch(`${API_BASE_URL}/blog/filter-options`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Fetch blog statistics
   * @returns {Promise<import('../../types/blogTypes').BlogStats>}
   */
  async fetchBlogStats() {
    const response = await fetch(`${API_BASE_URL}/blog/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Toggle like status for a blog post
   * @param {number} postId
   * @returns {Promise<import('../../types/blogTypes').LikeToggleResult>}
   */
  async toggleLike(postId) {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Record view for a blog post
   * @param {number} postId
   * @returns {Promise<import('../../types/blogTypes').ViewRecordResult>}
   */
  async recordView(postId) {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

// Export singleton instance
export const blogApi = new BlogApi();
