import React, { memo } from 'react';

/**
 * Blog Empty State Component
 * Single Responsibility: Display empty state with appropriate actions
 * Conditional Rendering: Different messages based on filter state
 */
const BlogEmptyState = memo(({ filters, onClearFilters, onNavigateToStudio }) => {
  const hasActiveFilters = filters.search || filters.room_type || filters.design_style;

  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-6">
        <span className="text-3xl">🎨</span>
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
        No designs shared yet
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {hasActiveFilters 
          ? 'No designs match your search criteria. Clear the filters to see all designs.'
          : 'Be the first to share a design! Head to the design studio to create AI-powered designs.'
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors"
          >
            🔄 Clear Filters
          </button>
        )}
        
        <button
          onClick={onNavigateToStudio}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🎨 Create a Design
        </button>
      </div>
    </div>
  );
});

BlogEmptyState.displayName = 'BlogEmptyState';

export default BlogEmptyState;
