import React, { memo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBlogData } from '../hooks';
import { useFavorites } from '../hooks';
import { 
  BlogHeaderSection, 
  BlogContentSection, 
  BlogSidebarSection 
} from '../components/blogPage';
import Navbar from '../components/Navbar';

/**
 * BlogPage - Blog listing and discovery page
 * Following project schema: Single page component with imported components
 * Architecture: Direct component usage like other pages (HomePage, FavoritesPage)
 */
const BlogPage = memo(() => {
  // Authentication context
  const { isAuthenticated } = useAuth();
  
  // Favorites management
  const { toggleDesignFavorite, isDesignFavorited, favoriteDesigns } = useFavorites();
  
  // Blog data management - all business logic in custom hook
  const {
    // State data
    blogPosts,
    filters,
    pagination,
    loading,
    error,
    showFilters,
    filterOptions,
    stats,
    
    // Action handlers
    handleFilterChange,
    handleSearch,
    handlePaginationChange,
    handleDesignView,
    handleClearFilters,
    handleNavigateToStudio,
    toggleFiltersVisibility,
    retryFetchPosts
  } = useBlogData();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-16">
        
        {/* Blog Header Section */}
        <BlogHeaderSection 
          onSearch={handleSearch}
          searchValue={filters.search}
          stats={stats}
          showFilters={showFilters}
          onToggleFilters={toggleFiltersVisibility}
        />

        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-8">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Sidebar Section */}
            <BlogSidebarSection
              showFilters={showFilters}
              filters={filters}
              filterOptions={filterOptions}
              stats={stats}
              loading={loading}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Main Content Section */}
            <BlogContentSection
              loading={loading}
              error={error}
              blogPosts={blogPosts}
              filters={filters}
              filterOptions={filterOptions}
              pagination={pagination}
              isAuthenticated={isAuthenticated}
              favoriteDesigns={favoriteDesigns}
              onFavoriteToggle={toggleDesignFavorite}
              isDesignFavorited={isDesignFavorited}
              onDesignView={handleDesignView}
              onFilterChange={handleFilterChange}
              onPageChange={handlePaginationChange}
              onClearFilters={handleClearFilters}
              onRetry={retryFetchPosts}
              onNavigateToStudio={handleNavigateToStudio}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

BlogPage.displayName = 'BlogPage';

export default BlogPage;
