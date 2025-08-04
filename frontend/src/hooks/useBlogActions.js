import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services';

/**
 * Blog Actions Hook
 * Handles all blog-related actions and side effects
 * Single Responsibility: Action handling only
 * Open/Closed Principle: Easy to extend with new actions
 */
export const useBlogActions = (state) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Destructure state updaters
  const {
    updateBlogPosts,
    updateFilterOptions,
    updateStats,
    updateBlogPost,
    setLoadingState,
    setErrorState
  } = state;

  // Fetch blog posts with current filters and pagination
  const fetchBlogPosts = useCallback(async (filters, pagination) => {
    try {
      setLoadingState(true);
      setErrorState(null);

      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      // Remove empty filters - data cleaning
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
  }, [updateBlogPosts, setLoadingState, setErrorState]);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await blogService.getBlogFilters();
      updateFilterOptions(options);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, [updateFilterOptions]);

  // Fetch blog statistics
  const fetchBlogStats = useCallback(async () => {
    try {
      const blogStats = await blogService.getBlogStats();
      updateStats(blogStats);
    } catch (err) {
      console.error('Error fetching blog stats:', err);
    }
  }, [updateStats]);

  // Handle like toggle with authentication check
  // NOTE: Like functionality removed - replaced with favorites system

  // Handle design detail navigation
  const handleDesignView = useCallback((designId) => {
    navigate(`/design/${designId}`);
  }, [navigate]);

  // Handle navigation to studio
  const handleNavigateToStudio = useCallback(() => {
    navigate('/studio');
  }, [navigate]);

  // Smooth scroll to top on page change
  const handlePageChange = useCallback((newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newPage;
  }, []);

  return {
    // Data fetching actions
    fetchBlogPosts,
    fetchFilterOptions,
    fetchBlogStats,
    
    // User interaction actions
    handleDesignView,
    handleNavigateToStudio,
    handlePageChange
  };
};

export default useBlogActions;
