import { useEffect } from 'react';
import { useBlogState } from './useBlogState';
import { useBlogActions } from './useBlogActions';

/**
 * Blog Data Management Hook
 * Combines state and actions, handles data fetching lifecycle
 */
export const useBlogData = () => {
  const blogState = useBlogState();
  const blogActions = useBlogActions(blogState);

  // Initial data loading
  useEffect(() => {
    blogActions.fetchBlogPosts();
  }, [blogActions.fetchBlogPosts]);

  useEffect(() => {
    blogActions.fetchFilterOptions();
    blogActions.fetchBlogStats();
  }, [blogActions.fetchFilterOptions, blogActions.fetchBlogStats]);

  return {
    ...blogState,
    ...blogActions
  };
};
