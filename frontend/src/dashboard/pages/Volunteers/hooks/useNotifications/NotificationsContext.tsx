import * as React from 'react';
import { ShowNotification, CloseNotification } from './types';

const NotificationsContext = React.createContext<{
  show: ShowNotification;
  close: CloseNotification;
} | null>(null);

export default NotificationsContext;
