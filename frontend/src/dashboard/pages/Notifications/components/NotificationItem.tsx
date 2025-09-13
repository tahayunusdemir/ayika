import * as React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import {
  RemoveRedEyeOutlined as ViewDetailsIcon,
  DeleteOutline as DeleteIcon,
  InfoOutlined as InfoIcon,
  WarningAmberOutlined as WarningIcon,
  ErrorOutlineOutlined as ErrorIcon,
  CheckCircleOutlineOutlined as SuccessIcon,
} from '@mui/icons-material';
import { Notification } from '../types/notification.types';

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
      case 'info':
        return <InfoIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'success':
        return <SuccessIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getAvatarColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'primary';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  const formattedTimestamp = React.useMemo(() => {
    const date = new Date(notification.timestamp);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [notification.timestamp]);

  return (
    <Fade in timeout={300}>
      <Card 
        variant="outlined" 
        sx={{
          mb: 1.5,
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            boxShadow: 2,
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
            <ListItemAvatar>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: `${getAvatarColor(notification.type)}.main`,
                  color: 'white',
                }}
              >
                {getTypeIcon(notification.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={`notification-message-${notification.id}`}
              primary={
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" sx={{ flex: 1, lineHeight: 1.5 }}>
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
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
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
    </Fade>
  );
});

export default NotificationItem;
