import React from 'react';
import { DesignResultSection } from '../sections';

/**
 * StudioResultPanel - Optimized result display panel
 * Full-width when results exist, placeholder when empty
 */
const StudioResultPanel = ({ 
  result, 
  moodBoard, 
  progress, 
  isMoodBoardLoading,
  isConnected 
}) => {
  
  if (!result) {
    // Placeholder when no result
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">AI Önerileri</h3>
          <p className="text-sm text-gray-500">
            Tasarım tercihlerinizi tamamlayın ve<br />
            yapay zeka destekli önerilerinizi görün
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <ResultHeader result={result} isConnected={isConnected} />
      
      <DesignResultSection
        result={result}
        moodBoard={moodBoard}
        progress={progress}
        isMoodBoardLoading={isMoodBoardLoading}
      />
    </div>
  );
};

/**
 * ResultHeader - Header for result panel
 */
const ResultHeader = ({ result, isConnected }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
          3
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-300">
            AI Önerileri
          </h3>
          <p className="text-xs text-gray-400">
            Yapay zeka destekli tasarım önerileri
          </p>
        </div>
      </div>
      
      <ConnectionStatus isConnected={isConnected} />
    </div>
  );
};

/**
 * ConnectionStatus - WebSocket connection status indicator
 */
const ConnectionStatus = ({ isConnected }) => {
  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-xs">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-400">Bağlı</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <span className="text-red-400">Çevrimdışı</span>
    </div>
  );
};

export default StudioResultPanel;
