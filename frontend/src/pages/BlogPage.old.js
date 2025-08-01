import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blogService from '../services/blogService';
import Navbar from '../components/Navbar';
import BlogHeader from '../components/blog/BlogHeader';
import BlogFilters from '../components/blog/BlogFilters';
import BlogDesignCard from '../components/blog/BlogDesignCard';
import BlogPagination from '../components/blog/BlogPagination';
import BlogStats from '../components/blog/BlogStats';

/**
 * BlogPage - Public blog for design sharing and discovery
 * Features: Public access, filtering, search, pagination, like system
 */
const BlogPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [blogPosts, setBlogPosts] = useState([]);
  const [filters, setFilters] = useState({
    room_type: '',
    design_style: '',
    search: '',
    sort_by: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    room_types: [],
    design_styles: [],
    sort_options: []
  });
  const [stats, setStats] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch blog posts with current filters and pagination
  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const posts = await blogService.getPublishedPosts(queryParams);
      setBlogPosts(posts);

    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Blog gönderileri yüklenirken bir hata oluştu');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await blogService.getBlogFilters();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  // Fetch blog stats
  const fetchBlogStats = useCallback(async () => {
    try {
      const blogStats = await blogService.getBlogStats();
      setStats(blogStats);
    } catch (err) {
      console.error('Error fetching blog stats:', err);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  useEffect(() => {
    fetchFilterOptions();
    fetchBlogStats();
  }, [fetchFilterOptions, fetchBlogStats]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle search
  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle like toggle
  const handleLikeToggle = useCallback(async (blogPostId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await blogService.toggleLike(blogPostId);
      
      // Update the post in local state
      setBlogPosts(prev => prev.map(post => 
        post.id === blogPostId 
          ? { 
              ...post, 
              is_liked: result.is_liked, 
              like_count: result.like_count 
            }
          : post
      ));
      
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }, [isAuthenticated, navigate]);

  // Handle view recording
  const handleViewRecord = useCallback(async (blogPostId) => {
    try {
      await blogService.recordView(blogPostId);
      
      // Update view count in local state
      setBlogPosts(prev => prev.map(post => 
        post.id === blogPostId 
          ? { ...post, view_count: post.view_count + 1 }
          : post
      ));
      
    } catch (err) {
      console.error('Error recording view:', err);
    }
  }, []);

  // Handle design detail navigation
  const handleDesignView = useCallback((designId) => {
    navigate(`/design/${designId}`);
  }, [navigate]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      room_type: '',
      design_style: '',
      search: '',
      sort_by: 'newest'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="pt-16">
        {/* Blog Header with Search */}
        <BlogHeader 
          onSearch={handleSearch}
          searchValue={filters.search}
          stats={stats}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <BlogFilters
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                loading={loading}
              />
              
              {/* Blog Stats */}
              <BlogStats stats={stats} className="mt-6" />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* Loading State */}
              {loading && (
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
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-900/50 border border-red-700 rounded-xl p-8 text-center">
                  <div className="text-red-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">Hata Oluştu</h3>
                  <p className="text-red-200 mb-4">{error}</p>
                  <button
                    onClick={fetchBlogPosts}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && blogPosts.length === 0 && (
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
                        onClick={handleClearFilters}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors"
                      >
                        🔄 Filtreleri Temizle
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate('/studio')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      🎨 Tasarım Oluştur
                    </button>
                  </div>
                </div>
              )}

              {/* Blog Posts Grid */}
              {!loading && !error && blogPosts.length > 0 && (
                <div className="space-y-8">
                  
                  {/* Results Count */}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-400 text-sm">
                      {blogPosts.length} tasarım gösteriliyor
                      {(filters.search || filters.room_type || filters.design_style) && (
                        <button
                          onClick={handleClearFilters}
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
                        onChange={(e) => handleFilterChange({ sort_by: e.target.value })}
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
                        onLikeToggle={handleLikeToggle}
                        onViewRecord={handleViewRecord}
                        onDesignView={handleDesignView}
                        isAuthenticated={isAuthenticated}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <BlogPagination
                    currentPage={pagination.page}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
