import React, { memo, useState } from 'react';

/**
 * Blog Header Component
 * Features: Search functionality, stats display, filter toggle
 */
const BlogHeader = memo(({ 
  onSearch, 
  searchValue, 
  stats, 
  showFilters, 
  onToggleFilters 
}) => {
  const [searchInput, setSearchInput] = useState(searchValue || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput('');
    onSearch('');
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-4">
            <span className="text-2xl">📖</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Tasarım Blogu
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            AI destekli iç mekan tasarımlarını keşfedin, ilham alın ve kendi tasarımlarınızı paylaşın
          </p>
        </div>

        {/* Stats Preview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">{stats.total_posts}</div>
              <div className="text-sm text-gray-400">Tasarım</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-pink-400">{stats.total_likes}</div>
              <div className="text-sm text-gray-400">Beğeni</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">{stats.total_views}</div>
              <div className="text-sm text-gray-400">Görüntülenme</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {stats.popular_room_types?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Kategori</div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tasarım ara... (başlık, açıklama, etiket)"
                  className="w-full bg-gray-800 border border-gray-600 rounded-l-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-r-xl transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Ara</span>
              </button>
            </div>
          </form>
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-4 text-center">
            <button
              onClick={onToggleFilters}
              className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span>{showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

BlogHeader.displayName = 'BlogHeader';

export default BlogHeader;
