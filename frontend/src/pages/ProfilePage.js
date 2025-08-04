import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services';
import Navbar from '../components/Navbar';
import {
  ProfileHeader,
  Message,
  ProfileInfoCard,
  ProfileForm,
  LoadingState
} from '../components/profile';

/**
 * ProfilePage - User profile management page
 * 
 * Provides comprehensive profile management including:
 * - Profile information display and editing
 * - User statistics
 * - Account management options
 * 
 * Refactored for better component organization and separation of concerns
 */
const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: ''
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Profil güncellenirken bir hata oluştu.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
    setMessage({ type: '', text: '' });
  };

  // Show loading state if no user
  if (!user) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <ProfileHeader onEdit={() => setIsEditing(true)} isEditing={isEditing} />
          
          {/* Message Display */}
          <Message message={message} />

          {/* Main Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile Info Card */}
            <div className="lg:col-span-1">
              <ProfileInfoCard user={user} />
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2">
              <ProfileForm
                user={user}
                formData={formData}
                isEditing={isEditing}
                loading={loading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
