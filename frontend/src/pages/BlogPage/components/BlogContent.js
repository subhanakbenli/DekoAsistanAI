import React from 'react';
import BlogDesignCard from '../../../components/blog/BlogDesignCard';
import BlogPagination from '../../../components/blog/BlogPagination';

/**
 * Blog Content Area Component
 * Displays blog posts, loading states, and pagination
 */
const BlogContent = ({ 
  loading,
  error,
  blogPosts,
  filters,
  filterOptions,
  pagination,
  isAuthenticated,
  onLikeToggle,
  onViewRecord,
  onDesignView,
  onFilterChange,
  onPageChange,
  onClearFilters,
  onRetry,
  onNavigateToStudio
}) => {
  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-700"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error && !loading) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-xl p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-300 mb-2">Hata Oluştu</h3>
        <p className="text-red-200 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  // Empty State
  if (!loading && !error && blogPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-6">
          <span className="text-3xl">🎨</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Henüz paylaşılan tasarım yok
        </h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {filters.search || filters.room_type || filters.design_style 
            ? 'Arama kriterlerinize uygun tasarım bulunamadı. Filtreleri temizleyerek tüm tasarımları görebilirsiniz.'
            : 'İlk tasarımı paylaşan siz olun! Tasarım stüdyosuna giderek AI destekli tasarımlar oluşturun.'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {(filters.search || filters.room_type || filters.design_style) && (
            <button
              onClick={onClearFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              🔄 Filtreleri Temizle
            </button>
          )}
          
          <button
            onClick={onNavigateToStudio}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎨 Tasarım Oluştur
          </button>
        </div>
      </div>
    );
  }

  // Blog Posts Content
  return (
    <div className="space-y-8">
      
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          {blogPosts.length} tasarım gösteriliyor
          {(filters.search || filters.room_type || filters.design_style) && (
            <button
              onClick={onClearFilters}
              className="ml-2 text-purple-400 hover:text-purple-300 underline"
            >
              (filtreleri temizle)
            </button>
          )}
        </div>
        
        {/* Sort by mobile */}
        <div className="lg:hidden">
          <select
            value={filters.sort_by}
            onChange={(e) => onFilterChange({ sort_by: e.target.value })}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            {filterOptions.sort_options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Design Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogDesignCard
            key={post.id}
            post={post}
            onLikeToggle={onLikeToggle}
            onViewRecord={onViewRecord}
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
  );
};

export default BlogContent;
