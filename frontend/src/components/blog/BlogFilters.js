import React, { memo } from 'react';

/**
 * Blog Filters Component
 * Features: Room type, design style, sort filters with counts
 */
const BlogFilters = memo(({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters, 
  loading 
}) => {

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters = filters.room_type || filters.design_style || filters.search;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sticky top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <span>🔍</span>
          <span>Filtreler</span>
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-purple-400 hover:text-purple-300 text-sm underline transition-colors"
          >
            Temizle
          </button>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            📊 Sıralama
          </label>
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
          >
            {filterOptions.sort_options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Room Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🏠 Oda Tipi
          </label>
          <select
            value={filters.room_type}
            onChange={(e) => handleFilterChange('room_type', e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="">Tüm Odalar</option>
            {filterOptions.room_types?.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.count})
              </option>
            ))}
          </select>
        </div>

        {/* Design Style Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🎨 Tasarım Stili
          </label>
          <select
            value={filters.design_style}
            onChange={(e) => handleFilterChange('design_style', e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="">Tüm Stiller</option>
            {filterOptions.design_styles?.map(style => (
              <option key={style.value} value={style.value}>
                {style.label} ({style.count})
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Aktif Filtreler:</div>
            <div className="flex flex-wrap gap-2">
              
              {filters.room_type && (
                <span className="inline-flex items-center bg-purple-600/20 text-purple-300 px-2 py-1 rounded-md text-xs border border-purple-500/30">
                  🏠 {filters.room_type}
                  <button
                    onClick={() => handleFilterChange('room_type', '')}
                    className="ml-1 hover:text-purple-200"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.design_style && (
                <span className="inline-flex items-center bg-blue-600/20 text-blue-300 px-2 py-1 rounded-md text-xs border border-blue-500/30">
                  🎨 {filters.design_style}
                  <button
                    onClick={() => handleFilterChange('design_style', '')}
                    className="ml-1 hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.search && (
                <span className="inline-flex items-center bg-green-600/20 text-green-300 px-2 py-1 rounded-md text-xs border border-green-500/30">
                  🔍 "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:text-green-200"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-gray-400 text-sm">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Filtreler yükleniyor...
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

BlogFilters.displayName = 'BlogFilters';

export default BlogFilters;
