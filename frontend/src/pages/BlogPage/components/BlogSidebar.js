import React from 'react';
import BlogFilters from '../../../components/blog/BlogFilters';
import BlogStats from '../../../components/blog/BlogStats';

/**
 * Blog Sidebar Component
 * Contains filters and statistics
 */
const BlogSidebar = ({ 
  showFilters, 
  filters, 
  filterOptions, 
  stats, 
  loading, 
  onFilterChange, 
  onClearFilters 
}) => {
  return (
    <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <BlogFilters
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        loading={loading}
      />
      
      {/* Blog Stats */}
      <BlogStats stats={stats} className="mt-6" />
    </div>
  );
};

export default BlogSidebar;
