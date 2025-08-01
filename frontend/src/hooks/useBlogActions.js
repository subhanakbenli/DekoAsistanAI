import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blogService from '../services/blogService';

/**
 * Blog Actions Hook
 * Handles all blog-related actions and business logic
 */
export const useBlogActions = (blogState) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
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
    updateStats,
    filters,
    pagination,
    blogPosts
  } = blogState;

  // Fetch blog posts with current filters and pagination
  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoadingState(true);
      clearError();

      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const posts = await blogService.getPublishedPosts(queryParams);
      updateBlogPosts(posts);

    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setErrorState('Blog gönderileri yüklenirken bir hata oluştu');
      updateBlogPosts([]);
    } finally {
      setLoadingState(false);
    }
  }, [filters, pagination.page, pagination.limit, setLoadingState, clearError, updateBlogPosts, setErrorState]);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await blogService.getBlogFilters();
      updateFilterOptions(options);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, [updateFilterOptions]);

  // Fetch blog stats
  const fetchBlogStats = useCallback(async () => {
    try {
      const blogStats = await blogService.getBlogStats();
      updateStats(blogStats);
    } catch (err) {
      console.error('Error fetching blog stats:', err);
    }
  }, [updateStats]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    updateFilters(newFilters);
    resetPaginationToFirstPage();
  }, [updateFilters, resetPaginationToFirstPage]);

  // Handle search
  const handleSearch = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
    resetPaginationToFirstPage();
  }, [updateFilters, resetPaginationToFirstPage]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    updatePagination({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updatePagination]);

  // Handle like toggle
  const handleLikeToggle = useCallback(async (blogPostId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await blogService.toggleLike(blogPostId);
      
      // Update the post in local state
      updateBlogPosts(blogPosts.map(post => 
        post.id === blogPostId 
          ? { 
              ...post, 
              is_liked: result.is_liked, 
              like_count: result.like_count 
            }
          : post
      ));
      
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }, [isAuthenticated, navigate, blogPosts, updateBlogPosts]);

  // Handle view recording
  const handleViewRecord = useCallback(async (blogPostId) => {
    try {
      await blogService.recordView(blogPostId);
      
      // Update view count in local state
      updateBlogPosts(blogPosts.map(post => 
        post.id === blogPostId 
          ? { ...post, view_count: post.view_count + 1 }
          : post
      ));
      
    } catch (err) {
      console.error('Error recording view:', err);
    }
  }, [blogPosts, updateBlogPosts]);

  // Handle design detail navigation
  const handleDesignView = useCallback((designId) => {
    navigate(`/design/${designId}`);
  }, [navigate]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    resetFilters();
    resetPaginationToFirstPage();
  }, [resetFilters, resetPaginationToFirstPage]);

  // Retry fetching posts
  const retryFetchPosts = useCallback(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return {
    // Data fetching actions
    fetchBlogPosts,
    fetchFilterOptions,
    fetchBlogStats,
    retryFetchPosts,
    
    // User interaction handlers
    handleFilterChange,
    handleSearch,
    handlePageChange,
    handleLikeToggle,
    handleViewRecord,
    handleDesignView,
    handleClearFilters
  };
};
