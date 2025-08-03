/**
 * Messages Constants - User-facing messages and text content
 * All user messages, errors, and text content centralized
 */
export class MessagesConstants {
  // Success Messages
  static SUCCESS = {
    LOGIN: 'Başarıyla giriş yaptınız!',
    REGISTER: 'Hesabınız başarıyla oluşturuldu!',
    LOGOUT: 'Başarıyla çıkış yaptınız!',
    PROFILE_UPDATED: 'Profil başarıyla güncellendi!',
    DESIGN_CREATED: 'Tasarım başarıyla oluşturuldu!',
    DESIGN_SAVED: 'Tasarım başarıyla kaydedildi!',
    FAVORITE_ADDED: 'Favorilere eklendi!',
    FAVORITE_REMOVED: 'Favorilerden çıkarıldı!',
    FILE_UPLOADED: 'Dosya başarıyla yüklendi!',
    COPIED_TO_CLIPBOARD: 'Panoya kopyalandı!'
  };

  // Error Messages
  static ERRORS = {
    // Authentication
    INVALID_CREDENTIALS: 'E-posta veya şifre hatalı!',
    USER_NOT_FOUND: 'Kullanıcı bulunamadı!',
    EMAIL_ALREADY_EXISTS: 'Bu e-posta adresi zaten kullanılıyor!',
    WEAK_PASSWORD: 'Şifre en az 8 karakter olmalı!',
    INVALID_EMAIL: 'Geçerli bir e-posta adresi girin!',
    
    // Network
    NETWORK_ERROR: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
    SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    TIMEOUT_ERROR: 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.',
    
    // Validation
    REQUIRED_FIELD: 'Bu alan zorunludur!',
    INVALID_DIMENSIONS: 'Oda boyutları geçersiz!',
    INVALID_FILE_TYPE: 'Desteklenmeyen dosya türü!',
    FILE_TOO_LARGE: 'Dosya boyutu çok büyük!',
    
    // Design
    DESIGN_GENERATION_FAILED: 'Tasarım oluşturulamadı. Lütfen tekrar deneyin.',
    DESIGN_NOT_FOUND: 'Tasarım bulunamadı!',
    DESIGN_LOAD_FAILED: 'Tasarım yüklenemedi!',
    
    // General
    UNEXPECTED_ERROR: 'Beklenmeyen bir hata oluştu!',
    ACCESS_DENIED: 'Bu işlem için yetkiniz yok!',
    PAGE_NOT_FOUND: 'Sayfa bulunamadı!'
  };

  // Warning Messages
  static WARNINGS = {
    UNSAVED_CHANGES: 'Kaydedilmemiş değişiklikler var. Sayfadan çıkmak istediğinizden emin misiniz?',
    DELETE_CONFIRMATION: 'Bu işlem geri alınamaz. Silmek istediğinizden emin misiniz?',
    LOGOUT_CONFIRMATION: 'Çıkış yapmak istediğinizden emin misiniz?',
    CLEAR_FORM: 'Form temizlenecek. Devam etmek istediğinizden emin misiniz?',
    OVERWRITE_DATA: 'Mevcut veriler üzerine yazılacak. Devam etmek istiyor musunuz?',
    ROOM_TOO_SMALL: 'Oda çok küçük görünüyor. Gerçekçi mi?',
    ROOM_TOO_LARGE: 'Oda çok büyük görünüyor. Gerçekçi mi?',
    LOW_CEILING: 'Tavan yüksekliği çok düşük görünüyor.',
    HIGH_CEILING: 'Tavan yüksekliği çok yüksek görünüyor.'
  };

  // Info Messages
  static INFO = {
    LOADING: 'Yükleniyor...',
    PROCESSING: 'İşleniyor...',
    GENERATING_DESIGN: 'Tasarım oluşturuluyor...',
    SAVING: 'Kaydediliyor...',
    UPLOADING: 'Yükleniyor...',
    CONNECTING: 'Bağlanıyor...',
    RECONNECTING: 'Yeniden bağlanıyor...',
    NO_DATA: 'Gösterilecek veri yok.',
    NO_RESULTS: 'Sonuç bulunamadı.',
    EMPTY_LIST: 'Liste boş.',
    COMING_SOON: 'Yakında...'
  };

  // Placeholders
  static PLACEHOLDERS = {
    EMAIL: 'E-posta adresinizi girin',
    PASSWORD: 'Şifrenizi girin',
    FIRST_NAME: 'Adınızı girin',
    LAST_NAME: 'Soyadınızı girin',
    BIO: 'Kendinizden bahsedin...',
    SEARCH: 'Arama yapın...',
    NOTES: 'Notlarınızı yazın...',
    ROOM_NAME: 'Oda adını girin'
  };

  // Button Labels
  static BUTTONS = {
    LOGIN: 'Giriş Yap',
    REGISTER: 'Kayıt Ol',
    LOGOUT: 'Çıkış Yap',
    SAVE: 'Kaydet',
    CANCEL: 'İptal',
    DELETE: 'Sil',
    EDIT: 'Düzenle',
    ADD: 'Ekle',
    REMOVE: 'Çıkar',
    UPLOAD: 'Yükle',
    DOWNLOAD: 'İndir',
    COPY: 'Kopyala',
    SHARE: 'Paylaş',
    BACK: 'Geri',
    NEXT: 'İleri',
    FINISH: 'Bitir',
    SUBMIT: 'Gönder',
    RESET: 'Sıfırla',
    CLEAR: 'Temizle',
    SEARCH: 'Ara',
    FILTER: 'Filtrele',
    SORT: 'Sırala',
    REFRESH: 'Yenile',
    RETRY: 'Tekrar Dene'
  };

  // Navigation
  static NAVIGATION = {
    HOME: 'Ana Sayfa',
    DESIGN_STUDIO: 'Tasarım Stüdyosu',
    FAVORITES: 'Favoriler',
    PROFILE: 'Profil',
    SETTINGS: 'Ayarlar',
    HELP: 'Yardım',
    ABOUT: 'Hakkında',
    CONTACT: 'İletişim',
    PRIVACY: 'Gizlilik',
    TERMS: 'Kullanım Şartları'
  };

  // Status Labels
  static STATUS = {
    ACTIVE: 'Aktif',
    INACTIVE: 'Pasif',
    PENDING: 'Beklemede',
    COMPLETED: 'Tamamlandı',
    FAILED: 'Başarısız',
    CANCELLED: 'İptal Edildi',
    IN_PROGRESS: 'Devam Ediyor',
    DRAFT: 'Taslak',
    PUBLISHED: 'Yayınlandı'
  };

  // Helper method to get nested message
  static getMessage(category, key) {
    return MessagesConstants[category]?.[key] || `Missing message: ${category}.${key}`;
  }
}

export default MessagesConstants;
