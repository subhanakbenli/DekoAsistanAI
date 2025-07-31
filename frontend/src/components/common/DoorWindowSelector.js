import React, { memo } from 'react';
import { useDoorWindow } from '../../hooks/useDoorWindow';

/**
 * Door Window Selector Component
 * Simple door/window position selection with conflict detection
 * Features toggle system and position selectors for each wall
 */
const DoorWindowSelector = memo(({ onSelectionChange, className = '' }) => {
  const {
    doorConfig,
    windowConfig,
    handleDoorToggle,
    handleDoorPositionChange,
    handleWindowToggle,
    handleWindowPositionChange,
    clearConfiguration,
    hasConflict,
    getValidationMessage,
    getDoorWindowDescription,
    getAvailableWindowPositions,
    getAvailableDoorPositions
  } = useDoorWindow();

  // Notify parent component of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        isValid: !hasConflict,
        configuration: {
          door: doorConfig,
          window: windowConfig,
          description: getDoorWindowDescription()
        }
      });
    }
  }, [doorConfig, windowConfig, hasConflict, getDoorWindowDescription, onSelectionChange]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🚪</span>
          Kapı ve Pencere Konumu
        </h3>
        <p className="text-gray-400 text-sm">
          Odanızdaki kapı ve pencere konumlarını belirleyin.
        </p>
      </div>

      {/* Room Layout Visual Guide */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="text-center mb-3">
          <span className="text-sm text-gray-400">Oda Düzeni Rehberi</span>
        </div>
        <div className="relative bg-gray-700 rounded-lg h-32 flex items-center justify-center">
          {/* Room representation */}
          <div className="absolute inset-2 border-2 border-gray-500 rounded">
            {/* Wall labels */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
              Kuzey
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
              Güney
            </div>
            <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Batı
            </div>
            <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Doğu
            </div>
            
            {/* Door indicator */}
            {doorConfig.hasDoor && (
              <div className={`absolute w-4 h-1 bg-yellow-500 ${getWallStyle(doorConfig.position, 'door')}`}>
                <span className="text-xs">🚪</span>
              </div>
            )}
            
            {/* Window indicator */}
            {windowConfig.hasWindow && (
              <div className={`absolute w-4 h-1 bg-blue-500 ${getWallStyle(windowConfig.position, 'window')}`}>
                <span className="text-xs">🪟</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Door Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
          <span className="text-2xl">🚪</span>
          <div className="flex-1">
            <h4 className="font-medium text-yellow-300 mb-1">Kapı Konfigürasyonu</h4>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasDoor"
                checked={doorConfig.hasDoor}
                onChange={(e) => handleDoorToggle(e.target.checked)}
                className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
              />
              <label htmlFor="hasDoor" className="text-sm text-gray-300 cursor-pointer">
                Odada kapı var
              </label>
            </div>
          </div>
        </div>

        {doorConfig.hasDoor && (
          <div className="ml-4 space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Kapı Konumu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableDoorPositions().map(({ key, name }) => (
                <label
                  key={key}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${doorConfig.position === key
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="doorPosition"
                    value={key}
                    checked={doorConfig.position === key}
                    onChange={(e) => handleDoorPositionChange(e.target.value)}
                    className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 focus:ring-yellow-500 focus:ring-2"
                  />
                  <span className="text-sm">{name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Window Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
          <span className="text-2xl">🪟</span>
          <div className="flex-1">
            <h4 className="font-medium text-blue-300 mb-1">Pencere Konfigürasyonu</h4>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasWindow"
                checked={windowConfig.hasWindow}
                onChange={(e) => handleWindowToggle(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="hasWindow" className="text-sm text-gray-300 cursor-pointer">
                Odada pencere var
              </label>
            </div>
          </div>
        </div>

        {windowConfig.hasWindow && (
          <div className="ml-4 space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Pencere Konumu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableWindowPositions().map(({ key, name }) => (
                <label
                  key={key}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${windowConfig.position === key
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="windowPosition"
                    value={key}
                    checked={windowConfig.position === key}
                    onChange={(e) => handleWindowPositionChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm">{name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={clearConfiguration}
          className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors text-sm"
        >
          🗑️ Sıfırla
        </button>
      </div>

      {/* Conflict Warning - hide in compact mode */}
      {hasConflict && !className?.includes('compact') && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            {getValidationMessage()}
          </p>
        </div>
      )}

      {/* Configuration Summary - hide in compact mode */}
      {!hasConflict && (doorConfig.hasDoor || windowConfig.hasWindow) && !className?.includes('compact') && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <span>✅</span>
            Konum ayarları: {getDoorWindowDescription()}
          </p>
        </div>
      )}
    </div>
  );
});

/**
 * Helper function to get wall positioning styles for visual guide
 */
const getWallStyle = (position, type) => {
  const baseOffset = type === 'door' ? '2' : '6';
  
  switch (position) {
    case 'north':
      return `top-0 left-1/2 transform -translate-x-1/2 -translate-y-${baseOffset}`;
    case 'south':
      return `bottom-0 left-1/2 transform -translate-x-1/2 translate-y-${baseOffset}`;
    case 'west':
      return `left-0 top-1/2 transform -translate-y-1/2 -translate-x-${baseOffset} rotate-90`;
    case 'east':
      return `right-0 top-1/2 transform -translate-y-1/2 translate-x-${baseOffset} rotate-90`;
    default:
      return '';
  }
};

DoorWindowSelector.displayName = 'DoorWindowSelector';

export default DoorWindowSelector;
