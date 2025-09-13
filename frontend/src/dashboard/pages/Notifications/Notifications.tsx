import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import * as React from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Box, 
  Typography,
  Card,
  CardContent,
  CardHeader,
  Fade,
} from '@mui/material';
import NotificationList from './components/NotificationList';
import NotificationPreferences from './components/NotificationPreferences';
import { useNotifications } from './hooks/useNotifications';
import { DeleteForeverOutlined as DeleteAllIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const Notifications: React.FC = React.memo(() => {
  const { notifications, loading, error, deleteNotification, deleteAllNotifications } = useNotifications();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNotifications = React.useMemo(() => {
    if (!searchTerm) return notifications;
    return notifications.filter(notification =>
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notifications, searchTerm]);

  const handleClearSearch = React.useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleDeleteAll = React.useCallback(() => {
    deleteAllNotifications();
  }, [deleteAllNotifications]);

  return (
    <DashboardPageLayout
      title="Bildirimler"
      description="Bildirimlerinizi yönetin ve ayarlarınızı güncelleyin."
      icon={NotificationsIcon}
    >
      <Grid container spacing={3}>
        {/* Main Content Column - Notification Management */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Search and Controls */}
          <Fade in timeout={300}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Bildirim Yönetimi
                  </Typography>
                }
              />
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          endAdornment: searchTerm ? (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="arama terimini temizle"
                                onClick={handleClearSearch}
                                edge="end"
                                size="small"
                              >
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          ) : null,
                          placeholder: "Bildirim Ara",
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteAllIcon />}
                      onClick={handleDeleteAll}
                      disabled={loading || notifications.length === 0}
                      fullWidth
                      size="small"
                    >
                      Tümünü Sil
                    </Button>
                  </Grid>
                </Grid>
                {searchTerm && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      "{searchTerm}" için {filteredNotifications.length} sonuç bulundu
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>

          {/* Notifications List */}
          <NotificationList
            notifications={filteredNotifications}
            loading={loading}
            error={error}
            onDelete={deleteNotification}
          />
        </Grid>

        {/* Notification Preferences Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <NotificationPreferences />
        </Grid>
      </Grid>
    </DashboardPageLayout>
  );
});

export default Notifications;
