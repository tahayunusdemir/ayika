import * as React from 'react';
import { Notification, NotificationsState } from '../types/notification.types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    message: 'Yeni bir etkinlik oluşturuldu: Kan Bağışı Kampanyası',
    timestamp: new Date().toISOString(), // Changed to current time
    type: 'info',
  },
  {
    id: '2',
    message: 'Profil bilgileriniz güncellendi.',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    type: 'success',
  },
  {
    id: '3',
    message: 'Sistem bakımı bu gece 02:00 - 04:00 arasında yapılacaktır.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), 
    type: 'warning',
  },
  {
    id: '4',
    message: 'Ödeme işleminiz başarısız oldu. Lütfen tekrar deneyin.',
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    type: 'error',
  },
];

export const useNotifications = () => {
  const [state, setState] = React.useState<NotificationsState>({
    notifications: [],
    loading: false,
    error: null,
  });

  const fetchNotifications = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setState(prev => ({
        ...prev,
        notifications: MOCK_NOTIFICATIONS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        loading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error instanceof Error ? error.message : 'Bildirimler yüklenemedi.'),
        loading: false,
      }));
    }
  }, []);

  const deleteNotification = React.useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(notification => notification.id !== id),
        loading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error instanceof Error ? error.message : 'Bildirim silinemedi.'),
        loading: false,
      }));
    }
  }, []);

  const deleteAllNotifications = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setState(prev => ({
        ...prev,
        notifications: [],
        loading: false,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error instanceof Error ? error.message : 'Tüm bildirimler silinemedi.'),
        loading: false,
      }));
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    ...state,
    deleteNotification,
    deleteAllNotifications,
    refetchNotifications: fetchNotifications,
  };
};
