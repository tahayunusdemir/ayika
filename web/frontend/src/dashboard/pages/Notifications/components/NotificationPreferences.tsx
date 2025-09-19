import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';

const NotificationPreferences: React.FC = React.memo(() => {
  const {
    preferences,
    loading,
    error,
    toggleEmailNotifications,
    toggleSmsNotifications,
  } = useNotificationPreferences();

  if (error) {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="error">
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          avatar={<SettingsIcon sx={{ color: 'primary.main' }} />}
          title={
            <Typography variant="h6" component="h2">
              Bildirim Tercihleri
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Hangi kanallardan bildirim almak istediğinizi seçin
            </Typography>
          }
        />
        <CardContent>
          <Stack spacing={3}>
            {/* Email Notifications */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.email}
                    onChange={toggleEmailNotifications}
                    disabled={loading}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    <Box>
                      <Typography variant="body1" component="span">
                        E-posta Bildirimleri
                      </Typography>
                      <Typography variant="body2" color="text.secondary" display="block">
                        Önemli güncellemeler ve duyurular e-posta ile gönderilir
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ 
                  alignItems: 'flex-start',
                  m: 0,
                  width: '100%',
                }}
              />
            </Box>

            <Divider />

            {/* SMS Notifications */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.sms}
                    onChange={toggleSmsNotifications}
                    disabled={loading}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <SmsIcon sx={{ mr: 1, color: 'action.active' }} />
                    <Box>
                      <Typography variant="body1" component="span">
                        SMS Bildirimleri
                      </Typography>
                      <Typography variant="body2" color="text.secondary" display="block">
                        Acil durumlar ve kritik bildirimler SMS ile gönderilir
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ 
                  alignItems: 'flex-start',
                  m: 0,
                  width: '100%',
                }}
              />
            </Box>
          </Stack>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress size={20} />
            </Box>
          )}
        </CardContent>
      </Card>
  );
});

export default NotificationPreferences;
