import React, { memo } from 'react';

/**
 * Blog Stats Component
 * Features: Statistics display, popular categories
 */
const BlogStats = memo(({ stats, className = '' }) => {
  if (!stats) {
    return null;
  }

  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 p-6 ${className}`}>
      
      {/* Header */}
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
        <span>📊</span>
        <span>Blog İstatistikleri</span>
      </h3>

      <div className="space-y-6">
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {stats.total_posts}
            </div>
            <div className="text-sm text-gray-400">Toplam Tasarım</div>
          </div>
        </div>

        {/* Popular Room Types */}
        {stats.popular_room_types && stats.popular_room_types.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
              <span>🏠</span>
              <span>Popüler Oda Tipleri</span>
            </h4>
            <div className="space-y-2">
              {stats.popular_room_types.slice(0, 5).map((room, index) => (
                <div key={room.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400 font-medium">#{index + 1}</span>
                    <span className="text-gray-300">{room.name}</span>
                  </div>
                  <span className="text-gray-400">{room.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Design Styles */}
        {stats.popular_design_styles && stats.popular_design_styles.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
              <span>🎨</span>
              <span>Popüler Tasarım Stilleri</span>
            </h4>
            <div className="space-y-2">
              {stats.popular_design_styles.slice(0, 5).map((style, index) => (
                <div key={style.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-medium">#{index + 1}</span>
                    <span className="text-gray-300">{style.name}</span>
                  </div>
                  <span className="text-gray-400">{style.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
        </div>
      </div>
    </div>
  );
});

BlogStats.displayName = 'BlogStats';

export default BlogStats;
