import React, { memo } from 'react';
import BlogHeader from '../blog/BlogHeader';

/**
 * Blog Header Section
 * Single Responsibility: Header display with search functionality
 * Pure Component: Only renders based on props
 */
const BlogHeaderSection = memo(({ 
  onSearch, 
  searchValue, 
  stats, 
  showFilters, 
  onToggleFilters 
}) => {
  return (
    <BlogHeader 
      onSearch={onSearch}
      searchValue={searchValue}
      stats={stats}
      showFilters={showFilters}
      onToggleFilters={onToggleFilters}
    />
  );
});

BlogHeaderSection.displayName = 'BlogHeaderSection';

export default BlogHeaderSection;
