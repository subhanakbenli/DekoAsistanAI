import { useEffect } from 'react';
import { useBlogStateManager } from './useBlogStateManager';
import { useBlogActionsSimplified } from './useBlogActionsSimplified';

/**
 * Simplified Blog Data Hook
 * Clean integration of state and actions with business logic separation
 */
export const useBlogDataSimplified = () => {
  const { state, actions } = useBlogStateManager();
  const blogActions = useBlogActionsSimplified(state, actions);

  // Initial data loading with clean separation
  useEffect(() => {
    blogActions.fetchBlogPosts();
  }, [blogActions.fetchBlogPosts]);

  useEffect(() => {
    blogActions.fetchFilterOptions();
    blogActions.fetchBlogStats();
  }, [blogActions.fetchFilterOptions, blogActions.fetchBlogStats]);

  return {
    // State (flat structure for easier access)
    ...state,
    
    // Actions (simplified interface)
    ...blogActions,
    
    // UI actions from state manager
    toggleFiltersVisibility: actions.toggleFiltersVisibility
  };
};
