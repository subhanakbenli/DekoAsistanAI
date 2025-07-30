import React from 'react';

/**
 * StudioHeader - Header component for Room Design Studio
 * Shows title, description, and version info
 */
const StudioHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <span className="text-lg">🏠</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tasarım Stüdyosu
          </h1>
          <p className="text-xs text-gray-400">AI destekli iç mekan tasarımı</p>
        </div>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-xs text-gray-400">Beta Sürümü</p>
        <p className="text-xs text-purple-300">Gemini AI</p>
      </div>
    </div>
  );
};

export default StudioHeader;
