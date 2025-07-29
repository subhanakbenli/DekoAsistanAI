import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from './Toast';

const FavoriteButton = ({ 
  designId, 
  size = 'md',
  variant = 'button',
  className = '',
  showTooltip = true,
  onToggle = null 
}) => {
  const { isAuthenticated } = useAuth();
  const { isDesignFavorited, toggleDesignFavorite } = useFavorites();
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  const isFavorited = isDesignFavorited(designId);

  const handleClick = async () => {
    if (!isAuthenticated) {
      if (showTooltip) {
        setShowLoginTooltip(true);
        setTimeout(() => setShowLoginTooltip(false), 3000);
      }
      return;
    }

    try {
      setIsProcessing(true);
      const result = await toggleDesignFavorite(designId);
      
      // Show success toast
      showSuccess(result.message);
      
      if (onToggle) {
        onToggle(isFavorited, result);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showError(error.message || 'Bir hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Heart icon component
  const HeartIcon = ({ filled, className: iconClassName = '' }) => (
    <svg
      className={iconClassName}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  if (variant === 'icon') {
    // Simple icon variant
    return (
      <div className="relative inline-block">
        <button
          onClick={handleClick}
          disabled={isProcessing}
          className={`
            relative
            ${sizeClasses[size]}
            ${isAuthenticated && isFavorited 
              ? 'text-red-500 hover:text-red-600' 
              : isAuthenticated 
                ? 'text-gray-400 hover:text-red-500' 
                : 'text-gray-300 hover:text-gray-400'
            }
            transition-all duration-200 ease-in-out
            ${isProcessing ? 'animate-pulse' : ''}
            ${className}
          `}
          title={
            !isAuthenticated 
              ? 'Favorilere eklemek için giriş yapın'
              : isFavorited 
                ? 'Favorilerden çıkar'
                : 'Favorilere ekle'
          }
        >
          {isProcessing ? (
            <div className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
          ) : (
            <HeartIcon filled={isAuthenticated && isFavorited} className={iconSizes[size]} />
          )}
        </button>

        {/* Login tooltip */}
        {showLoginTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
            Giriş yapın
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        )}
      </div>
    );
  }

  // Full button variant
  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={`
          flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out
          ${isAuthenticated && isFavorited
            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            : isAuthenticated
              ? 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
          }
          ${isProcessing ? 'animate-pulse cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        title={
          !isAuthenticated 
            ? 'Favorilere eklemek için giriş yapın'
            : isFavorited 
              ? 'Favorilerden çıkar'
              : 'Favorilere ekle'
        }
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>İşleniyor...</span>
          </>
        ) : (
          <>
            <HeartIcon 
              filled={isAuthenticated && isFavorited} 
              className="w-4 h-4" 
            />
            <span>
              {!isAuthenticated 
                ? 'Favorilere Ekle'
                : isFavorited 
                  ? 'Favorilerde'
                  : 'Favorilere Ekle'
              }
            </span>
          </>
        )}
      </button>

      {/* Login tooltip */}
      {showLoginTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
          Favorilere eklemek için giriş yapın
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;
