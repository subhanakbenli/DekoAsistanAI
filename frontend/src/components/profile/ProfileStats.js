import React from 'react';

/**
 * ProfileStats - User statistics display component
 * Shows user's design and favorite counts
 * 
 * Future enhancement: Accept actual stats as props when backend provides them
 */
const ProfileStats = () => (
  <div className="grid grid-cols-2 gap-4 mt-6">
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="text-2xl font-bold text-purple-400">0</div>
      <div className="text-xs text-gray-400">Tasarımlar</div>
    </div>
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="text-2xl font-bold text-blue-400">0</div>
      <div className="text-xs text-gray-400">Favoriler</div>
    </div>
  </div>
);

export default ProfileStats;
