import React, { memo } from 'react';

/**
 * Blog Error State Component
 * Single Responsibility: Display error message with retry option
 * Pure Component: Focused on error display only
 */
const BlogErrorState = memo(({ error, onRetry }) => {
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
});

BlogErrorState.displayName = 'BlogErrorState';

export default BlogErrorState;
