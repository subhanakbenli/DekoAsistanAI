import React, { memo } from 'react';
import BlogFilters from '../blog/BlogFilters';
import BlogStats from '../blog/BlogStats';

/**
 * Blog Sidebar Section
 * Single Responsibility: Sidebar with filters and statistics
 * Encapsulation: Contains sidebar-specific styling and layout
 */
const BlogSidebarSection = memo(({ 
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
      <div className="sticky top-24 space-y-6">
        <BlogFilters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          loading={loading}
        />
        
        <BlogStats stats={stats} />
      </div>
    </div>
  );
});

BlogSidebarSection.displayName = 'BlogSidebarSection';

export default BlogSidebarSection;
