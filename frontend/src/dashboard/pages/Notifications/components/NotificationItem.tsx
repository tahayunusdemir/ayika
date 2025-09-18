import * as React from 'react';
import {
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  RemoveRedEyeOutlined as ViewDetailsIcon,
} from '@mui/icons-material';
import { Notification } from '../types/notification.types';
import { dateUtils } from '../../../theme/customizations/dateUtils';

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onViewDetails: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = React.memo(({
  notification,
  onDelete,
  onViewDetails,
}) => {
  const handleDelete = React.useCallback(() => {
    onDelete(notification.id);
  }, [onDelete, notification.id]);

  const handleViewDetails = React.useCallback(() => {
    onViewDetails(notification);
  }, [onViewDetails, notification]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error': 
        return <WarningIcon color="error" sx={{ fontSize: 24 }} />;
      case 'warning': 
        return <WarningIcon color="warning" sx={{ fontSize: 24 }} />;
      case 'success':
        return <CheckCircleIcon color="success" sx={{ fontSize: 24 }} />;
      case 'info':
      default: 
        return <CheckCircleIcon color="info" sx={{ fontSize: 24 }} />;
    }
  };

  const formattedTimestamp = React.useMemo(() => {
    return dateUtils.formatDateTime(notification.timestamp);
  }, [notification.timestamp]);

  return (
    <Card 
      variant="outlined" 
      sx={{
        mb: 1.5,
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <ListItem
            sx={{
              p: 0,
              alignItems: 'flex-start',
            }}
            aria-labelledby={`notification-message-${notification.id}`}
            aria-describedby={`notification-timestamp-${notification.id}`}
            role="listitem"
          >
            <Box sx={{ mr: 2, mt: 0.25, display: 'flex', alignItems: 'center' }}>
              {getTypeIcon(notification.type)}
            </Box>
            <ListItemText
              id={`notification-message-${notification.id}`}
              primary={
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      flex: 1, 
                      lineHeight: 1.5,
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                    <Tooltip title="Detayları Görüntüle">
                      <IconButton
                        aria-label="bildirim detaylarını görüntüle"
                        onClick={handleViewDetails}
                        size="small"
                      >
                        <ViewDetailsIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton
                        aria-label="bildirimi sil"
                        onClick={handleDelete}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              }
              secondary={
                <Typography
                  id={`notification-timestamp-${notification.id}`}
                  variant="caption"
                  sx={{ 
                    mt: 1, 
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {formattedTimestamp}
                </Typography>
              }
              sx={{ cursor: 'pointer' }}
              onClick={handleViewDetails}
            />
          </ListItem>
      </CardContent>
    </Card>
  );
});

export default NotificationItem;
