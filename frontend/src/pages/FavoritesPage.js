import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    favoriteDesigns,
    favoriteProducts,
    loading,
    error,
    removeDesignFromFavorites,
    removeProductFromFavorites
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Giriş Gerekli</h2>
          <p className="text-gray-500 mb-6">Favorilerinizi görüntülemek için giriş yapın</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Favorilerim</h1>
            <p className="text-gray-600 mt-2">Beğendiğiniz tasarımlar ve ürünler</p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const DesignCard = ({ design }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {design.design_title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {design.room_type}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {design.design_style}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleRemoveDesign(design.design_id)}
            disabled={removing === design.design_id}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Favorilerden çıkar"
          >
            {removing === design.design_id ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Eklenme Tarihi: {new Date(design.created_at).toLocaleDateString('tr-TR')}
        </div>
        
        <button 
          onClick={() => navigate(`/design/${design.design_id}`)}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tasarımı Görüntüle
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.product_name}
            </h3>
            {product.product_category && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {product.product_category}
              </span>
            )}
          </div>
          <button
            onClick={() => handleRemoveProduct(product.id)}
            disabled={removing === product.id}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Favorilerden çıkar"
          >
            {removing === product.id ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {product.product_description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {product.product_description}
          </p>
        )}
        
        <div className="text-sm text-gray-600 mb-4">
          Eklenme Tarihi: {new Date(product.created_at).toLocaleDateString('tr-TR')}
        </div>
        
        {product.product_link && (
          <a
            href={product.product_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors inline-block text-center"
          >
            Ürünü Görüntüle
          </a>
        )}
      </div>
    </div>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">
        {type === 'designs' ? '🎨' : '🛍️'}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {type === 'designs' ? 'Henüz favori tasarımınız yok' : 'Henüz favori ürününüz yok'}
      </h3>
      <p className="text-gray-500 mb-6">
        {type === 'designs' 
          ? 'Beğendiğiniz tasarımları favorilere ekleyerek burada görüntüleyebilirsiniz'
          : 'Beğendiğiniz ürünleri favorilere ekleyerek burada görüntüleyebilirsiniz'
        }
      </p>
      <button
        onClick={() => navigate('/studio')}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        {type === 'designs' ? 'Tasarım Oluştur' : 'Tasarım Stüdyosuna Git'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Favorilerim</h1>
          <p className="text-gray-600 mt-2">Beğendiğiniz tasarımlar ve ürünler</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('designs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'designs'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tasarımlar ({favoriteDesigns.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ürünler ({favoriteProducts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Bir hata oluştu
                </h3>
                <div className="mt-2 text-sm text-red-700">
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
  );
};

export default FavoritesPage;
