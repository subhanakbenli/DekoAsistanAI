import React, { memo } from 'react';

/**
 * Blog Loading State Component
 * Single Responsibility: Display loading skeleton
 * Pure Component: No side effects, same input = same output
 */
const BlogLoadingState = memo(() => {
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
});

BlogLoadingState.displayName = 'BlogLoadingState';

export default BlogLoadingState;
