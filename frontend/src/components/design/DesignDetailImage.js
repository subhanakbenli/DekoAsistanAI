import React from 'react';

const DesignDetailImage = ({ design }) => {
  if (!design.image || !design.image.has_image) {
    return (
      <div className="h-64 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-red-400 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p>Tasarım görseli bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
      <img 
        src={`http://localhost:8000${design.image.image_url}`}
        alt={design.design_title || design.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          const fallback = e.target.nextSibling;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex flex-wrap gap-2">
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
  );
};

export default DesignDetailImage;
