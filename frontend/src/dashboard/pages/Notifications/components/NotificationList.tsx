import * as React from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Fade,
  Card,
  CardContent,
} from '@mui/material';
import { NotificationsOffOutlined as NotificationsOffIcon } from '@mui/icons-material';
import NotificationItem from './NotificationItem';
import NotificationDetailDialog from './NotificationDetailDialog';
import { Notification } from '../types/notification.types';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = React.memo(({
  notifications,
  loading,
  error,
  onDelete,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);

  const handleViewDetails = React.useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = React.useCallback(() => {
    setOpenDialog(false);
    setSelectedNotification(null);
  }, []);

  if (loading) {
    return (
      <Fade in timeout={300}>
        <Card variant="outlined" sx={{ minHeight: 200 }}>
          <CardContent>
            <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 160 }}>
              <CircularProgress aria-label="bildirimler yüklüyor" />
              <Typography variant="body2" color="text.secondary">
                Bildirimler yüklüyor...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    );
  }

  if (error) {
    return (
      <Fade in timeout={300}>
        <Card variant="outlined">
          <CardContent>
            <Alert severity="error" role="alert" aria-live="assertive">
              <Typography variant="subtitle2" gutterBottom>
                Hata Oluştu
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Fade>
    );
  }

  if (notifications.length === 0) {
    return (
      <Fade in timeout={300}>
        <Card variant="outlined" sx={{ minHeight: 200 }}>
          <CardContent>
            <Stack
              sx={{ minHeight: 160 }}
              alignItems="center"
              justifyContent="center"
              spacing={2}
              aria-live="polite"
              aria-label="hiç bildirim yok"
            >
              <NotificationsOffIcon sx={{ fontSize: 60, color: 'text.disabled' }} aria-hidden="true" />
              <Typography variant="h6" color="text.disabled">
                Hiç bildiriminiz yok
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Yeni bildirimler buraya düşecektir.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {notifications.map((notification, index) => (
          <Fade in={true} timeout={300 + index * 100} key={notification.id}>
            <div>
              <NotificationItem
                notification={notification}
                onDelete={onDelete}
                onViewDetails={handleViewDetails}
              />
            </div>
          </Fade>
        ))}
      </Box>
      <NotificationDetailDialog
        open={openDialog}
        onClose={handleCloseDialog}
        notification={selectedNotification}
        onDelete={onDelete}
      />
    </>
  );
});

export default NotificationList;
