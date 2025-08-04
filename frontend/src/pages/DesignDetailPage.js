import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import DesignDetailHeader from '../components/design/DesignDetailHeader';
import DesignDetailContent from '../components/design/DesignDetailContent';
import PageFeedback from '../components/design/PageFeedback';
import { designService, blogService } from '../services';

const DesignDetailPage = () => {
  const { designId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDesignDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await designService.getDesignDetails(designId);
      setDesign(data);
      
      // Note: View recording functionality has been removed from blogService
      // This feature is no longer needed for the current implementation
      
    } catch (error) {
      console.error('Error fetching design details:', error);
      setError(error.message || 'Tasarım detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [designId]);

  // Load design details when component mounts or designId changes
  useEffect(() => {
    if (designId) {
      fetchDesignDetails();
    }
  }, [designId, fetchDesignDetails]);

  const handleRetry = () => {
    fetchDesignDetails();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PageFeedback 
          loading={loading}
          error={error}
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />

        {!loading && !error && design && (
          <>
            <DesignDetailHeader design={design} isAuthenticated={isAuthenticated} />
            <DesignDetailContent design={design} />
          </>
        )}

        {!loading && !design && !error && (
           <div className="text-center py-12">
             <h1 className="text-2xl font-bold text-gray-400">Tasarım bulunamadı</h1>
           </div>
        )}
      </div>
    </div>
  );
};

export default DesignDetailPage;