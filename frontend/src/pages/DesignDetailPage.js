import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FavoriteButton from '../components/FavoriteButton';
import HashtagDisplay from '../components/HashtagDisplay';
import Navbar from '../components/Navbar';

const DesignDetailPage = () => {
  const { designId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesignDetails();
  }, [designId]);

  const fetchDesignDetails = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`http://localhost:8000/api/design/${designId}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tasarım bulunamadı');
        }
        throw new Error('Tasarım detayları yüklenirken hata oluştu');
      }

      const data = await response.json();
      console.log('DesignDetailPage - Received data:', data); // Debug
      setDesign(data);
    } catch (error) {
      console.error('Error fetching design details:', error);
      setError(error.message);
      // Toast yerine basit alert kullan
      console.error('Design fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Tasarım detayları yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">Hata Oluştu</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={() => navigate('/favorites')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Favorilere Dön
              </button>
              <button 
                onClick={() => navigate('/studio')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Yeni Tasarım Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-400">Tasarım bulunamadı</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <span className="mr-2">←</span>
            Geri Dön
          </button>
          
          {isAuthenticated && design.design_id && (
            <FavoriteButton 
              designId={design.design_id}
              variant="button"
              size="md"
            />
          )}
        </div>

        {/* Design Details */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          
          {/* Görsel Kısmı - En Üst */}
          {design.image && design.image.has_image ? (
            <div className="relative h-96 bg-gray-700">
              <img 
                src={`http://localhost:8000${design.image.image_url}`}
                alt={design.design_title || design.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              
              {/* Fallback placeholder */}
              <div className="absolute inset-0 hidden items-center justify-center bg-gray-700">
                <div className="text-center text-gray-400">
                  <div className="text-red-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Tasarım görseli yüklenemedi</p>
                </div>
              </div>
              
              {/* Overlay bilgileri */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex space-x-3">
                  <span className="bg-purple-600/80 backdrop-blur-sm text-purple-100 px-3 py-1 rounded-md text-sm font-medium">
                    {design.room_type}
                  </span>
                  <span className="bg-blue-600/80 backdrop-blur-sm text-blue-100 px-3 py-1 rounded-md text-sm font-medium">
                    {design.design_style}
                  </span>
                  {design.image.generation_time && (
                    <span className="bg-green-600/80 backdrop-blur-sm text-green-100 px-3 py-1 rounded-md text-sm font-medium">
                      {design.image.generation_time}s
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Görsel yoksa placeholder */
            <div className="h-64 bg-gray-700 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-red-400 mb-3">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Tasarım görseli bulunamadı</p>
                <div className="flex justify-center space-x-3 mt-4">
                  <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-md text-sm">
                    {design.room_type}
                  </span>
                  <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-md text-sm">
                    {design.design_style}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* İçerik Kısmı */}
          <div className="p-6 space-y-6">
          {/* Title */}
          <div className="border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-bold text-blue-300 mb-2">
              {design.design_title || design.title}
            </h1>
            <div className="flex text-sm text-gray-400 space-x-4">
              <span>📅 {new Date(design.created_at).toLocaleString('tr-TR')}</span>
            </div>
          </div>

          {/* Hashtags - En üstte */}
          {design.hashtags && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <HashtagDisplay 
                hashtags={design.hashtags} 
                showAll={true}
                copyEnabled={true}
              />
            </div>
          )}

          {/* Room Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Oda Bilgileri</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Oda Tipi:</span>
                  <p className="text-white font-medium">{design.room_type}</p>
                </div>
                <div>
                  <span className="text-gray-400">Tasarım Stili:</span>
                  <p className="text-white font-medium">{design.design_style}</p>
                </div>
              </div>
            </div>

            {design.notes && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Verilen Notlar</h3>
                <p className="text-white text-sm leading-relaxed">{design.notes}</p>
              </div>
            )}
          </div>

          {/* Design Description */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">📝 Tasarım Açıklaması</h3>
            <p className="text-gray-300 leading-relaxed">
              {design.design_description || design.description}
            </p>
          </div>

          {/* Product Suggestions */}
          {design.product_suggestion && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-3">🛍️ Ürün Önerileri</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {design.product_suggestion}
              </div>
            </div>
          )}

          {/* Products Array */}
          {design.products && design.products.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-3">🛒 Önerilen Ürünler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {design.products.map((product, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded border border-gray-600">
                    <h4 className="font-medium text-white mb-1">{product.name}</h4>
                    {product.description && (
                      <p className="text-sm text-gray-400 mb-2">{product.description}</p>
                    )}
                    {product.category && (
                      <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700">
            <button 
              onClick={() => navigate('/studio')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Benzer Tasarım Oluştur
            </button>
            
            <button 
              onClick={() => navigate('/favorites')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Favorilerime Dön
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetailPage;
