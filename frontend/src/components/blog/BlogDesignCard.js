import React, { memo, useState } from 'react';
import HashtagDisplay from '../HashtagDisplay';

/**
 * Blog Design Card Component
 * Features: Design preview, favorite tracking, author info, responsive design
 */
const BlogDesignCard = memo(({ 
  post, 
  favoriteDesigns,
  onFavoriteToggle, 
  isDesignFavorited,
  onDesignView, 
  isAuthenticated 
}) => {
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (isFavoriting) return;
    
    console.log('Favorite button clicked for design:', post.design_id);
    
    setIsFavoriting(true);
    try {
      await onFavoriteToggle(post.design_id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleCardClick = () => {
    onDesignView(post.design_id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if current design is favorited
  const isFavorited = isDesignFavorited(post.design_id);

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer group"
      onClick={handleCardClick}
    >
      
      {/* Image Section - Natural aspect ratio for better visibility */}
      <div className="relative bg-gray-700 overflow-hidden aspect-auto">
        {post.image && post.image.has_image ? (
          <img 
            src={`http://localhost:8000${post.image.image_url}`}
            alt={post.design_title}
            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder */}
        <div className={`absolute inset-0 flex items-center justify-center min-h-[200px] ${post.image && post.image.has_image ? 'hidden' : 'flex'}`}>
          <div className="text-center text-gray-400">
            <div className="text-red-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs">Görsel bulunamadı</p>
          </div>
        </div>
        
        {/* Category Badges - Reduced top margin */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <span className="bg-purple-600/80 backdrop-blur-sm text-purple-100 px-1.5 py-0.5 rounded text-xs font-medium">
            {post.room_type}
          </span>
          <span className="bg-blue-600/80 backdrop-blur-sm text-blue-100 px-1.5 py-0.5 rounded text-xs font-medium">
            {post.design_style}
          </span>
        </div>

        {/* Title Overlay - On top of image with transparent background */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors line-clamp-2 drop-shadow-lg">
            {post.design_title || post.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-200 drop-shadow-md">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{post.author_name}</span>
              <span className="mx-1">•</span>
              <span className="text-xs">{formatDate(post.created_at).split(' ')[0]} {formatDate(post.created_at).split(' ')[1]?.slice(0,3)}</span>
            </div>
            
            {/* Stats on image - Removed like count display */}
            <div className="flex items-center space-x-3 text-xs text-gray-200 drop-shadow-md">
              {/* Stats removed - only favorites functionality remains via heart icon */}
            </div>
          </div>
        </div>

        {/* Favorite Button - Reduced top margin */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleFavoriteClick}
            disabled={!isAuthenticated || isFavoriting}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorited 
                ? 'bg-red-500/80 text-white' 
                : 'bg-gray-800/60 text-gray-300 hover:bg-red-500/80 hover:text-white'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isAuthenticated ? (isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle') : 'Favorilere eklemek için giriş yapın'}
          >
            {isFavoriting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

BlogDesignCard.displayName = 'BlogDesignCard';

export default BlogDesignCard;
