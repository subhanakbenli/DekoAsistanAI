/**
 * Messages Constants - User-facing messages and text content
 * All user messages, errors, and text content centralized
 */
export class MessagesConstants {
  // Success Messages
  static SUCCESS = {
    LOGIN: 'Logged in successfully!',
    REGISTER: 'Your account was created successfully!',
    LOGOUT: 'Logged out successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    DESIGN_CREATED: 'Design created successfully!',
    DESIGN_SAVED: 'Design saved successfully!',
    FAVORITE_ADDED: 'Added to favorites!',
    FAVORITE_REMOVED: 'Removed from favorites!',
    FILE_UPLOADED: 'File uploaded successfully!',
    COPIED_TO_CLIPBOARD: 'Copied to clipboard!'
  };

  // Error Messages
  static ERRORS = {
    // Authentication
    INVALID_CREDENTIALS: 'Incorrect email or password!',
    USER_NOT_FOUND: 'User not found!',
    EMAIL_ALREADY_EXISTS: 'This email address is already in use!',
    WEAK_PASSWORD: 'Password must be at least 8 characters!',
    INVALID_EMAIL: 'Enter a valid email address!',
    
    // Network
    NETWORK_ERROR: 'Connection error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT_ERROR: 'The request timed out. Please try again.',
    
    // Validation
    REQUIRED_FIELD: 'This field is required!',
    INVALID_DIMENSIONS: 'Invalid room dimensions!',
    INVALID_FILE_TYPE: 'Unsupported file type!',
    FILE_TOO_LARGE: 'File is too large!',
    
    // Design
    DESIGN_GENERATION_FAILED: 'Design could not be created. Please try again.',
    DESIGN_NOT_FOUND: 'Design not found!',
    DESIGN_LOAD_FAILED: 'Design could not be loaded!',
    
    // General
    UNEXPECTED_ERROR: 'An unexpected error occurred!',
    ACCESS_DENIED: 'You are not authorized to perform this action!',
    PAGE_NOT_FOUND: 'Page not found!'
  };

  // Warning Messages
  static WARNINGS = {
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave this page?',
    DELETE_CONFIRMATION: 'This action cannot be undone. Are you sure you want to delete?',
    LOGOUT_CONFIRMATION: 'Are you sure you want to log out?',
    CLEAR_FORM: 'The form will be cleared. Are you sure you want to continue?',
    OVERWRITE_DATA: 'Existing data will be overwritten. Do you want to continue?',
    ROOM_TOO_SMALL: 'The room looks very small. Is that realistic?',
    ROOM_TOO_LARGE: 'The room looks very large. Is that realistic?',
    LOW_CEILING: 'The ceiling height looks very low.',
    HIGH_CEILING: 'The ceiling height looks very high.'
  };

  // Info Messages
  static INFO = {
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    GENERATING_DESIGN: 'Generating design...',
    SAVING: 'Saving...',
    UPLOADING: 'Uploading...',
    CONNECTING: 'Connecting...',
    RECONNECTING: 'Reconnecting...',
    NO_DATA: 'No data to display.',
    NO_RESULTS: 'No results found.',
    EMPTY_LIST: 'The list is empty.',
    COMING_SOON: 'Coming soon...'
  };

  // Placeholders
  static PLACEHOLDERS = {
    EMAIL: 'Enter your email address',
    PASSWORD: 'Enter your password',
    FIRST_NAME: 'Enter your first name',
    LAST_NAME: 'Enter your last name',
    BIO: 'Tell us about yourself...',
    SEARCH: 'Search...',
    NOTES: 'Write your notes...',
    ROOM_NAME: 'Enter a room name'
  };

  // Button Labels
  static BUTTONS = {
    LOGIN: 'Log In',
    REGISTER: 'Sign Up',
    LOGOUT: 'Log Out',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    ADD: 'Add',
    REMOVE: 'Remove',
    UPLOAD: 'Upload',
    DOWNLOAD: 'Download',
    COPY: 'Copy',
    SHARE: 'Share',
    BACK: 'Back',
    NEXT: 'Next',
    FINISH: 'Finish',
    SUBMIT: 'Submit',
    RESET: 'Reset',
    CLEAR: 'Clear',
    SEARCH: 'Search',
    FILTER: 'Filter',
    SORT: 'Sort',
    REFRESH: 'Refresh',
    RETRY: 'Try Again'
  };

  // Navigation
  static NAVIGATION = {
    HOME: 'Home',
    DESIGN_STUDIO: 'Design Studio',
    FAVORITES: 'Favorites',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
    HELP: 'Help',
    ABOUT: 'About',
    CONTACT: 'Contact',
    PRIVACY: 'Privacy',
    TERMS: 'Terms of Use'
  };

  // Status Labels
  static STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
    IN_PROGRESS: 'In Progress',
    DRAFT: 'Draft',
    PUBLISHED: 'Published'
  };

  // Helper method to get nested message
  static getMessage(category, key) {
    return MessagesConstants[category]?.[key] || `Missing message: ${category}.${key}`;
  }
}

export default MessagesConstants;
