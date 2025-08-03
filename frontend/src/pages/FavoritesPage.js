import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { 
  FavoritesHeaderSection, 
  FavoritesContentSection
} from '../components/favoritesPage';
import Navbar from '../components/Navbar';

/**
 * FavoritesPage - User favorites display page
 * Following project schema: Single page component with imported components
 * Architecture: Direct component usage like other pages (HomePage, BlogPage)
 */
const FavoritesPage = memo(() => {
  // Authentication context
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Favorites management
  const {
    favoriteDesigns,
    loading,
    error,
    removeDesignFromFavorites,
    fetchAllFavorites
  } = useFavorites();

  // Local state - Tab artık gerekli değil
  const [removing, setRemoving] = useState(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Don't redirect immediately, show login prompt instead
    }
  }, [isAuthenticated]);

  // Handle design removal
  const handleRemoveDesign = async (designId) => {
    try {
      setRemoving(designId);
      await removeDesignFromFavorites(designId);
    } catch (error) {
      console.error('Error removing design from favorites:', error);
    } finally {
      setRemoving(null);
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchAllFavorites();
  };

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Giriş Gerekli
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Favorilerinizi görüntülemek için giriş yapmanız gerekiyor
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                       text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 
                       transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-16">
        
        {/* Favorites Header Section */}
        <FavoritesHeaderSection 
          totalDesigns={favoriteDesigns.length}
          totalProducts={0}
        />

        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-8">
          
          {/* Main Content Section - Tab artık gerekli değil */}
          <FavoritesContentSection
            loading={loading}
            error={error}
            activeTab="designs"
            favoriteDesigns={favoriteDesigns}
            favoriteProducts={[]}
            onRemoveDesign={handleRemoveDesign}
            onRemoveProduct={() => {}}
            removing={removing}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
});

FavoritesPage.displayName = 'FavoritesPage';

export default FavoritesPage;