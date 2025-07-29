import React, { useState } from 'react';

/**
 * HashtagDisplay - Displays hashtags with Turkish translations
 * @param {Object} hashtags - Hashtag object with en, tr, display arrays
 * @param {number} previewLimit - Number of hashtags to show in preview mode (default: 4)
 * @param {boolean} showAll - Whether to show all hashtags or use preview limit
 * @param {string} className - Additional CSS classes
 * @param {boolean} copyEnabled - Enable copy to clipboard functionality
 */
const HashtagDisplay = ({ 
  hashtags, 
  previewLimit = 4, 
  showAll = false, 
  className = '', 
  copyEnabled = true 
}) => {
  const [expanded, setExpanded] = useState(showAll);
  const [copied, setCopied] = useState(false);

  // Safe access to hashtags with fallback
  const displayTags = hashtags?.display || hashtags?.tr || hashtags?.en || [];
  
  // Debug: Check hashtag format
  if (hashtags && Object.keys(hashtags).length > 0) {
    console.log('HashtagDisplay received:', hashtags);
  }
  
  if (!displayTags || displayTags.length === 0) {
    return null;
  }

  // Determine which hashtags to show
  const visibleTags = expanded ? displayTags : displayTags.slice(0, previewLimit);
  const hasMore = displayTags.length > previewLimit;

  // Copy all hashtags to clipboard
  const handleCopyToClipboard = async () => {
    if (!copyEnabled) return;
    
    try {
      const hashtagText = displayTags.join(' ');
      await navigator.clipboard.writeText(hashtagText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy hashtags:', err);
    }
  };

  // Handle hashtag click (placeholder for future functionality)
  const handleHashtagClick = (hashtag) => {
    // TODO: Implement hashtag click functionality (search/filter)
    console.log('Hashtag clicked:', hashtag);
  };

  // Truncate long hashtags for display
  const truncateHashtag = (tag, maxLength = 20) => {
    if (tag.length <= maxLength) return tag;
    return tag.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className={`hashtag-display ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-300 flex items-center">
          <span className="mr-2">🏷️</span>
          Hashtag'ler
        </h4>
        
        {copyEnabled && displayTags.length > 0 && (
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center text-xs text-gray-400 hover:text-blue-300 transition-colors"
            title="Hashtag'leri kopyala"
          >
            <span className="mr-1">
              {copied ? '✓' : '📋'}
            </span>
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </button>
        )}
      </div>

      {/* Responsive hashtag container */}
      <div className="flex flex-wrap gap-2 sm:gap-1.5">
        {visibleTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleHashtagClick(tag)}
            className="inline-block bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 hover:text-blue-100 
                       text-xs sm:text-2xs px-3 py-1.5 sm:px-2 sm:py-1 rounded-full 
                       border border-blue-700/50 hover:border-blue-600/70 
                       transition-all duration-200 cursor-pointer transform hover:scale-105 
                       group active:scale-95"
            title={tag.length > 20 ? tag : `Hashtag: ${tag}`}
          >
            <span className="group-hover:font-medium">
              {truncateHashtag(tag, window.innerWidth < 640 ? 15 : 20)}
            </span>
          </button>
        ))}
        
        {/* Show more/less button */}
        {hasMore && !showAll && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-block bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white 
                       text-xs sm:text-2xs px-3 py-1.5 sm:px-2 sm:py-1 rounded-full 
                       border border-gray-600/50 hover:border-gray-500/70 
                       transition-all duration-200 active:scale-95"
          >
            {expanded 
              ? `Daha az` 
              : `+${displayTags.length - previewLimit}`
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default HashtagDisplay;
