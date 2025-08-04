import React, { useState, useCallback } from 'react';
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
      
      // Record view if design is published to blog
      // Don't let this fail the main operation
      try {
        await blogService.recordDesignDetailView(designId);
      } catch (viewError) {
        // Silently log view recording errors without affecting the main flow
        console.warn('Could not record design view:', viewError.message);
      }
      
    } catch (error) {
      console.error('Error fetching design details:', error);
      setError(error.message || 'Tasarım detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [designId]);

  // useEffect removed - design details won't load automatically
  // Users need to manually trigger loading if needed

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