import { create } from 'zustand';
import { BlogBusinessLogic } from '../services/businessLogic/BlogBusinessLogic';
import { DEFAULT_FILTERS, DEFAULT_PAGINATION, DEFAULT_FILTER_OPTIONS } from '../types/blogTypes';

/**
 * Blog Store - Centralized state management with Zustand
 * Provides clean, predictable state management for blog functionality
 * @typedef {import('../types/blogTypes').BlogPost} BlogPost
 * @typedef {import('../types/blogTypes').BlogFilters} BlogFilters
 * @typedef {import('../types/blogTypes').BlogPagination} BlogPagination
 * @typedef {import('../types/blogTypes').FilterOptions} FilterOptions
 * @typedef {import('../types/blogTypes').BlogStats} BlogStats
 */
export const useBlogStore = create((set, get) => ({
  // State with type-safe defaults
  blogPosts: /** @type {BlogPost[]} */ ([]),
  filters: /** @type {BlogFilters} */ (DEFAULT_FILTERS),
  pagination: /** @type {BlogPagination} */ (DEFAULT_PAGINATION),
  loading: true,
  error: /** @type {string|null} */ (null),
  showFilters: false,
  filterOptions: /** @type {FilterOptions} */ (DEFAULT_FILTER_OPTIONS),
  stats: /** @type {BlogStats|null} */ (null),

  // Computed values
  hasActiveFilters: () => {
    try {
      const { filters } = get();
      return BlogBusinessLogic.hasActiveFilters(filters);
    } catch (error) {
      console.error('Error in hasActiveFilters:', error);
      return false;
    }
  },

  // Actions
  actions: {
    // State setters
    setBlogPosts: (posts) => set({ blogPosts: posts }),
    
    setFilters: (newFilters) => set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset page when filters change
    })),
    
    resetFilters: () => set({
      filters: DEFAULT_FILTERS,
      pagination: DEFAULT_PAGINATION
    }),
    
    setPagination: (newPagination) => set((state) => ({
      pagination: { ...state.pagination, ...newPagination }
    })),
    
    setLoading: (loading) => set({ loading }),
    
    setError: (error) => set({ error }),
    
    clearError: () => set({ error: null }),
    
    setFilterOptions: (filterOptions) => set({ filterOptions }),
    
    setStats: (stats) => set({ stats }),
    
    toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),

    // Complex actions with business logic
    updatePostLike: (postId, likeResult) => set((state) => ({
      blogPosts: BlogBusinessLogic.updatePostLikeStatus(
        state.blogPosts, 
        postId, 
        likeResult
      )
    })),

    updatePostViews: (postId) => set((state) => ({
      blogPosts: BlogBusinessLogic.updatePostViewCount(
        state.blogPosts, 
        postId
      )
    })),

    // Async actions
    fetchBlogPosts: async () => {
      const { filters, pagination, actions } = get();
      
      actions.setLoading(true);
      actions.clearError();

      const result = await BlogBusinessLogic.fetchBlogPosts(filters, pagination);
      
      if (result.success) {
        actions.setBlogPosts(result.data);
      } else {
        actions.setError(result.error);
        actions.setBlogPosts(result.data);
      }
      
      actions.setLoading(false);
    },

    fetchFilterOptions: async () => {
      const { actions } = get();
      const result = await BlogBusinessLogic.fetchFilterOptions();
      actions.setFilterOptions(result.data);
    },

    fetchBlogStats: async () => {
      const { actions } = get();
      const result = await BlogBusinessLogic.fetchBlogStats();
      if (result.success) {
        actions.setStats(result.data);
      }
    },

    // Combined actions
    initializeBlogData: async () => {
      const { actions } = get();
      await Promise.all([
        actions.fetchBlogPosts(),
        actions.fetchFilterOptions(),
        actions.fetchBlogStats()
      ]);
    },

    handleSearch: (searchTerm) => {
      const { actions } = get();
      actions.setFilters({ search: searchTerm });
      actions.fetchBlogPosts();
    },

    handleFilterChange: (newFilters) => {
      const { actions } = get();
      actions.setFilters(newFilters);
      actions.fetchBlogPosts();
    },

    handlePageChange: (newPage) => {
      const { actions } = get();
      actions.setPagination({ page: newPage });
      actions.fetchBlogPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    clearFiltersAndRefresh: () => {
      const { actions } = get();
      actions.resetFilters();
      actions.fetchBlogPosts();
    }
  }
}));
