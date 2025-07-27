import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection, FeaturesSection, Footer } from '../components/sections';

/**
 * HomePage - Landing page with navigation to design studio
 * Same as original landing page but with demo replaced by studio navigation
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      
      {/* Studio CTA Section - Replaces RoomDesignDemo */}
      <div id="demo" className="min-h-screen bg-gray-900 text-white p-8 font-sans flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-12 rounded-2xl border border-gray-700">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
                <span className="text-4xl">🏠</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                AI Tasarım Stüdyosu
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Yapay zeka destekli iç mekan tasarım aracımız ile hayalinizdeki mekanı yaratın. 
                Kişiselleştirilmiş öneriler, mood board'lar ve profesyonel çözümler için 
                tasarım stüdyomuzu deneyin.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold text-white mb-2">AI Önerileri</h3>
                <p className="text-sm text-gray-400">Akıllı mobilya ve dekor önerileri</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold text-white mb-2">Mood Board</h3>
                <p className="text-sm text-gray-400">AI ile oluşturulan görsel tasarımlar</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-white mb-2">Anlık Tasarım</h3>
                <p className="text-sm text-gray-400">Gerçek zamanlı tasarım değişiklikleri</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                to="/studio"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                         text-white font-bold text-lg px-12 py-4 rounded-xl transition-all duration-300 
                         transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🎨 Tasarım Stüdyosunu Başlat
              </Link>
            </div>
            
            <p className="text-sm text-gray-400 mt-4">
              Ücretsiz • AI destekli • Anında sonuç
            </p>
          </div>
        </div>
      </div>

      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
