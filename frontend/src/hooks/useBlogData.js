import { useEffect, useCallback } from 'react';
import useBlogState from './useBlogState';
import useBlogActions from './useBlogActions';

/**
 * Main Blog Data Hook
 * Orchestrates state and actions following the project's established pattern
 * Single Responsibility: Coordinate blog data flow
 * Dependency Injection: Uses state and actions hooks
 */
export const useBlogData = () => {
  // State management
  const state = useBlogState();
  const {
    blogPosts,
    filters,
    pagination,
    loading,
    error,
    showFilters,
    filterOptions,
    stats,
    updateFilters,
    updatePagination,
    clearFilters,
    toggleFiltersVisibility
  } = state;

  // Actions
  const actions = useBlogActions(state);
  const {
    fetchBlogPosts,
    fetchFilterOptions,
    fetchBlogStats,
    handleDesignView,
    handleNavigateToStudio,
    handlePageChange
  } = actions;

  // Initial data loading - Side effects management
  useEffect(() => {
    fetchBlogPosts(filters, pagination);
  }, [fetchBlogPosts, filters, pagination]);

  useEffect(() => {
    fetchFilterOptions();
    fetchBlogStats();
  }, [fetchFilterOptions, fetchBlogStats]);

  // Enhanced handlers with state updates
  const handleFilterChange = useCallback((newFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleSearch = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const handlePaginationChange = useCallback((newPage) => {
    const pageAfterScroll = handlePageChange(newPage);
    updatePagination(pageAfterScroll);
  }, [handlePageChange, updatePagination]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const retryFetchPosts = useCallback(() => {
    fetchBlogPosts(filters, pagination);
  }, [fetchBlogPosts, filters, pagination]);

  // Return everything needed by the view - Interface Segregation Principle
  return {
    // State data
    blogPosts,
    filters,
    pagination,
    loading,
    error,
    showFilters,
    filterOptions,
    stats,
    
    // Action handlers
    handleFilterChange,
    handleSearch,
    handlePaginationChange,
    handleDesignView,
    handleClearFilters,
    handleNavigateToStudio,
    toggleFiltersVisibility,
    retryFetchPosts
  };
};

export default useBlogData;
