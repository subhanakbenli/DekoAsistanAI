import React from 'react';
import { Card, Button, FormField } from '../common';

/**
 * ProfileForm - Profile editing form component
 * Handles both display and edit modes for user profile information
 * 
 * @param {Object} user - Current user object
 * @param {Object} formData - Form data state
 * @param {boolean} isEditing - Current editing state
 * @param {boolean} loading - Loading state for form submission
 * @param {Function} onInputChange - Input change handler
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} onCancel - Cancel editing handler
 */
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

export default ProfileForm;
