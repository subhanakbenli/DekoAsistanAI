import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Favorites Empty State
 * Single Responsibility: Empty state display for different types
 * Pure Component: Only renders based on props
 */
const FavoritesEmptyState = memo(({ type }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-6">
        <span className="text-2xl">
          {type === 'designs' ? '🎨' : '🛍️'}
        </span>
      </div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
        {type === 'designs' ? 'You have no favorite designs yet' : 'You have no favorite products yet'}
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
        {type === 'designs' 
          ? 'Add designs you like to your favorites to see them here.'
          : 'Add products you like to your favorites to see them here.'
        }
      </p>
      <button
        onClick={() => navigate('/studio')}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 
                 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        {type === 'designs' ? '🎨 Create a Design' : '🏠 Go to Design Studio'}
      </button>
    </div>
  );
});

FavoritesEmptyState.displayName = 'FavoritesEmptyState';

export default FavoritesEmptyState;
