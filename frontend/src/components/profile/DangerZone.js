import React from 'react';
import { Card, Button } from '../common';

/**
 * DangerZone - Dangerous profile operations component
 * Contains potentially destructive actions like password change and account deletion
 * 
 * Future enhancement: Add actual functionality for password change and account deletion
 */
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

export default DangerZone;
