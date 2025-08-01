import React from 'react';
import BlogPageLayout from '../components/BlogPageLayout';
import OptimizedBlogContent from '../components/OptimizedBlogContent';
import BlogSidebar from '../components/BlogSidebar';
import BlogHeader from '../../../components/blog/BlogHeader';

/**
 * Blog Page View - Presentational Component
 * Pure UI component with no business logic
 * Receives all data and handlers as props
 */
const BlogPageView = ({
  // State props
  blogPosts,
  filters,
  pagination,
  loading,
  error,
  showFilters,
  filterOptions,
  stats,
  isAuthenticated,
  
  // Action props
  handleFilterChange,
  handleSearch,
  handlePageChange,
  handleLikeToggle,
  handleViewRecord,
  handleDesignView,
  handleClearFilters,
  handleNavigateToStudio,
  toggleFiltersVisibility,
  retryFetchPosts
}) => {
  return (
    <BlogPageLayout>
      {/* Blog Header with Search */}
      <BlogHeader 
        onSearch={handleSearch}
        searchValue={filters.search}
        stats={stats}
        showFilters={showFilters}
        onToggleFilters={toggleFiltersVisibility}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <BlogSidebar
            showFilters={showFilters}
            filters={filters}
            filterOptions={filterOptions}
            stats={stats}
            loading={loading}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            <OptimizedBlogContent
              loading={loading}
              error={error}
              blogPosts={blogPosts}
              filters={filters}
              filterOptions={filterOptions}
              pagination={pagination}
              isAuthenticated={isAuthenticated}
              onLikeToggle={handleLikeToggle}
              onViewRecord={handleViewRecord}
              onDesignView={handleDesignView}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onClearFilters={handleClearFilters}
              onRetry={retryFetchPosts}
              onNavigateToStudio={handleNavigateToStudio}
            />
          </div>
        </div>
      </div>
    </BlogPageLayout>
  );
};

export default BlogPageView;
