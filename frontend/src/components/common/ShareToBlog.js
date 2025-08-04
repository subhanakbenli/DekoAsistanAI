import React, { memo, useState, useEffect } from 'react';
import { useShareToBlog } from '../../hooks/useShareToBlog';

/**
 * Share To Blog Component
 * Allows users to publish their designs to blog with success/error feedback
 * Features loading states, confirmation dialog, and toast notifications
 */
const ShareToBlog = memo(({ 
  designData, 
  designId, 
  className = '',
  onPublishSuccess,
  onPublishError,
  variant = 'button' // 'button' | 'card'
}) => {
  const {
    isPublishing,
    publishError,
    publishSuccess,
    publishedPost,
    publishToBlog,
    checkPublishStatus,
    clearPublishState,
    getPublishStatusMessage,
    canPublish
  } = useShareToBlog();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAlreadyPublished, setIsAlreadyPublished] = useState(false);
  const [checkingPublishStatus, setCheckingPublishStatus] = useState(false);

  // Check if design is already published on mount
  useEffect(() => {
    if (designId) {
      setCheckingPublishStatus(true);
      checkPublishStatus(designId)
        .then(result => setIsAlreadyPublished(result?.is_published || false))
        .catch(error => {
          // Silently handle errors during publish status check
          console.warn('Could not check publish status:', error);
          setIsAlreadyPublished(false);
        })
        .finally(() => setCheckingPublishStatus(false));
    }
  }, [designId, checkPublishStatus]);

  // Handle publish success/error callbacks
  useEffect(() => {
    if (publishSuccess && publishedPost) {
      onPublishSuccess?.(publishedPost);
      setIsAlreadyPublished(true);
    }
  }, [publishSuccess, publishedPost, onPublishSuccess]);

  useEffect(() => {
    if (publishError) {
      onPublishError?.(publishError);
    }
  }, [publishError, onPublishError]);

  const handlePublishClick = () => {
    if (!designData || !designId) {
      console.error('Design data and ID are required for publishing');
      return;
    }

    if (isAlreadyPublished) {
      // Already published, maybe show blog post
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmPublish = async () => {
    setShowConfirmDialog(false);
    
    const success = await publishToBlog(designId, {
      allowComments: true,
      isPublic: true
    });

    if (success) {
      // Success feedback will be handled by useEffect
    }
  };

  const handleCancelPublish = () => {
    setShowConfirmDialog(false);
  };

  const handleClearState = () => {
    clearPublishState();
  };

  // Don't render if no design data
  if (!designData || !designId) {
    return null;
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">📝</span>
          <div className="flex-1">
            <h4 className="font-medium text-purple-300 mb-2">Blog'da Paylaş</h4>
            <p className="text-sm text-gray-400 mb-3">
              Bu tasarımı blog'da paylaşarak diğer kullanıcılarla ilham verin.
            </p>
            
            {checkingPublishStatus ? (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Durum kontrol ediliyor...
              </div>
            ) : (
              <ShareButton
                isAlreadyPublished={isAlreadyPublished}
                isPublishing={isPublishing}
                canPublish={canPublish}
                onPublishClick={handlePublishClick}
                size="sm"
              />
            )}
            
            <StatusMessage
              publishSuccess={publishSuccess}
              publishError={publishError}
              getPublishStatusMessage={getPublishStatusMessage}
              onClearState={handleClearState}
            />
          </div>
        </div>
        
        <ConfirmDialog
          show={showConfirmDialog}
          onConfirm={handleConfirmPublish}
          onCancel={handleCancelPublish}
          designData={designData}
        />
      </div>
    );
  }

  // Button variant (default)
  return (
    <div className={`space-y-3 ${className}`}>
      {checkingPublishStatus ? (
        <button
          disabled
          className="w-full bg-gray-600 text-gray-400 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed transition-all"
        >
          <span className="animate-spin">⏳</span>
          Durum Kontrol Ediliyor...
        </button>
      ) : (
        <ShareButton
          isAlreadyPublished={isAlreadyPublished}
          isPublishing={isPublishing}
          canPublish={canPublish}
          onPublishClick={handlePublishClick}
        />
      )}
      
      <StatusMessage
        publishSuccess={publishSuccess}
        publishError={publishError}
        getPublishStatusMessage={getPublishStatusMessage}
        onClearState={handleClearState}
      />
      
      <ConfirmDialog
        show={showConfirmDialog}
        onConfirm={handleConfirmPublish}
        onCancel={handleCancelPublish}
        designData={designData}
      />
    </div>
  );
});

/**
 * Share Button Component
 */
const ShareButton = memo(({ isAlreadyPublished, isPublishing, canPublish, onPublishClick, size = 'default' }) => {
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    default: 'py-2 px-4 text-base'
  };

  if (isAlreadyPublished) {
    return (
      <button
        disabled
        className={`w-full bg-green-600/20 border border-green-500/30 text-green-300 ${sizeClasses[size]} rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed transition-all`}
      >
        <span>✅</span>
        Blog'da Paylaşıldı
      </button>
    );
  }

  if (isPublishing) {
    return (
      <button
        disabled
        className={`w-full bg-purple-600/20 border border-purple-500/30 text-purple-300 ${sizeClasses[size]} rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed transition-all`}
      >
        <span className="animate-spin">⏳</span>
        Paylaşılıyor...
      </button>
    );
  }

  return (
    <button
      onClick={onPublishClick}
      disabled={!canPublish}
      className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ${sizeClasses[size]} rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span>📝</span>
      Blog'da Paylaş
    </button>
  );
});

/**
 * Status Message Component
 */
const StatusMessage = memo(({ publishSuccess, publishError, getPublishStatusMessage, onClearState }) => {
  if (!publishSuccess && !publishError) return null;

  return (
    <div className={`p-3 rounded-lg border ${
      publishSuccess 
        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
        : 'bg-red-500/10 border-red-500/30 text-red-400'
    }`}>
      <div className="flex items-center justify-between">
        <p className="text-sm flex items-center gap-2">
          <span>{publishSuccess ? '✅' : '❌'}</span>
          {getPublishStatusMessage}
        </p>
        {onClearState && (
          <button
            onClick={onClearState}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * Confirmation Dialog Component
 */
const ConfirmDialog = memo(({ show, onConfirm, onCancel, designData }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <div className="text-center mb-4">
          <span className="text-4xl block mb-2">📝</span>
          <h3 className="text-lg font-semibold text-white mb-2">
            Blog'da Paylaş
          </h3>
          <p className="text-sm text-gray-400">
            Bu tasarımı blog'da paylaşmak istediğinizden emin misiniz?
          </p>
        </div>

        {/* Design Preview */}
        <div className="bg-gray-700/50 rounded-lg p-3 mb-4 text-sm">
          <div className="text-gray-300 space-y-1">
            <div><strong>Oda:</strong> {designData.roomType}</div>
            <div><strong>Tarz:</strong> {designData.designStyle}</div>
            <div><strong>Boyut:</strong> {designData.width}×{designData.length}×{designData.height}cm</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ❌ İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
          >
            ✅ Paylaş
          </button>
        </div>
      </div>
    </div>
  );
});

ShareToBlog.displayName = 'ShareToBlog';
ShareButton.displayName = 'ShareButton';
StatusMessage.displayName = 'StatusMessage';
ConfirmDialog.displayName = 'ConfirmDialog';

export default ShareToBlog;
