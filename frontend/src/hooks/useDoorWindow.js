import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Door and Window position management hook
 * Handles simple door/window positioning for room design
 */

export const WALL_POSITIONS = {
  NORTH: 'north',
  SOUTH: 'south',
  EAST: 'east',
  WEST: 'west'
};

export const WALL_NAMES = {
  [WALL_POSITIONS.NORTH]: 'Kuzey Duvarı',
  [WALL_POSITIONS.SOUTH]: 'Güney Duvarı', 
  [WALL_POSITIONS.EAST]: 'Doğu Duvarı',
  [WALL_POSITIONS.WEST]: 'Batı Duvarı'
};

export const useDoorWindow = () => {
  const [doorConfig, setDoorConfig] = useState({
    hasDoor: true,
    position: WALL_POSITIONS.SOUTH
  });

  const [windowConfig, setWindowConfig] = useState({
    hasWindow: true,
    position: WALL_POSITIONS.NORTH
  });

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedDoorConfig = localStorage.getItem('doorWindowConfig_door');
      const savedWindowConfig = localStorage.getItem('doorWindowConfig_window');

      if (savedDoorConfig) {
        const door = JSON.parse(savedDoorConfig);
        setDoorConfig(prev => ({ ...prev, ...door }));
      }

      if (savedWindowConfig) {
        const window = JSON.parse(savedWindowConfig);
        setWindowConfig(prev => ({ ...prev, ...window }));
      }
    } catch (error) {
      console.warn('Error loading door/window config from localStorage:', error);
    }
  }, []);

  // Save door config to localStorage
  const handleDoorToggle = useCallback((hasDoor) => {
    const newConfig = { ...doorConfig, hasDoor };
    setDoorConfig(newConfig);
    
    try {
      localStorage.setItem('doorWindowConfig_door', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Error saving door config to localStorage:', error);
    }
  }, [doorConfig]);

  // Save door position to localStorage
  const handleDoorPositionChange = useCallback((position) => {
    const newConfig = { ...doorConfig, position };
    setDoorConfig(newConfig);
    
    try {
      localStorage.setItem('doorWindowConfig_door', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Error saving door position to localStorage:', error);
    }
  }, [doorConfig]);

  // Save window config to localStorage
  const handleWindowToggle = useCallback((hasWindow) => {
    const newConfig = { ...windowConfig, hasWindow };
    setWindowConfig(newConfig);
    
    try {
      localStorage.setItem('doorWindowConfig_window', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Error saving window config to localStorage:', error);
    }
  }, [windowConfig]);

  // Save window position to localStorage
  const handleWindowPositionChange = useCallback((position) => {
    const newConfig = { ...windowConfig, position };
    setWindowConfig(newConfig);
    
    try {
      localStorage.setItem('doorWindowConfig_window', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Error saving window position to localStorage:', error);
    }
  }, [windowConfig]);

  // Clear all configurations
  const clearConfiguration = useCallback(() => {
    setDoorConfig({
      hasDoor: true,
      position: WALL_POSITIONS.SOUTH
    });
    
    setWindowConfig({
      hasWindow: true,
      position: WALL_POSITIONS.NORTH
    });
    
    try {
      localStorage.removeItem('doorWindowConfig_door');
      localStorage.removeItem('doorWindowConfig_window');
    } catch (error) {
      console.warn('Error clearing door/window config from localStorage:', error);
    }
  }, []);

  // Validation - check for conflicts
  const hasConflict = useMemo(() => {
    return doorConfig.hasDoor && 
           windowConfig.hasWindow && 
           doorConfig.position === windowConfig.position;
  }, [doorConfig, windowConfig]);

  // Generate human readable description
  const getDoorWindowDescription = useCallback(() => {
    const parts = [];
    
    if (doorConfig.hasDoor) {
      parts.push(`Kapı: ${WALL_NAMES[doorConfig.position]}`);
    } else {
      parts.push('Kapı yok');
    }
    
    if (windowConfig.hasWindow) {
      parts.push(`Pencere: ${WALL_NAMES[windowConfig.position]}`);
    } else {
      parts.push('Pencere yok');
    }
    
    return parts.join(', ');
  }, [doorConfig.hasDoor, doorConfig.position, windowConfig.hasWindow, windowConfig.position]);

  // Get current configuration for form submission
  const getConfiguration = useCallback(() => {
    const description = getDoorWindowDescription();
    return {
      door: doorConfig.hasDoor ? {
        position: doorConfig.position,
        wallName: WALL_NAMES[doorConfig.position]
      } : null,
      window: windowConfig.hasWindow ? {
        position: windowConfig.position,
        wallName: WALL_NAMES[windowConfig.position]
      } : null,
      hasConflict,
      description
    };
  }, [doorConfig, windowConfig, hasConflict, getDoorWindowDescription]);

  // Validation message
  const getValidationMessage = useCallback(() => {
    if (hasConflict) {
      return 'Kapı ve pencere aynı duvarda olamaz. Lütfen farklı duvarları seçin.';
    }
    return '';
  }, [hasConflict]);

  // Get available positions for window (excluding door position if door exists)
  const getAvailableWindowPositions = useCallback(() => {
    if (!doorConfig.hasDoor) {
      return Object.entries(WALL_NAMES).map(([key, name]) => ({ key, name }));
    }
    
    return Object.entries(WALL_NAMES)
      .filter(([key]) => key !== doorConfig.position)
      .map(([key, name]) => ({ key, name }));
  }, [doorConfig]);

  // Get available positions for door (excluding window position if window exists)
  const getAvailableDoorPositions = useCallback(() => {
    if (!windowConfig.hasWindow) {
      return Object.entries(WALL_NAMES).map(([key, name]) => ({ key, name }));
    }
    
    return Object.entries(WALL_NAMES)
      .filter(([key]) => key !== windowConfig.position)
      .map(([key, name]) => ({ key, name }));
  }, [windowConfig]);

  return {
    // State
    doorConfig,
    windowConfig,
    
    // Actions
    handleDoorToggle,
    handleDoorPositionChange,
    handleWindowToggle,
    handleWindowPositionChange,
    clearConfiguration,
    
    // Computed
    hasConflict,
    getConfiguration,
    getDoorWindowDescription,
    getValidationMessage,
    getAvailableWindowPositions,
    getAvailableDoorPositions,
    
    // Constants
    WALL_POSITIONS,
    WALL_NAMES
  };
};
