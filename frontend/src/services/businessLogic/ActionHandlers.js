// Note: Like and View handlers have been removed as they are no longer needed

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
