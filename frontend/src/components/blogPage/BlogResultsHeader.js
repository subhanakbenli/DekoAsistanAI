import React, { memo } from 'react';

/**
 * Blog Results Header Component
 * Single Responsibility: Display results count and mobile sort options
 * Pure Component: Only renders based on provided props
 */
const BlogResultsHeader = memo(({ 
  postsCount, 
  filters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters 
}) => {
  const hasActiveFilters = filters.search || filters.room_type || filters.design_style;

  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-400 text-sm">
        {postsCount} tasarım gösteriliyor
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-2 text-purple-400 hover:text-purple-300 underline"
          >
            (filtreleri temizle)
          </button>
        )}
      </div>
      
      {/* Sort by mobile - Hidden on desktop as it's in sidebar */}
      <div className="lg:hidden">
        <select
          value={filters.sort_by}
          onChange={(e) => onFilterChange({ sort_by: e.target.value })}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
        >
          {filterOptions.sort_options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

BlogResultsHeader.displayName = 'BlogResultsHeader';

export default BlogResultsHeader;
