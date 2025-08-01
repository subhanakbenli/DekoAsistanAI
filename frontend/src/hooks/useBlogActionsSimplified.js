import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BlogBusinessLogic } from '../services/businessLogic/BlogBusinessLogic';
import { 
  LikeActionHandler,
  ViewActionHandler,
  FilterActionHandler,
  NavigationActionHandler,
  PaginationActionHandler
} from '../services/businessLogic/ActionHandlers';

/**
 * Simplified Blog Actions Hook
 * Uses action handlers to simplify complex operations
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

  // Initialize action handlers
  const likeHandler = new LikeActionHandler(
    isAuthenticated, 
    navigate, 
    blogPosts, 
    updateBlogPosts
  );
  
  const viewHandler = new ViewActionHandler(
    blogPosts, 
    updateBlogPosts
  );
  
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

  // Simplified action handlers
  const handleLikeToggle = useCallback(async (postId) => {
    await likeHandler.handle(postId);
  }, [likeHandler]);

  const handleViewRecord = useCallback(async (postId) => {
    await viewHandler.handle(postId);
  }, [viewHandler]);

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
    
    // User interactions
    handleLikeToggle,
    handleViewRecord,
    handleFilterChange,
    handleSearch,
    handleClearFilters,
    handlePageChange,
    handleDesignView,
    handleNavigateToStudio
  };
};
