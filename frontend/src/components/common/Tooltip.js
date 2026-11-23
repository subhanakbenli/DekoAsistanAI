import React from 'react';

/**
 * Tooltip component - shows an informative message on hover
 * @param {React.ReactNode} children - Tooltip tetikleyici element
 * @param {string} text - Tooltip text to display
 */
const Tooltip = ({ children, text }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
    </div>
  </div>
);

export default Tooltip;
