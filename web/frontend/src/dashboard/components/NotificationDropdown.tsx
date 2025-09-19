import * as React from 'react';
import {
  Popover,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Badge,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  NotificationsRounded as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  NotificationsOffOutlined as NotificationsOffIcon,
  ArrowForward as ViewAllIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNotifications } from '../pages/Notifications/hooks/useNotifications';
import { Notification } from '../pages/Notifications/types/notification.types';
import { dateUtils } from '../theme/customizations/dateUtils';

interface NotificationDropdownProps {
  onNavigateToNotifications?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigateToNotifications }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { notifications, loading } = useNotifications();
  
  // Show only the latest 5 notifications in dropdown
  const recentNotifications = React.useMemo(() => {
    return notifications.slice(0, 5);
  }, [notifications]);

  const unreadCount = notifications.length;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAll = () => {
    handleClose();
    onNavigateToNotifications?.();
  };


  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error': 
        return <ErrorIcon sx={{ fontSize: 32, color: '#d32f2f' }} />;
      case 'warning': 
        return <WarningIcon sx={{ fontSize: 32, color: '#ed6c02' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 32, color: '#2e7d32' }} />;
      case 'info':
      default: 
        return <InfoIcon sx={{ fontSize: 32, color: '#0288d1' }} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return dateUtils.formatDateShort(timestamp);
  };

  return (
    <>
      <Badge
        color="error"
        badgeContent={unreadCount}
        invisible={unreadCount === 0}
        sx={{ 
          '& .MuiBadge-badge': { 
            right: 2, 
            top: 2,
            fontSize: '0.75rem',
            minWidth: '18px',
            height: '18px',
          } 
        }}
      >
        <IconButton
          size="small"
          onClick={handleClick}
          aria-label={`${unreadCount} bildirim`}
          aria-describedby={open ? 'notification-popover' : undefined}
          aria-haspopup="true"
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <NotificationsIcon />
        </IconButton>
      </Badge>

      <Popover
        id="notification-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '90vw', sm: 380 },
              maxWidth: { xs: 350, sm: 380 },
              maxHeight: { xs: '70vh', sm: 500 },
              mt: 1,
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Card variant="outlined" sx={{ border: 'none', boxShadow: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Bildirimler
            </Typography>
            <IconButton size="small" onClick={handleClose} aria-label="kapat">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Content */}
          <CardContent sx={{ p: 0, flex: 1, overflow: 'auto', minHeight: 0 }}>
            {loading ? (
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : recentNotifications.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <NotificationsOffIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Henüz bildiriminiz yok
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {recentNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        px: { xs: 1.5, sm: 2 },
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ mr: 2, mt: 0.5, display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                        {getTypeIcon(notification.type)}
                      </Box>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: { xs: 3, sm: 2 },
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              pr: 1,
                              fontSize: { xs: '0.875rem', sm: '0.875rem' },
                              color: 'text.primary',
                            }}
                          >
                            {notification.message}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{ 
                              mt: 0.5, 
                              display: 'block',
                              color: 'text.secondary',
                              fontWeight: 500,
                            }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentNotifications.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
              <Button
                fullWidth
                variant="outlined"
                endIcon={<ViewAllIcon />}
                onClick={handleViewAll}
                size="small"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Tüm Bildirimleri Görüntüle
              </Button>
            </Box>
          )}
        </Card>
      </Popover>
    </>
  );
};

export default NotificationDropdown;
