import React from 'react';
import { Card } from '../common';
import ProfileAvatar from './ProfileAvatar';
import ProfileStats from './ProfileStats';

/**
 * ProfileInfoCard - User information display card
 * Combines avatar, stats, and membership info in a unified card
 * 
 * @param {Object} user - User object containing profile information
 * @param {string} user.created_at - User's registration date
 */
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

export default ProfileInfoCard;
