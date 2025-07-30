import React from 'react';
import { Button } from '../common';

/**
 * ProfileHeader - Profile page header with edit functionality
 * Displays profile title and edit button
 * 
 * @param {Function} onEdit - Callback function to enable edit mode
 * @param {boolean} isEditing - Current editing state
 */
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

export default ProfileHeader;
