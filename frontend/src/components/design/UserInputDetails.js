import React from 'react';

/**
 * UserInputDetails - Kullanıcının girdiği notları ve ek bilgileri gösterir
 */
const UserInputDetails = ({ design }) => {
  if (!design.notes && !design.width && !design.length && !design.height) {
    return null; // Hiçbir kullanıcı girdisi yoksa gösterme
  }

  return (
    <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-2 rounded-lg">
          <span className="text-lg">📝</span>
        </div>
        <h4 className="text-lg font-semibold text-yellow-300">Kullanıcı Girdileri</h4>
      </div>

      <div className="space-y-4">
        {/* Kullanıcı Notları */}
        {design.notes && (
          <div className="bg-yellow-950/30 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg flex-shrink-0 mt-0.5">
                <span className="text-sm">💭</span>
              </div>
              <div className="flex-1">
                <p className="text-yellow-300 text-sm font-medium mb-2">Verilen Notlar</p>
                <p className="text-white leading-relaxed">{design.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Oda Boyutları */}
        {(design.width || design.length || design.height) && (
          <div className="bg-amber-950/30 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <span className="text-sm">📐</span>
              </div>
              <p className="text-amber-300 text-sm font-medium">Belirtilen Oda Boyutları</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {design.width && (
                <div className="text-center">
                  <p className="text-amber-200 text-xs">Genişlik</p>
                  <p className="text-white font-semibold">{design.width} m</p>
                </div>
              )}
              {design.length && (
                <div className="text-center">
                  <p className="text-amber-200 text-xs">Uzunluk</p>
                  <p className="text-white font-semibold">{design.length} m</p>
                </div>
              )}
              {design.height && (
                <div className="text-center">
                  <p className="text-amber-200 text-xs">Yükseklik</p>
                  <p className="text-white font-semibold">{design.height} m</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInputDetails;
