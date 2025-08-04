import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BlogBusinessLogic } from '../services/businessLogic/BlogBusinessLogic';
import { 
  FilterActionHandler,
  NavigationActionHandler,
  PaginationActionHandler
} from '../services/businessLogic/ActionHandlers';

/**
 * Simplified Blog Actions Hook
 * Uses action handlers to simplify complex operations
 * Note: Like and view handlers have been removed as they are no longer needed
 */
export const useBlogActionsSimplified = (state, actions) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const {
    blogPosts,
    filters,
    pagination
  } = state;
  
  const {
    updateBlogPosts,
    updateFilters,
    resetFilters,
    updatePagination,
    resetPaginationToFirstPage,
    setLoadingState,
    setErrorState,
    clearError,
    updateFilterOptions,
    updateStats
  } = actions;

  // Initialize action handlers (like and view handlers removed)
  const filterHandler = new FilterActionHandler(
    updateFilters, 
    resetPaginationToFirstPage
  );
  
  const navigationHandler = new NavigationActionHandler(navigate);
  
  const paginationHandler = new PaginationActionHandler(updatePagination);

  // Data fetching actions
  const fetchBlogPosts = useCallback(async () => {
    setLoadingState(true);
    clearError();

    const result = await BlogBusinessLogic.fetchBlogPosts(filters, pagination);
    
    if (result.success) {
      updateBlogPosts(result.data);
    } else {
      setErrorState(result.error);
      updateBlogPosts(result.data);
    }
    
    setLoadingState(false);
  }, [filters, pagination, setLoadingState, clearError, updateBlogPosts, setErrorState]);

  const fetchFilterOptions = useCallback(async () => {
    const result = await BlogBusinessLogic.fetchFilterOptions();
    updateFilterOptions(result.data);
  }, [updateFilterOptions]);

  const fetchBlogStats = useCallback(async () => {
    const result = await BlogBusinessLogic.fetchBlogStats();
    if (result.success) {
      updateStats(result.data);
    }
  }, [updateStats]);

  // Simplified action handlers (like and view handlers removed)
  const handleFilterChange = useCallback((newFilters) => {
    filterHandler.handle(newFilters);
  }, [filterHandler]);

  const handleSearch = useCallback((searchTerm) => {
    filterHandler.handleSearch(searchTerm);
  }, [filterHandler]);

  const handleClearFilters = useCallback(() => {
    filterHandler.handleReset(resetFilters);
  }, [filterHandler, resetFilters]);

  const handlePageChange = useCallback((newPage) => {
    paginationHandler.handle(newPage);
  }, [paginationHandler]);

  const handleDesignView = useCallback((designId) => {
    navigationHandler.handleDesignView(designId);
  }, [navigationHandler]);

  const handleNavigateToStudio = useCallback(() => {
    navigationHandler.handleStudioNavigation();
  }, [navigationHandler]);

  const retryFetchPosts = useCallback(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return {
    // Data fetching
    fetchBlogPosts,
    fetchFilterOptions,
    fetchBlogStats,
    retryFetchPosts,
    
    // User interactions (like and view handlers removed)
    handleFilterChange,
    handleSearch,
    handleClearFilters,
    handlePageChange,
    handleDesignView,
    handleNavigateToStudio
  };
};
