import React, { memo } from 'react';

/**
 * Button Component - Optimized with React.memo
 * Prevents unnecessary re-renders when props haven't changed
 */
const Button = memo(({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: disabled 
      ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transform shadow-lg focus:ring-purple-500",
    secondary: disabled 
      ? "border border-gray-700 text-gray-500 cursor-not-allowed" 
      : "border border-gray-600 text-white hover:bg-gray-800 focus:ring-gray-500",
    ghost: disabled 
      ? "text-gray-600 cursor-not-allowed" 
      : "text-gray-400 hover:text-white hover:bg-gray-800"
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-8 py-4 text-lg",
    large: "px-12 py-5 text-xl"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button 
      className={classes} 
      onClick={disabled ? undefined : onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
