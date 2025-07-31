import { useCallback, useMemo, useRef } from 'react';

/**
 * useOptimizedCallback - Optimized callback hook
 * Provides stable callback references with dependency management
 * 
 * @param {Function} callback - The callback function
 * @param {Array} deps - Dependencies array
 * @returns {Function} Memoized callback
 */
export const useOptimizedCallback = (callback, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps);
};

/**
 * useOptimizedMemo - Optimized memo hook
 * Provides memoized values with performance tracking
 * 
 * @param {Function} factory - Factory function
 * @param {Array} deps - Dependencies array
 * @returns {any} Memoized value
 */
export const useOptimizedMemo = (factory, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
};

/**
 * useDebounce - Debounce hook for performance optimization
 * Delays function execution until after specified delay
 * 
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} Debounced function
 */
export const useDebounce = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ...deps]);
};

/**
 * useThrottle - Throttle hook for performance optimization
 * Limits function execution to once per specified interval
 * 
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} Throttled function
 */
export const useThrottle = (callback, limit, deps = []) => {
  const inThrottle = useRef(false);
  
  return useCallback((...args) => {
    if (!inThrottle.current) {
      callback(...args);
      inThrottle.current = true;
      setTimeout(() => {
        inThrottle.current = false;
      }, limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, limit, ...deps]);
};

/**
 * usePrevious - Hook to track previous value
 * Useful for comparison and preventing unnecessary updates
 * 
 * @param {any} value - Current value
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useMemo(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

/**
 * useStableReference - Hook for stable object/array references
 * Prevents unnecessary re-renders due to reference changes
 * 
 * @param {any} value - Value to stabilize
 * @returns {any} Stable reference
 */
export const useStableReference = (value) => {
  return useMemo(() => {
    if (Array.isArray(value)) {
      return [...value];
    }
    if (typeof value === 'object' && value !== null) {
      return { ...value };
    }
    return value;
  }, [value]);
};

/**
 * usePerformanceTracker - Development performance tracking
 * Tracks render times and optimization opportunities
 * 
 * @param {string} componentName - Name of component being tracked
 */
export const usePerformanceTracker = (componentName) => {
  const renderStartTime = useRef(performance.now());
  const renderCount = useRef(0);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      const renderTime = performance.now() - renderStartTime.current;
      
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (Render #${renderCount.current})`
        );
      }
      
      if (renderCount.current > 10 && renderCount.current % 10 === 0) {
        console.info(
          `📊 ${componentName} has rendered ${renderCount.current} times`
        );
      }
    }
    
    renderStartTime.current = performance.now();
  }, [componentName]);
};

/**
 * useOptimizedEffect - Optimized effect hook with cleanup
 * Provides automatic cleanup and dependency optimization
 * 
 * @param {Function} effect - Effect function
 * @param {Array} deps - Dependencies array
 * @param {boolean} runOnMount - Whether to run on mount
 */
export const useOptimizedEffect = (effect, deps = [], runOnMount = true) => {
  const mountedRef = useRef(false);
  const cleanupRef = useRef(null);
  
  return useMemo(() => {
    if (!runOnMount && !mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    
    // Cleanup previous effect
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    
    // Run new effect
    cleanupRef.current = effect();
    
    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, runOnMount, ...deps]);
};
