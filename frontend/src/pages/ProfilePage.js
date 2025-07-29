import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';
import { Card, Button, FormField } from '../components/common';

// Profile Header Component
const ProfileHeader = ({ onEdit, isEditing }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
        <span className="text-lg">👤</span>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Profilim
        </h1>
        <p className="text-xs text-gray-400">Hesap bilgilerinizi yönetin</p>
      </div>
    </div>
    {!isEditing && (
      <Button onClick={onEdit} size="small">
        ✏️ Düzenle
      </Button>
    )}
  </div>
);

// Message Component
const Message = ({ message }) => {
  if (!message.text) return null;
  
  return (
    <div className={`mb-6 p-4 rounded-xl border ${
      message.type === 'success' 
        ? 'bg-green-900/50 border-green-700 text-green-300' 
        : 'bg-red-900/50 border-red-700 text-red-300'
    }`}>
      <div className="flex items-center space-x-2">
        <span>{message.type === 'success' ? '✅' : '❌'}</span>
        <span>{message.text}</span>
      </div>
    </div>
  );
};

// Profile Avatar Component
const ProfileAvatar = ({ user }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
      <span className="text-4xl">
        {user.first_name ? user.first_name.charAt(0).toUpperCase() : '👤'}
      </span>
    </div>
    
    <h2 className="text-xl font-bold text-white mb-2">
      {user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`
        : 'İsimsiz Kullanıcı'
      }
    </h2>
    
    <p className="text-gray-400 mb-4">{user.email}</p>
  </div>
);

// Profile Stats Component
const ProfileStats = () => (
  <div className="grid grid-cols-2 gap-4 mt-6">
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="text-2xl font-bold text-purple-400">0</div>
      <div className="text-xs text-gray-400">Tasarımlar</div>
    </div>
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="text-2xl font-bold text-blue-400">0</div>
      <div className="text-xs text-gray-400">Favoriler</div>
    </div>
  </div>
);

// Profile Info Card Component
const ProfileInfoCard = ({ user }) => (
  <Card className="p-6">
    <ProfileAvatar user={user} />
    <ProfileStats />
    
    <div className="mt-6 pt-4 border-t border-gray-700">
      <p className="text-xs text-gray-500">
        📅 Üyelik: {new Date(user.created_at || Date.now()).toLocaleDateString('tr-TR')}
      </p>
    </div>
  </Card>
);

// Profile Form Component
const ProfileForm = ({ 
  user, 
  formData, 
  isEditing, 
  loading, 
  onInputChange, 
  onSubmit, 
  onCancel 
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-white">
        {isEditing ? '✏️ Profili Düzenle' : '📋 Profil Bilgileri'}
      </h3>
      {isEditing && (
        <div className="flex space-x-2">
          <Button onClick={onCancel} variant="secondary" size="small">
            İptal
          </Button>
          <Button onClick={onSubmit} size="small" disabled={loading}>
            {loading ? '💾 Kaydediliyor...' : '💾 Kaydet'}
          </Button>
        </div>
      )}
    </div>

    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Ad"
          name="first_name"
          value={isEditing ? formData.first_name : (user.first_name || 'Belirtilmemiş')}
          onChange={onInputChange}
          placeholder="Adınızı girin"
          readOnly={!isEditing}
        />
        
        <FormField
          label="Soyad"
          name="last_name"
          value={isEditing ? formData.last_name : (user.last_name || 'Belirtilmemiş')}
          onChange={onInputChange}
          placeholder="Soyadınızı girin"
          readOnly={!isEditing}
        />
        
        <div className="md:col-span-2">
          <FormField
            label="E-posta"
            value={`${user.email} (değiştirilemez)`}
            readOnly={true}
          />
        </div>
        
        <FormField
          label="Telefon"
          name="phone"
          type="tel"
          value={isEditing ? formData.phone : (user.phone || 'Belirtilmemiş')}
          onChange={onInputChange}
          placeholder="Telefon numaranızı girin"
          readOnly={!isEditing}
        />
        
        <div></div>
        
        <div className="md:col-span-2">
          <FormField
            label="Hakkımda"
            name="bio"
            type="textarea"
            value={isEditing ? formData.bio : (user.bio || 'Henüz bir açıklama eklenmemiş.')}
            onChange={onInputChange}
            placeholder="Kendinizden bahsedin..."
            readOnly={!isEditing}
          />
        </div>
      </div>
    </form>
  </Card>
);

// Danger Zone Component
const DangerZone = () => (
  <Card variant="dark" className="mt-12 border-red-700/50 bg-red-900/20">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-red-300 mb-4">⚠️ Tehlikeli Bölge</h3>
      <p className="text-gray-400 mb-4">
        Bu işlemler geri alınamaz. Lütfen dikkatli olun.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" size="small" className="text-red-300 hover:bg-red-600/20">
          🔒 Şifre Değiştir
        </Button>
        <Button variant="ghost" size="small" className="text-red-300 hover:bg-red-600/20">
          🗑️ Hesabı Sil
        </Button>
      </div>
    </div>
  </Card>
);

// Loading Component
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

// Main ProfilePage Component
const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: ''
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
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
        phone: user.phone || '',
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
          <ProfileHeader onEdit={() => setIsEditing(true)} isEditing={isEditing} />
          <Message message={message} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProfileInfoCard user={user} />
            </div>

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

          <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
