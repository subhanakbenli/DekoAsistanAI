import React, { memo, useState, useEffect } from 'react';
import HashtagDisplay from '../HashtagDisplay';

/**
 * Blog Design Card Component
 * Features: Design preview, like/view tracking, author info, responsive design
 */
const BlogDesignCard = memo(({ 
  post, 
  onLikeToggle, 
  onViewRecord, 
  onDesignView, 
  isAuthenticated 
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [hasRecordedView, setHasRecordedView] = useState(false);

  // Record view when card comes into viewport
  useEffect(() => {
    if (!hasRecordedView) {
      const timer = setTimeout(() => {
        onViewRecord(post.id);
        setHasRecordedView(true);
      }, 1000); // Record view after 1 second

      return () => clearTimeout(timer);
    }
  }, [post.id, onViewRecord, hasRecordedView]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    await onLikeToggle(post.id);
    setIsLiking(false);
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

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer group"
      onClick={handleCardClick}
    >
      
      {/* Image Section */}
      <div className="relative h-48 bg-gray-700">
        {post.image && post.image.has_image ? (
          <img 
            src={`http://localhost:8000${post.image.image_url}`}
            alt={post.design_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder */}
        <div className={`absolute inset-0 flex items-center justify-center ${post.image && post.image.has_image ? 'hidden' : 'flex'}`}>
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
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className="bg-purple-600/80 backdrop-blur-sm text-purple-100 px-2 py-1 rounded-md text-xs font-medium">
            {post.room_type}
          </span>
          <span className="bg-blue-600/80 backdrop-blur-sm text-blue-100 px-2 py-1 rounded-md text-xs font-medium">
            {post.design_style}
          </span>
        </div>

        {/* Like Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleLikeClick}
            disabled={!isAuthenticated || isLiking}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              post.is_liked 
                ? 'bg-red-500/80 text-white' 
                : 'bg-gray-800/60 text-gray-300 hover:bg-red-500/80 hover:text-white'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isAuthenticated ? (post.is_liked ? 'Beğeniyi kaldır' : 'Beğen') : 'Beğenmek için giriş yapın'}
          >
            {isLiking ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        
        {/* Title and Author */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
            {post.design_title || post.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-400 mb-3">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>{post.author_name}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Design Description Instead of Content */}
        {post.design_description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {post.design_description}
          </p>
        )}

        {/* Hashtags */}
        <div className="mb-4">
          {post.hashtags && post.hashtags.length > 0 ? (
            <HashtagDisplay 
              hashtags={post.hashtags} 
              previewLimit={3}
              showAll={false}
              copyEnabled={false}
              size="sm"
            />
          ) : (
            <div className="text-gray-500 text-sm italic">
              Hashtag bulunamadı
            </div>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>{post.like_count || 0}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>{post.view_count || 0}</span>
            </div>
          </div>

          {/* View Button */}
          <button
            onClick={handleCardClick}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Tasarımı Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
});

BlogDesignCard.displayName = 'BlogDesignCard';

export default BlogDesignCard;
