import React, { memo } from 'react';
import { 
  FavoritesLoadingState, 
  FavoritesErrorState, 
  FavoritesEmptyState,
  FavoritesDesignCard
} from './';

/**
 * Favorites Content Section
 * Single Responsibility: Main content area with favorites grid (Designs only)
 * Open/Closed Principle: Easy to extend with new content types
 */
const FavoritesContentSection = memo(({
  loading,
  error,
  favoriteDesigns,
  onRemoveDesign,
  removing,
  onRetry
}) => {
  // Loading State
  if (loading) {
    return <FavoritesLoadingState />;
  }

  // Error State
  if (error && !loading) {
    return (
      <FavoritesErrorState 
        error={error} 
        onRetry={onRetry} 
      />
    );
  }

  return (
    <div className="min-h-96">
      {favoriteDesigns.length === 0 ? (
        <FavoritesEmptyState type="designs" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteDesigns.map((design) => (
            <FavoritesDesignCard 
              key={design.id} 
              design={design} 
              onRemove={onRemoveDesign}
              removing={removing}
            />
          ))}
        </div>
      )}
    </div>
  );
});

FavoritesContentSection.displayName = 'FavoritesContentSection';

export default FavoritesContentSection;
