import { useState, useCallback } from 'react';
import { BlogBusinessLogic } from '../services/businessLogic/BlogBusinessLogic';

/**
 * Simplified Blog State Manager
 * Cleaner state management with business logic separation
 */
export const useBlogStateManager = () => {
  // Initialize state with business logic defaults
  const [blogPosts, setBlogPosts] = useState([]);
  const [filters, setFilters] = useState(BlogBusinessLogic.createDefaultFilters());
  const [pagination, setPagination] = useState(BlogBusinessLogic.createDefaultPagination());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    room_types: [],
    design_styles: [],
    sort_options: []
  });
  const [stats, setStats] = useState(null);

  // Simple state updaters
  const updateBlogPosts = useCallback((posts) => {
    setBlogPosts(posts);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(BlogBusinessLogic.createDefaultFilters());
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

  // Computed values
  const hasActiveFilters = BlogBusinessLogic.hasActiveFilters(filters);

  return {
    // State
    state: {
      blogPosts,
      filters,
      pagination,
      loading,
      error,
      showFilters,
      filterOptions,
      stats,
      hasActiveFilters
    },
    
    // State updaters
    actions: {
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
    }
  };
};
