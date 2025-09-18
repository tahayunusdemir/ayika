import * as React from 'react';
import NotificationsContext from './NotificationsContext';
import type { ShowNotification, CloseNotification } from './types';

export type { ShowNotificationOptions, ShowNotification, CloseNotification } from './types';

interface UseNotifications {
  show: ShowNotification;
  close: CloseNotification;
}

export default function useNotifications(): UseNotifications {
  const notificationsContext = React.useContext(NotificationsContext);
  if (!notificationsContext) {
    throw new Error('Notifications context was used without a provider.');
  }
  return notificationsContext;
}
