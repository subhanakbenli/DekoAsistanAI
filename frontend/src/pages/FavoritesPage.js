import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import HashtagDisplay from '../components/HashtagDisplay';
import Navbar from '../components/Navbar';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    favoriteDesigns,
    favoriteProducts,
    loading,
    error,
    removeDesignFromFavorites,
    removeProductFromFavorites,
    fetchAllFavorites
  } = useFavorites();

  const [activeTab, setActiveTab] = useState('designs'); // 'designs' or 'products'
  const [removing, setRemoving] = useState(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRemoveDesign = async (designId) => {
    try {
      setRemoving(designId);
      await removeDesignFromFavorites(designId);
    } catch (error) {
      console.error('Error removing design:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      setRemoving(productId);
      await removeProductFromFavorites(productId);
    } catch (error) {
      console.error('Error removing product:', error);
    } finally {
      setRemoving(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="pt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Compact Header Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <span className="text-lg">❤️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Favorilerim
                  </h1>
                  <p className="text-xs text-gray-400">Beğendiğiniz tasarımlar yükleniyor...</p>
                </div>
              </div>
            </div>
            
            {/* Loading Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const DesignCard = ({ design }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              {design.design_title}
            </h3>
            <div className="flex items-center space-x-3 text-sm">
              <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                {design.room_type}
              </span>
              <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                {design.design_style}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleRemoveDesign(design.design_id)}
            disabled={removing === design.design_id}
            className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
            title="Favorilerden çıkar"
          >
            {removing === design.design_id ? (
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="text-sm text-gray-400 mb-4 border-t border-gray-700 pt-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(design.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>

        {/* Hashtags - Kart altında */}
        {design.hashtags && (
          <div className="mb-4">
            <HashtagDisplay 
              hashtags={design.hashtags} 
              previewLimit={3}
              showAll={false}
              copyEnabled={false}
              className="text-xs"
            />
          </div>
        )}
        
        <button 
          onClick={() => navigate(`/design/${design.design_id}`)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                   text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 
                   transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Tasarımı Görüntüle
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-green-500 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              {product.product_name}
            </h3>
            {product.product_category && (
              <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
                {product.product_category}
              </span>
            )}
          </div>
          <button
            onClick={() => handleRemoveProduct(product.id)}
            disabled={removing === product.id}
            className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
            title="Favorilerden çıkar"
          >
            {removing === product.id ? (
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {product.product_description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {product.product_description}
          </p>
        )}
        
        <div className="text-sm text-gray-400 mb-6 border-t border-gray-700 pt-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(product.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>
        
        {product.product_link && (
          <a
            href={product.product_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                     text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 
                     transform hover:scale-105 shadow-lg hover:shadow-xl inline-block text-center"
          >
            Ürünü Görüntüle
          </a>
        )}
      </div>
    </div>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-6">
        <span className="text-2xl">
          {type === 'designs' ? '🎨' : '🛍️'}
        </span>
      </div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
        {type === 'designs' ? 'Henüz favori tasarımınız yok' : 'Henüz favori ürününüz yok'}
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
        {type === 'designs' 
          ? 'Beğendiğiniz tasarımları favorilere ekleyerek burada görüntüleyebilirsiniz.'
          : 'Beğendiğiniz ürünleri favorilere ekleyerek burada görüntüleyebilirsiniz.'
        }
      </p>
      <button
        onClick={() => navigate('/studio')}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 
                 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        {type === 'designs' ? '🎨 Tasarım Oluştur' : '🏠 Tasarım Stüdyosuna Git'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact Header Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <span className="text-lg">❤️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Favorilerim
                </h1>
                <p className="text-xs text-gray-400">Beğendiğiniz tasarımlar ve ürünler</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="hidden md:block">💡 Kişisel koleksiyonunuz</span>
              <span className="bg-gray-700 px-2 py-1 rounded">
                {favoriteDesigns.length + favoriteProducts.length} toplam
              </span>
            </div>
          </div>

          {/* Modern Tabs */}
          <div className="mb-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-2">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('designs')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === 'designs'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎨</span>
                    <span>Tasarımlar</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === 'designs' 
                        ? 'bg-white/20' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {favoriteDesigns.length}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🛍️</span>
                    <span>Ürünler</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === 'products' 
                        ? 'bg-white/20' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {favoriteProducts.length}
                    </span>
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">
                    Bir hata oluştu
                  </h3>
                  <div className="mt-2 text-sm text-red-400">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="min-h-96">
            {activeTab === 'designs' && (
              <>
                {favoriteDesigns.length === 0 ? (
                  <EmptyState type="designs" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteDesigns.map((design) => (
                      <DesignCard key={design.id} design={design} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'products' && (
              <>
                {favoriteProducts.length === 0 ? (
                  <EmptyState type="products" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
