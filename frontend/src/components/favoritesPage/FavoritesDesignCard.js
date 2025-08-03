import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Favorites Design Card
 * Single Responsibility: Display design favorite item (Blog style)
 * Pure Component: Only renders based on props
 */
const FavoritesDesignCard = memo(({ design, onRemove, removing }) => {
  const navigate = useNavigate();

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(design.design_id);
  };

  const handleCardClick = () => {
    navigate(`/design/${design.design_id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer group"
      onClick={handleCardClick}
    >
      
      {/* Image Section - Blog style with natural aspect ratio */}
      <div className="relative bg-gray-700 overflow-hidden aspect-auto">
        {design.image && design.image.has_image ? (
          <img 
            src={`http://localhost:8000${design.image.image_url}`}
            alt={design.design_title || design.title}
            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder */}
        <div className={`absolute inset-0 flex items-center justify-center min-h-[200px] ${design.image && design.image.has_image ? 'hidden' : 'flex'}`}>
          <div className="text-center text-gray-400">
            <div className="text-red-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs">Görsel bulunamadı</p>
          </div>
        </div>
        
        {/* Category Badges */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <span className="bg-purple-600/80 backdrop-blur-sm text-purple-100 px-1.5 py-0.5 rounded text-xs font-medium">
            {design.room_type}
          </span>
          <span className="bg-blue-600/80 backdrop-blur-sm text-blue-100 px-1.5 py-0.5 rounded text-xs font-medium">
            {design.design_style}
          </span>
        </div>

        {/* Title Overlay - Blog style with gradient background */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors line-clamp-2 drop-shadow-lg">
            {design.title || design.design_title || 'Tasarım Başlığı'}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-200 drop-shadow-md">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">{formatDate(design.created_at).split(' ')[0]} {formatDate(design.created_at).split(' ')[1]?.slice(0,3)}</span>
            </div>
          </div>
        </div>

        {/* Remove Button - Blog style favorite button position */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleRemoveClick}
            disabled={removing === design.design_id}
            className="p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 bg-red-500/80 text-white hover:bg-red-600/90"
            title="Favorilerden çıkar"
          >
            {removing === design.design_id ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

FavoritesDesignCard.displayName = 'FavoritesDesignCard';

export default FavoritesDesignCard;
