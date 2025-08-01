import { useState, useCallback } from 'react';

/**
 * Blog State Management Hook
 * Manages all blog-related state in a centralized way
 */
export const useBlogState = () => {
  // Blog posts state
  const [blogPosts, setBlogPosts] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    room_type: '',
    design_style: '',
    search: '',
    sort_by: 'newest'
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter options state
  const [filterOptions, setFilterOptions] = useState({
    room_types: [],
    design_styles: [],
    sort_options: []
  });
  
  // Statistics state
  const [stats, setStats] = useState(null);

  // State update methods
  const updateBlogPosts = useCallback((posts) => {
    setBlogPosts(posts);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      room_type: '',
      design_style: '',
      search: '',
      sort_by: 'newest'
    });
  }, []);

  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const resetPaginationToFirstPage = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const toggleFiltersVisibility = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const setLoadingState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateFilterOptions = useCallback((options) => {
    setFilterOptions(options);
  }, []);

  const updateStats = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  // Computed state
  const hasActiveFilters = filters.room_type || filters.design_style || filters.search;

  return {
    // State
    blogPosts,
    filters,
    pagination,
    loading,
    error,
    showFilters,
    filterOptions,
    stats,
    hasActiveFilters,
    
    // State updaters
    updateBlogPosts,
    updateFilters,
    resetFilters,
    updatePagination,
    resetPaginationToFirstPage,
    toggleFiltersVisibility,
    setLoadingState,
    setErrorState,
    clearError,
    updateFilterOptions,
    updateStats
  };
};
