export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
}

export interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export interface NotificationPreferencesState {
  preferences: NotificationPreferences;
  loading: boolean;
  error: string | null;
}
