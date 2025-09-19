import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Notification } from '../types/notification.types';
import { dateUtils } from '../../../theme/customizations/dateUtils';

interface NotificationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
  onDelete?: (id: string) => void;
}

const NotificationDetailDialog: React.FC<NotificationDetailDialogProps> = React.memo(({ open, onClose, notification, onDelete }) => {
  const formattedTimestamp = React.useMemo(() => {
    if (!notification) return '';
    return dateUtils.formatDateTime(notification.timestamp);
  }, [notification]);

  const getTypeIcon = React.useCallback((type: Notification['type']) => {
    switch (type) {
      case 'error': 
        return <WarningIcon color="error" sx={{ fontSize: 28 }} />;
      case 'warning': 
        return <WarningIcon color="warning" sx={{ fontSize: 28 }} />;
      case 'success':
        return <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />;
      case 'info':
      default: 
        return <CheckCircleIcon color="info" sx={{ fontSize: 28 }} />;
    }
  }, []);

  const handleDelete = React.useCallback(() => {
    if (notification && onDelete) {
      onDelete(notification.id);
      onClose();
    }
  }, [notification, onDelete, onClose]);

  if (!notification) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      aria-labelledby="notification-detail-dialog-title" 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle id="notification-detail-dialog-title" sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {getTypeIcon(notification.type)}
              <Typography variant="h5" component="h2" fontWeight={600}>
                Bildirim Detayı
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <TimeIcon fontSize="small" />
              <Typography variant="body2" fontWeight={500}>
                {formattedTimestamp}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="diyaloğu kapat"
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8,
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {notification.message}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      
      <DialogActions sx={{ pt: 2, pr: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
        >
          Kapat
        </Button>
        {onDelete && (
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Bildirimi Sil
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

export default NotificationDetailDialog;
