import * as React from 'react';
import { NotificationPreferences, NotificationPreferencesState } from '../types/notification.types';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  sms: false,
};

export const useNotificationPreferences = () => {
  const [state, setState] = React.useState<NotificationPreferencesState>({
    preferences: DEFAULT_PREFERENCES,
    loading: false,
    error: null,
  });

  const fetchPreferences = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate API call - in real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Try to get preferences from localStorage
      const savedPreferences = localStorage.getItem('notificationPreferences');
      const preferences = savedPreferences 
        ? JSON.parse(savedPreferences) 
        : DEFAULT_PREFERENCES;

      setState(prev => ({
        ...prev,
        preferences,
        loading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error instanceof Error ? error.message : 'Tercihler yüklenemedi.'),
        loading: false,
      }));
    }
  }, []);

  const updatePreferences = React.useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPreferences = { ...state.preferences, ...newPreferences };
      
      // Save to localStorage
      localStorage.setItem('notificationPreferences', JSON.stringify(updatedPreferences));
      
      setState(prev => ({
        ...prev,
        preferences: updatedPreferences,
        loading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error instanceof Error ? error.message : 'Tercihler güncellenemedi.'),
        loading: false,
      }));
    }
  }, [state.preferences]);

  const toggleEmailNotifications = React.useCallback(() => {
    updatePreferences({ email: !state.preferences.email });
  }, [state.preferences.email, updatePreferences]);

  const toggleSmsNotifications = React.useCallback(() => {
    updatePreferences({ sms: !state.preferences.sms });
  }, [state.preferences.sms, updatePreferences]);

  React.useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    ...state,
    updatePreferences,
    toggleEmailNotifications,
    toggleSmsNotifications,
  };
};
