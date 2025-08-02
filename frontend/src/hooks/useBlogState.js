import { useState, useCallback } from 'react';

/**
 * Blog State Management Hook
 * Handles all local state following KISS principle
 * Single Responsibility: State management only
 */
export const useBlogState = () => {
  // Core blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [filters, setFilters] = useState({
    room_type: '',
    design_style: '',
    search: '',
    sort_by: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Meta data state
  const [filterOptions, setFilterOptions] = useState({
    room_types: [],
    design_styles: [],
    sort_options: []
  });
  const [stats, setStats] = useState(null);

  // State updaters - following OOP encapsulation principle
  const updateBlogPosts = useCallback((posts) => {
    setBlogPosts(posts);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset pagination
  }, []);

  const updatePagination = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      room_type: '',
      design_style: '',
      search: '',
      sort_by: 'newest'
    });
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

  const updateFilterOptions = useCallback((options) => {
    setFilterOptions(options);
  }, []);

  const updateStats = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  // Update specific blog post (for like toggle)
  const updateBlogPost = useCallback((postId, updates) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  }, []);

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
    
    // State updaters
    updateBlogPosts,
    updateFilters,
    updatePagination,
    clearFilters,
    toggleFiltersVisibility,
    setLoadingState,
    setErrorState,
    updateFilterOptions,
    updateStats,
    updateBlogPost
  };
};

export default useBlogState;
