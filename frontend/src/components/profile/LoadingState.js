import React from 'react';
import Navbar from '../Navbar';

/**
 * LoadingState - Profile page loading state component
 * Shows loading indicator while user data is being fetched
 */
const LoadingState = () => (
  <div className="min-h-screen bg-gray-900 text-white">
    <Navbar />
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-6">
          <span className="text-2xl">⏳</span>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Yükleniyor...
        </h2>
        <p className="text-gray-400">Kullanıcı bilgileri alınıyor</p>
      </div>
    </div>
  </div>
);

export default LoadingState;
