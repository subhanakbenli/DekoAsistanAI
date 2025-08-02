import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlogStore } from '../store/blogStore';
import { 
  LikeActionHandler,
  ViewActionHandler,
  NavigationActionHandler
} from '../services/businessLogic/ActionHandlers';

/**
 * Blog Store Hook - Uses Zustand store for state management
 * Provides clean interface to blog store with action handlers
 * @returns {Object} Blog state and actions
 */
export const useBlogStoreHook = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Get store state and actions
  const {
    blogPosts,
    filters,
    pagination,
    loading,
    error,
    showFilters,
    filterOptions,
    stats,
    hasActiveFilters,
    actions
  } = useBlogStore();

  // Initialize action handlers
  const likeHandler = new LikeActionHandler(
    isAuthenticated, 
    navigate, 
    actions.updatePostLike // Use store action instead of direct callback
  );
  
  const viewHandler = new ViewActionHandler(
    blogPosts, 
    actions.setBlogPosts
  );
  
  const navigationHandler = new NavigationActionHandler(navigate);

  // Initialize data on mount - use a ref to avoid dependency issues
  useEffect(() => {
    // Call directly from store to avoid dependency array issues
    useBlogStore.getState().actions.initializeBlogData();
  }, []); // Empty dependency array is safe here

  // Enhanced action handlers with store integration
  const handleLikeToggle = async (postId) => {
    await likeHandler.handle(postId);
  };

  const handleViewRecord = async (postId) => {
    await viewHandler.handle(postId);
  };

  const handleDesignView = (designId) => {
    navigationHandler.handleDesignView(designId);
  };

  const handleNavigateToStudio = () => {
    navigationHandler.handleStudioNavigation();
  };

  const retryFetchPosts = () => {
    actions.fetchBlogPosts();
  };

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
    hasActiveFilters: hasActiveFilters ? hasActiveFilters() : false,
    
    // Store actions (direct from store)
    handleFilterChange: actions.handleFilterChange,
    handleSearch: actions.handleSearch,
    handlePageChange: actions.handlePageChange,
    handleClearFilters: actions.clearFiltersAndRefresh,
    toggleFiltersVisibility: actions.toggleFilters,
    
    // Enhanced actions (with handlers)
    handleLikeToggle,
    handleViewRecord,
    handleDesignView,
    handleNavigateToStudio,
    retryFetchPosts
  };
};
