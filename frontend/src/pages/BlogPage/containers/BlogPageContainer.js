import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useBlogStoreHook } from '../../../hooks/useBlogStoreHook';
import BlogPageView from '../views/BlogPageView';

/**
 * Blog Page Container - Smart Component
 * Handles all business logic and state management
 * Follows Container/Presentational pattern for better separation of concerns
 */
const BlogPageContainer = () => {
  const { isAuthenticated } = useAuth();
  
  // All blog logic handled by store hook
  const blogData = useBlogStoreHook();

  // Pass all necessary props to presentational component
  const viewProps = {
    ...blogData,
    isAuthenticated
  };

  return <BlogPageView {...viewProps} />;
};

export default BlogPageContainer;
