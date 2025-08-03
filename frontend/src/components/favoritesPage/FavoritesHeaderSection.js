import React, { memo } from 'react';

/**
 * Favorites Header Section
 * Single Responsibility: Header display with title and stats (Designs only)
 * Pure Component: Only renders based on props
 */
const FavoritesHeaderSection = memo(({ 
  totalDesigns
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-6">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-6">
          {/* Left: Title and Description */}
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <span className="text-lg">❤️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Favorilerim
              </h1>
              <p className="text-xs text-gray-400">Beğendiğiniz tasarımlar</p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="hidden md:block">💡 Kişisel koleksiyonunuz</span>
            <span className="bg-gray-700 px-2 py-1 rounded">
              {totalDesigns} tasarım
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

FavoritesHeaderSection.displayName = 'FavoritesHeaderSection';

export default FavoritesHeaderSection;
