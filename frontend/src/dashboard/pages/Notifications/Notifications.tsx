import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationItem from './components/NotificationItem';
import { Switch, FormControlLabel } from '@mui/material';

export default function Notifications() {
  const [notifications, setNotifications] = React.useState([
    { id: '1', message: 'Yeni bir etkinlik oluşturuldu: Gönüllü Toplantısı', timestamp: '2024-07-20 10:00' },
    { id: '2', message: 'Profil bilgileriniz güncellendi.', timestamp: '2024-07-19 15:30' },
    { id: '3', message: 'Yeni bir mesajınız var.', timestamp: '2024-07-18 09:00' },
  ]);

  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const handleCloseNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleSettingChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: event.target.checked,
    }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '900px' }, mx: 'auto' }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <NotificationsIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1">
              Bildirimler
            </Typography>
          </Box>

          <Typography variant="h5" component="h2" gutterBottom>
            Bildirim Ayarları
          </Typography>
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={<Switch checked={settings.emailNotifications} onChange={handleSettingChange('emailNotifications')} />}
              label="E-posta Bildirimleri"
            />
            <FormControlLabel
              control={<Switch checked={settings.smsNotifications} onChange={handleSettingChange('smsNotifications')} />}
              label="SMS Bildirimleri"
            />
            <FormControlLabel
              control={<Switch checked={settings.pushNotifications} onChange={handleSettingChange('pushNotifications')} />}
              label="Anlık Bildirimler (Push Notifications)"
            />
          </Box>

          <Typography variant="h5" component="h2" gutterBottom>
            Tüm Bildirimler
          </Typography>
          <Box>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  message={notification.message}
                  timestamp={notification.timestamp}
                  onClose={handleCloseNotification}
                />
              ))
            ) : (
              <Typography>Henüz bildirim bulunmamaktadır.</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
