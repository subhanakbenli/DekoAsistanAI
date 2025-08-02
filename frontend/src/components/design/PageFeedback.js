import React from 'react';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
);

const ErrorDisplay = ({ error, onRetry, onGoBack }) => (
  <div className="text-center py-12">
    <div className="text-red-500 text-6xl mb-4">❌</div>
    <h1 className="text-2xl font-bold text-red-400 mb-4">Hata Oluştu</h1>
    <p className="text-gray-400 mb-6">{error}</p>
    <div className="space-x-4">
      <button 
        onClick={onGoBack}
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Geri Dön
      </button>
      <button 
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  </div>
);

const PageFeedback = ({ loading, error, onRetry, onGoBack }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner />
        <p className="text-gray-400">Tasarım detayları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} onGoBack={onGoBack} />;
  }

  return null;
};

export default PageFeedback;
