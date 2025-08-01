import { BlogBusinessLogic } from '../businessLogic/BlogBusinessLogic';

/**
 * Like Action Handler - Handles like-related actions
 * Simplifies like operations with proper error handling
 */
export class LikeActionHandler {
  constructor(isAuthenticated, navigate, blogPosts, updateBlogPosts) {
    this.isAuthenticated = isAuthenticated;
    this.navigate = navigate;
    this.blogPosts = blogPosts;
    this.updateBlogPosts = updateBlogPosts;
  }

  /**
   * Handle like toggle action
   * @param {number} postId - Post ID to toggle like
   */
  async handle(postId) {
    const result = await BlogBusinessLogic.handleLikeToggle(
      postId, 
      this.isAuthenticated, 
      this.navigate
    );

    if (result?.success) {
      const updatedPosts = BlogBusinessLogic.updatePostLikeStatus(
        this.blogPosts, 
        postId, 
        result
      );
      this.updateBlogPosts(updatedPosts);
    }
    // If not authenticated, user will be redirected to login
    // If error occurs, it's logged but UI remains stable
  }
}

/**
 * View Action Handler - Handles view recording actions
 */
export class ViewActionHandler {
  constructor(blogPosts, updateBlogPosts) {
    this.blogPosts = blogPosts;
    this.updateBlogPosts = updateBlogPosts;
  }

  /**
   * Handle view recording action
   * @param {number} postId - Post ID to record view
   */
  async handle(postId) {
    const result = await BlogBusinessLogic.handleViewRecord(postId);

    if (result.success) {
      const updatedPosts = BlogBusinessLogic.updatePostViewCount(
        this.blogPosts, 
        postId
      );
      this.updateBlogPosts(updatedPosts);
    }
    // Silent fail for view recording - not critical for UX
  }
}

/**
 * Filter Action Handler - Handles filter operations
 */
export class FilterActionHandler {
  constructor(updateFilters, resetPaginationToFirstPage) {
    this.updateFilters = updateFilters;
    this.resetPaginationToFirstPage = resetPaginationToFirstPage;
  }

  /**
   * Handle filter change
   * @param {Object} newFilters - New filter values
   */
  handle(newFilters) {
    this.updateFilters(newFilters);
    this.resetPaginationToFirstPage();
  }

  /**
   * Handle search
   * @param {string} searchTerm - Search term
   */
  handleSearch(searchTerm) {
    this.handle({ search: searchTerm });
  }

  /**
   * Handle filter reset
   */
  handleReset(resetFilters) {
    resetFilters();
    this.resetPaginationToFirstPage();
  }
}

/**
 * Navigation Action Handler - Handles navigation actions
 */
export class NavigationActionHandler {
  constructor(navigate) {
    this.navigate = navigate;
  }

  /**
   * Handle design view navigation
   * @param {string} designId - Design ID
   */
  handleDesignView(designId) {
    this.navigate(`/design/${designId}`);
  }

  /**
   * Handle studio navigation
   */
  handleStudioNavigation() {
    this.navigate('/studio');
  }

  /**
   * Handle login navigation
   */
  handleLoginNavigation() {
    this.navigate('/login');
  }
}

/**
 * Pagination Action Handler - Handles pagination actions
 */
export class PaginationActionHandler {
  constructor(updatePagination) {
    this.updatePagination = updatePagination;
  }

  /**
   * Handle page change
   * @param {number} newPage - New page number
   */
  handle(newPage) {
    this.updatePagination({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
