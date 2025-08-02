import React, { memo } from 'react';
import BlogDesignCard from '../blog/BlogDesignCard';
import BlogPagination from '../blog/BlogPagination';
import { 
  BlogLoadingState, 
  BlogErrorState, 
  BlogEmptyState, 
  BlogResultsHeader 
} from './';

/**
 * Blog Content Section
 * Single Responsibility: Main content area with posts grid
 * Open/Closed Principle: Easy to extend with new content types
 */
const BlogContentSection = memo(({
  loading,
  error,
  blogPosts,
  filters,
  filterOptions,
  pagination,
  isAuthenticated,
  favoriteDesigns,
  onFavoriteToggle,
  isDesignFavorited,
  onDesignView,
  onFilterChange,
  onPageChange,
  onClearFilters,
  onRetry,
  onNavigateToStudio
}) => {
  return (
    <div className="flex-1">
      {/* Loading State */}
      {loading && <BlogLoadingState />}

      {/* Error State */}
      {error && !loading && (
        <BlogErrorState 
          error={error} 
          onRetry={onRetry} 
        />
      )}

      {/* Empty State */}
      {!loading && !error && blogPosts.length === 0 && (
        <BlogEmptyState
          filters={filters}
          onClearFilters={onClearFilters}
          onNavigateToStudio={onNavigateToStudio}
        />
      )}

      {/* Blog Posts Content */}
      {!loading && !error && blogPosts.length > 0 && (
        <div className="space-y-8">
          
          {/* Results Header */}
          <BlogResultsHeader
            postsCount={blogPosts.length}
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
          />

          {/* Design Cards Grid - Auto-fit based on card natural width */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {blogPosts.map((post) => (
              <BlogDesignCard
                key={post.id}
                post={post}
                favoriteDesigns={favoriteDesigns}
                onFavoriteToggle={onFavoriteToggle}
                isDesignFavorited={isDesignFavorited}
                onDesignView={onDesignView}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>

          {/* Pagination */}
          <BlogPagination
            currentPage={pagination.page}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={onPageChange}
          />
          
        </div>
      )}
    </div>
  );
});

BlogContentSection.displayName = 'BlogContentSection';

export default BlogContentSection;
